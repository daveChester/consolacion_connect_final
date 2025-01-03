import React, { useState } from "react";
import NewsPage from "../pages/NewsPage";
import EventsPage from "../pages/EventsPage";
import JourneysPage from "../pages/JourneysPage";
import UsersPage from "../pages/UsersPage";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("users");

  const sections = {
    users: { title: "User Management", component: UsersPage },
    news: { title: "News Management", component: NewsPage },
    events: { title: "Events Management", component: EventsPage },
    journeys: { title: "Alumni Journeys", component: JourneysPage },
  };

  const ActiveComponent = sections[activeSection].component;

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-black text-white p-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-gray-100 min-h-screen p-4">
          {Object.entries(sections).map(([key, { title }]) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`w-full text-left p-2 mb-2 rounded ${
                activeSection === key
                  ? "bg-black text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {title}
            </button>
          ))}
        </aside>

        <main className="flex-1 p-8">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
