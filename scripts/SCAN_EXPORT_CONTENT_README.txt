# Export content regression scan

Run this after generating a fresh canonical export.

Current canonical export targets:
- *-lesson-plan-export.docx
- *-slides-export.txt
- *-printables-export.txt

The scan also still supports older PPTX / ZIP-style exports when present.

Examples:

powershell -ExecutionPolicy Bypass -File .\scripts\scan-export-content.ps1

powershell -ExecutionPolicy Bypass -File .\scripts\scan-export-content.ps1 -SinceMinutes 30

powershell -ExecutionPolicy Bypass -File .\scripts\scan-export-content.ps1 -Roots @((Join-Path $env:USERPROFILE 'Downloads'), (Get-Location).Path)