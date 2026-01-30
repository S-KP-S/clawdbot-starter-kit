---
name: grok
description: Query Grok (x-AI) via OpenRouter for Twitter/X data - trending topics, searches, sentiment analysis, and real-time X insights.
homepage: https://openrouter.ai/models/x-ai/grok-code-fast-1
metadata: {"clawdbot":{"emoji":"🐦","requires":{"env":["OPENROUTER_API_KEY"]}}}
---

# Grok for Twitter/X Queries

Grok is x-AI's model with real-time access to Twitter/X data. Use it via OpenRouter for:
- **Trending topics** — what's happening now on X
- **Topic searches** — what people are saying about a subject
- **Sentiment analysis** — public opinion on topics/people/events
- **Breaking news** — real-time updates from X

## Model

- **Provider:** OpenRouter
- **Model ID:** `x-ai/grok-code-fast-1`
- **API Key:** `OPENROUTER_API_KEY` environment variable

## Quick Usage (curl)

```powershell
# Write request to temp file (avoids escaping issues)
@'
{
  "model": "x-ai/grok-code-fast-1",
  "messages": [{"role": "user", "content": "What are the top trending topics on Twitter/X right now?"}]
}
'@ | Out-File -Encoding utf8 $env:TEMP\grok-request.json

# Call Grok
curl.exe -s "https://openrouter.ai/api/v1/chat/completions" `
  -H "Authorization: Bearer $env:OPENROUTER_API_KEY" `
  -H "Content-Type: application/json" `
  -d "@$env:TEMP\grok-request.json"
```

## Example Queries

### Trending Topics
```
What's trending on Twitter/X right now? Give me the top 10 topics.
```

### Topic Search
```
What are people saying on X about [TOPIC]? Summarize the main opinions.
```

### Sentiment Analysis
```
What's the sentiment on Twitter about [PERSON/COMPANY/EVENT]? 
Is it mostly positive, negative, or mixed? Give examples.
```

### Breaking News
```
What's the latest breaking news on X about [EVENT]?
```

### Hashtag Analysis
```
What's the context behind the hashtag #[TAG] trending on X?
```

### Account Activity
```
Summarize recent tweets from @[USERNAME] and public reactions to them.
```

## Sample Prompts for Common Tasks

| Task | Prompt |
|------|--------|
| Daily trending | "What are the top 10 trending topics on X today?" |
| Tech news | "What's trending in tech Twitter right now?" |
| Crypto sentiment | "What's the sentiment on crypto Twitter about Bitcoin today?" |
| Sports updates | "What are people saying on X about [TEAM/GAME]?" |
| Political pulse | "What are the main political discussions on X right now?" |
| Brand monitoring | "What are people saying about [BRAND] on Twitter?" |
| Event tracking | "What's happening on X regarding [EVENT]?" |

## Response Handling

Grok returns standard OpenAI-compatible JSON:

```json
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "The response text..."
    }
  }]
}
```

Extract content with:
```powershell
$response = curl.exe ... | ConvertFrom-Json
$response.choices[0].message.content
```

## Best Practices

1. **Be specific** — "trending in tech" beats "what's trending"
2. **Time context** — Grok has real-time access, so "right now" and "today" work
3. **Ask for examples** — "give examples of tweets" yields concrete data
4. **Request structure** — "list the top 5" or "summarize in bullet points"
5. **Sentiment requests** — explicitly ask for positive/negative/mixed breakdown

## When to Use Grok vs Web Search

| Use Grok | Use Web Search |
|----------|----------------|
| Twitter/X specific data | General web results |
| Real-time X sentiment | News articles |
| Trending hashtags | Blog posts, documentation |
| What people are saying | Official sources |
| Social media pulse | Factual lookups |

## Limitations

- Grok's X data is real-time but may not include private/protected tweets
- Results reflect public discourse (can be noisy or biased)
- Rate limits apply via OpenRouter
- Best for social sentiment, not authoritative facts
