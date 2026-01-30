# Dev Loop

Autonomous AI development loop for Windows. Trigger with "let's dev this [project]" or "dev loop [project]" to create a structured project, spawn a coding sub-agent, and get pinged when complete.

Adapted from Ahsan's Ralph Loop skill for macOS.

## Trigger Phrases

- "let's dev this [feature/project/task]"
- "dev loop [project]"
- "start dev loop for [task]"
- "autonomous dev [project]"

## Prerequisites

- Clawdbot with sessions_spawn capability
- Git for Windows
- Claude Code or similar coding agent available

## Workflow

### Step 1: Parse the Task

Extract from user input:
- **Project name**: Derive from task description (kebab-case)
- **Task description**: What needs to be built/fixed/implemented
- **Working directory**: Default `C:\Users\spenc\Projects` unless specified

### Step 2: Create Project Structure

```powershell
$ProjectDir = "C:\Users\spenc\Projects\$ProjectName"
New-Item -ItemType Directory -Path "$ProjectDir\.dev\specs" -Force
New-Item -ItemType Directory -Path "$ProjectDir\.dev\logs" -Force

# Create required files
New-Item -ItemType File -Path "$ProjectDir\.dev\PROMPT.md" -Force
New-Item -ItemType File -Path "$ProjectDir\.dev\fix_plan.md" -Force
New-Item -ItemType File -Path "$ProjectDir\.dev\AGENT.md" -Force
@{status="pending";exit_signal=$false} | ConvertTo-Json | Out-File "$ProjectDir\.dev\status.json"
```

### Step 3: Generate PROMPT.md

Create `.dev/PROMPT.md` with development instructions:

```markdown
# Development Instructions

## Project Overview
{TASK_DESCRIPTION}

## Core Workflow

1. Study project specifications in `specs/`
2. Review prioritized tasks in `fix_plan.md`
3. Implement the HIGHEST priority unchecked item
4. Run tests after implementation
5. Update documentation as needed
6. Mark completed items with [x]

## Key Principles

- **ONE task per loop** - Complete fully before moving on
- **Implementation > Tests** - Focus on building, limit testing to ~20% effort
- **Exit when DONE** - Don't continue busy work when complete

## Status Reporting (REQUIRED)

After completing work, update `.dev/status.json`:
```json
{
  "status": "IN_PROGRESS | COMPLETE | BLOCKED",
  "tasks_completed": ["task1", "task2"],
  "files_modified": ["file1.js", "file2.js"],
  "tests_status": "PASS | FAIL | SKIPPED",
  "exit_signal": false,
  "recommendation": "next action"
}
```

## Exit Conditions

Set `exit_signal: true` ONLY when:
- All items in `fix_plan.md` are checked [x]
- All tests passing
- No errors in recent execution
- All specifications implemented
```

### Step 4: Generate fix_plan.md

Break down the task into prioritized checklist:

```markdown
# Fix Plan: {PROJECT_NAME}

## High Priority
- [ ] {Critical task 1}
- [ ] {Critical task 2}
- [ ] {Critical task 3}

## Medium Priority
- [ ] {Enhancement 1}
- [ ] {Enhancement 2}

## Low Priority
- [ ] {Nice-to-have 1}

## Completed
<!-- Checked items move here -->
```

### Step 5: Generate AGENT.md

Create build/run instructions based on project type:

```markdown
# Agent Instructions

## Tech Stack
{Detect or ask: Node.js, Python, Go, etc.}

## Build Commands
```bash
npm install  # or pip install, go mod tidy, etc.
```

## Run Commands
```bash
npm start  # or python main.py, go run ., etc.
```

## Test Commands
```bash
npm test  # or pytest, go test, etc.
```
```

### Step 6: Generate specs/requirements.md

Document requirements, tech stack, success criteria.

### Step 7: Initialize Git

```powershell
Set-Location $ProjectDir
if (-not (Test-Path ".git")) {
    git init
    git add .
    git commit -m "chore: initialize dev loop for $ProjectName"
}
```

### Step 8: Spawn Sub-Agent via sessions_spawn

Use Clawdbot's sessions_spawn to deploy a coding agent:

```
sessions_spawn:
  task: |
    You are working on project: {PROJECT_NAME}
    Location: {PROJECT_DIR}
    
    Read these files first:
    - .dev/PROMPT.md (your instructions)
    - .dev/fix_plan.md (your task list)
    - .dev/AGENT.md (build/run commands)
    
    Work through the fix_plan.md checklist. After each task:
    1. Check off the completed item [x]
    2. Update .dev/status.json with progress
    
    When ALL tasks are complete, update status.json with:
    {"status": "COMPLETE", "exit_signal": true, ...}
    
    Then reply: "DEV LOOP COMPLETE: {PROJECT_NAME}"
  
  label: dev-{PROJECT_NAME}
  cleanup: keep
```

### Step 9: Monitor via Heartbeat

During heartbeats, Clawdbot checks active sessions for completion:

```javascript
// In heartbeat, check labeled sessions
const sessions = await sessions_list({ kinds: ['spawn'], messageLimit: 1 });
for (const s of sessions) {
  if (s.label?.startsWith('dev-') && s.lastMessage?.includes('DEV LOOP COMPLETE')) {
    // Notify user
    message({ action: 'send', message: `🚀 ${s.label} finished!` });
  }
}
```

## Output to User

After deployment, report:

```
## Dev Loop Deployed 🚀

**Project:** {PROJECT_NAME}
**Location:** {PROJECT_DIR}
**Session:** dev-{PROJECT_NAME}

### Created Files
- `.dev/PROMPT.md` - Development instructions
- `.dev/fix_plan.md` - Task checklist  
- `.dev/AGENT.md` - Build instructions
- `.dev/specs/requirements.md` - Requirements

### Monitor
Check session: sessions_list or sessions_history

I'll ping you when it completes.
```

## Monitor Commands

```
# Check session status
sessions_list(kinds: ['spawn'], messageLimit: 5)

# Get full history
sessions_history(sessionKey: 'dev-{name}')

# Send message to session
sessions_send(label: 'dev-{name}', message: 'status update?')
```

## Example

**User:** "let's dev this - build a CLI that converts CSV to JSON"

**Result:**
1. Creates `C:\Users\spenc\Projects\csv-to-json\`
2. Generates PROMPT.md, fix_plan.md, AGENT.md, specs/
3. Spawns sub-agent session `dev-csv-to-json`
4. Starts autonomous coding loop
5. Pings Telegram on completion
