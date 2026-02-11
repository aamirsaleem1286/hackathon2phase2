from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from datetime import timedelta

from database.session import get_session
from database.models import User
from schemas.user import UserCreate, UserLogin, UserResponse
from auth.utils import hash_password, verify_password, create_access_token
from config import settings

router = APIRouter(
    # prefix="/auth",
    tags=["Auth"]
)

# =========================
# REGISTER
# =========================
@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register(
    user_data: UserCreate,
    session: Session = Depends(get_session)
):
    # Check if email already exists
    existing_user = session.exec(
        select(User).where(User.email == user_data.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )

    # Create user with hashed password
    user = User(
        email=user_data.email,
        password_hash=hash_password(user_data.password)
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    return user


# =========================
# LOGIN
# =========================
@router.post("/login")
def login(
    user_credentials: UserLogin,
    session: Session = Depends(get_session)
):
    user = session.exec(
        select(User).where(User.email == user_credentials.email)
    ).first()

    if not user or not verify_password(
        user_credentials.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(
            id=user.id,
            email=user.email,
            created_at=user.created_at
        )
    }