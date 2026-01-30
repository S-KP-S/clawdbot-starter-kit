"""Find all crypto/BTC markets on Polymarket."""
import requests
import sys
sys.stdout.reconfigure(encoding='utf-8')

GAMMA_URL = "https://gamma-api.polymarket.com"

# Get all open events
resp = requests.get(f"{GAMMA_URL}/events", params={"closed": "false", "limit": 200})
events = resp.json()
print(f"Total open events: {len(events)}\n")

# Find crypto-related
keywords = ["bitcoin", "btc", "crypto", "ethereum", "eth ", "solana", "sol ", 
            "microstrategy", "coinbase", "binance", "price", "defi"]

crypto_events = []
for e in events:
    title = (e.get("title", "") + " " + e.get("description", "")).lower()
    if any(kw in title for kw in keywords):
        crypto_events.append(e)

print(f"Crypto-related events: {len(crypto_events)}\n")

for e in crypto_events[:15]:
    print(f"[MARKET] {e.get('title', '')}")
    print(f"   ID: {e.get('id', 'N/A')}")
    markets = e.get("markets", [])
    print(f"   Sub-markets: {len(markets)}")
    for m in markets[:3]:
        question = m.get("question", "N/A")[:50]
        cond_id = m.get("conditionId", "")[:16]
        outcomes = m.get("outcomePrices", "")
        print(f"     - {question}... | prices: {outcomes}")
    print()
