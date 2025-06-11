import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
from pathlib import Path

# .env 파일 경로 지정 및 로드 (현재 디렉터리 기준)
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# 환경변수 불러오기
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST")
port = os.getenv("DB_PORT")
db_name = os.getenv("DB_NAME")

# SQLAlchemy 연결 URL 구성
DATABASE_URL = f"mysql+pymysql://{user}:{password}@{host}:{port}/{db_name}"

# 연결 객체 생성
engine = create_engine(DATABASE_URL, echo=True)

# 세션 객체
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

# Base 클래스 (모델 선언 시 상속)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
