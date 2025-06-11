from sqlalchemy.orm import Session
from sqlalchemy import func, text
from models.models import Log

class LogService:
    def __init__(self, db: Session):
        self.db = db
        self.user_id = 1  # 시연용 사용자 고정

    def get_all_logs(self) -> list:
        logs = self.db.query(Log).filter_by(user_id=self.user_id).order_by(Log.timestamp.desc()).all()
        return [
            {"id": log.id, "word": log.word, "timestamp": log.timestamp.isoformat()}
            for log in logs
        ]

    def get_log_stats(self) -> dict:
        results = (
            self.db.query(Log.word, func.count(Log.word).label("count"))
            .filter(Log.user_id == self.user_id)
            .group_by(Log.word)
            .order_by(func.count(Log.word).desc())
            .all()
        )

        total = sum(count for _, count in results)
        return {
            "total": total,
            "words": [{"word": word, "count": count} for word, count in results]
        }

    def get_daily_log_stats(self) -> list:
        results = (
            self.db.query(func.date(Log.timestamp).label("day"), func.count().label("count"))
            .filter(Log.user_id == self.user_id)
            .group_by(func.date(Log.timestamp))
            .order_by(func.date(Log.timestamp).asc())
            .all()
        )
        return [{"date": str(day), "count": count} for day, count in results]

    def get_weekly_log_stats(self) -> list:
        results = (
            self.db.query(func.date_format(Log.timestamp, "%Y-%u").label("week"), func.count().label("count"))
            .filter(Log.user_id == self.user_id)
            .group_by(text("week"))
            .order_by(text("week ASC"))
            .all()
        )
        return [{"week": week, "count": count} for week, count in results]

    def get_monthly_log_stats(self) -> list:
        results = (
            self.db.query(func.date_format(Log.timestamp, "%Y-%m").label("month"), func.count().label("count"))
            .filter(Log.user_id == self.user_id)
            .group_by(text("month"))
            .order_by(text("month ASC"))
            .all()
        )
        return [{"month": month, "count": count} for month, count in results]

    def delete_all_logs(self) -> dict:
        self.db.query(Log).filter_by(user_id=self.user_id).delete()
        self.db.commit()
        return {"message": "모든 로그 삭제 완료"} 