import "./KeywordManager.css";

const KeywordManager = ({
    keywords,
    newKeyword,
    setNewKeyword,
    handleAddKeyword,
    handleDeleteKeyword,
}) => {
    return (
        <section className="keyword-manager-section">
            <h3>➕ 키워드 등록</h3>
            <div className="keyword-input-container">
                <input
                    type="text"
                    className="keyword-input"
                    placeholder="은어/신조어/말버릇"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                />
                <button className="add-button" onClick={handleAddKeyword}>등록</button>
            </div>

            <h3>📋 등록된 키워드 목록</h3>
            {keywords.length === 0 ? (
                <p className="no-keywords">등록된 키워드가 없습니다.</p>
            ) : (
                <ul className="keyword-list">
                    {keywords.map((kw) => (
                        <li key={kw.id}>
                            {kw.word}
                            <button className="delete-button" onClick={() => handleDeleteKeyword(kw.id)}>삭제</button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default KeywordManager;
