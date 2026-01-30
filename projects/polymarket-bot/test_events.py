"""Test events API for current markets."""
import requests
from datetime import datetime

# Try CLOB events endpoint
CLOB_URL = "https://clob.polymarket.com"

# Get events
resp = requests.get(f"{CLOB_URL}/events", params={"limit": 50})
print(f"Events Status: {resp.status_code}")

if resp.status_code == 200:
    events = resp.json()
    print(f"Found events\n")
    
    for e in events[:15]:
        title = e.get("title", "N/A")[:60]
        end = e.get("end_date_iso", "")[:10]
        print(f"  [{end}] {title}")
    
    # Look for crypto
    print("\n--- Crypto ---")
    keywords = ["bitcoin", "btc", "crypto", "ethereum", "eth ", "solana", "price"]
    for e in events:
        t = e.get("title", "").lower()
        if any(kw in t for kw in keywords):
            print(f"  {e.get('title', '')[:60]}")
            print(f"    Markets: {len(e.get('markets', []))}")

# Try Gamma with newer params
print("\n\n=== Trying Gamma with closed=false ===")
resp2 = requests.get("https://gamma-api.polymarket.com/events", params={"closed": "false", "limit": 30})
print(f"Status: {resp2.status_code}")
if resp2.status_code == 200:
    events2 = resp2.json()
    print(f"Found {len(events2)} events")
    for e in events2[:10]:
        title = e.get("title", "N/A")[:60]
        print(f"  {title}")
