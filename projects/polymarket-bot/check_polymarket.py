"""Check Polymarket account status."""
from py_clob_client.client import ClobClient
from dotenv import load_dotenv
import os

load_dotenv()

pk = os.getenv('POLYGON_WALLET_PRIVATE_KEY')
funder = os.getenv('POLYMARKET_FUNDER_ADDRESS')

client = ClobClient(
    'https://clob.polymarket.com',
    key=pk,
    chain_id=137,
    signature_type=0,
    funder=funder
)
client.set_api_creds(client.create_or_derive_api_creds())

print(f"Wallet: {funder}")
print()

# Get open orders
orders = client.get_orders()
print(f"Open orders: {len(orders) if orders else 0}")

# Get trades
try:
    trades = client.get_trades()
    print(f"Recent trades: {len(trades) if trades else 0}")
except Exception as e:
    print(f"Trades: {e}")

# Get balance info if available
try:
    # Check API key info
    info = client.get_api_keys()
    print(f"API Keys: {len(info) if info else 'N/A'}")
except Exception as e:
    pass

print()
print("Note: Polymarket balances are held internally, not in wallet.")
print("You can check balance at: https://polymarket.com/portfolio")
