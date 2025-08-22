<#
run_verification.ps1

Usage: run this from the repository root (c:\Users\kasik\alphafund)
PowerShell example:
  pwsh -NoProfile -ExecutionPolicy Bypass -File .\run_verification.ps1

What it does:
 - loads .env if present and exports variables to the process environment
 - validates required env vars (STRIPE_API_KEY, UPWORK_EARNINGS_URL, UPWORK_BEARER, GUMROAD_SIGNING_SECRET)
 - starts the backend (uvicorn) in the `alphafund` folder
 - runs smoke tests: gumroad (mesh.py), upwork (sample POST), stripe (/stripe/sync)
 - fetches /totals/{provider} for stripe, upwork, gumroad
 - appends a short Verification Epoch entry to MESH_CODEX.md with totals and sealed hashes

Note: this script intentionally avoids writing secrets into tracked files.
#>
param(
    [string]$EnvFile = '.env',
    [int]$Port = 8000,
    [string]$BackendFolder = "./alphafund"
)

function Load-DotEnv($path) {
    if (-not (Test-Path $path)) { return }
    Get-Content $path | ForEach-Object {
        $line = $_.Trim()
        if ($line -eq '' -or $line.StartsWith('#')) { return }
        $parts = $line -split('=',2)
        if ($parts.Length -ne 2) { return }
        $name = $parts[0].Trim()
        $value = $parts[1].Trim(' `"')
        Write-Host "Loading env var $name"
        $env:$name = $value
    }
}

Write-Host "[verify] Loading env from $EnvFile if present"
Load-DotEnv $EnvFile

$required = @('STRIPE_API_KEY','UPWORK_EARNINGS_URL','UPWORK_BEARER','GUMROAD_SIGNING_SECRET')
$missing = @()
foreach ($v in $required) { if (-not $env:$v) { $missing += $v } }
if ($missing.Count -gt 0) {
    Write-Host "[verify] Missing required env vars: $($missing -join ', ')" -ForegroundColor Yellow
    Write-Host "Please set them in environment or in $EnvFile and re-run. Exiting." -ForegroundColor Yellow
    exit 2
}

# Start backend
Push-Location $BackendFolder
Write-Host "[verify] Starting backend (uvicorn main:app) in $PWD on port $Port"
$startInfo = @{FilePath = 'python'; ArgumentList = "-m", "uvicorn", "main:app", "--port", "$Port"; NoNewWindow = $true }
$proc = Start-Process @startInfo -PassThru
Write-Host "[verify] Backend started (PID $($proc.Id)). Waiting for readiness..."

# Wait for server to respond
$uri = "http://127.0.0.1:$Port/"
$maxWait = 30
$wait = 0
while ($wait -lt $maxWait) {
    try {
        $r = Invoke-WebRequest -Uri $uri -UseBasicParsing -TimeoutSec 3
        if ($r.StatusCode -ge 200) { break }
    } catch { }
    Start-Sleep -Seconds 1
    $wait += 1
}
if ($wait -ge $maxWait) {
    Write-Host "[verify] Backend did not become ready within $maxWait seconds. Check logs. Exiting." -ForegroundColor Red
    Pop-Location
    exit 3
}
Write-Host "[verify] Backend ready. Running smoke tests..."

# 1) Gumroad test using mesh.py
Write-Host "[verify] Running gumroad test (mesh.py)"
try {
    & python .\alphafund\mesh.py test gumroad 2>&1 | Tee-Object -Variable gumout
    Write-Host $gumout
} catch {
    Write-Host "[verify] Gumroad test failed: $_" -ForegroundColor Red
}

# 2) Upwork sample POST
Write-Host "[verify] Posting sample Upwork report payload"
$upworkPayload = @{
    report = @{
        entries = @(
            @{ id = 'up_test_001'; date = (Get-Date).ToString('yyyy-MM-dd'); amount = '12.34'; currency = 'USD'; description = 'test entry' }
        )
    }
} | ConvertTo-Json -Depth 6
try {
    $respUp = Invoke-RestMethod -Uri ("http://127.0.0.1:$Port/upwork/sync") -Method Post -Body $upworkPayload -ContentType 'application/json'
    Write-Host "[verify] Upwork response:"; $respUp | ConvertTo-Json
} catch {
    Write-Host "[verify] Upwork POST failed: $_" -ForegroundColor Red
}

# 3) Trigger Stripe sync (server pulls using STRIPE_API_KEY)
Write-Host "[verify] Triggering /stripe/sync"
try {
    $respStripe = Invoke-RestMethod -Uri ("http://127.0.0.1:$Port/stripe/sync") -Method Post -TimeoutSec 60
    Write-Host "[verify] Stripe response:"; $respStripe | ConvertTo-Json
} catch {
    Write-Host "[verify] Stripe sync failed: $_" -ForegroundColor Yellow
}

# 4) Fetch totals for all three
$providers = @('gumroad','upwork','stripe')
$results = @{}
foreach ($p in $providers) {
    try {
        $t = Invoke-RestMethod -Uri ("http://127.0.0.1:$Port/totals/$p") -Method Get -TimeoutSec 10
        $results[$p] = $t
        Write-Host "[verify] $p -> $($t.total_formatted ?? $t.total_usd ?? $t.total_usd) rows=$($t.rows) seal=$($t.sealed_hash)"
    } catch {
        Write-Host "[verify] Failed to fetch totals for $p: $_" -ForegroundColor Yellow
    }
}

# 5) Append epoch to MESH_CODEX.md
$epochTime = Get-Date -Format 'yyyy-MM-ddTHH:mm:ssZ'
$mdFile = Join-Path (Resolve-Path ..).Path 'MESH_CODEX.md'
$entry = "\n## Verification Epoch - $([DateTime]::UtcNow.ToString('yyyy-MM-dd'))\n\n" +
         "Timestamp: $epochTime`n`n"
foreach ($p in $providers) {
    if ($results.ContainsKey($p)) {
        $r = $results[$p]
        $total = $r.total_formatted -or $r.total_usd -or "${0:N2}" -f ($r.total_cents/100)
        $rows = $r.rows -or 0
        $seal = $r.sealed_hash -or $r.sealedHash -or ''
        $entry += "- $p: $total, rows=$rows, sealed_hash=$seal`n"
    } else {
        $entry += "- $p: MISSING`n"
    }
}
$entry += "\n"
Write-Host "[verify] Appending verification epoch to $mdFile"
Add-Content -Path $mdFile -Value $entry

Write-Host "[verify] Verification run complete. Backend PID $($proc.Id) is still running. You can stop it manually when ready."
Pop-Location

# Exit cleanly
exit 0
