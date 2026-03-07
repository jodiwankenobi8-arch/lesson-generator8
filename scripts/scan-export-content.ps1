param(
  [string[]]$Roots = @((Join-Path $env:USERPROFILE 'Downloads')),
  [int]$SinceMinutes = 180,
  [switch]$FailOnHit = $true
)

$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$phrases = @(
  'Lesson Hub',
  'Clickable Hub',
  'Choose the lesson path together',
  'Launch and Navigation',
  'Guided Rotation and Practice',
  'Hub Launch',
  'Center Rotation',
  'Complete the final quick check before leaving the hub',
  'Rotate through the practice path you were assigned'
)

$since = (Get-Date).AddMinutes(-1 * [Math]::Abs($SinceMinutes))
$rootsToScan = $Roots | Where-Object { $_ -and (Test-Path $_) } | Select-Object -Unique

function Get-ZipText {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [string[]]$IncludePatterns = @('*.xml','*.rels','*.txt','*.json','*.md')
  )

  $zip = [System.IO.Compression.ZipFile]::OpenRead($Path)
  try {
    $parts = New-Object System.Collections.Generic.List[string]
    foreach ($entry in $zip.Entries) {
      if ($entry.Length -le 0) { continue }
      $name = $entry.FullName
      if (-not ($IncludePatterns | Where-Object { $name -like $_ })) { continue }

      $stream = $entry.Open()
      $reader = $null
      try {
        $reader = New-Object System.IO.StreamReader($stream)
        $raw = $reader.ReadToEnd()
        if ($raw) { [void]$parts.Add($raw) }
      }
      finally {
        if ($reader) { $reader.Dispose() }
        $stream.Dispose()
      }
    }

    return (($parts -join "`n") -replace '<[^>]+>', ' ' -replace '&nbsp;',' ' -replace '&amp;','&' -replace '\s+', ' ').Trim()
  }
  finally {
    $zip.Dispose()
  }
}

$files = foreach ($root in $rootsToScan) {
  Get-ChildItem $root -File -ErrorAction SilentlyContinue |
    Where-Object {
      $_.LastWriteTime -ge $since -and
      $_.Extension -in '.docx','.pptx','.zip' -and
      (
        $_.Name -match 'FULL_EXPORT' -or
        $_.Name -match 'lesson_plan' -or
        $_.Name -match 'slides'
      )
    }
}

$files = $files | Sort-Object LastWriteTime -Descending

Write-Host ''
Write-Host '=== EXPORT CONTENT REGRESSION SCAN ==='
Write-Host ('Roots: ' + ($rootsToScan -join '; '))
Write-Host ('Since: ' + $since.ToString('yyyy-MM-dd HH:mm:ss'))

Write-Host ''
Write-Host '=== CANDIDATE FILES ==='
if ($files) {
  $files | Select-Object LastWriteTime, Length, FullName | Format-Table -AutoSize
} else {
  Write-Host 'NO_RECENT_EXPORT_FILES_FOUND'
  exit 0
}

$hits = @()

foreach ($file in $files) {
  try {
    switch ($file.Extension.ToLowerInvariant()) {
      '.docx' { $text = Get-ZipText -Path $file.FullName -IncludePatterns @('word/*.xml','docProps/*.xml','*.rels') }
      '.pptx' { $text = Get-ZipText -Path $file.FullName -IncludePatterns @('ppt/slides/*.xml','ppt/notesSlides/*.xml','docProps/*.xml','*.rels') }
      '.zip'  { $text = Get-ZipText -Path $file.FullName -IncludePatterns @('*.xml','*.txt','*.json','*.md') }
      default { $text = '' }
    }

    foreach ($phrase in $phrases) {
      $idx = $text.IndexOf($phrase, [System.StringComparison]::OrdinalIgnoreCase)
      if ($idx -ge 0) {
        $start = [Math]::Max(0, $idx - 120)
        $len = [Math]::Min(280, $text.Length - $start)
        $snippet = $text.Substring($start, $len)

        $hits += [PSCustomObject]@{
          Modified = $file.LastWriteTime
          Name     = $file.Name
          Phrase   = $phrase
          Snippet  = $snippet
        }
      }
    }
  }
  catch {
    $hits += [PSCustomObject]@{
      Modified = $file.LastWriteTime
      Name     = $file.Name
      Phrase   = 'READ_ERROR'
      Snippet  = $_.Exception.Message
    }
  }
}

Write-Host ''
Write-Host '=== SCAN RESULTS ==='
if ($hits.Count -eq 0) {
  Write-Host 'NO_BANNED_HUB_LANGUAGE_FOUND'
  exit 0
}

$hits |
  Sort-Object -Property Modified, Name, Phrase -Descending |
  Format-List Modified, Name, Phrase, Snippet

if ($FailOnHit) {
  exit 1
}

exit 0
