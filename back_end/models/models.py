from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from datetime import datetime
import pytz
from .db import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False)

class Keyword(Base):
    __tablename__ = "keywords"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    word = Column(String(100))
    type = Column(String(10))  # "user" or "badword"
    user = relationship("User", backref="keywords")

def get_kst_now():
    return datetime.now(pytz.timezone("Asia/Seoul"))

class Log(Base):
    __tablename__ = "logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    word = Column(String(100))
    timestamp = Column(DateTime, default=get_kst_now)
    user = relationship("User", backref="logs")

class Badword(Base):
    __tablename__ = "badwords"
    id = Column(Integer, primary_key=True, index=True)
    word = Column(String(100), unique=True, nullable=False)
    category = Column(String(50))

# 말버릇 분석 추가 테이블 객체
class Habit(Base):
    __tablename__ = "habit"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    word = Column(String(100), nullable=False)
    count = Column(Integer, default=1)
    created_at = Column(DateTime, default=func.now())

    user = relationship("User", backref="habits")