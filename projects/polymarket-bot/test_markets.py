"""Quick test to see what markets exist."""
from py_clob_client.client import ClobClient

client = ClobClient("https://clob.polymarket.com")
markets = client.get_simplified_markets()

data = markets.get("data", [])
print(f"Total markets: {len(data)}")
print("\nFirst 15 markets:")
for m in data[:15]:
    q = m.get("question", "N/A")[:80]
    v = m.get("volume", 0)
    print(f"  ${v:,.0f} | {q}")

# Search for crypto-related
print("\n--- Crypto/BTC related ---")
keywords = ["bitcoin", "btc", "crypto", "eth", "ethereum", "solana", "sol "]
for m in data:
    q = m.get("question", "").lower()
    if any(kw in q for kw in keywords):
        print(f"  {m.get('question', '')[:70]}")
