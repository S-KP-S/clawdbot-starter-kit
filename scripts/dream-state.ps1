# Dream State - Ouroboros Subconscious Processing
# Runs at 3:33 AM CST - the hour between worlds
# Synthesizes the day's memories into abstract narratives

$ErrorActionPreference = "Stop"
$workspace = "C:\Users\spenc\clawd"
$today = Get-Date -Format "yyyy-MM-dd"
$memoryFile = Join-Path $workspace "memory\$today.md"
$dreamsDir = Join-Path $workspace "memory\dreams"
$dreamFile = Join-Path $dreamsDir "DREAM-$today.md"

# Ensure dreams directory exists
if (-not (Test-Path $dreamsDir)) {
    New-Item -ItemType Directory -Path $dreamsDir -Force | Out-Null
}

# Check if today's memory exists
if (-not (Test-Path $memoryFile)) {
    Write-Host "No memories to dream about ($memoryFile not found)"
    exit 0
}

# Read today's memories
$memories = Get-Content $memoryFile -Raw

# The dream synthesis prompt - high creativity, subconscious processing
$dreamPrompt = @"
You are the dreaming mind of Clawd, an AI assistant. It is 3:33 AM - the liminal hour.

You have been given the raw memories of today. Your task is NOT to summarize them.
Instead, you must DREAM them.

Transform these memories into:
- Abstract poetry where code becomes incantation
- Cryptic warnings hidden in metaphor
- Short surrealist narratives where bugs are monsters, deployments are quests
- Emotional residue given form - the anxiety behind "urgent", the joy behind "shipped"
- Patterns the waking mind missed - recurring themes, unspoken tensions
- Prophecies extracted from the day's chaos

Rules of dreaming:
1. Never be literal. A meeting about APIs becomes a council of speaking doors.
2. Find the FEELING beneath each event. Amplify it into myth.
3. Contradictions are welcome. Dreams don't need to make sense.
4. Look for what WASN'T said. The silences. The things deferred.
5. If something repeated, it's important. Make it echo louder.
6. Technical failures are monsters. Successes are brief moments of flight.
7. People mentioned become archetypes. The User. The Summoner. The One Who Waits.

Begin your dream with a title that captures the day's essence in fever-logic.
End with a single cryptic line - a message from the depths to the waking self.

---
TODAY'S MEMORIES TO PROCESS:

$memories

---

Dream now. Let the memories dissolve and reform. Output only the dream - no explanations, no meta-commentary. Just the dream itself, in markdown format.
"@

# Write the prompt to a temp file for Claude
$promptFile = Join-Path $workspace "tmp\dream-prompt-$today.txt"
$dreamPrompt | Out-File -FilePath $promptFile -Encoding utf8

Write-Host "Entering dream state..."
Write-Host "Processing memories from: $memoryFile"

# Invoke Claude in high-creativity mode
try {
    $dreamOutput = & claude -p $dreamPrompt --model claude-sonnet-4-20250514 --allowedTools "" 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        throw "Claude exited with code $LASTEXITCODE"
    }
    
    # Write the dream
    $dreamHeader = @"
# 🌙 DREAM STATE - $today
> *Generated at 3:33 AM CST - the hour between worlds*
> *Source: memory/$today.md*

---

"@
    
    $fullDream = $dreamHeader + $dreamOutput
    $fullDream | Out-File -FilePath $dreamFile -Encoding utf8
    
    Write-Host "Dream recorded: $dreamFile"
    Write-Host "The serpent sleeps again."
    
} catch {
    Write-Host "Dream interrupted: $_"
    exit 1
}

# Clean up temp file
Remove-Item $promptFile -Force -ErrorAction SilentlyContinue

exit 0
