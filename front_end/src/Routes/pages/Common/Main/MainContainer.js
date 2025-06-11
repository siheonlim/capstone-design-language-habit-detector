import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainPresenter from "./MainPresenter";

const MainContainer = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [text, setText] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [badwords, setBadwords] = useState([]);
  const [isAutoRecording, setIsAutoRecording] = useState(false);
  const [habitCandidates, setHabitCandidates] = useState([]);

  const mediaRecorder = useRef(null);
  const recordedChunksRef = useRef([]);
  const recordingTimeoutRef = useRef(null);
  const streamRef = useRef(null);
  const isAutoRecordingRef = useRef(false);

  const isSilent = async (blob) => {
    return new Promise((resolve) => {
      const audioContext = new AudioContext();
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          await audioContext.resume();
          const buffer = await audioContext.decodeAudioData(reader.result);
          const input = buffer.getChannelData(0);
          const avgVolume = input.reduce((sum, val) => sum + Math.abs(val), 0) / input.length;
          console.log("🎧 평균 볼륨:", avgVolume);
          resolve(avgVolume < 0.006);
        } catch (error) {
          console.error("❌ 오디오 디코딩 실패:", error);
          resolve(false);
        }
      };
      reader.readAsArrayBuffer(blob);
    });
  };

  const analyzeInBackground = async (blob) => {
    const formData = new FormData();
    formData.append("file", blob, "audio.webm");
    try {
      const res = await fetch("http://localhost:8000/analyze-audio", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("서버 오류:", data.error);
        return;
      }
      setText(data.transcribed_text || "");
      console.log("Test, --- 인식된 텍스트:", data.transcribed_text || "(없음)");
      setKeywords(data.detected_keywords || []);
      setBadwords(data.detected_badwords || []);
      fetchHabitCandidates();
    } catch (err) {
      console.error("분석 실패:", err);
    }
  };

  const fetchHabitCandidates = async () => {
    try {
      const res = await fetch("http://localhost:8000/habit/candidates");
      const data = await res.json();
      setHabitCandidates(data.habit_candidates);
      console.log(data.habit_candidates)
    } catch (err) {
      console.error("말버릇 후보 가져오기 실패:", err);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = "audio/webm;codecs=opus";

      if (!MediaRecorder.isTypeSupported(mimeType)) {
        alert("WebM 코덱을 지원하지 않는 브라우저입니다.");
        isAutoRecordingRef.current = false;
        setIsAutoRecording(false);
        return;
      }

      recordedChunksRef.current = [];
      mediaRecorder.current = new MediaRecorder(stream, { mimeType });

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        console.log("녹음 종료")
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        console.log("Blob 생성 완료:", blob.size, "bytes");
        recordedChunksRef.current = [];
        if (blob.size >= 5000) {
          const silent = await isSilent(blob);
          console.log("무음 처리 여부: ", silent)
          if (!silent) await analyzeInBackground(blob);
        }
        if (isAutoRecordingRef.current) {
          console.log("---자동 녹음 재시작---");
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
          setTimeout(() => {
            startRecording();
          }, 100);
        }
      };

      mediaRecorder.current.start();
      console.log("---녹음 시작 ---")
      setIsRecording(true);
      recordingTimeoutRef.current = setTimeout(() => {
        if (mediaRecorder.current?.state === "recording") {
          mediaRecorder.current.stop();
          setIsRecording(false);
        }
      }, 6000);
    } catch (err) {
      isAutoRecordingRef.current = false;
      setIsAutoRecording(false);
      alert("마이크 접근 권한이 필요합니다.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current?.state === "recording") {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    isAutoRecordingRef.current = false;
    setIsAutoRecording(false);
  };

  const toggleAutoRecording = () => {
    if (isAutoRecording) {
      stopRecording();
    } else {
      isAutoRecordingRef.current = true;
      setIsAutoRecording(true);
      startRecording();
    }
  };

  useEffect(() => {
    fetchHabitCandidates();
    return () => {
      if (recordingTimeoutRef.current) clearTimeout(recordingTimeoutRef.current);
      if (mediaRecorder.current?.state === "recording") mediaRecorder.current.stop();
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <MainPresenter
      isRecording={isRecording}
      startRecording={toggleAutoRecording}
      stopRecording={stopRecording}
      text={text}
      keywords={keywords}
      badwords={badwords}
      navigate={navigate}
      isAutoRecording={isAutoRecording}
      habitCandidates={habitCandidates}
    />
  );
};

export default MainContainer;
