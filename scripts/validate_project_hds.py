#!/usr/bin/env python3
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
docs = [p for p in (ROOT / 'docs').rglob('*.md') if p.is_file()]
errors = []
for p in docs:
    text = p.read_text(encoding='utf-8')
    if not text.startswith('---\n'):
        errors.append(f'Missing hDS front matter: {p.relative_to(ROOT)}')
        continue
    end = text.find('\n---\n', 4)
    if end == -1:
        errors.append(f'Invalid hDS front matter: {p.relative_to(ROOT)}')
        continue
    fm = text[4:end]
    for key in ['doc_id:', 'title:', 'version:', 'status:', 'owner:', 'lang:', 'audience:', 'last_updated:']:
        if key not in fm:
            errors.append(f'Missing {key} in {p.relative_to(ROOT)}')
    words = re.findall(r'\b[\wÀ-ÿ-]+\b', text[end+5:])
    if len(words) < 60:
        errors.append(f'Document appears shallow: {p.relative_to(ROOT)}')
if errors:
    print('PROJECT HDS VALIDATION FAILED')
    for e in errors:
        print(f'- {e}')
    sys.exit(1)
print('PROJECT HDS VALIDATION PASSED')
