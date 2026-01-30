# Model Benchmark Skill

Run a 12-category benchmark suite to evaluate Clawdbot model performance.

## Usage

When user says "run benchmark", "test this model", or "benchmark [model]":

1. Note the current model from runtime info
2. Run through each test in `tests.md` sequentially
3. Record outputs and timing to `results/YYYY-MM-DD-HH-MM-{model}.md`
4. Present summary for manual scoring

## Running the Benchmark

```
I'll run the 12-step benchmark now. Current model: {model}
```

Execute each test from `tests.md` in order. For each:
- State the category and test number
- Run the test (execute the prompt/task)
- Record: output, time taken, pass/fail for objective tests
- Move to next

## Scoring

After all tests complete:
- **Objective tests** (tool calls, code, browser): Auto-score pass/fail
- **Subjective tests** (vibes, quality): User scores 1-10

Final output format in results file:
```
# Benchmark: {model}
Date: {date}
Total Time: {time}

## Results

| # | Category | Test | Result | Score | Notes |
|---|----------|------|--------|-------|-------|
| 1 | Reasoning | ... | ... | /10 | ... |
...

## Raw Outputs
[Full outputs for each test]
```

## Test Categories

1. Reasoning
2. Tool Calls (Single)
3. Tool Calls (Parallel)
4. Tool Calls (Chained)
5. Code Generation
6. Browser Automation
7. Memory Recall
8. Instruction Following
9. Speed
10. Vibes/Personality
11. One-Shot Complex
12. Error Recovery
