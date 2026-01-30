"""Test Gamma API for market discovery."""
import requests

# Gamma API endpoint
GAMMA_URL = "https://gamma-api.polymarket.com"

# Get active markets
resp = requests.get(f"{GAMMA_URL}/markets", params={"active": "true", "limit": 50})
print(f"Status: {resp.status_code}")

if resp.status_code == 200:
    markets = resp.json()
    print(f"Found {len(markets)} markets\n")
    
    for m in markets[:10]:
        question = m.get("question", "N/A")[:70]
        volume = m.get("volume", 0)
        print(f"  ${float(volume):,.0f} | {question}")
    
    # Search for crypto
    print("\n--- Crypto/BTC ---")
    keywords = ["bitcoin", "btc", "crypto", "ethereum", "eth ", "solana"]
    for m in markets:
        q = m.get("question", "").lower()
        if any(kw in q for kw in keywords):
            print(f"  {m.get('question', '')[:70]}")
            print(f"    Tokens: {m.get('tokens', [])}")
else:
    print(f"Error: {resp.text}")
