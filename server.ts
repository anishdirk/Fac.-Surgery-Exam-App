import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Clinical Case Answer Comparison via Gemini API
  app.post("/api/compare-case", async (req, res) => {
    try {
      const { stem, stemEn, questions, answers, userAnswer } = req.body;

      if (!userAnswer || typeof userAnswer !== "string" || !userAnswer.trim()) {
        return res.status(400).json({ error: "User answer text is required." });
      }

      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ error: "Case questions are required." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "GEMINI_API_KEY is not configured on the server. Please check the Secrets settings."
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const caseStem = stem || stemEn || "N/A";

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

      const prompt = `You are an expert surgical educator and board examiner assessing a medical student / surgical resident's spoken or typed answer to a clinical case problem.

CLINICAL VIGNETTE:
${caseStem}

CASE SUB-QUESTIONS & OFFICIAL MODEL ANSWERS:
${formattedQuestions}

TRAINEE'S FREE-FORM SPOKEN/TYPED RESPONSE:
"""
${userAnswer}
"""

EVALUATION INSTRUCTIONS:
1. The trainee's answer is a single comprehensive verbal or typed narrative addressing the case in English.
2. Trainees may use speech-to-text dictation, which may introduce phonetic speech recognition mishearings of medical jargon or eponyms (e.g. Murphy, Blumberg, Mayo-Robson, appendectomy, cholecystitis, laparotomy). Give generous benefit of the doubt for obvious transcription typos.
3. For EACH question ID listed above (${questions.map((q: any, idx: number) => `"${q.id || `q${idx + 1}`}"`).join(", ")}):
   - Determine status:
     * "correct": accurately covers the key diagnostic, physiological, anatomical, or management concepts.
     * "partial": addresses the question but omits crucial clinical steps, safety precautions, or specifics.
     * "missing": not addressed at all in the trainee's answer.
     * "incorrect": makes a medically inaccurate, contradictory, or unsafe statement.
   - Write a concise 1-2 sentence constructive feedback note for that question highlighting what was good, missing, or needs correction.
4. Write a supportive 2-3 sentence overall holistic summary of their clinical reasoning and situational assessment.

Return STRICT JSON matching the schema.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an objective, encouraging surgical faculty examiner evaluating clinical case answers. Return valid JSON adhering strictly to the schema.",
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
