# kilo-swarm.ps1 - Spawn multiple Kilo Code (Kimi K2.5) workers in parallel - FREE
# Usage: .\kimi-swarm.ps1 -Tasks @("task1", "task2", "task3") [-BaseDir "path"] [-Wait]

param(
    [Parameter(Mandatory=$true)]
    [string[]]$Tasks,
    
    [string]$BaseDir = "C:\Users\spenc\clawd\tmp\swarm-$(Get-Date -Format 'yyyyMMdd-HHmmss')",
    
    [switch]$Wait,
    
    [switch]$Quiet,
    
    [int]$StaggerMs = 2000
)

# Use Kilo Code (free) instead of Kimi CLI (paid)
$kiloCmd = "kilocode"

# Create base directory
New-Item -ItemType Directory -Path $BaseDir -Force | Out-Null

if (-not $Quiet) {
    Write-Host "🦊 Kimi Swarm - Spawning $($Tasks.Count) workers" -ForegroundColor Cyan
    Write-Host "   Base: $BaseDir" -ForegroundColor DarkGray
}

$workers = @()
$index = 0

foreach ($task in $Tasks) {
    $index++
    $workerDir = Join-Path $BaseDir "worker-$index"
    $logFile = Join-Path $BaseDir "worker-$index.log"
    
    # Create worker directory with git
    New-Item -ItemType Directory -Path $workerDir -Force | Out-Null
    Push-Location $workerDir
    git init --quiet 2>$null
    Pop-Location
    
    if (-not $Quiet) {
        Write-Host "   [$index] Spawning: $($task.Substring(0, [Math]::Min(50, $task.Length)))..." -ForegroundColor Yellow
    }
    
    # Spawn worker using Kilo Code (free tier)
    $job = Start-Job -Name "kilo-worker-$index" -ScriptBlock {
        param($workdir, $prompt, $log)
        try {
            kilocode --auto --yolo -w $workdir -m code $prompt 2>&1 | Out-File $log -Encoding utf8
            return @{success=$true; workdir=$workdir; log=$log}
        } catch {
            return @{success=$false; error=$_.Exception.Message; workdir=$workdir}
        }
    } -ArgumentList $workerDir, $task, $logFile
    
    $workers += @{
        job = $job
        index = $index
        task = $task
        dir = $workerDir
        log = $logFile
    }
    
    # Stagger to avoid rate limits
    if ($index -lt $Tasks.Count) {
        Start-Sleep -Milliseconds $StaggerMs
    }
}

if (-not $Quiet) {
    Write-Host "`n✅ All $($Tasks.Count) workers spawned" -ForegroundColor Green
}

if ($Wait) {
    if (-not $Quiet) {
        Write-Host "⏳ Waiting for completion..." -ForegroundColor Cyan
    }
    
    $workers.job | Wait-Job | Out-Null
    
    if (-not $Quiet) {
        Write-Host "`n📊 Results:" -ForegroundColor Cyan
        foreach ($w in $workers) {
            $state = $w.job.State
            $color = if ($state -eq "Completed") { "Green" } else { "Red" }
            Write-Host "   [$($w.index)] $state - $($w.dir)" -ForegroundColor $color
        }
    }
}

# Output worker info for scripting
$output = @{
    baseDir = $BaseDir
    workers = $workers | ForEach-Object {
        @{
            index = $_.index
            jobId = $_.job.Id
            dir = $_.dir
            log = $_.log
            task = $_.task
        }
    }
}

if ($Quiet) {
    $output | ConvertTo-Json -Depth 3
} else {
    Write-Host "`n📁 Logs: $BaseDir\worker-*.log" -ForegroundColor DarkGray
    $output
}
