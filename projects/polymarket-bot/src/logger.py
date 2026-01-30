"""Logging system for the trading bot."""
import json
from datetime import datetime
from pathlib import Path
from typing import Optional, Any

# Log directory
LOG_DIR = Path(__file__).parent.parent / "logs"
LOG_DIR.mkdir(exist_ok=True)


def get_log_file() -> Path:
    """Get today's log file path."""
    date_str = datetime.now().strftime("%Y-%m-%d")
    return LOG_DIR / f"trading_{date_str}.jsonl"


def log_event(
    category: str,
    message: str,
    level: str = "info",
    data: Optional[Any] = None
):
    """Log an event to the daily log file."""
    entry = {
        "timestamp": datetime.now().isoformat(),
        "level": level,
        "category": category,
        "message": message
    }
    
    if data is not None:
        try:
            # Ensure data is serializable
            entry["data"] = json.loads(json.dumps(data, default=str))
        except:
            entry["data"] = str(data)
    
    # Write to file
    log_file = get_log_file()
    with open(log_file, "a") as f:
        f.write(json.dumps(entry) + "\n")
    
    # Also print to console with color
    colors = {
        "info": "\033[36m",    # Cyan
        "warn": "\033[33m",    # Yellow
        "error": "\033[31m",   # Red
        "success": "\033[32m"  # Green
    }
    reset = "\033[0m"
    color = colors.get(level, "")
    
    print(f"{color}[{entry['timestamp'][:19]}] [{category}] {message}{reset}")


def log_trade(
    action: str,
    token_id: str,
    amount: float,
    price: float,
    outcome: str,
    reasoning: str,
    simulated: bool = False
):
    """Log a trade decision."""
    trade_entry = {
        "type": "trade",
        "timestamp": datetime.now().isoformat(),
        "action": action,
        "token_id": token_id,
        "amount": amount,
        "price": price,
        "outcome": outcome,
        "reasoning": reasoning,
        "simulated": simulated
    }
    
    # Write to trades log
    trades_file = LOG_DIR / "trades.jsonl"
    with open(trades_file, "a") as f:
        f.write(json.dumps(trade_entry) + "\n")
    
    status = "SIMULATED" if simulated else "EXECUTED"
    log_event(
        "trade",
        f"{status}: {action.upper()} {outcome} ${amount:.2f} @ {price:.2f}",
        level="success" if not simulated else "info",
        data=trade_entry
    )


def get_recent_logs(count: int = 50) -> list[dict]:
    """Get recent log entries."""
    log_file = get_log_file()
    if not log_file.exists():
        return []
    
    entries = []
    with open(log_file, "r") as f:
        for line in f:
            try:
                entries.append(json.loads(line))
            except:
                pass
    
    return entries[-count:]


def get_trade_history(days: int = 7) -> list[dict]:
    """Get trade history."""
    trades_file = LOG_DIR / "trades.jsonl"
    if not trades_file.exists():
        return []
    
    trades = []
    with open(trades_file, "r") as f:
        for line in f:
            try:
                trades.append(json.loads(line))
            except:
                pass
    
    return trades


def summarize_trades() -> dict:
    """Summarize trading performance."""
    trades = get_trade_history()
    
    if not trades:
        return {"total_trades": 0}
    
    executed = [t for t in trades if not t.get("simulated")]
    simulated = [t for t in trades if t.get("simulated")]
    
    total_invested = sum(t.get("amount", 0) for t in executed)
    
    return {
        "total_trades": len(trades),
        "executed_trades": len(executed),
        "simulated_trades": len(simulated),
        "total_invested": total_invested,
        "first_trade": trades[0]["timestamp"] if trades else None,
        "last_trade": trades[-1]["timestamp"] if trades else None
    }
