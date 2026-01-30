"""Configuration management for the Polymarket bot."""
import os
from dataclasses import dataclass
from dotenv import load_dotenv

load_dotenv()


@dataclass
class Config:
    """Bot configuration."""
    
    # Polymarket
    private_key: str = os.getenv("POLYGON_WALLET_PRIVATE_KEY", "")
    funder_address: str = os.getenv("POLYMARKET_FUNDER_ADDRESS", "")
    clob_host: str = "https://clob.polymarket.com"
    chain_id: int = 137  # Polygon
    
    # AI
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    anthropic_api_key: str = os.getenv("ANTHROPIC_API_KEY", "")
    
    # Trading
    trading_enabled: bool = os.getenv("TRADING_ENABLED", "false").lower() == "true"
    max_position_size: float = float(os.getenv("MAX_POSITION_SIZE", "25.0"))
    min_confidence: float = float(os.getenv("MIN_CONFIDENCE", "0.7"))
    check_interval_minutes: int = int(os.getenv("CHECK_INTERVAL_MINUTES", "15"))
    
    # Keywords for BTC markets
    btc_keywords: list = None
    
    def __post_init__(self):
        self.btc_keywords = [
            "bitcoin", "btc", "btc price", "bitcoin price",
            "btc $", "bitcoin $", "btc above", "btc below",
            "bitcoin above", "bitcoin below"
        ]
    
    def validate(self) -> list[str]:
        """Validate required config. Returns list of errors."""
        errors = []
        if not self.private_key:
            errors.append("POLYGON_WALLET_PRIVATE_KEY is required")
        if not self.funder_address:
            errors.append("POLYMARKET_FUNDER_ADDRESS is required")
        if not self.openai_api_key and not self.anthropic_api_key:
            errors.append("OPENAI_API_KEY or ANTHROPIC_API_KEY is required")
        return errors


config = Config()
