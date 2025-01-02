import React, { useState, useCallback, useMemo } from "react";
import { Plus, Trash2, Edit, Eye } from "lucide-react";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("news");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);

  const sections = useMemo(
    () => ({
      news: { title: "News Management", endpoint: "news" },
      events: { title: "Events Management", endpoint: "events" },
      alumni: { title: "Alumni Directory", endpoint: "alumni_directory" },
      journeys: { title: "Alumni Journeys", endpoint: "journeys" },
    }),
    []
  );

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/api/${sections[activeSection].endpoint}`
      );
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  }, [activeSection, sections]);

  React.useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    const dataToSend = { ...formData };
    if (activeSection === "news" && dataToSend.description) {
      dataToSend.excerpt = dataToSend.description;
      delete dataToSend.description;
    }

    Object.keys(dataToSend).forEach((key) => {
      form.append(key, dataToSend[key]);
    });

    if (file) {
      form.append("image", file);
    }

    try {
      if (formData.id) {
        await axios.put(
          `${BASE_URL}/api/${sections[activeSection].endpoint}/${formData.id}`,
          form
        );
      } else {
        await axios.post(
          `${BASE_URL}/api/${sections[activeSection].endpoint}`,
          form
        );
      }
      setShowForm(false);
      setFormData({});
      setFile(null);
      fetchItems();
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(
          `${BASE_URL}/api/${sections[activeSection].endpoint}/${id}`
        );
        fetchItems();
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const renderForm = () => {
    if (activeSection === "journeys") {
      return (
        <>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={formData.first_name || ""}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formData.last_name || ""}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <input
            type="number"
            placeholder="Graduation Year"
            value={formData.graduationYear || ""}
            onChange={(e) =>
              setFormData({ ...formData, graduationYear: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Current Job"
            value={formData.current_job || ""}
            onChange={(e) =>
              setFormData({ ...formData, current_job: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Company"
            value={formData.company || ""}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Industry"
            value={formData.industry || ""}
            onChange={(e) =>
              setFormData({ ...formData, industry: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Your Journey Story"
            value={formData.story || ""}
            onChange={(e) =>
              setFormData({ ...formData, story: e.target.value })
            }
            className="w-full p-2 border rounded"
            rows="5"
            required
          />
        </>
      );
    }

    if (activeSection === "alumni") {
      return (
        <>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.full_name || ""}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Degree"
            value={formData.degree || ""}
            onChange={(e) =>
              setFormData({ ...formData, degree: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Batch Year"
            value={formData.batch_year || ""}
            onChange={(e) =>
              setFormData({ ...formData, batch_year: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Achievements"
            value={formData.achievements || ""}
            onChange={(e) =>
              setFormData({ ...formData, achievements: e.target.value })
            }
            className="w-full p-2 border rounded"
            rows="3"
          />
        </>
      );
    }

    if (activeSection === "events") {
      return (
        <>
          <input
            type="text"
            placeholder="Title"
            value={formData.title || ""}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Excerpt"
            value={formData.excerpt || ""}
            onChange={(e) =>
              setFormData({ ...formData, excerpt: e.target.value })
            }
            className="w-full p-2 border rounded"
            rows="3"
          />
          <input
            type="date"
            value={formData.event_date || ""}
            onChange={(e) =>
              setFormData({ ...formData, event_date: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <select
            value={formData.status || "upcoming"}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="w-full p-2 border rounded"
          >
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </>
      );
    }

    return (
      <>
        <input
          type="text"
          placeholder="Title"
          value={formData.title || ""}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Excerpt"
          value={formData.excerpt || ""}
          onChange={(e) =>
            setFormData({ ...formData, excerpt: e.target.value })
          }
          className="w-full p-2 border rounded"
          rows="3"
        />
      </>
    );
  };

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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              {sections[activeSection].title}
            </h2>
            <button
              onClick={() => {
                setFormData({});
                setShowForm(true);
              }}
              className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800"
            >
              <Plus className="w-4 h-4" />
              Add New
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-3 text-left">
                      {activeSection === "journeys" ? "Name" : "Title/Name"}
                    </th>
                    <th className="px-6 py-3 text-left">
                      {activeSection === "journeys" ? "Current Job" : "Date"}
                    </th>
                    <th className="px-6 py-3 text-left">
                      {activeSection === "journeys" ? "Company" : "Status"}
                    </th>
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="px-6 py-4">
                        {activeSection === "journeys"
                          ? `${item.first_name} ${item.last_name}`
                          : item.title || item.full_name}
                      </td>
                      <td className="px-6 py-4">
                        {activeSection === "journeys"
                          ? item.current_job
                          : new Date(
                              item.event_date || item.created_at
                            ).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {activeSection === "journeys"
                          ? item.company
                          : item.status || "Active"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setFormData(item);
                              setShowForm(true);
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1 hover:bg-gray-100 rounded text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">
                  {formData.id ? "Edit" : "Add New"} Item
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {renderForm()}
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
