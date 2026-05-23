import { useEffect, useState } from "react";

export default function Admin() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState("Breaking News");
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    setNewsList(JSON.parse(localStorage.getItem("news") || "[]"));
  }, []);

  const save = () => {
    if (!title.trim() || !body.trim()) {
      alert("Title aur description fill karo");
      return;
    }

    const item = {
      id: Date.now(),
      title,
      body,
      tag,
      author: "Yashwant Yadav",
      date: new Date().toLocaleString(),
    };

    const updated = [item, ...newsList];
    localStorage.setItem("news", JSON.stringify(updated));
    setNewsList(updated);
    setTitle("");
    setBody("");
    setTag("Breaking News");
    alert("News published successfully!");
  };

  const deleteNews = (id) => {
    const updated = newsList.filter((n) => n.id !== id);
    localStorage.setItem("news", JSON.stringify(updated));
    setNewsList(updated);
  };

  return (
    <div className="admin-page">
      <section className="admin-hero">
        <div>
          <span className="tag">Admin Control Center</span>
          <h1>Cricket News Dashboard</h1>
          <p>
            Manage breaking news, match updates, IPL stories and player reports
            with a clean Cricbuzz-style admin panel.
          </p>
        </div>

        <div className="admin-stats">
          <div>
            <h3>{newsList.length}</h3>
            <span>Total News</span>
          </div>
          <div>
            <h3>Live</h3>
            <span>Local Storage</span>
          </div>
        </div>
      </section>

      <div className="admin-layout">
        <div className="admin card">
          <h2>Publish News</h2>
          <p className="sub">Create and save cricket updates locally.</p>

          <label>News Title</label>
          <input
            placeholder="Example: India announces squad for T20 series"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Category</label>
          <select value={tag} onChange={(e) => setTag(e.target.value)}>
            <option>Breaking News</option>
            <option>Match Update</option>
            <option>IPL News</option>
            <option>Team News</option>
            <option>Player News</option>
            <option>Admin Update</option>
          </select>

          <label>Description</label>
          <textarea
            placeholder="Write complete news description..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          <button className="btn publish-btn" onClick={save}>
            🚀 Publish News
          </button>
        </div>

        <div className="card admin-preview">
          <div className="preview-head">
            <div>
              <h2>Published Updates</h2>
              <p className="sub">Latest admin news will appear here.</p>
            </div>
            <span className="pill">{newsList.length} Posts</span>
          </div>

          {newsList.length === 0 ? (
            <div className="empty-news">
              <h3>📰 No News Yet</h3>
              <p>Publish your first cricket update from the left panel.</p>
            </div>
          ) : (
            <div className="news-admin-list">
              {newsList.map((item) => (
                <article className="news-admin-item" key={item.id}>
                  <div className="news-main">
                    <div className="news-row">
                      <span className="pill">{item.tag}</span>
                      <small>{item.date}</small>
                    </div>

                    <h3>{item.title}</h3>
                    <p>{item.body}</p>

                    <div className="author">
                      <span>👤 Published by</span>
                      <strong>{item.author}</strong>
                    </div>
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => deleteNews(item.id)}
                  >
                    Delete
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}