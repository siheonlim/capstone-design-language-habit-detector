from fastapi import FastAPI
from routers import  test_db, keywords, logs, audio, habit
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React 개발 서버, *로 전역 설정 가능 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(websocket.router)
app.include_router(test_db.router)
app.include_router(keywords.router)
app.include_router(logs.router)
app.include_router(audio.router)
app.include_router(habit.router)

@app.get("/")
def health_check():
    return {"status": "running"}


