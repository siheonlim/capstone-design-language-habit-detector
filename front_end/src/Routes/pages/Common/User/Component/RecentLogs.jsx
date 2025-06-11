import "./RecentLogs.css";

const RecentLogs = ({ recentLogs }) => {
    return (
        <section className="recent-logs-section">
            {/* <h3>🕓 최근 감지 기록 (최신순)</h3> */}
            {recentLogs.length === 0 ? (
                <p className="no-logs">최근 감지된 기록이 없습니다.</p>
            ) : (
                <ul className="logs-list">
                    {recentLogs.slice(0, 10).map((log) => (
                        <li key={log.id}>
                            [{new Date(log.timestamp).toLocaleString()}] {log.word}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default RecentLogs;
