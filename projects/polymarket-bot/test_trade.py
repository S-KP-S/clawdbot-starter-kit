"""Test a small trade to verify funds."""
from py_clob_client.client import ClobClient
from py_clob_client.clob_types import MarketOrderArgs, OrderType
from py_clob_client.order_builder.constants import BUY
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

# Try to buy $5 of "MicroStrategy sells any Bitcoin by March 31, 2026?" NO
# This is at 96% - very safe bet that they won't sell
token_id = "61476326573463890939120700176570456436619008823217970387484180237661307640203"

print(f"Attempting to buy $5 of NO (MicroStrategy selling BTC by March 2026)...")
print(f"Token: {token_id[:20]}...")
print()

try:
    mo = MarketOrderArgs(
        token_id=token_id,
        amount=5.0,
        side=BUY,
        order_type=OrderType.FOK
    )
    signed = client.create_market_order(mo)
    resp = client.post_order(signed, OrderType.FOK)
    print(f"SUCCESS! Order response: {resp}")
except Exception as e:
    print(f"FAILED: {e}")
    print()
    if "insufficient" in str(e).lower() or "balance" in str(e).lower():
        print("Looks like insufficient balance - need to deposit USDC to Polymarket")
    else:
        print("May need to set token allowances first")
