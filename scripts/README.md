# Data Generation Scripts

This directory contains the data generation utilities for the Russian Medical MCQ DuoPrep application.

## Active Script

### `generate_all_mcqs.py`
- **Purpose**: Generates the complete 620-question Russian surgical MCQ dataset partitioned across 16 exam topics into 6 modular TypeScript chunks (`src/data/questions/chunk1.ts` through `chunk6.ts`) and the aggregator entry point `src/data/questions/index.ts`.
- **Inputs**: Self-contained with authentic medical question banks, bilingual translations (Russian/English), option sets, correct answer keys, and medical explanations.
- **Execution**:
  ```bash
  python3 scripts/generate_all_mcqs.py
  ```
- **Output**:
  - `src/data/questions/chunk1.ts` (Questions 1–100)
  - `src/data/questions/chunk2.ts` (Questions 101–200)
  - `src/data/questions/chunk3.ts` (Questions 201–300)
  - `src/data/questions/chunk4.ts` (Questions 301–400)
  - `src/data/questions/chunk5.ts` (Questions 401–500)
  - `src/data/questions/chunk6.ts` (Questions 501–620)
  - `src/data/questions/index.ts` (Exports all questions and query helper functions)

## Redundant Scripts Cleanup
During the code-health audit, 28 redundant, incomplete, and experimental scratch scripts (such as `build_all_data.py`, `build_full_database.py`, `buildAllQuestions.js`, `parse_full_ocr.py`, `create_chunks.py`, `generate_all_620.py`, etc.) were removed to eliminate repository clutter and maintain a single source of truth.
