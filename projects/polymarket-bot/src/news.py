"""News aggregation for BTC market intelligence."""
import requests
from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from .logger import log_event


@dataclass
class NewsItem:
    """A single news item."""
    title: str
    url: str
    source: str
    snippet: str
    timestamp: Optional[str] = None
    relevance: float = 0.0  # 0-1 relevance score


@dataclass
class NewsResult:
    """Aggregated news results."""
    items: list[NewsItem]
    bullish_headlines: int
    bearish_headlines: int
    breaking_news: list[str]
    fetched_at: str


class NewsAggregator:
    """Aggregate BTC news from multiple sources."""
    
    # Headline sentiment keywords
    BULLISH_WORDS = [
        "surge", "rally", "rises", "jumps", "gains", "bullish",
        "record", "high", "soars", "breaks", "adoption"
    ]
    
    BEARISH_WORDS = [
        "crash", "plunge", "drops", "falls", "tumbles", "bearish",
        "low", "sells", "dump", "regulation", "ban", "hack"
    ]
    
    def __init__(self):
        self.last_result: Optional[NewsResult] = None
    
    def _classify_headline(self, headline: str) -> str:
        """Classify headline sentiment."""
        headline_lower = headline.lower()
        
        bullish = sum(1 for w in self.BULLISH_WORDS if w in headline_lower)
        bearish = sum(1 for w in self.BEARISH_WORDS if w in headline_lower)
        
        if bullish > bearish:
            return "bullish"
        elif bearish > bullish:
            return "bearish"
        return "neutral"
    
    def fetch_crypto_news(self) -> list[NewsItem]:
        """Fetch crypto news from CryptoCompare (free API)."""
        items = []
        
        try:
            # CryptoCompare News API (free, no key required for basic)
            url = "https://min-api.cryptocompare.com/data/v2/news/"
            params = {"categories": "BTC", "lang": "EN"}
            
            resp = requests.get(url, params=params, timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                for article in data.get("Data", [])[:15]:
                    items.append(NewsItem(
                        title=article.get("title", ""),
                        url=article.get("url", ""),
                        source=article.get("source", ""),
                        snippet=article.get("body", "")[:200],
                        timestamp=datetime.fromtimestamp(
                            article.get("published_on", 0)
                        ).isoformat() if article.get("published_on") else None
                    ))
                log_event("news", f"Fetched {len(items)} articles from CryptoCompare")
        except Exception as e:
            log_event("news", f"CryptoCompare fetch failed: {e}", level="warn")
        
        return items
    
    def fetch_coindesk_headlines(self) -> list[NewsItem]:
        """Fetch from CoinDesk RSS (backup source)."""
        items = []
        
        try:
            import feedparser
            feed = feedparser.parse("https://www.coindesk.com/arc/outboundfeeds/rss/")
            
            for entry in feed.entries[:10]:
                if "bitcoin" in entry.title.lower() or "btc" in entry.title.lower():
                    items.append(NewsItem(
                        title=entry.title,
                        url=entry.link,
                        source="CoinDesk",
                        snippet=entry.get("summary", "")[:200]
                    ))
            log_event("news", f"Fetched {len(items)} BTC articles from CoinDesk")
        except ImportError:
            log_event("news", "feedparser not installed - skipping CoinDesk", level="warn")
        except Exception as e:
            log_event("news", f"CoinDesk fetch failed: {e}", level="warn")
        
        return items
    
    def aggregate_news(self) -> NewsResult:
        """Aggregate news from all sources."""
        log_event("news", "Starting news aggregation")
        
        all_items = []
        
        # Fetch from sources
        all_items.extend(self.fetch_crypto_news())
        all_items.extend(self.fetch_coindesk_headlines())
        
        # Dedupe by URL
        seen_urls = set()
        unique_items = []
        for item in all_items:
            if item.url not in seen_urls:
                seen_urls.add(item.url)
                unique_items.append(item)
        
        # Classify headlines
        bullish = 0
        bearish = 0
        breaking = []
        
        for item in unique_items:
            sentiment = self._classify_headline(item.title)
            if sentiment == "bullish":
                bullish += 1
            elif sentiment == "bearish":
                bearish += 1
            
            # Check for breaking/urgent news
            if any(kw in item.title.lower() for kw in ["breaking", "just in", "urgent"]):
                breaking.append(item.title)
        
        result = NewsResult(
            items=unique_items,
            bullish_headlines=bullish,
            bearish_headlines=bearish,
            breaking_news=breaking,
            fetched_at=datetime.now().isoformat()
        )
        
        self.last_result = result
        log_event("news", f"Aggregated {len(unique_items)} items, {bullish} bullish, {bearish} bearish")
        
        return result
