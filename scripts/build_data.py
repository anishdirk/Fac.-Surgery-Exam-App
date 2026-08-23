# Script to compile all questions into TypeScript chunks
import json
import os
import re

os.makedirs('src/data/questions', exist_ok=True)

print("Compiling questions chunks...")
