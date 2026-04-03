[CmdletBinding()]
param(
    [switch]$SkipFullTests,
    [switch]$SkipBuild,
    [switch]$OpenTargetFiles
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Write-Step {
    param([string]$Message)
    Write-Host "`n=== $Message ===" -ForegroundColor Cyan
}

function Assert-CommandExists {
    param([string]$Name)
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command not found: $Name"
    }
}

function Invoke-Checked {
    param(
        [Parameter(Mandatory = $true)][string]$FilePath,
        [string[]]$Arguments = @()
    )

    $display = (@($FilePath) + $Arguments) -join ' '
    Write-Host "> $display" -ForegroundColor Yellow

    & $FilePath @Arguments

    if ($LASTEXITCODE -ne 0) {
        throw ("Command failed with exit code {0}: {1}" -f $LASTEXITCODE, $display)
    }
}

$repoRoot = (Get-Location).Path
$packageJson = Join-Path $repoRoot 'package.json'
if (-not (Test-Path $packageJson)) {
    throw "Run this script from the repo root. package.json was not found in: $repoRoot"
}

Assert-CommandExists git
Assert-CommandExists npm
Assert-CommandExists npx

$timestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$logDir = Join-Path $repoRoot 'handoff-logs'
$null = New-Item -ItemType Directory -Force -Path $logDir
$logPath = Join-Path $logDir ("handoff1_verify_{0}.log" -f $timestamp)

Write-Step 'Starting transcript'
Start-Transcript -Path $logPath | Out-Null

try {
    Write-Step 'Handoff 1 scope'
    Write-Host 'Target files:'
    Write-Host '  - src/engine/package/buildPackageOutputs.ts'
    Write-Host '  - src/engine/spec/buildLessonSpec.ts'
    Write-Host '  - src/pages/ResultsPage.tsx'
    Write-Host '  - wording-focused tests'
    Write-Host ''
    Write-Host 'Acceptance for this pass:'
    Write-Host '  - no package section contradicts another'
    Write-Host '  - opening and objective remain distinct'
    Write-Host '  - multi-area lessons read naturally'
    Write-Host '  - Results summary matches package wording'
    Write-Host '  - typecheck, targeted tests, full tests, build pass'

    Write-Step 'Immediate cleanup from handoff'
    $cleanupTarget = Join-Path $repoRoot 'finish_closeout_apply.ps1'
    if (Test-Path $cleanupTarget) {
        $archiveRoot = Join-Path (Split-Path $repoRoot -Parent) 'repo-helper-archive'
        $null = New-Item -ItemType Directory -Force -Path $archiveRoot
        $archivedName = "finish_closeout_apply_{0}.ps1" -f $timestamp
        $archivedPath = Join-Path $archiveRoot $archivedName
        Move-Item -Path $cleanupTarget -Destination $archivedPath -Force
        Write-Host "Archived helper script outside repo: $archivedPath" -ForegroundColor Green
    }
    else {
        Write-Host 'No finish_closeout_apply.ps1 file found in repo root.' -ForegroundColor DarkGray
    }

    Write-Step 'Baseline status'
    git status --short

    if ($OpenTargetFiles) {
        Write-Step 'Opening target files in VS Code'
        if (Get-Command code -ErrorAction SilentlyContinue) {
            $targets = @(
                'src/engine/package/buildPackageOutputs.ts',
                'src/engine/spec/buildLessonSpec.ts',
                'src/pages/ResultsPage.tsx',
                'src/engine/package-outputs.test.ts',
                'src/pages/ResultsPage.test.tsx'
            )
            code @targets
        }
        else {
            Write-Host 'VS Code command-line launcher (code) was not found. Skipping file open.' -ForegroundColor DarkGray
        }
    }

    Write-Step 'Reminder before validation'
    Write-Host 'Make the Handoff 1 code edits first, then let this script run the validation stack.' -ForegroundColor Magenta

    $env:CI = '1'

    Write-Step 'Typecheck'
    Invoke-Checked -FilePath 'npm' -Arguments @('run', 'typecheck')

    Write-Step 'Targeted Handoff 1 tests'
    Invoke-Checked -FilePath 'npx' -Arguments @(
        'vitest',
        'run',
        'src/engine/package-outputs.test.ts',
        'src/engine/lesson-spec.test.ts',
        'src/pages/ResultsPage.test.tsx'
    )

    if (-not $SkipFullTests) {
        Write-Step 'Full test suite'
        Invoke-Checked -FilePath 'npm' -Arguments @('test')
    }
    else {
        Write-Host 'Skipping full test suite because -SkipFullTests was supplied.' -ForegroundColor DarkGray
    }

    if (-not $SkipBuild) {
        Write-Step 'Build'
        Invoke-Checked -FilePath 'npm' -Arguments @('run', 'build')
    }
    else {
        Write-Host 'Skipping build because -SkipBuild was supplied.' -ForegroundColor DarkGray
    }

    Write-Step 'Finished'
    Write-Host 'Handoff 1 validation stack completed successfully.' -ForegroundColor Green
    Write-Host "Transcript log: $logPath" -ForegroundColor Green
}
finally {
    Stop-Transcript | Out-Null
}
