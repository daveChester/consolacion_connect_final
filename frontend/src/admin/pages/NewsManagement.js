import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useAuth } from "../../AuthContext";

const BASE_URL = "http://localhost:5000";

const NewsManagement = () => {
  const { getAuthHeaders, logout } = useAuth();
  const [news, setNews] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null); // State for tracking which item is being deleted

  const fetchNews = useCallback(async () => {
    try {
      const response = await axios.get("/api/news", {
        headers: getAuthHeaders(),
      });
      setNews(response.data);
    } catch (error) {
      console.error("Error fetching news:", error);
      if (error.response && error.response.status === 401) {
        logout();
      }
    }
  }, [getAuthHeaders, logout]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Set loading state
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("excerpt", formData.excerpt);
      if (formData.image) formDataToSend.append("image", formData.image);

      await axios.post("/api/news", formDataToSend, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData({ title: "", excerpt: "", image: null });
      fetchNews();
    } catch (error) {
      console.error("Error submitting news:", error);
      if (error.response && error.response.status === 401) {
        logout();
      }
    } finally {
      setIsSubmitting(false); // Clear loading state
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news item?"))
      return;
    setDeleteId(id); // Set deleting ID
    try {
      await axios.delete(`/api/news/${id}`, { headers: getAuthHeaders() });
      setNews((prevNews) => prevNews.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting news:", error);
      if (error.response && error.response.status === 401) {
        logout();
      }
    } finally {
      setDeleteId(null); // Clear deleting ID
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">News Management</h2>

      <form onSubmit={handleSubmit} className="mb-8">
        <label htmlFor="title" className="block mb-2 font-medium">
          Title:
        </label>
        <input
          type="text"
          id="title"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          required
          aria-required="true"
        />

        <label htmlFor="excerpt" className="block mb-2 font-medium">
          Excerpt:
        </label>
        <textarea
          id="excerpt"
          placeholder="Excerpt"
          value={formData.excerpt}
          onChange={(e) =>
            setFormData({ ...formData, excerpt: e.target.value })
          }
          className="w-full mb-4 p-2 border rounded h-32"
          required
          aria-required="true"
        />

        <label htmlFor="image" className="block mb-2 font-medium">
          Image:
        </label>
        <input
          type="file"
          id="image"
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.files[0] })
          }
          className="w-full mb-4"
          accept="image/*"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
          disabled={isSubmitting} // Disable button while submitting
        >
          {isSubmitting ? "Submitting..." : "Add News"}{" "}
          {/* Show loading message */}
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {news.map((item) => (
          <div key={item.id} className="border rounded p-4 shadow-md">
            {item.image && (
              <img
                src={`${BASE_URL}${item.image}`}
                alt={item.title ? `Image for ${item.title}` : ""}
                className="w-full h-48 object-cover mb-4 rounded"
                loading="lazy"
              />
            )}
            <h2 className="font-bold text-xl mb-2">{item.title}</h2>
            <p className="mb-4 text-gray-700">{item.excerpt}</p>
            <button
              onClick={() => handleDelete(item.id)}
              className="flex items-center gap-2 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
              aria-label={`Delete news item: ${item.title}`}
              aria-disabled={deleteId === item.id} // Disable button while deleting
              disabled={deleteId === item.id} // Also disable using the disabled attribute
            >
              {deleteId === item.id ? (
                "Deleting..."
              ) : (
                <>
                  <Trash2 size={18} aria-hidden="true" /> Delete
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsManagement;
