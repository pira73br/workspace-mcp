#!/usr/bin/env bash
set -euo pipefail
git init >/dev/null 2>&1 || true
git config core.hooksPath .githooks
echo "Git hooks installed: .githooks"
