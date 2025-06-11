from fastapi import APIRouter, Depends, Path
from sqlalchemy.orm import Session
from models.db import get_db
from services.keyword_service import KeywordService

router = APIRouter()


@router.post("/keywords")
def add_keyword(word: str, db: Session = Depends(get_db)):
    service = KeywordService(db)
    return service.add_keyword(word)

@router.get("/keywords")
def get_keywords(db: Session = Depends(get_db)):
    service = KeywordService(db)
    return service.get_keywords()

@router.delete("/keywords/{id}")
def delete_keyword(id: int = Path(...), db: Session = Depends(get_db)):
    service = KeywordService(db)
    return service.delete_keyword(id)
