import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

# ---------- PATH FIX ----------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

# ---------- IMPORTS ----------
from api.v1.api_router import api_router
from database.session import engine
from database import models  # noqa: F401 (important: registers models)

# ---------- DB ----------
def create_db_and_tables():
    SQLModel.metadata.create_all(bind=engine)

# ---------- APP ----------
app = FastAPI(
    title="Todo API",
    version="1.0.0",
    description="Todo Application API"
)

# ---------- CORS (FIXED FOR DEV WITH AUTHENTICATION) ----------
# IMPORTANT:
# - For authentication with credentials, we need specific origins
# - Cannot use wildcard origins with credentials
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow only frontend origin
    allow_credentials=True,  # Enable credentials for JWT auth
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- STARTUP ----------
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# ---------- ROUTES ----------
app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}
