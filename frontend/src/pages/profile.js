import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import { ArrowRight, BadgeCheck, ShieldAlert } from "lucide-react";
import FormField from "../components/FormField";

const ProfilePage = () => {
  const { user, getAuthHeaders } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    student_id: "",
    first_name: "",
    last_name: "",
    batch_year: "",
    year_level: "",
    course: "",
    current_company: "",
    job_title: "",
    contact_number: "",
    address: "",
    messenger_link: "",
    gender: "",
    about_me: "",
    verification_status: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0] || null,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const formDataToSend = new FormData();

      // Add all non-file form data
      Object.entries(formData).forEach(([key, value]) => {
        if (
          value !== null &&
          value !== undefined &&
          key !== "front_id_picture" &&
          key !== "back_id_picture"
        ) {
          formDataToSend.append(key, String(value));
        }
      });

      // Add file data
      const frontIdInput = document.querySelector(
        'input[name="front_id_picture"]'
      );
      const backIdInput = document.querySelector(
        'input[name="back_id_picture"]'
      );

      if (frontIdInput?.files[0]) {
        formDataToSend.append("front_id_picture", frontIdInput.files[0]);
      }
      if (backIdInput?.files[0]) {
        formDataToSend.append("back_id_picture", backIdInput.files[0]);
      }

      const config = {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.put(
        `http://localhost:5000/api/users/${user.user_id}`,
        formDataToSend,
        config
      );

      if (response.data.user) {
        setFormData((prev) => ({
          ...prev,
          ...response.data.user,
        }));
      }

      setSuccess(true);
      setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      console.error("Update error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to update profile. Please try again.";
      setError(errorMessage);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${user.user_id}`,
          { headers: getAuthHeaders() }
        );
        setFormData((prev) => ({
          ...prev,
          ...response.data,
          verification_status:
            response.data.verification_status || "unverified",
        }));
      } catch (err) {
        setError("Failed to fetch user data");
        console.error("Fetch error:", err);
      }
    };

    if (user?.user_id) {
      fetchUserData();
    }
  }, [user, getAuthHeaders]);

  const genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  return (
    <div className="flex justify-center min-h-screen bg-background font-inter">
      <div className="flex items-center w-full max-w-4xl p-8 mx-auto">
        <div className="w-full">
          <h1 className="text-2xl font-semibold tracking-wider text-gold capitalize mb-12 text-center">
            Complete Your Profile
          </h1>

          {success && (
            <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-600 bg-green-200 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-4 w-4 text-green-600"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-green-700">Profile updated successfully!</p>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Account Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-blue3">
                Account Information
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <FormField
                  label="Student ID"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-blue3">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
                <FormField
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
                <FormField
                  label="Gender"
                  type="select"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={genderOptions}
                />
                <FormField
                  label="About Me"
                  type="textarea"
                  name="about_me"
                  value={formData.about_me}
                  onChange={handleChange}
                  fullWidth
                />
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-blue3">
                Academic Information
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  label="Batch Year"
                  type="number"
                  name="batch_year"
                  value={formData.batch_year}
                  onChange={handleChange}
                  required
                />
                <FormField
                  label="Year Level"
                  type="number"
                  name="year_level"
                  value={formData.year_level}
                  onChange={handleChange}
                  required
                />
                <FormField
                  label="Course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-blue3">
                Professional Information
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  label="Current Company"
                  name="current_company"
                  value={formData.current_company}
                  onChange={handleChange}
                />
                <FormField
                  label="Job Title"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-blue3">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  label="Contact Number"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleChange}
                />
                <FormField
                  label="Messenger Link"
                  name="messenger_link"
                  value={formData.messenger_link}
                  onChange={handleChange}
                />
                <FormField
                  label="Address"
                  type="textarea"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  fullWidth
                />
              </div>
            </div>

            {/* ID Verification */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-blue3">
                ID Verification
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  label="Front ID Picture"
                  type="file"
                  name="front_id_picture"
                  onChange={handleChange}
                  accept="image/*"
                />
                <FormField
                  label="Back ID Picture"
                  type="file"
                  name="back_id_picture"
                  onChange={handleChange}
                  accept="image/*"
                />
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm text-text">
                    Verification Status
                  </label>
                  <p
                    className={`flex items-center w-full px-5 py-3 mt-2 text-gray-700 border rounded-md ${
                      formData.verification_status === "verified"
                        ? "border-green-500 text-green-900 bg-green-200"
                        : "border-red-500 text-red-900 bg-red-200"
                    }`}
                  >
                    {formData.verification_status === "verified" ? (
                      <BadgeCheck className="w-5 h-5 mr-2" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 mr-2" />
                    )}
                    <span>{formData.verification_status || "unverified"}</span>
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center w-full px-6 py-3 mt-8 text-sm tracking-wide text-background capitalize transition-colors duration-300 transform bg-blue3 rounded-md hover:bg-blue3/80 focus:outline-none focus:ring focus:ring-blue3 focus:ring-opacity-50"
            >
              <span>Update Profile</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
