from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.db import get_db
from services.habit_service import HabitService

router = APIRouter()

@router.get("/habit/candidates")
def habit_candidates(
    db: Session = Depends(get_db)
):
    """
    고정된 사용자 ID(1)로 최근 7일간 로그 기반 말버릇 후보 반환
    """
    service = HabitService(db)
    result = service.get_habit_candidates()
    print(result)
    return {"habit_candidates": result}
