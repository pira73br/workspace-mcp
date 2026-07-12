#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
python3 scripts/validate_git_repository.py
python3 scripts/validate_project_capsule.py
python3 scripts/validate_project_hds.py
python3 scripts/validate_briefing_bootstrap.py
python3 scripts/validate_next_agent_startup.py
python3 scripts/validate_input_assets_scaffold.py
python3 scripts/validate_generated_metadata.py
python3 scripts/validate_v154_project_policy.py
python3 scripts/validate_file_size_policy.py
if [ -f package.json ] && command -v npm >/dev/null 2>&1; then
  npm run lint --if-present
  npm run typecheck --if-present
  npm test --if-present
  npm run build --if-present
fi
if [ -f pytest.ini ] || [ -f pyproject.toml ]; then
  if command -v pytest >/dev/null 2>&1; then pytest; fi
fi
if [ -f go.mod ] && command -v go >/dev/null 2>&1; then
  go test ./...
fi
echo "ALL AVAILABLE CHECKS PASSED"
