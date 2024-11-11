import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    image: null,
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/news", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNews(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("excerpt", formData.excerpt);
      if (formData.image) formDataToSend.append("image", formData.image);

      await axios.post("http://localhost:5000/api/news", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData({ title: "", excerpt: "", image: null });
      fetchNews();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this news item?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNews(news.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">News Management</h2>

      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <textarea
          placeholder="Excerpt"
          value={formData.excerpt}
          onChange={(e) =>
            setFormData({ ...formData, excerpt: e.target.value })
          }
          className="w-full mb-4 p-2 border rounded h-32"
          required
        />
        <input
          type="file"
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.files[0] })
          }
          className="w-full mb-4"
          accept="image/*"
        />
        <button className="w-full bg-blue-500 text-white p-2 rounded">
          Add News
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {news.map((item) => (
          <div key={item.id} className="border rounded p-4">
            {item.image && (
              <img
                src={`http://localhost:5000${item.image}`}
                alt={item.title}
                className="w-full h-48 object-cover mb-4"
              />
            )}
            <h3 className="font-bold mb-2">{item.title}</h3>
            <p className="mb-4">{item.excerpt}</p>
            <button
              onClick={() => handleDelete(item.id)}
              className="flex items-center gap-2 bg-red-500 text-white p-2 rounded"
            >
              <Trash2 size={18} /> Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsManagement;
