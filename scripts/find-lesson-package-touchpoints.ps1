param()

Write-Host "=== LessonPackage integration scan ==="

$targets = @(
  ".\src\state",
  ".\src\pages",
  ".\src\engine",
  ".\src\app"
)

$patterns = @(
  "lesson_generator__package_v2",
  "localStorage",
  "generateLesson",
  "blueprint",
  "lessonPlan",
  "slides",
  "results hub",
  "export",
  "materials"
)

foreach ($target in $targets) {
  if (Test-Path $target) {
    Write-Host ""
    Write-Host "--- Scanning $target ---"
    Get-ChildItem -Path $target -Recurse -Include *.ts,*.tsx |
      Select-String -Pattern $patterns |
      Select-Object Path, LineNumber, Line |
      Format-Table -AutoSize
  }
}
