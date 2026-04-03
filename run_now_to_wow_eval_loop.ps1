$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$pythonFile = Join-Path $PSScriptRoot 'now_to_wow_eval.py'
if (-not (Test-Path $pythonFile)) {
  throw "now_to_wow_eval.py is missing from the repo root. Save that file first, then rerun this script."
}

New-Item -ItemType Directory -Path (Join-Path $PSScriptRoot '_review_stage') -Force | Out-Null

while ($true) {
  python .\now_to_wow_eval.py --verify
  if ($LASTEXITCODE -ne 0) {
    throw "now_to_wow_eval.py failed with exit code $LASTEXITCODE"
  }

  Write-Host "Report refreshed: _review_stage\NOW_TO_WOW_EVAL.md"
  Read-Host "Press Enter to run again after more changes, or Ctrl+C to stop"
}