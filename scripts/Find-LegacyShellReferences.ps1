[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$repoRoot = Split-Path -Parent $PSScriptRoot
$srcRoot = Join-Path $repoRoot "src"

if (-not (Test-Path $srcRoot)) {
  throw "Could not find src directory at: $srcRoot"
}

$files = Get-ChildItem -Path $srcRoot -Recurse -File -Include *.ts,*.tsx |
  Where-Object {
    $_.FullName -notmatch "\\node_modules\\" -and
    $_.FullName -notmatch "\\dist\\"
  }

$legacyPatterns = @(
  "BlueprintPage",
  "ResultsHubPage",
  "AppRouter",
  "\.\/app\/AppRouter",
  "\.\./app\/AppRouter"
)

$forbiddenPageImportPatterns = @(
  "\.\./engine\/generateLesson",
  "\.\./engine\/workflow\/processMaterial",
  "\.\./\.\./engine\/generateLesson",
  "\.\./\.\./engine\/workflow\/processMaterial"
)

$legacyHits = @()
$forbiddenHits = @()

foreach ($file in $files) {
  $content = Get-Content -Raw -Path $file.FullName

  foreach ($pattern in $legacyPatterns) {
    if ($content -match $pattern) {
      $legacyHits += [PSCustomObject]@{
        File = $file.FullName.Replace($repoRoot + "\", "")
        Pattern = $pattern
      }
    }
  }

  if ($file.FullName -match "\\src\\pages\\") {
    foreach ($pattern in $forbiddenPageImportPatterns) {
      if ($content -match $pattern) {
        $forbiddenHits += [PSCustomObject]@{
          File = $file.FullName.Replace($repoRoot + "\", "")
          Pattern = $pattern
        }
      }
    }
  }
}

Write-Host ""
Write-Host "=== Import Graph Audit ===" -ForegroundColor Cyan
Write-Host ""

if ($legacyHits.Count -gt 0) {
  Write-Host "Legacy shell references found:" -ForegroundColor Yellow
  $legacyHits | Sort-Object File, Pattern | Format-Table -AutoSize
} else {
  Write-Host "No legacy shell references found." -ForegroundColor Green
}

Write-Host ""

if ($forbiddenHits.Count -gt 0) {
  Write-Host "Forbidden page-to-engine imports found:" -ForegroundColor Red
  $forbiddenHits | Sort-Object File, Pattern | Format-Table -AutoSize
  exit 1
} else {
  Write-Host "No forbidden page-to-engine imports found." -ForegroundColor Green
}

Write-Host ""
Write-Host "Audit complete." -ForegroundColor Cyan
