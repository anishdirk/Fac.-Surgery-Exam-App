import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import {
  CaseEvaluationCache,
  CaseSubmissionRateLimiter,
  DEFAULT_CACHE_TTL_MS,
  DEFAULT_COOLDOWN_SECONDS,
  generateCaseCacheKey
} from "./src/utils/caseEvaluationCache";

dotenv.config();

// Global in-memory cache with 24-hour TTL and per-user cooldown rate limiter
const cacheTtlMs = process.env.CASE_CACHE_TTL_MS
  ? parseInt(process.env.CASE_CACHE_TTL_MS, 10)
  : DEFAULT_CACHE_TTL_MS;

const cooldownSeconds = process.env.CASE_COMPARE_COOLDOWN_SECONDS
  ? parseInt(process.env.CASE_COMPARE_COOLDOWN_SECONDS, 10)
  : DEFAULT_COOLDOWN_SECONDS;

const caseEvaluationCache = new CaseEvaluationCache(cacheTtlMs);
const caseRateLimiter = new CaseSubmissionRateLimiter(cooldownSeconds);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ 
      status: "ok",
      cacheSize: caseEvaluationCache.size(),
      cooldownSeconds
    });
  });

  // Clinical Case Answer Comparison via Gemini API
  app.post("/api/compare-case", async (req, res) => {
    try {
      const { caseId, stem, stemEn, questions, answers, userAnswer, userAnswers } = req.body;

      // Handle userAnswers array (CaseSubAnswer[]) or single userAnswer string
      const rawUserAnswers: Array<{ questionId?: string; num?: number; text?: string }> =
        Array.isArray(userAnswers) ? userAnswers : [];

      const combinedFromSubAnswers = rawUserAnswers
        .map((ua, idx) => {
          const qId = ua.questionId || `q${idx + 1}`;
          const text = (ua.text || '').trim();
          return `[Question ID: "${qId}"]: ${text}`;
        })
        .join("\n\n");

      const effectiveUserAnswer = (typeof userAnswer === "string" && userAnswer.trim())
        ? userAnswer.trim()
        : combinedFromSubAnswers.trim();

      if (!effectiveUserAnswer) {
        return res.status(400).json({ error: "User answer text is required." });
      }

      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ error: "Case questions are required." });
      }

      const caseStem = stem || stemEn || "N/A";
      const resolvedCaseId = caseId ?? (caseStem.length > 5 ? caseStem.slice(0, 48) : "default_case");
      const userSessionId =
        (req.headers["x-session-id"] as string) ||
        (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
        req.socket.remoteAddress ||
        "anonymous_user";

      // 1. In-memory Cache check (24h TTL)
      const cachedResult = caseEvaluationCache.get(resolvedCaseId, effectiveUserAnswer);
      if (cachedResult) {
        const hash = generateCaseCacheKey(resolvedCaseId, effectiveUserAnswer).slice(0, 8);
        console.log(`[CACHE HIT] Serving cached evaluation for caseId="${resolvedCaseId}" (hash: ${hash})`);
        return res.json({
          ...cachedResult,
          _fromCache: true
        });
      }

      // 2. Cooldown check (default 10s per user/case)
      const cooldownCheck = caseRateLimiter.check(userSessionId, resolvedCaseId, cooldownSeconds);
      if (!cooldownCheck.allowed) {
        console.log(`[RATE LIMIT] Cooldown active for user="${userSessionId}" on case="${resolvedCaseId}". Remaining wait: ${cooldownCheck.waitSeconds}s.`);
        return res.status(429).json({
          error: cooldownCheck.message || "Please wait before resubmitting an answer for this case.",
          retryAfter: cooldownCheck.waitSeconds
        });
      }

      // 3. Verify Gemini API key is configured before issuing model request
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "GEMINI_API_KEY is not configured on the server. Please check the Secrets settings."
        });
      }

      const hash = generateCaseCacheKey(resolvedCaseId, effectiveUserAnswer).slice(0, 8);
      console.log(`[GEMINI API CALL] Requesting Gemini evaluation for caseId="${resolvedCaseId}" (hash: ${hash})`);

      // Record submission timestamp for user cooldown
      caseRateLimiter.record(userSessionId, resolvedCaseId);

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const formattedQuestions = questions
        .map((q: any, idx: number) => {
          const ans = (answers || []).find((a: any) => (a.questionId && a.questionId === q.id) || (a.num && a.num === q.num)) || (answers || [])[idx];
          const qId = q.id || `q${idx + 1}`;
          const qText = q.text || q.textEn || "N/A";
          const ansText = ans ? (ans.text || ans.textEn || "N/A") : "N/A";
          return `[Question ID: "${qId}"]
Question: ${qText}
Authoritative Model Answer: ${ansText}`;
        })
        .join("\n\n");

      const traineeResponsesFormatted = rawUserAnswers.length > 0
        ? `TRAINEE'S ANSWERS PER SUB-QUESTION:
${rawUserAnswers.map((ua: any, idx: number) => {
  const qId = ua.questionId || `q${idx + 1}`;
  const ansText = (ua.text || '').trim() || '[No answer provided]';
  return `[Question ID: "${qId}"]
Trainee's Answer: ${ansText}`;
}).join('\n\n')}

COMBINED TRANSCRIPT:
"""
${effectiveUserAnswer}
"""`
        : `TRAINEE'S FREE-FORM SPOKEN/TYPED RESPONSE:
"""
${effectiveUserAnswer}
"""`;

      const prompt = `You are an expert surgical educator and board examiner assessing a medical student / surgical resident's answers to a clinical case problem.

CLINICAL VIGNETTE:
${caseStem}

CASE SUB-QUESTIONS & OFFICIAL MODEL ANSWERS:
${formattedQuestions}

${traineeResponsesFormatted}

EVALUATION INSTRUCTIONS:
1. The trainee answered each sub-question individually (or provided a comprehensive case narrative). Evaluate each question against the trainee's specific answer for that question.
2. Trainees may use speech-to-text dictation, which may introduce phonetic speech recognition mishearings of medical jargon or eponyms (e.g. Murphy, Blumberg, Mayo-Robson, appendectomy, cholecystitis, laparotomy). Give generous benefit of the doubt for obvious transcription typos.
3. For EACH question ID listed above (${questions.map((q: any, idx: number) => `"${q.id || `q${idx + 1}`}"`).join(", ")}):
   - Determine status:
     * "correct": accurately covers the key diagnostic, physiological, anatomical, or management concepts.
     * "partial": addresses the question but omits crucial clinical steps, safety precautions, or specifics.
     * "missing": not addressed at all in the trainee's answer.
     * "incorrect": makes a medically inaccurate, contradictory, or unsafe statement.
    - Write a concise 1-2 sentence constructive feedback note for that question highlighting what was good, missing, or needs correction.
   - Extract short clinical phrases (aim for specific clinical detail, e.g. "drainage if perforated" or "ultrasound of RUQ", NOT a full sentence or paragraph):
     * matchedPhrase: the specific short phrase or clause from the trainee's answer that was evaluated (leave empty "" if nothing relevant was said or for a missing point).
     * expectedPhrase: the specific short phrase or clause from the authoritative model answer that corresponds to this point (what should have been said).
4. Write a supportive 2-3 sentence overall holistic summary of their clinical reasoning and situational assessment.

Return STRICT JSON matching the schema.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an objective, encouraging surgical faculty examiner evaluating clinical case answers. Return valid JSON adhering strictly to the schema. For each question, provide constructive feedback and extract short phrase-level clinical details (matchedPhrase and expectedPhrase) highlighting the exact clinical detail rather than a full paragraph.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              perQuestion: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    questionId: {
                      type: Type.STRING,
                      description: "The unique question ID being evaluated (must match one of the input question IDs)",
                    },
                    status: {
                      type: Type.STRING,
                      description: "Evaluation status: 'correct', 'partial', 'missing', or 'incorrect'",
                    },
                    feedback: {
                      type: Type.STRING,
                      description: "1-2 sentence constructive clinical feedback",
                    },
                    matchedPhrase: {
                      type: Type.STRING,
                      description: "The specific short phrase or clause from the student's answer that was evaluated (can be empty if nothing relevant was said)",
                    },
                    expectedPhrase: {
                      type: Type.STRING,
                      description: "The specific short phrase or clause from the reference answer that corresponds to this point",
                    },
                  },
                  required: ["questionId", "status", "feedback"],
                },
              },
              overallSummary: {
                type: Type.STRING,
                description: "2-3 sentence holistic clinical feedback and summary",
              },
            },
            required: ["perQuestion", "overallSummary"],
          },
        },
      });

      const responseText = response.text || "{}";
      const parsedResult = JSON.parse(responseText);

      // Store in 24h cache for subsequent submissions of the identical answer
      caseEvaluationCache.set(resolvedCaseId, effectiveUserAnswer, parsedResult);

      return res.json(parsedResult);
    } catch (err: any) {
      console.error("Error in /api/compare-case:", err);
      return res.status(500).json({
        error: err.message || "Failed to compare answer with model answers.",
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
