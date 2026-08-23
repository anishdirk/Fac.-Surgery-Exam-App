# Complete Python Parser & Dataset Generator for 620 Russian Medical MCQ Questions
import json
import os
import re

os.makedirs('src/data/questions', exist_ok=True)

# Topic ranges
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

def get_page(n):
    if n <= 12: return 1
    if n <= 19: return 2
    if n <= 25: return 3
    if n <= 34: return 4
    if n <= 41: return 5
    if n <= 46: return 6
    if n <= 55: return 7
    if n <= 68: return 8
    if n <= 76: return 9
    if n <= 86: return 10
    if n <= 99: return 11
    if n <= 109: return 12
    if n <= 116: return 13
    if n <= 125: return 14
    if n <= 132: return 15
    if n <= 141: return 16
    if n <= 151: return 17
    if n <= 165: return 18
    if n <= 174: return 19
    if n <= 182: return 20
    if n <= 189: return 21
    if n <= 198: return 22
    if n <= 209: return 23
    if n <= 221: return 24
    if n <= 232: return 25
    if n <= 243: return 26
    if n <= 252: return 27
    if n <= 262: return 28
    if n <= 273: return 29
    if n <= 283: return 30
    if n <= 292: return 31
    if n <= 301: return 32
    if n <= 312: return 33
    if n <= 324: return 34
    if n <= 335: return 35
    if n <= 349: return 36
    if n <= 361: return 37
    if n <= 372: return 38
    if n <= 384: return 39
    if n <= 394: return 40
    if n <= 403: return 41
    if n <= 413: return 42
    if n <= 421: return 43
    if n <= 432: return 44
    if n <= 438: return 45
    if n <= 448: return 46
    if n <= 458: return 47
    if n <= 471: return 48
    if n <= 482: return 49
    if n <= 495: return 50
    if n <= 503: return 51
    if n <= 512: return 52
    if n <= 520: return 53
    if n <= 531: return 54
    if n <= 536: return 55
    if n <= 549: return 56
    if n <= 555: return 57
    if n <= 562: return 58
    if n <= 568: return 59
    if n <= 572: return 60
    if n <= 581: return 61
    if n <= 593: return 62
    if n <= 604: return 63
    if n <= 613: return 64
    if n <= 619: return 65
    return 66

print("Base setup ready.")
