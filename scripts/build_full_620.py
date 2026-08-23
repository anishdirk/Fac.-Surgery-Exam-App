import json
import os

# Helper to determine topic
def get_topic_id(num):
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

def get_page_number(n):
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

print("Data builder utility loaded.")
