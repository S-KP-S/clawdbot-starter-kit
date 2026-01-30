"""Polymarket CLOB API client wrapper."""
import json
import requests
from typing import Optional
from dataclasses import dataclass

from py_clob_client.client import ClobClient
from py_clob_client.clob_types import (
    MarketOrderArgs, OrderArgs, OrderType, OpenOrderParams, BookParams
)
from py_clob_client.order_builder.constants import BUY, SELL

from .config import config
from .logger import log_event

GAMMA_API = "https://gamma-api.polymarket.com"


@dataclass
class Market:
    """Simplified market data."""
    token_id: str
    condition_id: str
    question: str
    outcome: str  # YES or NO
    price: float
    volume: float
    end_date: str
    event_title: str


@dataclass
class Position:
    """Current position in a market."""
    token_id: str
    question: str
    outcome: str
    size: float
    avg_price: float
    current_price: float
    pnl: float


class PolymarketClient:
    """Wrapper for Polymarket CLOB operations."""
    
    def __init__(self):
        self.client = None
        self._authenticated = False
    
    def connect(self, read_only: bool = False) -> bool:
        """Initialize connection to Polymarket."""
        try:
            if read_only:
                self.client = ClobClient(config.clob_host)
                log_event("polymarket", "Connected (read-only)")
                return True
            
            self.client = ClobClient(
                config.clob_host,
                key=config.private_key,
                chain_id=config.chain_id,
                signature_type=0,  # EOA
                funder=config.funder_address
            )
            self.client.set_api_creds(self.client.create_or_derive_api_creds())
            self._authenticated = True
            log_event("polymarket", "Connected (authenticated)")
            return True
        except Exception as e:
            log_event("polymarket", f"Connection failed: {e}", level="error")
            return False
    
    def get_crypto_markets(self) -> list[Market]:
        """Find all active crypto-related prediction markets via Gamma API."""
        markets = []
        
        # Keywords for crypto markets
        keywords = [
            "bitcoin", "btc", "crypto", "ethereum", "eth ", "solana", 
            "microstrategy", "coinbase", "binance", "defi", "token",
            "blockchain", "mining", "stablecoin", "usdc", "usdt"
        ]
        
        try:
            # Fetch open events from Gamma API
            resp = requests.get(
                f"{GAMMA_API}/events",
                params={"closed": "false", "limit": 200},
                timeout=15
            )
            
            if resp.status_code != 200:
                log_event("polymarket", f"Gamma API error: {resp.status_code}", level="error")
                return markets
            
            events = resp.json()
            
            for event in events:
                event_title = event.get("title", "")
                search_text = (event_title + " " + event.get("description", "")).lower()
                
                # Check if crypto-related
                if not any(kw in search_text for kw in keywords):
                    continue
                
                # Get markets within this event
                for m in event.get("markets", []):
                    # Parse outcome prices
                    prices = m.get("outcomePrices", "")
                    if isinstance(prices, str):
                        try:
                            prices = json.loads(prices) if prices else ["0", "0"]
                        except:
                            prices = ["0", "0"]
                    
                    yes_price = float(prices[0]) if len(prices) > 0 else 0
                    no_price = float(prices[1]) if len(prices) > 1 else 0
                    
                    # Get token IDs from clobTokenIds
                    token_ids = m.get("clobTokenIds", "")
                    if isinstance(token_ids, str):
                        try:
                            token_ids = json.loads(token_ids) if token_ids else []
                        except:
                            token_ids = []
                    
                    yes_token = token_ids[0] if len(token_ids) > 0 else ""
                    no_token = token_ids[1] if len(token_ids) > 1 else ""
                    
                    # Add YES outcome
                    if yes_token:
                        markets.append(Market(
                            token_id=yes_token,
                            condition_id=m.get("conditionId", ""),
                            question=m.get("question", ""),
                            outcome="YES",
                            price=yes_price,
                            volume=float(m.get("volume", 0) or 0),
                            end_date=m.get("endDate", ""),
                            event_title=event_title
                        ))
                    
                    # Add NO outcome
                    if no_token:
                        markets.append(Market(
                            token_id=no_token,
                            condition_id=m.get("conditionId", ""),
                            question=m.get("question", ""),
                            outcome="NO",
                            price=no_price,
                            volume=float(m.get("volume", 0) or 0),
                            end_date=m.get("endDate", ""),
                            event_title=event_title
                        ))
            
            log_event("polymarket", f"Found {len(markets)} crypto market outcomes")
            
        except Exception as e:
            log_event("polymarket", f"Failed to get markets: {e}", level="error")
        
        return markets
    
    def get_btc_markets(self) -> list[Market]:
        """Find BTC-specific markets (subset of crypto markets)."""
        all_crypto = self.get_crypto_markets()
        btc_keywords = ["bitcoin", "btc", "microstrategy"]
        
        btc_markets = [
            m for m in all_crypto
            if any(kw in m.question.lower() or kw in m.event_title.lower() 
                   for kw in btc_keywords)
        ]
        
        log_event("polymarket", f"Found {len(btc_markets)} BTC-specific markets")
        return btc_markets
    
    def get_price(self, token_id: str, side: str = "BUY") -> Optional[float]:
        """Get current price for a token."""
        try:
            return float(self.client.get_price(token_id, side=side))
        except Exception as e:
            log_event("polymarket", f"Failed to get price: {e}", level="error")
            return None
    
    def get_orderbook(self, token_id: str) -> dict:
        """Get orderbook for a token."""
        try:
            book = self.client.get_order_book(token_id)
            return {
                "bids": book.bids[:5] if book.bids else [],
                "asks": book.asks[:5] if book.asks else []
            }
        except Exception as e:
            log_event("polymarket", f"Failed to get orderbook: {e}", level="error")
            return {"bids": [], "asks": []}
    
    def place_market_order(
        self, token_id: str, amount: float, side: str = "BUY"
    ) -> Optional[dict]:
        """Place a market order (Fill-or-Kill)."""
        if not self._authenticated:
            log_event("trading", "Cannot trade - not authenticated", level="error")
            return None
        
        if not config.trading_enabled:
            log_event("trading", f"SIMULATED: {side} ${amount} of {token_id[:8]}...")
            return {"simulated": True, "side": side, "amount": amount}
        
        try:
            order_side = BUY if side == "BUY" else SELL
            mo = MarketOrderArgs(
                token_id=token_id,
                amount=amount,
                side=order_side,
                order_type=OrderType.FOK
            )
            signed = self.client.create_market_order(mo)
            resp = self.client.post_order(signed, OrderType.FOK)
            log_event("trading", f"Order placed: {side} ${amount}", data=resp)
            return resp
        except Exception as e:
            log_event("trading", f"Order failed: {e}", level="error")
            return None
    
    def place_limit_order(
        self, token_id: str, price: float, size: float, side: str = "BUY"
    ) -> Optional[dict]:
        """Place a limit order (Good-til-Cancelled)."""
        if not self._authenticated:
            log_event("trading", "Cannot trade - not authenticated", level="error")
            return None
        
        if not config.trading_enabled:
            log_event("trading", f"SIMULATED: Limit {side} {size} @ {price}")
            return {"simulated": True, "side": side, "price": price, "size": size}
        
        try:
            order_side = BUY if side == "BUY" else SELL
            order = OrderArgs(
                token_id=token_id,
                price=price,
                size=size,
                side=order_side
            )
            signed = self.client.create_order(order)
            resp = self.client.post_order(signed, OrderType.GTC)
            log_event("trading", f"Limit order placed: {side} {size} @ {price}", data=resp)
            return resp
        except Exception as e:
            log_event("trading", f"Limit order failed: {e}", level="error")
            return None
    
    def get_open_orders(self) -> list:
        """Get all open orders."""
        if not self._authenticated:
            return []
        try:
            return self.client.get_orders(OpenOrderParams())
        except Exception as e:
            log_event("polymarket", f"Failed to get orders: {e}", level="error")
            return []
    
    def cancel_all_orders(self) -> bool:
        """Cancel all open orders."""
        if not self._authenticated:
            return False
        try:
            self.client.cancel_all()
            log_event("trading", "All orders cancelled")
            return True
        except Exception as e:
            log_event("trading", f"Cancel failed: {e}", level="error")
            return False
    
    def get_balance(self) -> Optional[float]:
        """Get USDC balance (requires implementation based on wallet)."""
        # Note: py-clob-client doesn't directly expose balance
        # Would need web3 call to USDC contract
        log_event("polymarket", "Balance check not implemented - use wallet directly")
        return None
