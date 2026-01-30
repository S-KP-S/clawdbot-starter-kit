"""AI-powered trading decision engine."""
import json
from dataclasses import dataclass
from typing import Optional
from datetime import datetime

try:
    import openai
except ImportError:
    openai = None

try:
    import anthropic
except ImportError:
    anthropic = None

from .config import config
from .sentiment import SentimentResult
from .news import NewsResult
from .polymarket_client import Market
from .logger import log_event


@dataclass
class TradeDecision:
    """A trading decision from the AI."""
    action: str  # "buy", "sell", "hold"
    token_id: str
    market_question: str
    outcome: str  # YES or NO
    confidence: float  # 0-1
    amount: float  # $ amount to trade
    reasoning: str
    timestamp: str


@dataclass
class MarketAnalysis:
    """Complete analysis for a market."""
    market: Market
    sentiment_score: float
    news_bias: float  # -1 to 1
    price_opportunity: float  # how mispriced we think it is
    overall_score: float
    recommended_action: str


class DecisionEngine:
    """AI-powered decision maker for Polymarket trades."""
    
    SYSTEM_PROMPT = """You are an expert crypto trading analyst specializing in Bitcoin prediction markets on Polymarket.

Your job is to analyze:
1. Current market prices (probability implied by YES/NO prices)
2. X/Twitter sentiment (bullish/bearish signals)
3. News headlines (bullish/bearish bias)
4. Market liquidity and volatility

Then decide whether to BUY YES, BUY NO, or HOLD for each market.

Rules:
- Only recommend trades with >70% confidence
- Consider the time remaining until market resolution
- Factor in sentiment momentum (is sentiment shifting?)
- Look for mispricings: sentiment disagrees with current price
- Keep position sizes conservative (max $25 per trade)

Output JSON with your decision and reasoning."""

    def __init__(self):
        self.provider = None
        self._setup_provider()
    
    def _setup_provider(self):
        """Initialize the AI provider."""
        if config.anthropic_api_key and anthropic:
            self.provider = "anthropic"
            self.anthropic_client = anthropic.Anthropic(api_key=config.anthropic_api_key)
            log_event("decision", "Using Anthropic Claude for decisions")
        elif config.openai_api_key and openai:
            self.provider = "openai"
            self.openai_client = openai.OpenAI(api_key=config.openai_api_key)
            log_event("decision", "Using OpenAI for decisions")
        else:
            log_event("decision", "No AI provider configured", level="error")
    
    def _call_llm(self, prompt: str) -> Optional[str]:
        """Call the configured LLM."""
        try:
            if self.provider == "anthropic":
                response = self.anthropic_client.messages.create(
                    model="claude-sonnet-4-20250514",
                    max_tokens=1000,
                    system=self.SYSTEM_PROMPT,
                    messages=[{"role": "user", "content": prompt}]
                )
                return response.content[0].text
            
            elif self.provider == "openai":
                response = self.openai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    max_tokens=1000,
                    messages=[
                        {"role": "system", "content": self.SYSTEM_PROMPT},
                        {"role": "user", "content": prompt}
                    ]
                )
                return response.choices[0].message.content
        except Exception as e:
            log_event("decision", f"LLM call failed: {e}", level="error")
            return None
    
    def _build_analysis_prompt(
        self,
        markets: list[Market],
        sentiment: SentimentResult,
        news: NewsResult
    ) -> str:
        """Build the analysis prompt for the LLM."""
        
        # Format markets
        markets_text = "## Active BTC Markets on Polymarket:\n"
        for i, m in enumerate(markets[:5], 1):
            markets_text += f"""
{i}. {m.question}
   - Outcome: {m.outcome}
   - Current Price: ${m.price:.2f} ({m.price*100:.1f}% implied probability)
   - Volume: ${m.volume:,.0f}
   - Ends: {m.end_date}
   - Token ID: {m.token_id[:16]}...
"""
        
        # Format sentiment
        sentiment_text = f"""
## X/Twitter Sentiment:
- Bullish tweets: {sentiment.bullish_count}
- Bearish tweets: {sentiment.bearish_count}
- Neutral tweets: {sentiment.neutral_count}
- Overall score: {sentiment.sentiment_score:.2f} (-1=bearish, +1=bullish)
- Key signals: {', '.join(sentiment.key_signals) if sentiment.key_signals else 'None'}
"""
        
        # Format news
        news_text = f"""
## Recent News:
- Bullish headlines: {news.bullish_headlines}
- Bearish headlines: {news.bearish_headlines}
- Breaking news: {', '.join(news.breaking_news) if news.breaking_news else 'None'}

Top Headlines:
"""
        for item in news.items[:5]:
            news_text += f"- {item.title} ({item.source})\n"
        
        prompt = f"""{markets_text}
{sentiment_text}
{news_text}

Based on this data, analyze each market and provide trading recommendations.

Respond with a JSON object:
{{
    "analysis": "Brief overall market analysis",
    "decisions": [
        {{
            "token_id": "...",
            "action": "buy_yes" | "buy_no" | "hold",
            "confidence": 0.0-1.0,
            "amount": dollar amount (max 25),
            "reasoning": "Why this trade"
        }}
    ]
}}

Only include markets where you have a clear edge. Hold if uncertain."""
        
        return prompt
    
    def analyze_markets(
        self,
        markets: list[Market],
        sentiment: SentimentResult,
        news: NewsResult
    ) -> list[TradeDecision]:
        """Analyze markets and generate trade decisions."""
        
        if not markets:
            log_event("decision", "No markets to analyze")
            return []
        
        if not self.provider:
            log_event("decision", "No AI provider available", level="error")
            return []
        
        prompt = self._build_analysis_prompt(markets, sentiment, news)
        log_event("decision", "Requesting AI analysis...")
        
        response = self._call_llm(prompt)
        if not response:
            return []
        
        # Parse response
        decisions = []
        try:
            # Extract JSON from response
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            if json_start >= 0 and json_end > json_start:
                data = json.loads(response[json_start:json_end])
                
                log_event("decision", f"Analysis: {data.get('analysis', 'N/A')}")
                
                for d in data.get("decisions", []):
                    # Find the full market info
                    market = next(
                        (m for m in markets if m.token_id.startswith(d.get("token_id", "")[:16])),
                        None
                    )
                    
                    if market and d.get("action") != "hold":
                        action = "buy"
                        outcome = "YES" if "yes" in d.get("action", "").lower() else "NO"
                        
                        decisions.append(TradeDecision(
                            action=action,
                            token_id=market.token_id,
                            market_question=market.question,
                            outcome=outcome,
                            confidence=float(d.get("confidence", 0)),
                            amount=min(float(d.get("amount", 0)), config.max_position_size),
                            reasoning=d.get("reasoning", ""),
                            timestamp=datetime.now().isoformat()
                        ))
                        
        except json.JSONDecodeError as e:
            log_event("decision", f"Failed to parse AI response: {e}", level="error")
        
        # Filter by minimum confidence
        filtered = [d for d in decisions if d.confidence >= config.min_confidence]
        log_event("decision", f"Generated {len(filtered)} high-confidence decisions")
        
        return filtered
    
    def quick_decision(
        self,
        market: Market,
        sentiment_score: float,
        news_bias: float
    ) -> Optional[TradeDecision]:
        """Make a quick rule-based decision without AI (for high-confidence signals)."""
        
        # Simple heuristic: strong sentiment + news alignment = trade
        combined_signal = (sentiment_score + news_bias) / 2
        
        # If strong bullish signal and price is low
        if combined_signal > 0.5 and market.price < 0.4:
            return TradeDecision(
                action="buy",
                token_id=market.token_id,
                market_question=market.question,
                outcome="YES",
                confidence=min(0.6 + combined_signal * 0.3, 0.9),
                amount=10.0,  # Conservative
                reasoning=f"Strong bullish signal ({combined_signal:.2f}) with low price ({market.price:.2f})",
                timestamp=datetime.now().isoformat()
            )
        
        # If strong bearish signal and YES price is high
        if combined_signal < -0.5 and market.price > 0.6:
            return TradeDecision(
                action="buy",
                token_id=market.token_id,
                market_question=market.question,
                outcome="NO",
                confidence=min(0.6 + abs(combined_signal) * 0.3, 0.9),
                amount=10.0,
                reasoning=f"Strong bearish signal ({combined_signal:.2f}) with high YES price ({market.price:.2f})",
                timestamp=datetime.now().isoformat()
            )
        
        return None
