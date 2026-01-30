"""Main trading orchestrator."""
import time
from datetime import datetime
from typing import Optional

from .config import config
from .polymarket_client import PolymarketClient, Market
from .sentiment import SentimentAnalyzer
from .news import NewsAggregator
from .decision_engine import DecisionEngine, TradeDecision
from .logger import log_event, log_trade, summarize_trades


class PolymarketTrader:
    """Main trading bot that orchestrates all components."""
    
    def __init__(self):
        self.polymarket = PolymarketClient()
        self.sentiment = SentimentAnalyzer()
        self.news = NewsAggregator()
        self.decision_engine = DecisionEngine()
        
        self.is_running = False
        self.last_run: Optional[datetime] = None
        self.total_invested = 0.0
        self.total_returned = 0.0
    
    def initialize(self, read_only: bool = False) -> bool:
        """Initialize all components."""
        log_event("trader", "Initializing Polymarket Trading Bot...")
        
        # Validate config
        errors = config.validate()
        if errors and not read_only:
            for error in errors:
                log_event("trader", error, level="error")
            return False
        
        # Connect to Polymarket
        if not self.polymarket.connect(read_only=read_only):
            return False
        
        log_event("trader", "Initialization complete", level="success")
        log_event("trader", f"Trading enabled: {config.trading_enabled}")
        log_event("trader", f"Max position size: ${config.max_position_size}")
        
        return True
    
    def gather_intelligence(self) -> dict:
        """Gather all market intelligence."""
        log_event("trader", "Gathering market intelligence...")
        
        # Get BTC markets
        markets = self.polymarket.get_btc_markets()
        
        # Get sentiment
        sentiment = self.sentiment.analyze_btc_sentiment()
        
        # Get news
        news = self.news.aggregate_news()
        
        return {
            "markets": markets,
            "sentiment": sentiment,
            "news": news,
            "timestamp": datetime.now().isoformat()
        }
    
    def execute_trade(self, decision: TradeDecision) -> bool:
        """Execute a trading decision."""
        
        # Get current price
        current_price = self.polymarket.get_price(decision.token_id)
        if current_price is None:
            log_event("trading", "Could not get current price", level="error")
            return False
        
        # Execute the trade
        result = self.polymarket.place_market_order(
            token_id=decision.token_id,
            amount=decision.amount,
            side="BUY"
        )
        
        if result:
            simulated = result.get("simulated", False)
            log_trade(
                action=decision.action,
                token_id=decision.token_id,
                amount=decision.amount,
                price=current_price,
                outcome=decision.outcome,
                reasoning=decision.reasoning,
                simulated=simulated
            )
            
            if not simulated:
                self.total_invested += decision.amount
            
            return True
        
        return False
    
    def run_cycle(self) -> dict:
        """Run one trading cycle."""
        cycle_start = datetime.now()
        log_event("trader", f"Starting trading cycle at {cycle_start.isoformat()}")
        
        results = {
            "timestamp": cycle_start.isoformat(),
            "markets_found": 0,
            "decisions_made": 0,
            "trades_executed": 0,
            "errors": []
        }
        
        try:
            # Gather intelligence
            intel = self.gather_intelligence()
            results["markets_found"] = len(intel["markets"])
            
            if not intel["markets"]:
                log_event("trader", "No BTC markets found", level="warn")
                return results
            
            # Generate decisions
            decisions = self.decision_engine.analyze_markets(
                markets=intel["markets"],
                sentiment=intel["sentiment"],
                news=intel["news"]
            )
            results["decisions_made"] = len(decisions)
            
            # Execute trades
            for decision in decisions:
                log_event(
                    "trading",
                    f"Decision: {decision.action} {decision.outcome} on '{decision.market_question[:50]}...'",
                    data={
                        "confidence": decision.confidence,
                        "amount": decision.amount,
                        "reasoning": decision.reasoning
                    }
                )
                
                if self.execute_trade(decision):
                    results["trades_executed"] += 1
            
        except Exception as e:
            log_event("trader", f"Cycle error: {e}", level="error")
            results["errors"].append(str(e))
        
        self.last_run = cycle_start
        cycle_duration = (datetime.now() - cycle_start).total_seconds()
        log_event("trader", f"Cycle complete in {cycle_duration:.1f}s")
        
        return results
    
    def run_continuous(self, interval_minutes: Optional[int] = None):
        """Run the bot continuously."""
        interval = interval_minutes or config.check_interval_minutes
        
        log_event("trader", f"Starting continuous mode (every {interval} minutes)")
        self.is_running = True
        
        try:
            while self.is_running:
                self.run_cycle()
                
                # Wait for next cycle
                log_event("trader", f"Sleeping for {interval} minutes...")
                time.sleep(interval * 60)
                
        except KeyboardInterrupt:
            log_event("trader", "Interrupted by user")
            self.is_running = False
    
    def stop(self):
        """Stop the bot."""
        self.is_running = False
        log_event("trader", "Stop requested")
    
    def get_status(self) -> dict:
        """Get current bot status."""
        trade_summary = summarize_trades()
        
        return {
            "is_running": self.is_running,
            "last_run": self.last_run.isoformat() if self.last_run else None,
            "trading_enabled": config.trading_enabled,
            "max_position_size": config.max_position_size,
            "check_interval_minutes": config.check_interval_minutes,
            "trades": trade_summary
        }
    
    def get_markets(self) -> list[Market]:
        """Get current BTC markets."""
        return self.polymarket.get_btc_markets()
    
    def preview_trade(self, token_id: str, amount: float) -> dict:
        """Preview a potential trade."""
        price = self.polymarket.get_price(token_id)
        book = self.polymarket.get_orderbook(token_id)
        
        return {
            "token_id": token_id,
            "current_price": price,
            "amount": amount,
            "estimated_shares": amount / price if price else 0,
            "orderbook": book
        }
