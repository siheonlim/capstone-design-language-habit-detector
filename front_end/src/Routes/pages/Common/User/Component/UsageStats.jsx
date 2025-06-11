import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid
} from "recharts";
import { useState } from "react";
import "./UsageStats.css";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f", "#a4de6c", "#d0ed57", "#8dd1e1", "#f66d44", "#6a4c93"];

const UsageStats = ({
    logs,
    totalCount,
    handleClearLogs,
    dailyStats,
    weeklyStats,
    monthlyStats,
}) => {
    const [range, setRange] = useState("day");

    const getSelectedStats = () => {
        switch (range) {
            case "day":
                return { label: "📅 일간", data: dailyStats, key: "date" };
            case "week":
                return { label: "📆 주간", data: weeklyStats, key: "week" };
            case "month":
                return { label: "🗓 월간", data: monthlyStats, key: "month" };
            default:
                return { label: "", data: [], key: "" };
        }
    };

    // 📌 Pie 데이터 최적화: 상위 10개 + 기타
    const getTopWordsForPie = (rawLogs) => {
        const sorted = [...rawLogs].sort((a, b) => b.count - a.count);
        const top10 = sorted.slice(0, 9);
        const otherTotal = sorted.slice(9).reduce((sum, log) => sum + log.count, 0);

        if (otherTotal > 0) {
            top10.push({ word: "기타", count: otherTotal });
        }

        return top10;
    };

    const topPieData = getTopWordsForPie(logs);
    const { label, data, key } = getSelectedStats();

    return (
        <section className="usage-stats-section">
            <div className="stats-header">
                <h3>📌 감지된 단어 사용 통계</h3>
            </div>

            {logs.length === 0 ? (
                <p className="no-data">감지된 데이터가 없습니다.</p>
            ) : (
                <div className="stats-content">
                    <div className="stats-grid">
                        <div className="stats-summary">
                            <div className="total-count">
                                <span>총 감지 횟수</span>
                                <strong>{totalCount}</strong>
                                <span>회</span>
                            </div>
                            <div className="word-list-container">
                                <h4>감지된 단어 목록</h4>
                                <ul className="word-list">
                                    {logs.map((log, idx) => (
                                        <li key={idx}>
                                            <span className="word">{log.word}</span>
                                            <span className="count">{log.count}회</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={topPieData}
                                        dataKey="count"
                                        nameKey="word"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label
                                    >
                                        {topPieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {data.length > 0 && (
                        <div className="trend-chart">
                            <h4>{label} 감지 변화 추이</h4>
                            <div className="range-selector">
                                <label htmlFor="range-select">📈 변화 추이: </label>
                                <select
                                    id="range-select"
                                    value={range}
                                    onChange={(e) => setRange(e.target.value)}
                                >
                                    <option value="day">일간</option>
                                    <option value="week">주간</option>
                                    <option value="month">월간</option>
                                </select>
                            </div>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey={key} />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    <button className="clear-button" onClick={handleClearLogs}>
                        로그 전체 삭제
                    </button>
                </div>
            )}
        </section>
    );
};

export default UsageStats;
