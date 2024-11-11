import React, { useState, useEffect } from "react";
import axios from "axios";

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    image: null,
  });

  const api = axios.create({
    baseURL: "http://localhost:5000",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const response = await api.get("/api/news");
    setNews(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("excerpt", formData.excerpt);
    if (formData.image) formDataToSend.append("image", formData.image);

    await api.post("/api/news", formDataToSend, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setFormData({ title: "", excerpt: "", image: null });
    fetchNews();
  };

  const handleDelete = async (id) => {
    await api.delete(`/api/news/${id}`);
    setNews(news.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="News Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="input input-bordered w-full"
          required
        />
        <textarea
          name="excerpt"
          placeholder="News Excerpt"
          value={formData.excerpt}
          onChange={(e) =>
            setFormData({ ...formData, excerpt: e.target.value })
          }
          className="textarea textarea-bordered w-full h-24"
          required
        />
        <input
          type="file"
          name="image"
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.files[0] })
          }
          className="file-input file-input-bordered w-full"
          accept="image/*"
        />
        <button type="submit" className="btn btn-primary w-full">
          Add News
        </button>
      </form>

      <div className="space-y-4">
        {news.map((item) => (
          <div key={item.id} className="card bg-white shadow-xl">
            <div className="card-body">
              <h3 className="card-title">{item.title}</h3>
              <p>{item.excerpt}</p>
              {item.image && (
                <img
                  src={`http://localhost:5000${item.image}`}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <button
                onClick={() => handleDelete(item.id)}
                className="btn btn-error"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("news");

  const tabs = ["news", "alumni", "honorem", "jobs", "journey", "mentorship"];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="navbar bg-blue-900 text-white">
        <h1 className="text-xl px-4">Admin Dashboard</h1>
      </nav>

      <main className="p-6">
        <div className="card bg-white shadow-xl">
          <div className="card-body">
            <div className="tabs tabs-bordered">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`tab tab-bordered ${
                    activeTab === tab ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} Management
                </button>
              ))}
            </div>

            <div className="mt-4">
              {activeTab === "news" ? (
                <NewsManagement />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                  Management coming soon
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
