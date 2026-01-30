"""Check wallet balance on Polygon."""
from web3 import Web3

# Polygon RPC
w3 = Web3(Web3.HTTPProvider('https://polygon-rpc.com'))

wallet = '0xd2969b7d431a87dE8E1e206a5fd09ac60E5Ea759'

# USDC on Polygon (6 decimals)
USDC_ADDRESS = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
USDC_ABI = [{'inputs': [{'name': 'account', 'type': 'address'}], 'name': 'balanceOf', 'outputs': [{'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}]

usdc = w3.eth.contract(address=Web3.to_checksum_address(USDC_ADDRESS), abi=USDC_ABI)
balance = usdc.functions.balanceOf(Web3.to_checksum_address(wallet)).call()

usdc_balance = balance / 1e6
print(f"USDC Balance: ${usdc_balance:.2f}")

# MATIC for gas
matic = w3.eth.get_balance(Web3.to_checksum_address(wallet))
print(f"MATIC Balance: {w3.from_wei(matic, 'ether'):.4f} MATIC")
