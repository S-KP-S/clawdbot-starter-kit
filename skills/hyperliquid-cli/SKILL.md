# Hyperliquid CLI Skill

CLI for Hyperliquid DEX trading, monitoring, and automation.

## Installation

```bash
npm install -g hyperliquid-cli
```

## Authentication

Set environment variables (already configured for Spencer):
```bash
export HYPERLIQUID_PRIVATE_KEY=0x...
export HYPERLIQUID_WALLET_ADDRESS=0x...
```

Or use the account manager:
```bash
hl account add  # Interactive wizard
```

## Quick Reference

### Account & Portfolio

```bash
# Full portfolio (positions + balances)
hl account portfolio
hl account portfolio --json

# Just positions
hl account positions
hl account positions -w  # Watch mode (real-time)

# Just balances
hl account balances

# Open orders
hl account orders
```

### Trading

```bash
# Market orders
hl trade order market buy 0.001 BTC
hl trade order market sell 0.1 ETH --slippage 0.5

# Limit orders
hl trade order limit buy 0.001 BTC 50000
hl trade order limit sell 0.1 ETH 3500 --tif Gtc

# Stop-loss
hl trade order stop-loss sell 0.001 BTC 48000 49000

# Take-profit
hl trade order take-profit sell 0.001 BTC 55000 54000

# Set leverage
hl trade set-leverage BTC 10
hl trade set-leverage ETH 5 --isolated
```

### Order Management

```bash
# List open orders
hl trade order ls

# Cancel specific order
hl trade cancel <oid>

# Cancel all orders
hl trade cancel-all -y

# Cancel orders for specific coin
hl trade cancel-all --coin BTC -y
```

### Market Data

```bash
# Get price
hl asset price BTC
hl asset price HYPE --json

# Order book
hl asset book BTC
hl asset book ETH -w  # Watch mode

# List all markets
hl markets ls
```

### Watch Mode (Real-Time)

Add `-w` to any monitoring command for live updates:
```bash
hl account positions -w    # Live PnL
hl asset price BTC -w      # Live price
hl asset book ETH -w       # Live order book
```

### JSON Output

Add `--json` for scripting:
```bash
hl account portfolio --json
hl asset price BTC --json
```

### Testnet

Add `--testnet` for testnet operations:
```bash
hl --testnet account positions
hl --testnet trade order market buy 0.001 BTC
```

## Background Server (Optional)

For caching market data (note: has issues on Windows):
```bash
hl server start
hl server status
hl server stop
```

## Local Storage

| Path | Description |
|------|-------------|
| `~/.hyperliquid/accounts.db` | SQLite account storage |
| `~/.hyperliquid/order-config.json` | Order defaults |
| `~/.hl/server.log` | Server logs |

## Scripting Examples

```bash
# Get BTC price in script
BTC_PRICE=$(hl asset price BTC --json | jq -r '.price')

# Check if in position
POSITIONS=$(hl account positions --json)

# Place order and capture result
RESULT=$(hl trade order market buy 0.001 BTC --json)
```

## PowerShell Usage

Since env vars need to be set per-session in PowerShell:
```powershell
$env:HYPERLIQUID_PRIVATE_KEY = "0x..."
$env:HYPERLIQUID_WALLET_ADDRESS = "0x..."
hl account portfolio
```

Or use the permanently set User environment variables (already configured).

## Source

- npm: `hyperliquid-cli`
- GitHub: https://github.com/chrisling-dev/hyperliquid-cli
- ClawHub: https://clawhub.ai/chrisling-dev/hyperliquid-cli
