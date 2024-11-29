import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  Briefcase,
  NewspaperIcon,
  BookOpen,
  Heart,
  Megaphone,
  UserCog,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import MentorshipManagement from "./MentorshipManagement";

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
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg p-6 bg-white shadow-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="News Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-2 bg-white border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-black placeholder:text-black/60 text-sm"
            required
          />
          <textarea
            name="excerpt"
            placeholder="News Excerpt"
            value={formData.excerpt}
            onChange={(e) =>
              setFormData({ ...formData, excerpt: e.target.value })
            }
            className="w-full px-4 py-2 h-24 bg-white border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-black placeholder:text-black/60 text-sm"
            required
          />
          <input
            type="file"
            name="image"
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.files[0] })
            }
            className="w-full px-4 py-2 bg-white border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-black text-sm"
            accept="image/*"
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black/5 transition duration-200"
          >
            Add News
          </button>
        </form>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.02 }}
            className="rounded-lg overflow-hidden bg-white shadow-lg"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-black text-xl font-bold">{item.title}</h3>
                <Megaphone className="h-6 w-6 text-black/70" />
              </div>
              <p className="text-black/70 mb-4">{item.excerpt}</p>
              {item.image && (
                <img
                  src={`http://localhost:5000${item.image}`}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <button
                onClick={() => handleDelete(item.id)}
                className="flex items-center space-x-2 bg-black text-white py-2 px-4 rounded-lg hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black/5 transition duration-200"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("news");
  const tabs = [
    { name: "news", icon: Megaphone },
    { name: "alumni", icon: UserCog },
    { name: "honorem", icon: Heart },
    { name: "jobs", icon: Briefcase },
    { name: "journey", icon: BookOpen },
    { name: "mentorship", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-white text-black pt-12 pb-6">
      <div className="flex items-center p-4 border-b border-black/10">
        <div className="flex items-center">
          <img
            src={`${process.env.PUBLIC_URL}/images/HomepageLogo.svg`}
            alt="LCCB Logo"
            className="h-8 w-auto"
          />
        </div>
      </div>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-black text-xl font-bold mb-2">Admin Dashboard</h2>
          <p className="text-black/70">
            Manage and maintain the Consolacion Connect platform
          </p>
        </div>

        <div className="rounded-lg overflow-hidden bg-white shadow-lg">
          <div className="border-b border-black/10">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  className={`flex items-center space-x-2 px-6 py-3 font-medium transition duration-200 border-b-2 whitespace-nowrap
                      ${
                        activeTab === tab.name
                          ? "border-black text-black"
                          : "border-transparent text-black/60 hover:text-black"
                      }`}
                  onClick={() => setActiveTab(tab.name)}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>
                    {tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}{" "}
                    Management
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === "news" ? (
              <NewsManagement />
            ) : activeTab === "mentorship" ? (
              <MentorshipManagement />
            ) : (
              <div className="text-center py-8 text-black/70">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                Management coming soon
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
