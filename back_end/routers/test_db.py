# routers/test_db.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.db import SessionLocal
from sqlalchemy import text

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/test-db")
def test_db_connection(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": " DB 연결 성공"}
    except Exception as e:
        return {"status": " 연결 실패", "error": str(e)}
