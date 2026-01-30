"""X/Twitter sentiment analysis for BTC markets."""
import subprocess
import json
import re
from dataclasses import dataclass
from typing import Optional
from datetime import datetime

from .logger import log_event


@dataclass
class SentimentResult:
    """Aggregated sentiment from X/Twitter."""
    bullish_count: int
    bearish_count: int
    neutral_count: int
    total_tweets: int
    sentiment_score: float  # -1.0 (bearish) to 1.0 (bullish)
    key_signals: list[str]
    timestamp: str


class SentimentAnalyzer:
    """Analyze BTC sentiment from X/Twitter using Clawdbot's bird skill."""
    
    # Keywords indicating bullish sentiment
    BULLISH_KEYWORDS = [
        "bullish", "moon", "pump", "buy", "long", "breakout",
        "ath", "all time high", "green", "rally", "surge",
        "🚀", "📈", "💚", "🐂"
    ]
    
    # Keywords indicating bearish sentiment
    BEARISH_KEYWORDS = [
        "bearish", "dump", "sell", "short", "crash", "dip",
        "red", "plunge", "drop", "fall", "down",
        "📉", "🔴", "🐻", "💀"
    ]
    
    def __init__(self):
        self.last_result: Optional[SentimentResult] = None
    
    def _run_bird_search(self, query: str, count: int = 20) -> list[dict]:
        """Run a search using the bird CLI (Clawdbot X skill)."""
        try:
            # Use bird CLI for X search
            cmd = f'bird search "{query}" --count {count} --json'
            result = subprocess.run(
                cmd, shell=True, capture_output=True, text=True, timeout=30
            )
            if result.returncode == 0:
                return json.loads(result.stdout)
            else:
                log_event("sentiment", f"Bird search failed: {result.stderr}", level="warn")
                return []
        except subprocess.TimeoutExpired:
            log_event("sentiment", "Bird search timed out", level="warn")
            return []
        except json.JSONDecodeError:
            log_event("sentiment", "Failed to parse bird output", level="warn")
            return []
        except Exception as e:
            log_event("sentiment", f"Bird search error: {e}", level="error")
            return []
    
    def _classify_tweet(self, text: str) -> str:
        """Classify a tweet as bullish, bearish, or neutral."""
        text_lower = text.lower()
        
        bullish_hits = sum(1 for kw in self.BULLISH_KEYWORDS if kw in text_lower)
        bearish_hits = sum(1 for kw in self.BEARISH_KEYWORDS if kw in text_lower)
        
        if bullish_hits > bearish_hits:
            return "bullish"
        elif bearish_hits > bullish_hits:
            return "bearish"
        return "neutral"
    
    def _extract_signals(self, tweets: list[dict]) -> list[str]:
        """Extract key trading signals from tweets."""
        signals = []
        
        # Look for price mentions
        for tweet in tweets[:10]:
            text = tweet.get("text", "")
            
            # Price targets
            price_matches = re.findall(r'\$(\d{2,3}),?(\d{3})', text)
            for match in price_matches:
                price = int(match[0]) * 1000 + int(match[1])
                signals.append(f"Price target: ${price:,}")
            
            # Influential accounts (high engagement)
            likes = tweet.get("likes", 0)
            if likes > 1000:
                sentiment = self._classify_tweet(text)
                signals.append(f"High engagement ({likes} likes): {sentiment}")
        
        return signals[:5]  # Top 5 signals
    
    def analyze_btc_sentiment(self) -> SentimentResult:
        """Analyze current BTC sentiment from X/Twitter."""
        log_event("sentiment", "Starting BTC sentiment analysis")
        
        # Search queries
        queries = [
            "BTC",
            "bitcoin price",
            "#BTC",
            "bitcoin prediction"
        ]
        
        all_tweets = []
        for query in queries:
            tweets = self._run_bird_search(query, count=15)
            all_tweets.extend(tweets)
        
        # Dedupe by tweet ID
        seen_ids = set()
        unique_tweets = []
        for tweet in all_tweets:
            tid = tweet.get("id")
            if tid and tid not in seen_ids:
                seen_ids.add(tid)
                unique_tweets.append(tweet)
        
        # Classify each tweet
        bullish = 0
        bearish = 0
        neutral = 0
        
        for tweet in unique_tweets:
            classification = self._classify_tweet(tweet.get("text", ""))
            if classification == "bullish":
                bullish += 1
            elif classification == "bearish":
                bearish += 1
            else:
                neutral += 1
        
        total = len(unique_tweets)
        
        # Calculate sentiment score (-1 to 1)
        if total > 0:
            score = (bullish - bearish) / total
        else:
            score = 0.0
        
        # Extract key signals
        signals = self._extract_signals(unique_tweets)
        
        result = SentimentResult(
            bullish_count=bullish,
            bearish_count=bearish,
            neutral_count=neutral,
            total_tweets=total,
            sentiment_score=round(score, 3),
            key_signals=signals,
            timestamp=datetime.now().isoformat()
        )
        
        self.last_result = result
        log_event("sentiment", f"Analysis complete: score={score:.3f}, tweets={total}")
        
        return result


# Alternative: Use web search for sentiment if bird isn't available
class WebSentimentAnalyzer:
    """Fallback sentiment analyzer using web search."""
    
    def analyze_btc_sentiment(self) -> SentimentResult:
        """Simple sentiment check via news headlines."""
        # This would use web_search to find recent BTC news
        # and analyze headline sentiment
        
        # Placeholder - implement with actual web search
        return SentimentResult(
            bullish_count=0,
            bearish_count=0,
            neutral_count=0,
            total_tweets=0,
            sentiment_score=0.0,
            key_signals=["Web sentiment not implemented"],
            timestamp=datetime.now().isoformat()
        )
