param()

$targets = @(
  ".\src\state\useLessonStore.ts",
  ".\src\pages\ResultsHubPage.tsx",
  ".\src\pages\MaterialsPage.tsx",
  ".\src\pages\InputsPage.tsx",
  ".\src\engine\generateLesson.ts"
)

$out = ".\tmp\lesson-package-touchpoints-detailed.txt"
if (Test-Path $out) { Remove-Item $out -Force }

foreach ($target in $targets) {
  if (Test-Path $target) {
    "=== FILE: $target ===" | Out-File $out -Append -Encoding utf8
    Get-Content $target | Select-Object -First 260 | Out-File $out -Append -Encoding utf8
    "" | Out-File $out -Append -Encoding utf8
  }
}

Write-Host "Wrote detailed touchpoints to $out"
