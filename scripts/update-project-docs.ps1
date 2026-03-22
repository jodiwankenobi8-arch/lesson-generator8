param(
  [Parameter(Mandatory = $true)][string]$CheckpointHash,
  [Parameter(Mandatory = $true)][string]$CurrentActiveSeam,
  [Parameter(Mandatory = $true)][string]$NextMove,
  [Parameter(Mandatory = $true)][string]$ValidationSnapshot
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

function Write-Utf8NoBom {
  param(
    [string]$Path,
    [string]$Content
  )
  $encoding = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText((Resolve-Path $Path), $Content, $encoding)
}

function Replace-LineByAnyPrefix {
  param(
    [string]$Path,
    [string[]]$Prefixes,
    [string]$NewLine,
    [switch]$Optional
  )

  $text = Get-Content $Path -Raw

  foreach ($prefix in $Prefixes) {
    $pattern = '(?m)^' + [regex]::Escape($prefix) + '.*$'
    if ([regex]::IsMatch($text, $pattern)) {
      $updated = [regex]::Replace(
        $text,
        $pattern,
        [System.Text.RegularExpressions.MatchEvaluator]{
          param($match)
          return $NewLine
        },
        1
      )
      Write-Utf8NoBom -Path $Path -Content $updated
      return $true
    }
  }

  if ($Optional) {
    return $false
  }

  throw ("None of the expected prefixes were found in {0}: {1}" -f $Path, ($Prefixes -join " | "))
}

function Upsert-SectionBody {
  param(
    [string]$Path,
    [string]$Header,
    [string[]]$NextHeaders,
    [string]$NewBody
  )

  $text = Get-Content $Path -Raw
  $headerPattern = [regex]::Escape($Header)
  $nextHeaderPattern = ""

  if ($NextHeaders -and $NextHeaders.Count -gt 0) {
    $nextHeaderPattern = "(?m)^(" + (($NextHeaders | ForEach-Object { [regex]::Escape($_) }) -join "|") + ")$"
  }

  if (-not [string]::IsNullOrWhiteSpace($nextHeaderPattern)) {
    $replacePattern = "(?s)($headerPattern`r?`n)(.*?)(?=$nextHeaderPattern)"

    if ([regex]::IsMatch($text, $replacePattern)) {
      $replacement = '$1' + $NewBody.TrimEnd() + "`r`n"
      $updated = [regex]::Replace($text, $replacePattern, $replacement, 1)
      Write-Utf8NoBom -Path $Path -Content $updated
      return
    }

    foreach ($nextHeader in $NextHeaders) {
      $nextPattern = "(?m)^" + [regex]::Escape($nextHeader) + "$"
      if ([regex]::IsMatch($text, $nextPattern)) {
        $insert = $Header + "`r`n" + $NewBody.TrimEnd() + "`r`n"
        $updated = [regex]::Replace($text, $nextPattern, $insert + '$0', 1)
        Write-Utf8NoBom -Path $Path -Content $updated
        return
      }
    }
  }

  $updated = $text.TrimEnd() + "`r`n`r`n" + $Header + "`r`n" + $NewBody.TrimEnd() + "`r`n"
  Write-Utf8NoBom -Path $Path -Content $updated
}

function Replace-SectionBody {
  param(
    [string]$Path,
    [string]$Header,
    [string[]]$NextHeaders,
    [string]$NewBody
  )

  $text = Get-Content $Path -Raw
  $headerPattern = [regex]::Escape($Header)

  if (-not $NextHeaders -or $NextHeaders.Count -eq 0) {
    throw ("NextHeaders cannot be empty for Replace-SectionBody: {0}" -f $Header)
  }

  $nextHeaderPattern = "(?m)^(" + (($NextHeaders | ForEach-Object { [regex]::Escape($_) }) -join "|") + ")$"
  $pattern = "(?s)($headerPattern`r?`n)(.*?)(?=$nextHeaderPattern)"

  if (-not [regex]::IsMatch($text, $pattern)) {
    throw ("Section not found in {0}: {1}" -f $Path, $Header)
  }

  $replacement = '$1' + $NewBody.TrimEnd() + "`r`n"
  $updated = [regex]::Replace($text, $pattern, $replacement, 1)
  Write-Utf8NoBom -Path $Path -Content $updated
}
function New-Slug {
  param([string]$Text)

  $slug = $Text.ToLowerInvariant() -replace '[^a-z0-9]+', '-' -replace '^-+', '' -replace '-+$', ''
  if ([string]::IsNullOrWhiteSpace($slug)) {
    return "seam-update"
  }

  $parts = $slug.Split('-', [System.StringSplitOptions]::RemoveEmptyEntries)
  if ($parts.Count -gt 8) {
    $slug = ($parts[0..7] -join '-')
  }

  return $slug
}

$branch = (git branch --show-current).Trim()
$currentHead = (git log -1 --oneline).Trim()
$checkpointLine = (git show -s --format="%h %s" $CheckpointHash).Trim()
$timestamp = Get-Date -Format "yyyy-MM-dd_HHmm"
$slug = New-Slug -Text $CurrentActiveSeam

$startHerePath = ".\START_HERE_CURRENT_TRUTH.md"
$projectStatePath = ".\PROJECT_CURRENT_STATE.md"
$handoffDir = ".\docs\chat-handoffs"
$handoffPath = Join-Path $handoffDir ("{0}_{1}.md" -f $timestamp, $slug)

Replace-LineByAnyPrefix -Path $startHerePath -Prefixes @("- Branch:") -NewLine "- Branch: $branch" | Out-Null
Replace-LineByAnyPrefix -Path $startHerePath -Prefixes @("- Current published continuation point:", "- Current checkpoint in working repo:") -NewLine "- Current published continuation point: $currentHead" | Out-Null
Replace-LineByAnyPrefix -Path $startHerePath -Prefixes @("- Last meaningful code checkpoint:", "- Current checkpoint in working repo:") -NewLine "- Last meaningful code checkpoint: $checkpointLine" | Out-Null
Replace-LineByAnyPrefix -Path $startHerePath -Prefixes @("- Current active seam:") -NewLine "- Current active seam: $CurrentActiveSeam" | Out-Null

Upsert-SectionBody -Path $startHerePath `
  -Header "## Latest validation snapshot" `
  -NextHeaders @("## Non-blocking warnings") `
  -NewBody @"
- current published continuation point is $currentHead
- last meaningful code checkpoint is $checkpointLine
- $ValidationSnapshot
- doc refresh was run from branch $branch
"@

Upsert-SectionBody -Path $startHerePath `
  -Header "## Exact next move" `
  -NextHeaders @("## Retrieval fallback rule") `
  -NewBody @"
- current active seam: $CurrentActiveSeam
- continue from the newest handoff file and live repo files, not older overridden notes
- $NextMove
"@

Replace-LineByAnyPrefix -Path $projectStatePath -Prefixes @("- Active branch:") -NewLine "- Active branch: $branch" | Out-Null
Replace-LineByAnyPrefix -Path $projectStatePath -Prefixes @("- Current published continuation point:", "- Current checkpoint in working repo:") -NewLine "- Current published continuation point: $currentHead" | Out-Null
Replace-LineByAnyPrefix -Path $projectStatePath -Prefixes @("- Last meaningful code checkpoint:", "- Current checkpoint in working repo:") -NewLine "- Last meaningful code checkpoint: $checkpointLine" | Out-Null

Upsert-SectionBody -Path $projectStatePath `
  -Header "## Validated state" `
  -NextHeaders @("## Product truths to preserve") `
  -NewBody @"
- current published continuation point is $currentHead
- last meaningful code checkpoint is $checkpointLine
- $ValidationSnapshot
- doc refresh was run from branch $branch
"@

Upsert-SectionBody -Path $projectStatePath `
  -Header "## Top next steps" `
  -NextHeaders @("## Local doc policy") `
  -NewBody @"
1. Continue from the newest handoff file and live repo files
2. Treat the current active seam as: $CurrentActiveSeam
3. $NextMove
4. Keep continuation docs authoritative and small
5. Do not let overridden notes compete with the active continuation set
"@

New-Item -ItemType Directory -Force -Path $handoffDir | Out-Null

$handoff = @"
# $CurrentActiveSeam

## Repo checkpoint
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: $branch
- Handoff-time HEAD: $currentHead

## Current maintained truth
- Current published continuation point is $currentHead
- Last meaningful code checkpoint remains $checkpointLine
- Current active seam: $CurrentActiveSeam

## What this seam changed
- refreshed START_HERE_CURRENT_TRUTH.md against the current schema
- refreshed PROJECT_CURRENT_STATE.md against the current schema
- created one new handoff file for the seam
- preserved the last meaningful code checkpoint separately from the published continuation point

## Validation snapshot
- $ValidationSnapshot

## Recommended next move
- $NextMove
"@

$encoding = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($handoffPath, $handoff, $encoding)

Write-Host ""
Write-Host ("Project docs refreshed for checkpoint {0}" -f $CheckpointHash)
Write-Host ("Published continuation point: {0}" -f $currentHead)
Write-Host ("Active seam: {0}" -f $CurrentActiveSeam)
Write-Host ("Validation: {0}" -f $ValidationSnapshot)
Write-Host ("New handoff: {0}" -f $handoffPath)