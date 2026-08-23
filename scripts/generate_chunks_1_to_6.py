# Python script to generate all 6 chunks from the 66-page medical MCQ exam
import json
import os
import re

os.makedirs('src/data/questions', exist_ok=True)

print("Starting generation...")
