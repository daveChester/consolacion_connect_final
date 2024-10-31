import React, { useState, useEffect } from "react";
import axios from "axios";

const NewsManagement = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    image: "",
  });

  useEffect(() => {
    const fetchNews = async () => {
      const response = await axios.get("/api/news");
      setNewsItems(response.data);
    };
    fetchNews();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/news", formData);
    setFormData({ title: "", excerpt: "", image: "" });
    // Re-fetch news items after adding
    const response = await axios.get("/api/news");
    setNewsItems(response.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/news/${id}`);
    setNewsItems(newsItems.filter((item) => item.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage News</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="input w-full mb-2"
          required
        />
        <input
          type="text"
          name="excerpt"
          placeholder="Excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          className="input w-full mb-2"
          required
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="input w-full mb-4"
          required
        />
        <button type="submit" className="btn">
          Add News
        </button>
      </form>
      <ul className="list-decimal">
        {newsItems.map((item) => (
          <li key={item.id} className="flex justify-between items-center mb-2">
            <span>{item.title}</span>
            <button
              onClick={() => handleDelete(item.id)}
              className="btn btn-error"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsManagement;
