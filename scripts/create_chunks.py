import json
import os
import sys

os.makedirs('src/data/questions', exist_ok=True)

def write_chunk(chunk_idx, questions):
    filename = f'src/data/questions/chunk{chunk_idx}.ts'
    with open(filename, 'w', encoding='utf-8') as f:
        f.write("import { Question } from '../../types';\n\n")
        f.write(f"export const CHUNK_{chunk_idx}: Question[] = ")
        f.write(json.dumps(questions, ensure_ascii=False, indent=2))
        f.write(";\n")
    print(f"Wrote {len(questions)} questions to {filename}")

print("Chunk writer ready.")
