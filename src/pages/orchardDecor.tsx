$ErrorActionPreference = "Stop"

git checkout feat/orchard-inputs-materials-preview-polish

function Get-Eol {
  param([string]$Text)
  if ($Text.Contains("`r`n")) { return "`r`n" }
  return "`n"
}

function Read-Normalized {
  param([string]$Path)
  if (-not (Test-Path $Path)) { throw "Missing file: $Path" }
  $raw = [System.IO.File]::ReadAllText($Path)
  return @{
    Raw = $raw
    Eol = (Get-Eol $raw)
    Normalized = ($raw -replace "`r`n", "`n")
  }
}

function Write-Normalized {
  param(
    [string]$Path,
    [string]$Content,
    [string]$Eol
  )
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, ($Content -replace "`n", $Eol), $utf8NoBom)
}

function Replace-OrKeep {
  param(
    [string]$Path,
    [string]$OldText,
    [string]$NewText,
    [string]$Label
  )

  $file = Read-Normalized $Path
  $oldNorm = $OldText -replace "`r`n", "`n"
  $newNorm = $NewText -replace "`r`n", "`n"

  if ($file.Normalized.Contains($newNorm)) {
    Write-Host "ALREADY PRESENT: $Label"
    return
  }

  if (-not $file.Normalized.Contains($oldNorm)) {
    throw "Could not find expected block for $Label in $Path"
  }

  $updated = $file.Normalized.Replace($oldNorm, $newNorm)
  Write-Normalized $Path $updated $file.Eol
  Write-Host "UPDATED: $Label"
}

Write-Host ""
Write-Host "=== CLEAN TEMP/JUNK FILES ==="
@(
  ".\tmp_exact_snapshot.ps1",
  ".\tmp_snapshot_inputs_materials.ps1",
  ".\tmp_inputs_materials_polish.ps1",
  ".\tmp_safe_polish_retry.ps1",
  ".\t",
  ".\t "
) | ForEach-Object {
  if (Test-Path $_) {
    Remove-Item $_ -Force
    Write-Host "REMOVED: $_"
  }
}

Write-Host ""
Write-Host "=== WRITE STORYBOOK SVG ASSET COMPONENTS ==="
@'
import React from "react";

type SizeProps = {
  size?: number;
  flip?: boolean;
};

export function OrchardBlossomCorner({ size = 120, flip = false }: SizeProps) {
  const style: React.CSSProperties = flip ? { transform: "scaleX(-1)", transformOrigin: "center" } : {};
  return (
    <svg
      width={size}
      height={Math.round(size * 0.72)}
      viewBox="0 0 120 86"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      aria-hidden="true"
    >
      <path d="M14 74C36 58 44 42 52 18" stroke="#6E8B6B" strokeWidth="3" strokeLinecap="round" />
      <path d="M38 56C44 50 48 44 52 36" stroke="#6E8B6B" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M58 42C68 36 76 28 84 16" stroke="#6E8B6B" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M30 64C24 60 18 58 12 58C16 64 22 68 28 70" fill="#8BA786" />
      <path d="M56 50C52 44 48 40 42 38C44 44 48 50 54 54" fill="#8BA786" />
      <path d="M68 34C76 36 82 40 88 46C80 46 74 44 68 38" fill="#8BA786" />
      <g transform="translate(48 18)">
        <circle cx="8" cy="8" r="5.8" fill="#F7D6D0" />
        <circle cx="16" cy="12" r="5.8" fill="#F7D6D0" />
        <circle cx="13" cy="21" r="5.8" fill="#F7D6D0" />
        <circle cx="3.5" cy="20" r="5.8" fill="#F7D6D0" />
        <circle cx="1.8" cy="11" r="5.8" fill="#F7D6D0" />
        <circle cx="9.2" cy="14.2" r="3.1" fill="#F2C078" />
      </g>
      <g transform="translate(74 8)">
        <circle cx="8" cy="8" r="5.4" fill="#F8E1DC" />
        <circle cx="15.5" cy="11.5" r="5.4" fill="#F8E1DC" />
        <circle cx="13" cy="19.5" r="5.4" fill="#F8E1DC" />
        <circle cx="4.5" cy="19" r="5.4" fill="#F8E1DC" />
        <circle cx="2.2" cy="11.4" r="5.4" fill="#F8E1DC" />
        <circle cx="9.1" cy="13.7" r="2.8" fill="#F2C078" />
      </g>
    </svg>
  );
}

export function OrchardGinghamCorner({ size = 70, flip = false }: SizeProps) {
  const style: React.CSSProperties = flip ? { transform: "scaleX(-1)", transformOrigin: "center" } : {};
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 70 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      aria-hidden="true"
    >
      <defs>
        <pattern id="gingham-grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#FFF7F4" />
          <rect width="5" height="10" fill="#F7D6D0" fillOpacity="0.42" />
          <rect width="10" height="5" fill="#F7D6D0" fillOpacity="0.42" />
          <path d="M5 0V10M0 5H10" stroke="#E7E2DA" strokeWidth="0.8" />
        </pattern>
      </defs>
      <path d="M0 0H70L0 70V0Z" fill="url(#gingham-grid)" />
      <path d="M0 0H70L0 70V0Z" stroke="#E7E2DA" strokeWidth="1.2" />
      <path d="M10 13C16 9 22 9 28 13" stroke="#B8545A" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13 10L10 13L13 16" stroke="#B8545A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function OrchardMushroomCluster({ size = 96, flip = false }: SizeProps) {
  const style: React.CSSProperties = flip ? { transform: "scaleX(-1)", transformOrigin: "center" } : {};
  return (
    <svg
      width={size}
      height={Math.round(size * 0.8)}
      viewBox="0 0 96 76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      aria-hidden="true"
    >
      <path d="M6 70C16 66 28 64 40 64C54 64 72 66 90 71" stroke="#8BA786" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="30" cy="58" rx="7" ry="10" fill="#F3E7D7" />
      <path d="M15 52C16 40 22 31 32 31C40 31 47 37 49 47C38 49 26 50 15 52Z" fill="#B8545A" />
      <circle cx="23" cy="42" r="2" fill="#FFF7F4" />
      <circle cx="31" cy="39" r="2.2" fill="#FFF7F4" />
      <circle cx="38" cy="44" r="1.9" fill="#FFF7F4" />
      <ellipse cx="56" cy="56" rx="5.6" ry="8.6" fill="#F3E7D7" />
      <path d="M44 51C45 42 50 35 58 35C64 35 69 40 71 48C62 49 53 50 44 51Z" fill="#C86469" />
      <circle cx="52" cy="43" r="1.8" fill="#FFF7F4" />
      <circle cx="59" cy="41" r="2" fill="#FFF7F4" />
      <circle cx="64" cy="45" r="1.6" fill="#FFF7F4" />
      <path d="M72 64C76 58 80 56 86 56C84 61 80 66 74 68" fill="#8BA786" />
      <path d="M7 66C10 61 14 58 20 58C19 62 15 67 9 69" fill="#8BA786" />
    </svg>
  );
}
