import "./User.css";
import UsageStats from "./Component/UsageStats";
import KeywordManager from "./Component/KeywordManager";
import RecentLogs from "./Component/RecentLogs";

const UserPresenter = ({
    logs,
    totalCount,
    handleClearLogs,
    dailyStats,
    weeklyStats,
    monthlyStats,
    keywords,
    newKeyword,
    setNewKeyword,
    handleAddKeyword,
    handleDeleteKeyword,
    recentLogs,
    navigate
}) => {
    return (
        <div className="user-container">
            <div className="user-content">
                <header className="user-header">

                    <h1 className="user-title">언어 습관 관리</h1>
                    <p className="user-subtitle">
                        당신의 언어 습관을 분석하고 개선하는 대시보드입니다.
                    </p>
                </header>
                <button className="cta-button"
                    onClick={() => navigate("/")}
                    style={{
                        backgroundColor: 'white',
                        color: '#3498db',
                        fontWeight: 'bold',
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)'
                    }}>뒤로가기</button>
                <div className="user-dashboard">
                    {/* 왼쪽 컬럼 */}
                    <div className="user-left-column">
                        <div className="user-stats-grid">
                            <div className="user-stats-card">
                                <h2 className="user-stats-title">총 감지 횟수</h2>
                                <div className="user-stats-value">{totalCount}</div>
                                <p className="user-stats-description">지금까지 감지된 언어 습관의 총 횟수입니다.</p>
                            </div>
                            <div className="user-stats-card">
                                <h2 className="user-stats-title">등록된 키워드</h2>
                                <div className="user-stats-value">{keywords.length}</div>
                                <p className="user-stats-description">현재 등록된 모니터링 키워드의 수입니다.</p>
                            </div>
                        </div>

                        <section className="user-section">
                            <h2 className="user-section-title">📈 사용 통계</h2>
                            <div className="user-section-content">
                                <UsageStats
                                    logs={logs}
                                    totalCount={totalCount}
                                    handleClearLogs={handleClearLogs}
                                    dailyStats={dailyStats}
                                    weeklyStats={weeklyStats}
                                    monthlyStats={monthlyStats}
                                />
                            </div>
                        </section>
                    </div>

                    {/* 오른쪽 컬럼 */}
                    <div className="user-right-column">
                        <section className="user-section">
                            <h2 className="user-section-title">📝 키워드 관리</h2>
                            <div className="user-section-content">
                                <KeywordManager
                                    keywords={keywords}
                                    newKeyword={newKeyword}
                                    setNewKeyword={setNewKeyword}
                                    handleAddKeyword={handleAddKeyword}
                                    handleDeleteKeyword={handleDeleteKeyword}
                                />
                            </div>
                        </section>

                        <section className="user-section">
                            <h2 className="user-section-title">🕒 최근 감지 기록</h2>
                            <div className="user-section-content scrollable">
                                <RecentLogs recentLogs={recentLogs} />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPresenter;
