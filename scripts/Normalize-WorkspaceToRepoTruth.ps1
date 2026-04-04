param()

$ErrorActionPreference = "Stop"

$dupes = ".github","docs","scripts","src"
foreach ($d in $dupes) {
  if (-not (Test-Path $d)) { continue }

  $inner = Join-Path $d $d
  if (Test-Path $inner) {
    Get-ChildItem $inner -Force | Move-Item -Destination $d -Force
    Remove-Item $inner -Recurse -Force
  }
}

Get-ChildItem -Path "." -Directory -Force |
  Where-Object { $_.Name -like "_pro_handoff_*" } |
  Remove-Item -Recurse -Force

Get-ChildItem -Path ".\src" -Recurse -File -Force -Include "*.bak","*.broken" -ErrorAction SilentlyContinue |
  Remove-Item -Force -ErrorAction SilentlyContinue

Write-Host "[OK] workspace normalized"
