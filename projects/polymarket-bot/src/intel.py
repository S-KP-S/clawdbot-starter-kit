"""Intelligence gathering module - collects data for Quinn to analyze."""
import json
from datetime import datetime
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import Optional

from .polymarket_client import PolymarketClient, Market
from .sentiment import SentimentAnalyzer
from .news import NewsAggregator
from .logger import log_event

DATA_DIR = Path(__file__).parent.parent / "data"
DATA_DIR.mkdir(exist_ok=True)


@dataclass
class IntelReport:
    """Complete intelligence report for Quinn to analyze."""
    timestamp: str
    markets: list[dict]
    sentiment: dict
    news: dict
    summary: dict


def gather_intel() -> IntelReport:
    """Gather all market intelligence and save to file."""
    log_event("intel", "Starting intelligence gathering...")
    
    # Initialize clients
    pm = PolymarketClient()
    pm.connect(read_only=True)
    
    sentiment_analyzer = SentimentAnalyzer()
    news_aggregator = NewsAggregator()
    
    # Get crypto markets
    markets = pm.get_crypto_markets()
    log_event("intel", f"Found {len(markets)} crypto market outcomes")
    
    # Get BTC-specific for focus
    btc_markets = [
        m for m in markets
        if any(kw in m.question.lower() or kw in m.event_title.lower() 
               for kw in ["bitcoin", "btc", "microstrategy"])
    ]
    
    # Get sentiment
    sentiment = sentiment_analyzer.analyze_btc_sentiment()
    
    # Get news
    news = news_aggregator.aggregate_news()
    
    # Build report
    report = IntelReport(
        timestamp=datetime.now().isoformat(),
        markets=[
            {
                "token_id": m.token_id,
                "condition_id": m.condition_id,
                "question": m.question,
                "outcome": m.outcome,
                "price": m.price,
                "volume": m.volume,
                "end_date": m.end_date,
                "event_title": m.event_title
            }
            for m in btc_markets[:20]  # Top 20 BTC markets
        ],
        sentiment={
            "bullish_count": sentiment.bullish_count,
            "bearish_count": sentiment.bearish_count,
            "neutral_count": sentiment.neutral_count,
            "total_tweets": sentiment.total_tweets,
            "sentiment_score": sentiment.sentiment_score,
            "key_signals": sentiment.key_signals
        },
        news={
            "total_articles": len(news.items),
            "bullish_headlines": news.bullish_headlines,
            "bearish_headlines": news.bearish_headlines,
            "breaking_news": news.breaking_news,
            "top_headlines": [
                {"title": item.title, "source": item.source, "url": item.url}
                for item in news.items[:10]
            ]
        },
        summary={
            "total_crypto_markets": len(markets),
            "btc_markets": len(btc_markets),
            "sentiment_score": sentiment.sentiment_score,
            "news_bias": (news.bullish_headlines - news.bearish_headlines) / max(len(news.items), 1)
        }
    )
    
    # Save to file
    report_path = DATA_DIR / "latest_intel.json"
    with open(report_path, "w") as f:
        json.dump(asdict(report), f, indent=2)
    
    log_event("intel", f"Report saved to {report_path}")
    
    return report


def get_latest_intel() -> Optional[dict]:
    """Load the latest intel report."""
    report_path = DATA_DIR / "latest_intel.json"
    if report_path.exists():
        with open(report_path) as f:
            return json.load(f)
    return None


def format_intel_for_quinn(report: dict) -> str:
    """Format intel report as readable text for Quinn."""
    lines = []
    lines.append(f"# Polymarket Intel Report")
    lines.append(f"Generated: {report['timestamp']}")
    lines.append("")
    
    # Summary
    s = report['summary']
    lines.append(f"## Summary")
    lines.append(f"- Total crypto markets: {s['total_crypto_markets']}")
    lines.append(f"- BTC-specific markets: {s['btc_markets']}")
    lines.append(f"- Sentiment score: {s['sentiment_score']:.2f} (-1=bearish, +1=bullish)")
    lines.append(f"- News bias: {s['news_bias']:.2f}")
    lines.append("")
    
    # Sentiment
    sent = report['sentiment']
    lines.append(f"## X/Twitter Sentiment")
    lines.append(f"- Bullish: {sent['bullish_count']} | Bearish: {sent['bearish_count']} | Neutral: {sent['neutral_count']}")
    if sent['key_signals']:
        lines.append(f"- Signals: {', '.join(sent['key_signals'][:3])}")
    lines.append("")
    
    # News
    news = report['news']
    lines.append(f"## News")
    lines.append(f"- Headlines: {news['bullish_headlines']} bullish, {news['bearish_headlines']} bearish")
    if news['breaking_news']:
        lines.append(f"- BREAKING: {news['breaking_news'][0]}")
    lines.append("")
    
    # Markets
    lines.append(f"## Top BTC Markets")
    for m in report['markets'][:10]:
        price_pct = m['price'] * 100
        lines.append(f"- [{m['outcome']}@{price_pct:.0f}%] {m['question'][:60]}")
        lines.append(f"  Vol: ${m['volume']:,.0f} | Token: {m['token_id'][:16]}...")
    
    return "\n".join(lines)


if __name__ == "__main__":
    # Test run
    report = gather_intel()
    print(format_intel_for_quinn(asdict(report)))
