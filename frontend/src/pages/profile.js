import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import axios from "axios";

const ProfilePage = () => {
  const { user, logout, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [frontIdPicture, setFrontIdPicture] = useState(null);
  const [backIdPicture, setBackIdPicture] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/landing-page");
      return;
    }

    //  Crucially, fetch profile data *only* if user is available
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${user.user_id}`
        );
        setProfileData(response.data);
      } catch (error) {
        // Handle errors during profile fetching
        console.error("Error fetching profile:", error);
        setUpdateError("Failed to load profile. Please try again later.");
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const updatedData = { ...profileData };
    updatedData[e.target.name] = e.target.value;
    setProfileData(updatedData);
  };

  const handleFileChange = (e, type) => {
    const selectedFile = e.target.files[0] || null;
    if (type === "front") {
      setFrontIdPicture(selectedFile);
    } else {
      setBackIdPicture(selectedFile);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setProfileData({ ...user });
    setFrontIdPicture(null);
    setBackIdPicture(null);
    setUpdateError(null);
  };

  const handleSaveChanges = async () => {
    if (!user) return; // Prevent update if user is not logged in

    try {
      const formData = new FormData();
      Object.entries(profileData).forEach(([key, value]) => {
        // Handle potential null/undefined values during update
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      if (frontIdPicture) formData.append("front_id_picture", frontIdPicture);
      if (backIdPicture) formData.append("back_id_picture", backIdPicture);

      const response = await axios.put(
        `http://localhost:5000/api/users/${user.user_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        // Important: Update the user state in AuthContext correctly
        const updatedUser = { ...user, ...profileData }; // Correctly merging
        setUser(updatedUser);
        setIsEditing(false);
        setUpdateError(null);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);

      if (error.response) {
        setUpdateError(error.response.data.message || "Update failed.");
      } else {
        setUpdateError("Network error. Please check your internet connection.");
      }
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-background p-8">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-wider text-gold capitalize mb-6 text-center">
          My Profile
        </h1>
        {updateError && (
          <p className="text-red-500 text-center mb-4">{updateError}</p>
        )}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form className="grid grid-cols-1 gap-6 md:grid-cols-2 font-inter text-[15px]">
            {Object.keys(profileData).map((key) => {
              if (key === "password" || key === "user_id") return null;

              return (
                <div key={key}>
                  <label className="block mb-2 text-sm text-text">
                    {key.replace(/_/g, " ").toUpperCase()}
                  </label>

                  {isEditing ? (
                    key.includes("picture") ? (
                      <input
                        type="file"
                        name={key}
                        onChange={(e) =>
                          handleFileChange(
                            e,
                            key === "front_id_picture" ? "front" : "back"
                          )
                        }
                        className="block w-full text-gray-700 placeholder-gray-400 border border-text/30 rounded-md focus:border-blue3 focus:ring-blue3 focus:outline-none"
                      />
                    ) : (
                      <input
                        type={key === "batch_year" ? "number" : "text"}
                        name={key}
                        // The crucial change: provide a default empty string if the value is null or undefined
                        value={profileData[key] || ""}
                        onChange={handleChange}
                        className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-text/30 rounded-md focus:border-blue3 focus:ring-blue3 focus:outline-none focus:ring focus:ring-opacity-40"
                      />
                    )
                  ) : (
                    <p className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-text/30 rounded-md">
                      {/* Also handle null/undefined display here */}
                      {profileData[key] || ""}
                    </p>
                  )}
                </div>
              );
            })}

            {isEditing && (
              <div className="md:col-span-2 flex justify-end">
                <button
                  onClick={handleCancelClick}
                  type="button"
                  className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  type="button"
                  className="px-4 py-2 bg-blue3 text-white rounded-md hover:bg-blue3/80 focus:outline-none"
                >
                  Save Changes
                </button>
              </div>
            )}

            {!isEditing && (
              <div className="md:col-span-2 flex justify-end">
                <button
                  onClick={handleEditClick}
                  className="px-4 py-2 bg-blue3 text-white rounded-md hover:bg-blue3/80 focus:outline-none"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
