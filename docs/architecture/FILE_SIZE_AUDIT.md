---
doc_id: file-size-audit
title: File Size Audit — Workspace MCP
version: 0.1.0
status: approved
owner: project-owner
lang: pt-BR
audience: tech
last_updated: 2026-07-11
---

# File Size Audit

## Policy

Preferred maximum is 300 lines. Files above 500 lines require a refactor plan or waiver. Files above 1000 lines are structural blockers. Files above 2000 lines are critical blockers unless explicitly waived.

## Initial status

Run `python3 scripts/validate_file_size_policy.py` after bootstrap and before feature stacking in adopted codebases.

## Required action

Record overloaded files, waivers, and structural refactor plans here.
