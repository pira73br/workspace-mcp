#!/usr/bin/env python3
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
EXCLUDED_DIRS={'.git','node_modules','dist','build','.venv','__pycache__'}
SOURCE_SUFFIXES={'.py','.ts','.tsx','.js','.jsx','.go','.rs','.java','.kt','.swift','.cs','.rb','.php','.vue','.svelte'}
print('FILE SIZE POLICY REPORT')
for p in sorted(ROOT.rglob('*')):
    if not p.is_file() or p.suffix.lower() not in SOURCE_SUFFIXES: continue
    if any(part in EXCLUDED_DIRS for part in p.parts): continue
    try: lines=len(p.read_text(encoding='utf-8', errors='ignore').splitlines())
    except Exception: continue
    if lines>300:
        rel=p.relative_to(ROOT)
        if lines>2000: level='critical_blocker_above_2000'
        elif lines>1000: level='structural_blocker_above_1000'
        elif lines>500: level='refactor_plan_required_above_500'
        else: level='warning_above_300'
        print(f'- {rel}: {lines} lines ({level})')
print('FILE SIZE POLICY VALIDATION COMPLETED')
