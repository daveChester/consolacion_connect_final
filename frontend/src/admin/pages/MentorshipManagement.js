import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Trash2, Edit2 } from "lucide-react";
import { useAuth } from "../../AuthContext";

const BASE_URL = "http://localhost:5000";

const MentorshipManagement = () => {
  const { getAuthHeaders, logout } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    professional_title: "",
    bio: "",
    profile_image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fetchMentors = useCallback(async () => {
    try {
      const response = await axios.get("/api/mentors", {
        headers: getAuthHeaders(),
      });
      setMentors(response.data);
    } catch (error) {
      console.error("Error fetching mentors:", error);
      if (error.response && error.response.status === 401) {
        logout();
      }
    }
  }, [getAuthHeaders, logout]);

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("professional_title", formData.professional_title);
      formDataToSend.append("bio", formData.bio);
      if (formData.profile_image) {
        formDataToSend.append("profile_image", formData.profile_image);
      }

      if (editingId) {
        // Update existing mentor
        await axios.put(`/api/mentors/${editingId}`, formDataToSend, {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Create new mentor
        await axios.post("/api/mentors", formDataToSend, {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // Reset form and fetch updated list
      setFormData({
        name: "",
        professional_title: "",
        bio: "",
        profile_image: null,
      });
      setEditingId(null);
      fetchMentors();
    } catch (error) {
      console.error("Error submitting mentor:", error);
      if (error.response && error.response.status === 401) {
        logout();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this mentor?")) return;
    setDeleteId(id);
    try {
      await axios.delete(`/api/mentors/${id}`, { headers: getAuthHeaders() });
      setMentors((prevMentors) => prevMentors.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting mentor:", error);
      if (error.response && error.response.status === 401) {
        logout();
      }
    } finally {
      setDeleteId(null);
    }
  };

  const handleEdit = (mentor) => {
    setEditingId(mentor.id);
    setFormData({
      name: mentor.name,
      professional_title: mentor.professional_title,
      bio: mentor.bio,
      profile_image: null,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Mentorship Management</h2>

      <form onSubmit={handleSubmit} className="mb-8">
        <label htmlFor="name" className="block mb-2 font-medium">
          Name:
        </label>
        <input
          type="text"
          id="name"
          placeholder="Mentor Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          required
          aria-required="true"
        />

        <label htmlFor="professional_title" className="block mb-2 font-medium">
          Professional Title:
        </label>
        <input
          type="text"
          id="professional_title"
          placeholder="Professional Title"
          value={formData.professional_title}
          onChange={(e) =>
            setFormData({ ...formData, professional_title: e.target.value })
          }
          className="w-full mb-4 p-2 border rounded"
          required
          aria-required="true"
        />

        <label htmlFor="bio" className="block mb-2 font-medium">
          Bio:
        </label>
        <textarea
          id="bio"
          placeholder="Mentor Bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="w-full mb-4 p-2 border rounded h-32"
          required
          aria-required="true"
        />

        <label htmlFor="profile_image" className="block mb-2 font-medium">
          Profile Image:
        </label>
        <input
          type="file"
          id="profile_image"
          onChange={(e) =>
            setFormData({ ...formData, profile_image: e.target.files[0] })
          }
          className="w-full mb-4"
          accept="image/*"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? editingId
              ? "Updating..."
              : "Adding..."
            : editingId
            ? "Update Mentor"
            : "Add Mentor"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setFormData({
                name: "",
                professional_title: "",
                bio: "",
                profile_image: null,
              });
            }}
            className="w-full mt-2 bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition-colors"
          >
            Cancel Edit
          </button>
        )}
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mentors.map((mentor) => (
          <div key={mentor.id} className="border rounded p-4 shadow-md">
            {mentor.profile_image && (
              <img
                src={`${BASE_URL}${mentor.profile_image}`}
                alt={mentor.name ? `Image of ${mentor.name}` : ""}
                className="w-full h-48 object-cover mb-4 rounded"
                loading="lazy"
              />
            )}
            <h2 className="font-bold text-xl mb-2">{mentor.name}</h2>
            <p className="mb-2 text-gray-600">{mentor.professional_title}</p>
            <p className="mb-4 text-gray-700">{mentor.bio}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(mentor)}
                className="flex items-center gap-2 bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-colors flex-1"
                aria-label={`Edit mentor: ${mentor.name}`}
              >
                <Edit2 size={18} aria-hidden="true" /> Edit
              </button>
              <button
                onClick={() => handleDelete(mentor.id)}
                className="flex items-center gap-2 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors flex-1"
                aria-label={`Delete mentor: ${mentor.name}`}
                aria-disabled={deleteId === mentor.id}
                disabled={deleteId === mentor.id}
              >
                {deleteId === mentor.id ? (
                  "Deleting..."
                ) : (
                  <>
                    <Trash2 size={18} aria-hidden="true" /> Delete
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorshipManagement;
