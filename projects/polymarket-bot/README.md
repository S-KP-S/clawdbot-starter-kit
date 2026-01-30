# Polymarket BTC Trading Bot 🤖📈

Automated trading on Polymarket prediction markets for Bitcoin, powered by AI sentiment analysis.

**Features:**
- 📊 Scans X/Twitter for BTC sentiment
- 📰 Aggregates crypto news from multiple sources
- 🧠 AI-powered trade decisions (Claude or GPT-4o)
- 💰 Automatic position management
- 📝 Full decision logging and audit trail

## Quick Start

### 1. Install Dependencies

```bash
cd projects/polymarket-bot
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your keys
```

**Required:**
- `POLYGON_WALLET_PRIVATE_KEY` - Your Polygon wallet private key
- `POLYMARKET_FUNDER_ADDRESS` - Your wallet address that holds USDC
- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` - For AI decisions

### 3. Run

```bash
# List available BTC markets (read-only, no keys needed)
python main.py markets

# Run one trading cycle (simulation mode by default)
python main.py run

# Check sentiment
python main.py sentiment

# Check news
python main.py news

# Run continuously (daemon mode)
python main.py daemon --interval 15
```

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `TRADING_ENABLED` | `false` | Set to `true` to execute real trades |
| `MAX_POSITION_SIZE` | `25.0` | Max $ per trade |
| `MIN_CONFIDENCE` | `0.7` | Minimum AI confidence to trade |
| `CHECK_INTERVAL_MINUTES` | `15` | How often to check markets |

## How It Works

### 1. Intelligence Gathering
- Scans X/Twitter for BTC-related posts
- Classifies each as bullish/bearish/neutral
- Fetches crypto news from CryptoCompare + CoinDesk
- Analyzes headline sentiment

### 2. Market Discovery
- Queries Polymarket for active BTC prediction markets
- Filters by keywords: "bitcoin", "btc", "btc price", etc.
- Gets current prices and orderbook data

### 3. AI Decision Engine
- Feeds all data to Claude/GPT-4o
- AI analyzes sentiment vs. current prices
- Looks for mispricings (sentiment disagrees with odds)
- Returns BUY YES, BUY NO, or HOLD for each market

### 4. Trade Execution
- Filters decisions by confidence threshold
- Executes market orders via Polymarket CLOB
- Logs every decision with reasoning

## Architecture

```
polymarket-bot/
├── main.py                 # CLI entry point
├── src/
│   ├── config.py          # Configuration management
│   ├── polymarket_client.py # Polymarket API wrapper
│   ├── sentiment.py       # X/Twitter sentiment analysis
│   ├── news.py            # News aggregation
│   ├── decision_engine.py # AI trading decisions
│   ├── trader.py          # Main orchestrator
│   └── logger.py          # Logging system
├── logs/                  # Trading logs (JSONL)
├── data/                  # Cached data
├── requirements.txt
└── .env                   # Your secrets (not committed)
```

## Commands

| Command | Description |
|---------|-------------|
| `python main.py run` | Run one trading cycle |
| `python main.py run --read-only` | Run without trading |
| `python main.py daemon` | Run continuously |
| `python main.py markets` | List BTC markets |
| `python main.py status` | Show bot status |
| `python main.py sentiment` | Analyze X sentiment |
| `python main.py news` | Fetch BTC news |
| `python main.py logs` | Show recent logs |

## Safety

- **Simulation mode by default** - Set `TRADING_ENABLED=true` explicitly
- **Position limits** - Enforced max position size
- **Confidence thresholds** - Only trades above 70% confidence
- **Full audit trail** - Every decision logged with reasoning

## Getting Polymarket Credentials

1. Create a Polygon wallet (or use existing)
2. Fund it with USDC on Polygon
3. Export your private key
4. Set allowances if using EOA (see py-clob-client docs)

**Note:** Polymarket [Terms of Service](https://polymarket.com/tos) prohibit US persons from trading.

## Integrating with Clawdbot

This bot can run as a Clawdbot background task:

```bash
# Add to cron (every 15 minutes)
clawdbot cron add --schedule "*/15 * * * *" --text "Run Polymarket bot cycle"

# Or spawn as a sub-agent
sessions_spawn --task "Run polymarket trading cycle" --cleanup keep
```

## Logs

Logs are stored in `logs/` as JSONL:
- `trading_YYYY-MM-DD.jsonl` - Daily activity logs
- `trades.jsonl` - All trade decisions

Example log entry:
```json
{
  "timestamp": "2026-01-26T19:55:00",
  "level": "success",
  "category": "trade",
  "message": "EXECUTED: BUY YES $25.00 @ 0.42",
  "data": {...}
}
```

## Disclaimer

This is experimental software. Prediction markets involve risk. Only trade what you can afford to lose. The AI can and will make mistakes.

---

Built with 🦊 by Quinn
