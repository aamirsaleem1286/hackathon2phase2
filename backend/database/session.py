import sys
import os
from typing import Generator
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlmodel import create_engine, Session
from config import settings

# -------------------------
# DATABASE ENGINE
# -------------------------
engine = create_engine(
    settings.DATABASE_URL,
    echo=True,
    connect_args={"check_same_thread": False}  # Only for SQLite
)

# -------------------------
# SESSION DEPENDENCY
# -------------------------
def get_session() -> Generator[Session, None, None]:
    """
    FastAPI dependency.
    Yields a SQLModel Session for DB operations and closes it automatically.
    """
    with Session(engine) as session:
        yield session
