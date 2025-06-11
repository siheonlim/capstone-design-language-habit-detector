from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.db import get_db
from services.log_service import LogService

router = APIRouter()


@router.get("/logs")
def get_all_logs(db: Session = Depends(get_db)):
    service = LogService(db)
    return service.get_all_logs()

@router.get("/logs/stat")
def get_log_stats(db: Session = Depends(get_db)):
    service = LogService(db)
    return service.get_log_stats()

@router.get("/logs/stat/day")
def get_daily_log_stats(db: Session = Depends(get_db)):
    service = LogService(db)
    return service.get_daily_log_stats()

@router.get("/logs/stat/week")
def get_weekly_log_stats(db: Session = Depends(get_db)):
    service = LogService(db)
    return service.get_weekly_log_stats()

@router.get("/logs/stat/month")
def get_monthly_log_stats(db: Session = Depends(get_db)):
    service = LogService(db)
    return service.get_monthly_log_stats()

@router.delete("/logs")
def delete_all_logs(db: Session = Depends(get_db)):
    service = LogService(db)
    return service.delete_all_logs()
