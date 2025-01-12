import React, { useState, useCallback, useEffect } from "react";
import { Plus, Trash2, Edit, Eye, Check } from "lucide-react";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

const UserModal = ({ user, onClose, onVerify, isPending }) => {
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("/uploads")) {
      return `${BASE_URL}${imagePath}`;
    }
    return `${BASE_URL}/uploads/${imagePath}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">User Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            {user.profile_picture && (
              <div className="mb-6 flex itmes-left">
                <img
                  src={`http://localhost:5000/uploads/${user.profile_picture}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-2 border-darker-blue"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                    const fallbackDiv = e.target.parentElement;
                    if (fallbackDiv) {
                      fallbackDiv.innerHTML = `<div class="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-600">
                    <span class="text-4xl text-blue-600 font-semibold">${user.first_name[0]}${user.last_name[0]}</span>
                  </div>`;
                    }
                  }}
                />
              </div>
            )}
            <p className="font-semibold">Name:</p>
            <p>{`${user.first_name} ${user.last_name}`}</p>
          </div>
          <div>
            <p className="font-semibold">Student ID:</p>
            <p>{user.student_id}</p>
          </div>
          <div>
            <p className="font-semibold">Email:</p>
            <p>{user.email}</p>
          </div>
          <div>
            <p className="font-semibold">Course:</p>
            <p>{user.course}</p>
          </div>
          <div>
            <p className="font-semibold">Batch Year:</p>
            <p>{user.batch_year}</p>
          </div>
          <div>
            <p className="font-semibold">Year Level:</p>
            <p>{user.year_level}</p>
          </div>
          <div>
            <p className="font-semibold">Gender:</p>
            <p>{user.gender}</p>
          </div>
          <div>
            <p className="font-semibold">Contact Number:</p>
            <p>{user.contact_number}</p>
          </div>
          <div>
            <p className="font-semibold">Current Company:</p>
            <p>{user.current_company}</p>
          </div>
          <div>
            <p className="font-semibold">Job Title:</p>
            <p>{user.job_title}</p>
          </div>
          <div>
            <p className="font-semibold">Messenger Link:</p>
            <p>{user.messenger_link}</p>
          </div>
          <div>
            <p className="font-semibold">Created At:</p>
            <p>{new Date(user.created_at).toLocaleString()}</p>
          </div>
          <div className="col-span-2">
            <p className="font-semibold">Address:</p>
            <p>{user.address}</p>
          </div>
          <div className="col-span-2">
            <p className="font-semibold">About Me:</p>
            <p>{user.about_me}</p>
          </div>
          <div className="col-span-2 mt-4">
            <p className="font-semibold mb-2">ID Pictures:</p>
            <div className="grid grid-cols-2 gap-4">
              {user.front_id_picture && (
                <div>
                  <p className="text-sm mb-1">Front ID:</p>
                  <img
                    src={getImageUrl(user.front_id_picture)}
                    alt="Front ID"
                    className="w-full h-48 object-cover rounded"
                    onError={(e) => {
                      console.error("Image load error:", e);
                      e.target.src = "placeholder-image-url";
                    }}
                  />
                </div>
              )}
              {user.back_id_picture && (
                <div>
                  <p className="text-sm mb-1">Back ID:</p>
                  <img
                    src={getImageUrl(user.back_id_picture)}
                    alt="Back ID"
                    className="w-full h-48 object-cover rounded"
                    onError={(e) => {
                      console.error("Image load error:", e);
                      e.target.src = "placeholder-image-url";
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Close
          </button>
          {isPending && user.verification_status === "unverified" && (
            <button
              onClick={() => onVerify(user.user_id)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Verify User
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const UserForm = ({ formData, setFormData, onSubmit, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
      <h3 className="text-xl font-semibold mb-4">
        {formData.user_id ? "Edit" : "Add New"} User
      </h3>
      <form onSubmit={onSubmit} className="space-y-4">
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
        <input
          type="email"
          placeholder="Email"
          value={formData.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Student ID"
          value={formData.student_id || ""}
          onChange={(e) =>
            setFormData({ ...formData, student_id: e.target.value })
          }
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Course"
          value={formData.course || ""}
          onChange={(e) => setFormData({ ...formData, course: e.target.value })}
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
        <input
          type="number"
          placeholder="Year Level"
          value={formData.year_level || ""}
          onChange={(e) =>
            setFormData({ ...formData, year_level: e.target.value })
          }
          className="w-full p-2 border rounded"
          required
        />
        <select
          value={formData.gender || ""}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="text"
          placeholder="Current Company"
          value={formData.current_company || ""}
          onChange={(e) =>
            setFormData({ ...formData, current_company: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Job Title"
          value={formData.job_title || ""}
          onChange={(e) =>
            setFormData({ ...formData, job_title: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Contact Number"
          value={formData.contact_number || ""}
          onChange={(e) =>
            setFormData({ ...formData, contact_number: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Messenger Link"
          value={formData.messenger_link || ""}
          onChange={(e) =>
            setFormData({ ...formData, messenger_link: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Address"
          value={formData.address || ""}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          className="w-full p-2 border rounded"
          rows="3"
        />
        <textarea
          placeholder="About Me"
          value={formData.about_me || ""}
          onChange={(e) =>
            setFormData({ ...formData, about_me: e.target.value })
          }
          className="w-full p-2 border rounded"
          rows="3"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
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
);

const UsersTable = ({ users, onView, onEdit, onDelete, isViewingPending }) => (
  <table className="min-w-full">
    <thead>
      <tr className="bg-gray-100">
        <th className="px-6 py-3 text-left">Name</th>
        <th className="px-6 py-3 text-left">Email</th>
        <th className="px-6 py-3 text-left">Student ID</th>
        <th className="px-6 py-3 text-left">Course</th>
        <th className="px-6 py-3 text-left">Batch Year</th>
        <th className="px-6 py-3 text-left">Status</th>
        <th className="px-6 py-3 text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user) => (
        <tr key={user.user_id} className="border-t">
          <td className="px-6 py-4">{`${user.first_name} ${user.last_name}`}</td>
          <td className="px-6 py-4">{user.email}</td>
          <td className="px-6 py-4">{user.student_id}</td>
          <td className="px-6 py-4">{user.course}</td>
          <td className="px-6 py-4">{user.batch_year}</td>
          <td className="px-6 py-4">{user.verification_status}</td>
          <td className="px-6 py-4">
            <div className="flex justify-center gap-2">
              <button
                onClick={() => onView(user)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Eye className="w-4 h-4" />
              </button>
              {!isViewingPending && (
                <>
                  <button
                    onClick={() => onEdit(user)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(user.user_id)}
                    className="p-1 hover:bg-gray-100 rounded text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [isViewingPending, setIsViewingPending] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/alumni_directory`);
      const allUsers = response.data;
      setPendingUsers(
        allUsers.filter(
          (user) =>
            user.verification_status === "unverified" ||
            user.verification_status === "pending"
        )
      );
      setUsers(
        allUsers.filter((user) => user.verification_status === "verified")
      );
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.user_id) {
        // Handling edit
        await axios.put(
          `${BASE_URL}/api/alumni_directory/${formData.user_id}`,
          formData
        );
        // Update the user in the local state
        setUsers(
          users.map((user) =>
            user.user_id === formData.user_id ? { ...formData } : user
          )
        );
      } else {
        // For new user, generate a temporary ID
        const newUser = {
          ...formData,
          user_id: Date.now(), // Temporary ID
          verification_status: "verified",
          created_at: new Date().toISOString(),
        };

        // Add to local state first
        setUsers((prevUsers) => [...prevUsers, newUser]);
      }
      setShowForm(false);
      setFormData({});
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${BASE_URL}/api/alumni_directory/${id}`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleVerify = async (userId) => {
    try {
      await axios.put(`${BASE_URL}/api/alumni_directory/${userId}/verify`);
      await fetchUsers();
      setShowUserModal(false);
      alert("User verified successfully");
    } catch (error) {
      console.error("Error verifying user:", error);
      alert("Failed to verify user. Please try again.");
    }
  };

  const displayedUsers = isViewingPending ? pendingUsers : users;

  return (
    <div className="p-8 font-inter">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setIsViewingPending(!isViewingPending)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            {isViewingPending
              ? "View Verified Users"
              : `View Pending Users (${pendingUsers.length})`}
          </button>
          {!isViewingPending && (
            <button
              onClick={() => {
                setFormData({});
                setShowForm(true);
              }}
              className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800"
            >
              <Plus className="w-4 h-4" />
              Add User
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <UsersTable
            users={displayedUsers}
            onView={(user) => {
              setSelectedUser(user);
              setShowUserModal(true);
            }}
            onEdit={(user) => {
              setFormData(user);
              setShowForm(true);
            }}
            onDelete={handleDelete}
            isViewingPending={isViewingPending}
          />
        </div>
      )}

      {showForm && (
        <UserForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
        />
      )}

      {showUserModal && selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
          onVerify={handleVerify}
          isPending={isViewingPending}
        />
      )}
    </div>
  );
};

export default UsersPage;
