import json
import os

# Helper to classify topics
def get_topic_id(n):
    if n <= 48: return 'appendicitis'
    if n <= 96: return 'hernias'
    if n <= 144: return 'biliary'
    if n <= 192: return 'obstruction'
    if n <= 240: return 'pancreatitis'
    if n <= 312: return 'ulcer'
    if n <= 346: return 'gastric_cancer'
    if n <= 383: return 'peritonitis'
    if n <= 410: return 'proctology'
    if n <= 440: return 'thoracic_suppuration'
    if n <= 471: return 'pleural'
    if n <= 500: return 'lung_cancer'
    if n <= 536: return 'arterial'
    if n <= 572: return 'venous'
    if n <= 596: return 'esophagus'
    return 'thyroid'

print("Ready to generate all chunks.")
