# 언어 습관 개선을 위한 실시간 음성 감지 시스템

이 프로젝트는 Faster-Whisper 기반 음성 인식 및 KoBERT 기반 욕설 필터링 모델을 활용하여,  
실시간으로 사용자의 비속어, 은어, 말버릇 등을 감지하고 시각화된 피드백을 제공하는 시스템입니다.

  // Kobert는 본 프로젝트에서 삽입되지 않음
  
---

## 기술 스택

- **Frontend**: React  
- **Backend**: FastAPI + WebSocket  
- **AI Model**: Faster-Whisper (STT), KoBERT (욕설/비속어 분류)
- **Database**: MySQL  
- **기타**: N-gram 기반 말버릇 분석, 환경변수 설정 `.env`, 가상환경 `environment.yml`

---

## ⚙️ 가상환경 세팅

> 프로젝트 실행 전, 아래 명령어로 Conda 가상환경을 구성하세요.

```bash
conda env create -f environment.yml
conda activate capstone
