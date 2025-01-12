import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import {
  ArrowRight,
  BadgeCheck,
  ShieldAlert,
  CheckCircle,
  Plus,
  User,
} from "lucide-react";
import FormField from "../components/FormField";
import { Dropdown } from "../components/Dropdown";

const INITIAL_FORM_STATE = {
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
  profile_picture: "",
};

const GENDER_OPTIONS = [
  { label: "Male", path: "Male" },
  { label: "Female", path: "Female" },
  { label: "Other", path: "Other" },
];

// Modified to make ID Verification conditional
const getFormSections = (isVerified) => {
  const baseSections = [
    {
      title: "Account Information",
      fields: [
        { name: "email", label: "Email", type: "email", required: true },
        { name: "student_id", label: "Student ID", required: true },
      ],
    },
    {
      title: "Personal Information",
      fields: [
        { name: "first_name", label: "First Name", required: true },
        { name: "last_name", label: "Last Name", required: true },
        { name: "gender", label: "Gender", type: "dropdown" },
        {
          name: "about_me",
          label: "About Me",
          type: "textarea",
          fullWidth: true,
        },
      ],
    },
    {
      title: "Academic Information",
      fields: [
        {
          name: "batch_year",
          label: "Batch Year",
          type: "number",
          required: true,
        },
        {
          name: "year_level",
          label: "Year Level",
          type: "number",
          required: true,
        },
        { name: "course", label: "Course", required: true },
      ],
    },
    {
      title: "Professional Information",
      fields: [
        { name: "current_company", label: "Current Company" },
        { name: "job_title", label: "Job Title" },
      ],
    },
    {
      title: "Contact Information",
      fields: [
        { name: "contact_number", label: "Contact Number" },
        { name: "messenger_link", label: "Messenger Link" },
        {
          name: "address",
          label: "Address",
          type: "textarea",
          rows: 3,
          fullWidth: true,
        },
      ],
    },
  ];

  // Only add ID Verification section if user is not verified
  if (!isVerified) {
    baseSections.push({
      title: "ID Verification",
      fields: [
        {
          name: "front_id_picture",
          label: "Front ID Picture",
          type: "file",
          accept: "image/*",
        },
        {
          name: "back_id_picture",
          label: "Back ID Picture",
          type: "file",
          accept: "image/*",
        },
      ],
    });
  }

  return baseSections;
};

const FormSection = ({ title, fields, formData, handleChange }) => {
  const [openDropdown, setOpenDropdown] = useState("");

  const handleDropdownSelect = (fieldName, value) => {
    handleChange({
      target: {
        name: fieldName,
        value: value,
      },
    });
    setOpenDropdown("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-blue3">{title}</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {fields.map((field) => {
          if (field.type === "dropdown") {
            return (
              <div key={field.name} className="w-full">
                <label className="block mb-2 text-sm text-text">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                <Dropdown
                  label={formData[field.name] || `Select ${field.label}`}
                  isOpen={openDropdown === field.name}
                  onToggle={() =>
                    setOpenDropdown(
                      openDropdown === field.name ? "" : field.name
                    )
                  }
                  items={GENDER_OPTIONS.map((option) => ({
                    ...option,
                    onClick: () =>
                      handleDropdownSelect(field.name, option.path),
                  }))}
                  buttonClassName="w-full px-5 py-3 text-left text-gray-700 bg-white border rounded-md"
                  className="w-48"
                />
              </div>
            );
          }
          return (
            <FormField
              key={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              {...field}
            />
          );
        })}
      </div>
    </div>
  );
};

const VerificationStatus = ({ status }) => (
  <div className="md:col-span-2">
    <label className="block mb-2 text-sm text-text">Verification Status</label>
    <p
      className={`flex items-center w-full px-5 py-3 mt-2 text-gray-700 border rounded-md ${
        status === "verified"
          ? "border-green-500 text-green-900 bg-green-200"
          : "border-red-500 text-red-900 bg-red-200"
      }`}
    >
      {status === "verified" ? (
        <BadgeCheck className="w-5 h-5 mr-2" />
      ) : (
        <ShieldAlert className="w-5 h-5 mr-2" />
      )}
      <span>{status || "unverified"}</span>
    </p>
  </div>
);

const SuccessMessage = () => (
  <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-600 bg-green-200 p-4">
    <CheckCircle className="h-4 w-4 text-green-600" />
    <p className="text-green-700">Profile updated successfully!</p>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4">
    <p className="text-red-600">{message}</p>
  </div>
);

const ProfilePicture = ({ imageUrl, onChange }) => {
  const inputRef = React.useRef(null);
  const [imageError, setImageError] = useState(false);
  const fullImageUrl = imageUrl?.startsWith("http")
    ? imageUrl
    : imageUrl
    ? `http://localhost:5000/uploads/${imageUrl}`
    : null;

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue3">
          {imageError || !fullImageUrl ? (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
          ) : (
            <img
              src={fullImageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          )}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-0 right-0 p-2 bg-blue3 rounded-full text-white hover:bg-blue1 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onChange}
        name="profile_picture"
      />
    </div>
  );
};

const ProfilePage = () => {
  const { user, getAuthHeaders } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [profilePreview, setProfilePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      if (name === "profile_picture" && files[0]) {
        const objectUrl = URL.createObjectURL(files[0]);
        setProfilePreview(objectUrl);
        setFormData((prev) => ({
          ...prev,
          [name]: files[0],
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" && value !== "" ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (
          value !== null &&
          value !== undefined &&
          !key.includes("_picture")
        ) {
          formDataToSend.append(key, String(value));
        }
      });

      if (
        formData.profile_picture &&
        formData.profile_picture instanceof File
      ) {
        formDataToSend.append("profile_picture", formData.profile_picture);
      }

      const response = await axios.put(
        `http://localhost:5000/api/users/${user.user_id}`,
        formDataToSend,
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.user) {
        setFormData((prev) => ({ ...prev, ...response.data.user }));
      }

      setSuccess(true);
      setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      console.error("Update error:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update profile. Please try again."
      );
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
        if (response.data.profile_picture) {
          setProfilePreview(response.data.profile_picture);
        }
      } catch (err) {
        setError("Failed to fetch user data");
        console.error("Fetch error:", err);
      }
    };

    if (user?.user_id) {
      fetchUserData();
    }
  }, [user, getAuthHeaders]);

  // Get form sections based on verification status
  const formSections = getFormSections(
    formData.verification_status === "verified"
  );

  return (
    <div className="flex justify-center min-h-screen bg-background font-inter">
      <div className="flex items-center w-full max-w-4xl p-8 mx-auto">
        <div className="w-full">
          <h1 className="text-2xl font-semibold tracking-wider text-gold capitalize mb-12 text-center">
            Complete Your Profile
          </h1>

          {success && <SuccessMessage />}
          {error && <ErrorMessage message={error} />}

          <ProfilePicture imageUrl={profilePreview} onChange={handleChange} />

          <form onSubmit={handleSubmit} className="space-y-8">
            {formSections.map((section) => (
              <FormSection
                key={section.title}
                formData={formData}
                handleChange={handleChange}
                {...section}
              />
            ))}

            <VerificationStatus status={formData.verification_status} />

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
