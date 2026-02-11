from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))) )

from config import settings

# -----------------------------
# PASSWORD HASHING
# -----------------------------
pwd_context = CryptContext(
    schemes=["bcrypt"], 
    bcrypt__rounds=12,       # optional: increase/decrease rounds
    deprecated="auto"
)
MAX_BCRYPT_BYTES = 72  # bcrypt max

def hash_password(password: str) -> str:
    # ensure password is bytes and truncate to 72
    truncated = password.encode("utf-8")[:MAX_BCRYPT_BYTES]
    return pwd_context.hash(truncated)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    truncated = plain_password.encode("utf-8")[:MAX_BCRYPT_BYTES]
    return pwd_context.verify(truncated, hashed_password)

# -----------------------------
# JWT TOKEN FUNCTIONS
# -----------------------------
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

def verify_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
        return {"user_id": user_id}
    except JWTError:
        return None
