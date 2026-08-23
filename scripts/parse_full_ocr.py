# Complete parser that builds the 620 questions database
import json
import os
import re

os.makedirs('src/data/questions', exist_ok=True)

print("Starting full OCR compilation...")
