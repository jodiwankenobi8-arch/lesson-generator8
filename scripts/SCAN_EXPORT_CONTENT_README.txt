# Export content regression scan

Run this after generating a fresh DOCX, PPTX, or FULL_EXPORT zip.

Examples:

powershell -ExecutionPolicy Bypass -File .\scripts\scan-export-content.ps1

powershell -ExecutionPolicy Bypass -File .\scripts\scan-export-content.ps1 -SinceMinutes 30

powershell -ExecutionPolicy Bypass -File .\scripts\scan-export-content.ps1 -Roots @((Join-Path $env:USERPROFILE 'Downloads'), (Get-Location).Path)
