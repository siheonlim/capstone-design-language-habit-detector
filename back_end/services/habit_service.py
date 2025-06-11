from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from models.models import Habit

class HabitService:
    def __init__(self, db: Session):
        self.db = db
        self.user_id = 1  # 시연용 사용자 고정

    def get_habit_candidates(self) -> list:
        """
        최근 7일간 habit 테이블에서 상위 3개 말버릇 반환
        """
        seven_days_ago = datetime.utcnow() - timedelta(days=7)

        word_counts = (
            self.db.query(Habit.word, Habit.count)
            .filter(Habit.user_id == self.user_id)
            .filter(Habit.created_at >= seven_days_ago)
            .order_by(Habit.count.desc())
            .limit(3)
            .all()
        )

        return [{"word": word, "count": count} for word, count in word_counts]
