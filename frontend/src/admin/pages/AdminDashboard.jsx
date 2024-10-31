import React, { useState } from "react";
import AdminHeader from "../components/AdminHeader";
import NewsManagement from "./NewsManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("news"); // Default to news tab

  const tabItems = [
    {
      id: "alumni",
      label: "Alumni Management",
      content: "Alumni Management Content",
    },
    {
      id: "honorem",
      label: "Honorem Management",
      content: "Honorem Management Content",
    },
    {
      id: "jobs",
      label: "Jobs Management",
      content: "Jobs Management Content",
    },
    {
      id: "journey",
      label: "Journey Management",
      content: "Journey Management Content",
    },
    {
      id: "mentorship",
      label: "Mentorship Management",
      content: "Mentorship Management Content",
    },
    { id: "news", label: "News Management", content: <NewsManagement /> },
  ];

  const statsCards = [
    {
      title: "Total Alumni",
      value: "0",
      description: "Registered alumni in the system",
    },
    {
      title: "Active Jobs",
      value: "0",
      description: "Currently posted job opportunities",
    },
    {
      title: "Mentorship Programs",
      value: "0",
      description: "Ongoing mentorship programs",
    },
    {
      title: "Latest News",
      value: "0",
      description: "Published news articles",
    },
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <AdminHeader />
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsCards.map((stat, index) => (
            <div key={index} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="text-base-content/60 font-semibold">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold my-2">{stat.value}</p>
                <p className="text-sm text-base-content/70">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="tabs tabs-bordered">
              {tabItems.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab ${activeTab === tab.id ? "tab-active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`panel-${tab.id}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div id={`panel-${activeTab}`} role="tabpanel" className="mt-4">
              {tabItems.find((tab) => tab.id === activeTab)?.content}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
