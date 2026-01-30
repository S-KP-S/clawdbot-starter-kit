#!/usr/bin/env python3
"""
Polymarket BTC Trading Bot

Automated trading on Polymarket prediction markets using:
- X/Twitter sentiment analysis
- News aggregation
- Quinn (Clawdbot) makes trading decisions

Usage:
    python main.py intel        # Gather intel report for Quinn
    python main.py markets      # List crypto markets
    python main.py trade        # Execute a trade (Quinn's decision)
    python main.py status       # Show bot status
    python main.py logs         # Show recent logs
"""

import typer
from rich.console import Console
from rich.table import Table
from rich import print as rprint

from src.trader import PolymarketTrader
from src.config import config
from src.logger import get_recent_logs, summarize_trades
from src.intel import gather_intel, get_latest_intel, format_intel_for_quinn

app = typer.Typer(help="Polymarket BTC Trading Bot")
console = Console()


@app.command()
def intel():
    """Gather intelligence report for Quinn to analyze."""
    rprint("[bold]Gathering Polymarket intelligence...[/bold]\n")
    
    try:
        from dataclasses import asdict
        report = gather_intel()
        formatted = format_intel_for_quinn(asdict(report))
        print(formatted)
        rprint("\n[green]Report saved to data/latest_intel.json[/green]")
    except Exception as e:
        rprint(f"[red]Error: {e}[/red]")
        raise typer.Exit(1)


@app.command()
def trade(
    token_id: str = typer.Argument(..., help="Token ID to trade"),
    amount: float = typer.Argument(..., help="Amount in USD"),
    side: str = typer.Option("BUY", "--side", "-s", help="BUY or SELL"),
    dry_run: bool = typer.Option(True, "--dry-run/--execute", help="Simulate or execute"),
):
    """Execute a trade (called by Quinn after analysis)."""
    trader = PolymarketTrader()
    
    if dry_run:
        rprint(f"[yellow]DRY RUN: Would {side} ${amount} of {token_id[:20]}...[/yellow]")
        return
    
    if not trader.initialize(read_only=False):
        rprint("[red]Failed to initialize. Check wallet credentials.[/red]")
        raise typer.Exit(1)
    
    result = trader.polymarket.place_market_order(token_id, amount, side)
    if result:
        rprint(f"[green]Trade executed: {result}[/green]")
    else:
        rprint("[red]Trade failed[/red]")
        raise typer.Exit(1)


@app.command()
def markets():
    """List active BTC prediction markets."""
    trader = PolymarketTrader()
    
    # Read-only connection
    if not trader.initialize(read_only=True):
        rprint("[red]Failed to connect to Polymarket.[/red]")
        raise typer.Exit(1)
    
    btc_markets = trader.get_markets()
    
    if not btc_markets:
        rprint("[yellow]No BTC markets found.[/yellow]")
        return
    
    table = Table(title="BTC Prediction Markets")
    table.add_column("Question", style="cyan", max_width=50)
    table.add_column("Outcome", style="green")
    table.add_column("Price", justify="right")
    table.add_column("Volume", justify="right")
    table.add_column("Ends", style="dim")
    
    for m in btc_markets[:10]:
        table.add_row(
            m.question[:50] + ("..." if len(m.question) > 50 else ""),
            m.outcome,
            f"${m.price:.2f}",
            f"${m.volume:,.0f}",
            m.end_date[:10] if m.end_date else "N/A"
        )
    
    console.print(table)


@app.command()
def status():
    """Show bot status and trade summary."""
    rprint("[bold]Polymarket BTC Trading Bot Status[/bold]\n")
    
    # Config
    rprint("[bold]Configuration:[/bold]")
    rprint(f"  Trading enabled: {config.trading_enabled}")
    rprint(f"  Max position size: ${config.max_position_size}")
    rprint(f"  Min confidence: {config.min_confidence}")
    rprint(f"  Check interval: {config.check_interval_minutes} minutes")
    
    # Trade summary
    summary = summarize_trades()
    rprint("\n[bold]Trade Summary:[/bold]")
    rprint(f"  Total trades: {summary['total_trades']}")
    rprint(f"  Executed: {summary.get('executed_trades', 0)}")
    rprint(f"  Simulated: {summary.get('simulated_trades', 0)}")
    rprint(f"  Total invested: ${summary.get('total_invested', 0):.2f}")


@app.command()
def logs(
    count: int = typer.Option(20, "--count", "-n", help="Number of log entries to show"),
):
    """Show recent log entries."""
    entries = get_recent_logs(count)
    
    if not entries:
        rprint("[yellow]No log entries found.[/yellow]")
        return
    
    for entry in entries:
        level = entry.get("level", "info")
        color = {
            "info": "cyan",
            "warn": "yellow",
            "error": "red",
            "success": "green"
        }.get(level, "white")
        
        timestamp = entry["timestamp"][:19]
        category = entry.get("category", "")
        message = entry.get("message", "")
        
        rprint(f"[dim]{timestamp}[/dim] [{color}][{category}][/{color}] {message}")


@app.command()
def sentiment():
    """Analyze current BTC sentiment from X/Twitter."""
    from src.sentiment import SentimentAnalyzer
    
    analyzer = SentimentAnalyzer()
    result = analyzer.analyze_btc_sentiment()
    
    rprint("[bold]BTC Sentiment Analysis[/bold]\n")
    rprint(f"  🟢 Bullish: {result.bullish_count}")
    rprint(f"  🔴 Bearish: {result.bearish_count}")
    rprint(f"  ⚪ Neutral: {result.neutral_count}")
    rprint(f"  📊 Score: {result.sentiment_score:.2f} (-1=bearish, +1=bullish)")
    
    if result.key_signals:
        rprint("\n[bold]Key Signals:[/bold]")
        for signal in result.key_signals:
            rprint(f"  • {signal}")


@app.command()
def news():
    """Fetch and analyze BTC news."""
    from src.news import NewsAggregator
    
    aggregator = NewsAggregator()
    result = aggregator.aggregate_news()
    
    rprint("[bold]BTC News Analysis[/bold]\n")
    rprint(f"  📰 Total articles: {len(result.items)}")
    rprint(f"  🟢 Bullish headlines: {result.bullish_headlines}")
    rprint(f"  🔴 Bearish headlines: {result.bearish_headlines}")
    
    if result.breaking_news:
        rprint("\n[bold red]Breaking News:[/bold red]")
        for headline in result.breaking_news:
            rprint(f"  🚨 {headline}")
    
    rprint("\n[bold]Recent Headlines:[/bold]")
    for item in result.items[:5]:
        rprint(f"  • {item.title[:70]}{'...' if len(item.title) > 70 else ''}")


if __name__ == "__main__":
    app()
