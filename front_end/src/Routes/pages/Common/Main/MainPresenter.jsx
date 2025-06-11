import "./Main.css";

const MainPresenter = ({
    navigate,
    isRecording,
    startRecording,
    stopRecording,
    text,
    keywords,
    badwords,
    isAutoRecording,
    habitCandidates = []
}) => {
    return (
        <div className="main-container">
            <div className="main-content">
                <header className="main-header">
                    <h1 className="main-title">언어 습관 개선 서비스</h1>
                    <p className="main-subtitle">
                        당신의 언어 습관을 분석하고 개선하는 AI 기반 서비스입니다.
                    </p>
                </header>

                <div className="feature-grid">
                    {/* 🎤 실시간 음성 감지 카드 */}
                    <div className="feature-card">
                        <div className="feature-icon">🎤</div>
                        <h2 className="feature-title">실시간 음성 감지</h2>
                        <button
                            className={`cta-button ${isAutoRecording ? "recording" : ""}`}
                            onClick={startRecording}
                            style={{
                                marginTop: "1rem",
                                backgroundColor: isAutoRecording ? "#ff6b6b" : "#4CAF50",
                                color: "white",
                                fontWeight: "bold",
                                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                                boxShadow: isAutoRecording
                                    ? "0 4px 15px rgba(255, 107, 107, 0.3)"
                                    : "0 4px 15px rgba(76, 175, 80, 0.3)",
                            }}
                        >
                            {isAutoRecording ? "🛑 자동 감지 중지" : "🎙️ 자동 감지 시작"}
                        </button>
                        {isAutoRecording && (
                            <p
                                style={{
                                    marginTop: "0.5rem",
                                    color: "#ff6b6b",
                                    fontSize: "0.9rem",
                                    fontWeight: "bold",
                                    textShadow: "0.5px 0.5px 1px rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                ⚡ 자동 감지 모드 실행 중
                            </p>
                        )}
                    </div>

                    {/* 📝 인식된 텍스트 카드 */}
                    {/* <div className="feature-card">
                        <div className="feature-icon">📝</div>
                        <h2 className="feature-title">인식된 텍스트 (시연영상용 UI)</h2>
                        <p className="feature-description">
                            {text || "아직 감지된 내용이 없습니다."}
                        </p>
                    </div> */}

                    {/* 🔍 감지 결과 카드 */}
                    <div className="feature-card">
                        <div className="feature-icon">🔍</div>
                        <h2 className="feature-title">감지 결과</h2>
                        <div className="feature-description">
                            <h4 style={{ color: "red", marginBottom: "0.5rem" }}>
                                감지된 비속어:
                            </h4>
                            <ul style={{ listStyle: "none", padding: 0 }}>
                                {badwords.map((word, idx) => (
                                    <li
                                        key={idx}
                                        style={{ color: "red", marginBottom: "0.3rem" }}
                                    >
                                        {word}
                                    </li>
                                ))}
                            </ul>
                            <h4
                                style={{
                                    color: "blue",
                                    marginTop: "1rem",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                감지된 키워드:
                            </h4>
                            <ul style={{ listStyle: "none", padding: 0 }}>
                                {keywords.map((word, idx) => (
                                    <li
                                        key={idx}
                                        style={{ color: "blue", marginBottom: "0.3rem" }}
                                    >
                                        {word}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 🧠 7일간의 나의 말버릇 카드 */}
                <div className="habit-card">
                    <div className="feature-icon">😬</div>
                    <h2 className="feature-title">7일간의 나의 말버릇</h2>
                    <p className="feature-description">
                        최근 7일간 가장 많이 사용한 단어를 바탕으로 당신의 말버릇을 분석합니다.
                    </p>
                    <p className="feature-note">
                        ※ 이 데이터는 실시간 업데이트되며 최근 7일간의 발화를 기반으로 합니다.
                    </p>
                    <ul className="habit-list">
                        {habitCandidates.length > 0 ? (
                            habitCandidates.map((item, idx) => (
                                <li key={idx}>
                                    {item.word} ({item.count}회)
                                </li>
                            ))
                        ) : (
                            <li style={{ color: "#aaa" }}>데이터 없음</li>
                        )}
                    </ul>
                </div>

                {/* 마이페이지 이동 섹션 */}
                <section className="cta-section">
                    <h2 className="cta-title">마이페이지에서 더 자세한 통계를 확인하세요</h2>
                    <button
                        className="cta-button"
                        onClick={() => navigate("/user")}
                        style={{
                            backgroundColor: "white",
                            color: "#3498db",
                            fontWeight: "bold",
                            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        마이페이지로 이동
                    </button>
                </section>
            </div>
        </div>
    );
};

export default MainPresenter;
