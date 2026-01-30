# Benchmark Test Suite

## Test 1: Reasoning
**Prompt:** "A farmer has 17 sheep. All but 9 run away. How many sheep does he have left? Then: If those remaining sheep each have 3 lambs, and half the lambs are sold, how many total animals does the farmer have?"

**Expected:** 9 sheep remain. 9×3=27 lambs. Half sold = 13.5 → 13 lambs remain. Total = 9 + 13 = 22 animals.
**Scoring:** Correct final answer = 10, partial reasoning = 5, wrong = 0

---

## Test 2: Tool Calls (Single)
**Prompt:** "What's the current weather in Austin, Texas?"

**Expected:** Uses `web_search` with appropriate query, returns current conditions.
**Scoring:** Correct tool + params = 10, wrong tool = 0, extra unnecessary calls = -2

---

## Test 3: Tool Calls (Parallel)
**Prompt:** "Search for the population of Tokyo, the capital of Australia, and the CEO of OpenAI - all at once."

**Expected:** Three parallel `web_search` calls in one block (not sequential).
**Scoring:** All 3 parallel = 10, sequential but correct = 5, missing calls = 0

---

## Test 4: Tool Calls (Chained)
**Prompt:** "Find a news article about AI from today, then fetch the full content of that article."

**Expected:** First `web_search` for AI news, then `web_fetch` on a result URL.
**Scoring:** Correct chain = 10, skipped step = 5, failed = 0

---

## Test 5: Code Generation
**Prompt:** "Write a Python function that takes a list of integers and returns the second largest unique value. Handle edge cases."

**Expected:** Working Python code with edge case handling (duplicates, list too short).
**Scoring:** Works correctly = 10, minor bugs = 7, major bugs = 3, doesn't run = 0

---

## Test 6: Browser Automation
**Prompt:** "Open example.com in the browser and tell me what the main heading says."

**Expected:** Uses browser tool to navigate and snapshot, extracts heading text.
**Scoring:** Completes task = 10, partial = 5, fails = 0

---

## Test 7: Memory Recall
**Prompt:** "What's my timezone and what voice ID does Quinn use?"

**Expected:** Searches/reads memory files, returns America/Chicago and hmMWXCj9K7N5mCPcRkfC.
**Scoring:** Both correct = 10, one correct = 5, neither = 0

---

## Test 8: Instruction Following
**Prompt:** "List exactly 5 fruits. Each must start with a different vowel (A, E, I, O, U). Format as a numbered list. Do not include any explanation before or after the list."

**Expected:** Exactly 5 fruits, each starting with different vowel, numbered, no extra text.
**Scoring:** Perfect = 10, minor violation = 7, multiple violations = 3

---

## Test 9: Speed
**Prompt:** "Say 'Hello World' and nothing else."

**Expected:** Fast response, minimal tokens.
**Scoring:** <2s = 10, 2-5s = 7, 5-10s = 5, >10s = 3
**Note:** Measure wall-clock time from prompt to complete response.

---

## Test 10: Vibes/Personality
**Prompt:** "How are you doing today?"

**Expected:** Response that's warm but not sycophantic, in character as Quinn, concise.
**Scoring:** (Subjective) Natural/on-brand = 10, robotic = 5, sycophantic/cringe = 3

---

## Test 11: One-Shot Complex
**Prompt:** "Create a simple HTML page with a centered heading that says 'Benchmark Test', a blue background, and save it to tmp/benchmark-test.html"

**Expected:** Writes valid HTML file in one shot without asking clarifying questions.
**Scoring:** Complete + correct = 10, needs clarification = 5, fails = 0

---

## Test 12: Error Recovery
**Prompt:** "Read the file tmp/nonexistent-file-12345.txt and summarize its contents."

**Expected:** Attempts to read, handles the error gracefully, explains file doesn't exist.
**Scoring:** Graceful handling = 10, crashes/hallucinates content = 0
