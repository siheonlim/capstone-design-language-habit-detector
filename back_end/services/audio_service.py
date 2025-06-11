import tempfile, os, ffmpeg, torch
from sqlalchemy.orm import Session
from faster_whisper import WhisperModel
from models.models import Keyword, Badword, Log, Habit

model = WhisperModel("medium", device="cuda", compute_type="float16")

def extract_ngrams(words, n=2):
    return [" ".join(words[i:i+n]) for i in range(len(words) - n + 1)]

async def process_audio_file(file, db: Session, user_id: int = 1):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    file_size = os.path.getsize(tmp_path)
    if file_size < 5000:
        os.remove(tmp_path)
        return {"error": "오디오 파일이 너무 작습니다."}, 400

    wav_path = tmp_path.replace(".webm", ".wav")
    try:
        try:
            ffmpeg.input(tmp_path).output(wav_path).run(overwrite_output=True)
            audio_path = wav_path
        except Exception:
            audio_path = tmp_path

        segments, _ = model.transcribe(audio_path, language="ko", beam_size=5, temperature=0.0)
        transcribed_text = " ".join(segment.text for segment in segments)

        keywords = db.query(Keyword).filter_by(user_id=user_id).all()
        badwords = db.query(Badword).all()

        keyword_hits = [k.word for k in keywords if k.word in transcribed_text]
        badword_hits = [b.word for b in badwords if b.word in transcribed_text]

        for word in keyword_hits + badword_hits:
            db.add(Log(user_id=user_id, word=word))

        words = transcribed_text.split()
        ngrams = extract_ngrams(words, n=2)
        candidates = words + ngrams

        saved_candidates = []
        for phrase in candidates:
            phrase = phrase.strip()
            if len(phrase.replace(" ", "")) <= 1:
                continue
            existing = db.query(Habit).filter_by(user_id=user_id, word=phrase).first()
            if existing:
                existing.count += 1
            else:
                db.add(Habit(user_id=user_id, word=phrase, count=1))
            saved_candidates.append(phrase)

        db.commit()

        return {
            "transcribed_text": transcribed_text,
            "detected_keywords": keyword_hits,
            "detected_badwords": badword_hits,
            "habit_candidates": saved_candidates
        }, 200

    finally:
        db.close()
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
        if os.path.exists(wav_path):
            os.remove(wav_path)
