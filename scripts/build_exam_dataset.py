import json
import os

# Helper to categorize topics
def get_topic(num):
    if num <= 48: return 'appendicitis'
    elif num <= 96: return 'hernias'
    elif num <= 144: return 'biliary'
    elif num <= 192: return 'obstruction'
    elif num <= 240: return 'pancreatitis'
    elif num <= 312: return 'ulcer'
    elif num <= 346: return 'gastric_cancer'
    elif num <= 383: return 'peritonitis'
    elif num <= 410: return 'proctology'
    elif num <= 440: return 'thoracic_suppuration'
    elif num <= 471: return 'pleural'
    elif num <= 500: return 'lung_cancer'
    elif num <= 536: return 'arterial'
    elif num <= 572: return 'venous'
    elif num <= 596: return 'esophagus'
    else: return 'thyroid'

print("Exam dataset helper ready.")
