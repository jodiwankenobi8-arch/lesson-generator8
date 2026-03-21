param(
  [Parameter(Mandatory = $true)][string]$CheckpointHash,
  [Parameter(Mandatory = $true)][string]$CurrentActiveSeam,
  [Parameter(Mandatory = $true)][string]$NextMove,
  [Parameter(Mandatory = $true)][string]$ValidationSnapshot
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

function Replace-LineByPrefix {
  param(
    [string]$Path,
    [string]$Prefix,
    [string]$NewLine,
    [switch]$Optional
  )

  $text = Get-Content $Path -Raw
  $pattern = '(?m)^' + [regex]::Escape($Prefix) + '.*$'

  if (-not [regex]::IsMatch($text, $pattern)) {
    if ($Optional) {
      return $false
    }
    throw ("Prefix not found in {0}: {1}" -f $Path, $Prefix)
  }

  $updated = [regex]::Replace(
    $text,
    $pattern,
    [System.Text.RegularExpressions.MatchEvaluator]{
      param($match)
      return $NewLine
    },
    1
  )

  [System.IO.File]::WriteAllText((Resolve-Path $Path), $updated, (New-Object System.Text.UTF8Encoding($false)))
  return $true
}

$branch = (git branch --show-current).Trim()

Replace-LineByPrefix -Path ".\START_HERE_CURRENT_TRUTH.md" -Prefix "- Branch:" -NewLine "- Branch: $branch" -Optional | Out-Null
Replace-LineByPrefix -Path ".\START_HERE_CURRENT_TRUTH.md" -Prefix "- Current checkpoint in working repo:" -NewLine "- Current checkpoint in working repo: last meaningful code checkpoint committed at $CheckpointHash"
Replace-LineByPrefix -Path ".\START_HERE_CURRENT_TRUTH.md" -Prefix "- Current active seam:" -NewLine "- Current active seam: $CurrentActiveSeam"
Replace-LineByPrefix -Path ".\START_HERE_CURRENT_TRUTH.md" -Prefix "- confirm HEAD " -NewLine "- confirm HEAD $CheckpointHash as the last meaningful code checkpoint, then $NextMove"

Replace-LineByPrefix -Path ".\PROJECT_CURRENT_STATE.md" -Prefix "- Active branch:" -NewLine "- Active branch: $branch" -Optional | Out-Null
Replace-LineByPrefix -Path ".\PROJECT_CURRENT_STATE.md" -Prefix "- Current checkpoint in working repo:" -NewLine "- Current checkpoint in working repo: last meaningful code checkpoint committed at $CheckpointHash"

foreach ($path in @(".\START_HERE_CURRENT_TRUTH.md", ".\PROJECT_CURRENT_STATE.md")) {
  foreach ($prefix in @("- Latest validation snapshot:", "- Validation snapshot:", "- Current validation status:")) {
    if (Replace-LineByPrefix -Path $path -Prefix $prefix -NewLine ("{0} {1}" -f $prefix, $ValidationSnapshot) -Optional) {
      break
    }
  }
}

Write-Host ""
Write-Host ("Project docs refreshed for checkpoint {0}" -f $CheckpointHash)
Write-Host ("Active seam: {0}" -f $CurrentActiveSeam)
Write-Host ("Validation: {0}" -f $ValidationSnapshot)
