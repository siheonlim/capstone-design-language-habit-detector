from sqlalchemy.orm import Session
from models.models import Keyword
from fastapi import HTTPException

class KeywordService:
    def __init__(self, db: Session):
        self.db = db
        self.user_id = 1  # 시연용 사용자 고정

    def add_keyword(self, word: str) -> dict:
        # 중복 방지
        existing = self.db.query(Keyword).filter_by(user_id=self.user_id, word=word).first()
        if existing:
            raise HTTPException(status_code=400, detail="이미 등록된 키워드입니다.")

        keyword = Keyword(user_id=self.user_id, word=word, type="user")
        self.db.add(keyword)
        self.db.commit()
        self.db.refresh(keyword)
        return {"message": "키워드 등록 완료", "word": keyword.word}

    def get_keywords(self) -> list:
        keywords = self.db.query(Keyword).filter_by(user_id=self.user_id).all()
        return [{"id": kw.id, "word": kw.word, "type": kw.type} for kw in keywords]

    def delete_keyword(self, id: int) -> dict:
        keyword = self.db.query(Keyword).filter_by(id=id, user_id=self.user_id).first()
        if not keyword:
            raise HTTPException(status_code=404, detail="해당 키워드를 찾을 수 없습니다.")

        self.db.delete(keyword)
        self.db.commit()
        return {"message": "키워드 삭제 완료", "deleted_id": id} 