import React, { useEffect, useState } from "react";
import UserPresenter from "./UserPresenter";
import { useNavigate } from "react-router-dom";

const UserContainer = () => {
    const navigate = useNavigate();

    const [logs, setLogs] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [keywords, setKeywords] = useState([]);
    const [newKeyword, setNewKeyword] = useState("");
    const [recentLogs, setRecentLogs] = useState([]);
    const [dailyStats, setDailyStats] = useState([]);
    const [weeklyStats, setWeeklyStats] = useState([]);
    const [monthlyStats, setMonthlyStats] = useState([]);

    const fetchLogs = async () => {
        try {
            const res = await fetch("http://localhost:8000/logs/stat");
            const data = await res.json();
            setLogs(data.words || []);
            setTotalCount(data.total || 0);
        } catch (err) {
            console.error("로그 통계 조회 실패:", err);
        }
    };

    const fetchRecentLogs = async () => {
        try {
            const res = await fetch("http://localhost:8000/logs");
            const data = await res.json();
            setRecentLogs(data);
        } catch (err) {
            console.error("최근 로그 조회 실패:", err);
        }
    };

    const fetchKeywords = async () => {
        try {
            const res = await fetch("http://localhost:8000/keywords");
            const data = await res.json();
            setKeywords(data);
        } catch (err) {
            console.error("키워드 조회 실패:", err);
        }
    };

    const handleAddKeyword = async () => {
        if (!newKeyword.trim()) return;

        try {
            const res = await fetch(`http://localhost:8000/keywords?word=${encodeURIComponent(newKeyword)}`, {
                method: "POST",
            });
            const data = await res.json();
            alert(data.message);
            setNewKeyword("");
            fetchKeywords();
        } catch (err) {
            console.error("키워드 등록 실패:", err);
            alert("이미 등록된 키워드이거나 오류가 발생했습니다.");
        }
    };

    const handleDeleteKeyword = async (id) => {
        try {
            await fetch(`http://localhost:8000/keywords/${id}`, {
                method: "DELETE",
            });
            fetchKeywords();
        } catch (err) {
            console.error("키워드 삭제 실패:", err);
        }
    };

    const handleClearLogs = async () => {
        const ok = window.confirm("모든 감지 로그를 삭제하시겠습니까?");
        if (!ok) return;

        try {
            await fetch("http://localhost:8000/logs", { method: "DELETE" });
            fetchLogs();
            fetchRecentLogs();
            fetchDailyStats();
            fetchWeeklyStats();
            fetchMonthlyStats();
        } catch (err) {
            console.error("로그 초기화 실패:", err);
        }
    };

    const fetchDailyStats = async () => {
        try {
            const res = await fetch("http://localhost:8000/logs/stat/day");
            const data = await res.json();
            setDailyStats(data);
        } catch (err) {
            console.error("일간 통계 조회 실패:", err);
        }
    };

    const fetchWeeklyStats = async () => {
        try {
            const res = await fetch("http://localhost:8000/logs/stat/week");
            const data = await res.json();
            setWeeklyStats(data);
        } catch (err) {
            console.error("주간 통계 조회 실패:", err);
        }
    };

    const fetchMonthlyStats = async () => {
        try {
            const res = await fetch("http://localhost:8000/logs/stat/month");
            const data = await res.json();
            setMonthlyStats(data);
        } catch (err) {
            console.error("월간 통계 조회 실패:", err);
        }
    };

    useEffect(() => {
        fetchLogs();
        fetchKeywords();
        fetchRecentLogs();
        fetchDailyStats();
        fetchWeeklyStats();
        fetchMonthlyStats();
    }, []);

    return (
        <UserPresenter
            navigate={navigate}
            logs={logs}
            totalCount={totalCount}
            keywords={keywords}
            newKeyword={newKeyword}
            setNewKeyword={setNewKeyword}
            handleAddKeyword={handleAddKeyword}
            handleDeleteKeyword={handleDeleteKeyword}
            handleClearLogs={handleClearLogs}
            recentLogs={recentLogs}
            dailyStats={dailyStats}
            weeklyStats={weeklyStats}
            monthlyStats={monthlyStats}
        />
    );
};

export default UserContainer;
