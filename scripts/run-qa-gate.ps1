param()

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

New-Item -ItemType Directory -Force -Path "qa-runs" | Out-Null

$stamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$logPath = Join-Path "qa-runs" "qa_gate_$stamp.log"

function Log {
  param([string]$Message)
  $Message | Tee-Object -FilePath $logPath -Append
}

function Run-And-Log {
  param(
    [string]$Title,
    [string]$FilePath,
    [string[]]$ArgumentList
  )

  Log ""
  Log "=== $Title ==="

  $stdoutPath = Join-Path $env:TEMP ("qa_gate_stdout_" + [guid]::NewGuid().ToString("N") + ".log")
  $stderrPath = Join-Path $env:TEMP ("qa_gate_stderr_" + [guid]::NewGuid().ToString("N") + ".log")

  try {
    $proc = Start-Process `
      -FilePath $FilePath `
      -ArgumentList $ArgumentList `
      -WorkingDirectory (Get-Location).Path `
      -NoNewWindow `
      -Wait `
      -PassThru `
      -RedirectStandardOutput $stdoutPath `
      -RedirectStandardError $stderrPath

    if (Test-Path $stdoutPath) {
      Get-Content $stdoutPath | Tee-Object -FilePath $logPath -Append
    }

    if (Test-Path $stderrPath) {
      $stderr = Get-Content $stderrPath
      if ($stderr) {
        $stderr | Tee-Object -FilePath $logPath -Append
      }
    }

    if ($proc.ExitCode -ne 0) {
      Log ""
      Log "QA gate failed during: $Title"
      exit $proc.ExitCode
    }
  }
  finally {
    if (Test-Path $stdoutPath) { Remove-Item $stdoutPath -Force -ErrorAction SilentlyContinue }
    if (Test-Path $stderrPath) { Remove-Item $stderrPath -Force -ErrorAction SilentlyContinue }
  }
}

Log "=== QA GATE START $stamp ==="
Log "Repo: $(Get-Location)"

Run-And-Log -Title "npm run build" -FilePath "npm.cmd" -ArgumentList @("run", "build")
Run-And-Log -Title "playwright smoke" -FilePath "npx.cmd" -ArgumentList @("playwright", "test", "e2e/smoke.spec.ts", "--reporter=line")

Log ""
Log "QA gate passed."
exit 0
