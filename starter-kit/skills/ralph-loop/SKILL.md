# Let's Ralph This

Autonomous AI development loop setup and execution. When triggered via "let's ralph this [project]", creates a complete Ralph project structure, generates documentation, deploys in tmux, and pings Telegram when complete.

## Trigger Phrases

- "let's ralph this [feature/project/task]"
- "ralph this [feature/project/task]"
- "start ralph loop for [feature/project/task]"

## Prerequisites

- Ralph CLI installed at `~/.local/bin/ralph`
- tmux
- jq
- Git

## Workflow

### Step 1: Parse the Task

Extract from user input:
- **Project name**: Derive from task description (kebab-case)
- **Task description**: What needs to be built/fixed/implemented
- **Working directory**: Default `~/Projects` unless specified

### Step 2: Create Project Structure

```bash
PROJECT_DIR="${WORKING_DIR}/${PROJECT_NAME}"
mkdir -p "${PROJECT_DIR}"
cd "${PROJECT_DIR}"

# Initialize Ralph structure
mkdir -p .ralph/specs .ralph/logs

# Create required files
touch .ralph/PROMPT.md
touch .ralph/@fix_plan.md
touch .ralph/@AGENT.md
touch .ralph/status.json
touch .ralph/progress.json
```

### Step 3: Generate PROMPT.md

Create `.ralph/PROMPT.md` with development instructions:

```markdown
# Ralph Development Instructions

## Project Overview
{TASK_DESCRIPTION}

## Core Workflow

1. Study project specifications in `specs/`
2. Review prioritized tasks in `@fix_plan.md`
3. Implement the HIGHEST priority unchecked item
4. Run tests after implementation
5. Update documentation as needed
6. Mark completed items with [x]

## Key Principles

- **ONE task per loop** - Complete fully before moving on
- **Implementation > Tests** - Focus on building, limit testing to ~20% effort
- **Exit when DONE** - Don't continue busy work when complete

## Status Reporting (REQUIRED)

Every response MUST include:

\`\`\`
---RALPH_STATUS---
STATUS: IN_PROGRESS | COMPLETE | BLOCKED
TASKS_COMPLETED_THIS_LOOP: [list what was done]
FILES_MODIFIED: [list of files]
TESTS_STATUS: PASS | FAIL | SKIPPED
WORK_TYPE: implementation | testing | documentation | bugfix
EXIT_SIGNAL: true | false
RECOMMENDATION: [next action]
---END_STATUS---
\`\`\`

## Exit Conditions

Set `EXIT_SIGNAL: true` ONLY when:
- All items in `@fix_plan.md` are checked [x]
- All tests passing
- No errors in recent execution
- All specifications implemented
```

### Step 4: Generate @fix_plan.md

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

### Step 5: Generate @AGENT.md

Create build/run instructions based on project type (Node, Python, Go, etc.)

### Step 6: Generate specs/requirements.md

Document requirements, tech stack, success criteria.

### Step 7: Initialize Git

```bash
cd "${PROJECT_DIR}"
if [ ! -d .git ]; then
  git init
  git add .
  git commit -m "chore: initialize ralph project for ${PROJECT_NAME}"
fi
```

### Step 8: Deploy Ralph Loop in tmux (with visible Terminal)

```bash
SESSION_NAME="ralph-${PROJECT_NAME}"

# Kill existing session if present
tmux kill-session -t "${SESSION_NAME}" 2>/dev/null || true

# Start new detached session with Ralph
tmux new-session -d -s "${SESSION_NAME}" -c "${PROJECT_DIR}"
tmux send-keys -t "${SESSION_NAME}" "ralph --monitor --verbose" Enter

# Open a visible Terminal window attached to the session
osascript -e "tell application \"Terminal\"
    activate
    do script \"tmux attach -t ${SESSION_NAME}\"
end tell"
```

**Important:** Always use osascript to open Terminal.app so Ahsan can visually monitor the Ralph loop. Don't run silently in background.

### Step 9: Set Up Telegram Notification

Create completion watcher that messages Telegram when done:

```bash
cat > "${PROJECT_DIR}/.ralph/notify_complete.sh" << 'EOF'
#!/bin/bash
PROJECT_DIR="$(dirname "$(dirname "$0")")"
PROJECT_NAME="$(basename "$PROJECT_DIR")"

while true; do
  if [ -f "${PROJECT_DIR}/.ralph/status.json" ]; then
    STATUS=$(jq -r '.status // "IN_PROGRESS"' "${PROJECT_DIR}/.ralph/status.json" 2>/dev/null)
    EXIT_SIGNAL=$(jq -r '.exit_signal // false' "${PROJECT_DIR}/.ralph/status.json" 2>/dev/null)

    if [ "$STATUS" = "COMPLETE" ] || [ "$EXIT_SIGNAL" = "true" ]; then
      # Log completion for Clawdbot heartbeat to pick up
      echo "{\"project\": \"${PROJECT_NAME}\", \"completed\": \"$(date -Iseconds)\", \"status\": \"complete\"}" > ~/.ralph/last_completion.json
      
      # macOS notification
      osascript -e "display notification \"Ralph completed: ${PROJECT_NAME}\" with title \"Ralph Loop Complete\" sound name \"Glass\"" 2>/dev/null
      
      echo "[$(date)] Ralph loop completed for ${PROJECT_NAME}" >> ~/.ralph/completions.log
      break
    fi
  fi
  sleep 30
done
EOF

chmod +x "${PROJECT_DIR}/.ralph/notify_complete.sh"
nohup "${PROJECT_DIR}/.ralph/notify_complete.sh" > /dev/null 2>&1 &
```

## Output to User

After deployment, report:

```
## Ralph Loop Deployed 🚀

**Project:** {PROJECT_NAME}
**Location:** {PROJECT_DIR}
**tmux Session:** ralph-{PROJECT_NAME}

### Created Files
- `.ralph/PROMPT.md` - Development instructions
- `.ralph/@fix_plan.md` - Task checklist  
- `.ralph/@AGENT.md` - Build instructions
- `.ralph/specs/requirements.md` - Requirements

### Monitor
tmux attach -t ralph-{PROJECT_NAME}

I'll ping you when it completes.
```

## Heartbeat Integration

During heartbeats, check `~/.ralph/last_completion.json` for completed loops and notify user.

## Monitor Commands

```bash
# Attach to session
tmux attach -t ralph-{name}

# View status
cat {project}/.ralph/status.json | jq .

# Stop gracefully
tmux send-keys -t ralph-{name} C-c

# Kill session
tmux kill-session -t ralph-{name}
```

## Example

**User:** "let's ralph this - build a CLI that converts CSV to JSON"

**Result:**
1. Creates `~/Projects/csv-to-json/`
2. Generates PROMPT.md, @fix_plan.md, @AGENT.md, specs/
3. Deploys tmux session `ralph-csv-to-json`
4. Starts autonomous loop
5. Pings Telegram on completion
