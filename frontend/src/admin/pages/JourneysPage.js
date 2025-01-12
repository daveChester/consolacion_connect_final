import React, { useState, useCallback } from "react";
import { Plus, Eye } from "lucide-react";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

const JourneysPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/journeys`);
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    const dataToSend = { ...formData };

    Object.keys(dataToSend).forEach((key) => {
      form.append(key, dataToSend[key]);
    });

    if (file) {
      form.append("image", file);
    }

    try {
      await axios.post(`${BASE_URL}/api/journeys`, form);
      setShowForm(false);
      setFormData({});
      setFile(null);
      fetchItems();
    } catch (error) {
      console.error("Error saving journey:", error);
    }
  };

  const JourneyModal = ({ journey, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Alumni Journey Details</h3>
        <div className="space-y-4">
          {journey.image && (
            <div className="mb-4">
              <img
                src={`${BASE_URL}${journey.image}`}
                alt={`${journey.first_name} ${journey.last_name}`}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
          <div>
            <p className="font-semibold">Name:</p>
            <p>{`${journey.first_name} ${journey.last_name}`}</p>
          </div>
          <div>
            <p className="font-semibold">Graduation Year:</p>
            <p>{journey.graduationYear}</p>
          </div>
          <div>
            <p className="font-semibold">Current Job:</p>
            <p>{journey.current_job}</p>
          </div>
          <div>
            <p className="font-semibold">Company:</p>
            <p>{journey.company}</p>
          </div>
          <div>
            <p className="font-semibold">Industry:</p>
            <p>{journey.industry}</p>
          </div>
          <div>
            <p className="font-semibold">Journey Story:</p>
            <p className="whitespace-pre-wrap">{journey.story}</p>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Alumni Journeys</h2>
        <button
          onClick={() => {
            setFormData({});
            setFile(null);
            setShowForm(true);
          }}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800"
        >
          <Plus className="w-4 h-4" />
          Add Journey
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
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Current Job</th>
                <th className="px-6 py-3 text-left">Company</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-6 py-4">{`${item.first_name} ${item.last_name}`}</td>
                  <td className="px-6 py-4">{item.current_job}</td>
                  <td className="px-6 py-4">{item.company}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedJourney(item);
                          setShowModal(true);
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
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
            <h3 className="text-xl font-semibold mb-4">Add New Journey</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="space-y-2">
                <label className="block text-sm text-gray-600">
                  Profile Photo
                </label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full p-2 border rounded"
                  accept="image/*"
                />
              </div>
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

      {showModal && selectedJourney && (
        <JourneyModal
          journey={selectedJourney}
          onClose={() => {
            setShowModal(false);
            setSelectedJourney(null);
          }}
        />
      )}
    </div>
  );
};

export default JourneysPage;
