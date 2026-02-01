---
name: kimi-orchestration
description: Orchestrate multiple Kimi K2.5 agents in parallel for free. Spawn workers, distribute tasks, aggregate results.
version: 1.0.0
author: quinn
---

# Kimi Orchestration 🦊⚡

Orchestrate multiple **free** Kimi K2.5 agents in parallel. Perfect for:
- Parallel frontend builds (multiple components simultaneously)
- Research swarms (different angles, same question)
- A/B code approaches (pick the best)
- Divide-and-conquer complex tasks

## Architecture

```
┌─────────────────────────────────────────────────┐
│           Orchestrator (You/Quinn)              │
│        Strategy, dispatch, synthesis            │
└────────────────┬────────────────────────────────┘
                 │ spawn workers
        ┌────────┼────────┬────────┐
        ▼        ▼        ▼        ▼
   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
   │ Kimi 1 │ │ Kimi 2 │ │ Kimi 3 │ │ Kilo N │
   │ Worker │ │ Worker │ │ Worker │ │ Worker │
   └────────┘ └────────┘ └────────┘ └────────┘
       │          │          │          │
       └──────────┴──────────┴──────────┘
                       │
              Aggregate → Synthesize
```

## Available Workers

| Worker | Command | Best For | Cost |
|--------|---------|----------|------|
| **Kilo Code** ⭐ | `kilocode --auto --yolo -m code "prompt"` | All coding tasks | **FREE** |
| **Kimi CLI** | `kimi -y -p "prompt"` | If you have paid access | Paid |

**Default: Kilo Code** — uses Kimi K2.5, completely free.

## Spawning Patterns

### Pattern 1: Parallel Background Workers (PTY)

Spawn multiple workers in background, poll for completion:

```powershell
# Worker 1 - Component A
$env:WORKER_ID = "worker-1"
Start-Process -NoNewWindow powershell -ArgumentList '-Command', '& "C:\Users\spenc\.local\bin\kimi" -y -w "C:\project\component-a" -p "Build the header component with dark mode toggle" > C:\tmp\worker-1.log 2>&1'

# Worker 2 - Component B  
$env:WORKER_ID = "worker-2"
Start-Process -NoNewWindow powershell -ArgumentList '-Command', '& "C:\Users\spenc\.local\bin\kimi" -y -w "C:\project\component-b" -p "Build the sidebar navigation" > C:\tmp\worker-2.log 2>&1'

# Worker 3 - Component C
$env:WORKER_ID = "worker-3"
Start-Process -NoNewWindow powershell -ArgumentList '-Command', '& "C:\Users\spenc\.local\bin\kimi" -y -w "C:\project\component-c" -p "Build the footer with social links" > C:\tmp\worker-3.log 2>&1'
```

### Pattern 2: Isolated Workspaces

Each worker gets its own git-initialized workspace:

```powershell
# Create isolated workspaces
$timestamp = Get-Date -Format "HHmmss"
$workspaces = @(
    "C:\Users\spenc\clawd\tmp\kimi-$timestamp-1",
    "C:\Users\spenc\clawd\tmp\kimi-$timestamp-2",
    "C:\Users\spenc\clawd\tmp\kimi-$timestamp-3"
)

foreach ($ws in $workspaces) {
    New-Item -ItemType Directory -Path $ws -Force
    Push-Location $ws
    git init
    Pop-Location
}
```

### Pattern 3: Research Swarm

Multiple agents research different angles of the same topic:

```powershell
$question = "Best practices for React state management in 2026"

# Agent 1: Official docs angle
& "C:\Users\spenc\.local\bin\kimi" -y -p "Research from official React docs: $question" > research-1.md

# Agent 2: Community/Reddit angle  
& "C:\Users\spenc\.local\bin\kimi" -y -p "Research from dev community discussions: $question" > research-2.md

# Agent 3: Performance angle
& "C:\Users\spenc\.local\bin\kimi" -y -p "Research performance benchmarks: $question" > research-3.md

# Synthesize
& "C:\Users\spenc\.local\bin\kimi" -y -p "Synthesize these research files into a comprehensive guide: $(Get-Content research-*.md -Raw)"
```

## Orchestration via Clawdbot

Use `exec` with `background: true` to spawn workers, then `process` to monitor:

### Step 1: Spawn Workers

```
exec background=true command="kimi -y -w /path/to/workspace -p 'Task 1'"
exec background=true command="kimi -y -w /path/to/workspace -p 'Task 2'"  
exec background=true command="kimi -y -w /path/to/workspace -p 'Task 3'"
```

### Step 2: Monitor Progress

```
process action=list
process action=log sessionId=<id> limit=50
```

### Step 3: Aggregate Results

Once workers complete, read their output files or logs and synthesize.

## Task Distribution Strategies

### 1. Component Split (Frontend)
```
Worker 1: Header + Navigation
Worker 2: Main content area
Worker 3: Footer + Modals
Worker 4: Shared utilities + hooks
```

### 2. Layer Split (Full Stack)
```
Worker 1: Database schema + migrations
Worker 2: API routes + validation
Worker 3: Frontend components
Worker 4: Tests + documentation
```

### 3. A/B Approach
```
Worker 1: Implement with approach A (e.g., Redux)
Worker 2: Implement with approach B (e.g., Zustand)
Orchestrator: Compare, pick winner
```

### 4. Review + Implement
```
Worker 1: Implement the feature
Worker 2: Review Worker 1's code, suggest improvements
Worker 1: Apply improvements
```

## Example: Build a Dashboard

**Task**: Build a React dashboard with 4 widgets

**Orchestration**:

```powershell
# Setup
$base = "C:\Users\spenc\clawd\tmp\dashboard-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Path $base -Force
Set-Location $base
npm create vite@latest . -- --template react-ts
npm install

# Spawn 4 parallel workers
$widgets = @(
    @{name="stats"; prompt="Create src/components/StatsWidget.tsx - shows 4 KPI cards with icons"},
    @{name="chart"; prompt="Create src/components/ChartWidget.tsx - line chart using recharts"},
    @{name="table"; prompt="Create src/components/TableWidget.tsx - sortable data table"},
    @{name="activity"; prompt="Create src/components/ActivityWidget.tsx - recent activity feed"}
)

$jobs = @()
foreach ($w in $widgets) {
    $logFile = "$base\$($w.name).log"
    $job = Start-Job -ScriptBlock {
        param($prompt, $workdir, $log)
        & "C:\Users\spenc\.local\bin\kimi" -y -w $workdir -p $prompt 2>&1 | Out-File $log
    } -ArgumentList $w.prompt, $base, $logFile
    $jobs += $job
}

# Wait for all workers
$jobs | Wait-Job

# Final assembly worker
& "C:\Users\spenc\.local\bin\kimi" -y -w $base -p "Update App.tsx to import and arrange all 4 widget components in a 2x2 grid layout"
```

## Tips

1. **Workspace isolation**: Always give each worker its own directory to avoid conflicts
2. **Git init**: Initialize git in each workspace so Kimi can track changes
3. **Logging**: Redirect output to files for later review
4. **Timeouts**: Kimi can hang on complex tasks — set reasonable timeouts
5. **Error handling**: Check exit codes, retry failed workers
6. **Synthesis**: Use a final "assembler" worker or the orchestrator to merge results

## Rate Limits

Kimi K2.5 free tier is generous but not unlimited:
- Stagger spawns by 2-3 seconds if hitting limits
- Max ~5 concurrent workers recommended
- If rate limited, fall back to sequential execution

## Integration with Hyperliquid Trader

For trading workflows, combine with the trading assistant:
```
Worker 1: Sentiment analysis (Twitter/news)
Worker 2: Technical analysis (chart patterns)
Worker 3: Risk calculation
Orchestrator: Synthesize into trade decision
```
