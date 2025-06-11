from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from models.db import SessionLocal
from services.audio_service import process_audio_file

router = APIRouter()

@router.post("/analyze-audio")
async def analyze_audio(file: UploadFile = File(...)):
    db: Session = SessionLocal()
    result, status_code = await process_audio_file(file, db)
    return JSONResponse(content=result, status_code=status_code)
