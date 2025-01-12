import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  User,
  GraduationCap,
  Building2,
  Phone,
  Info,
  Search,
} from "lucide-react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { Dropdown } from "../components/Dropdown";

const AlumniDirectory = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    batchYear: "",
    course: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);

  const isCurrentUserVerified = currentUser?.verification_status === "verified";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        const verifiedUsers = response.data.filter(
          (user) => user.verification_status === "verified"
        );
        setUsers(verifiedUsers);
        setFilteredUsers(verifiedUsers);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) => {
      const matchesSearch = `${user.first_name} ${user.last_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesFilters =
        (!filters.batchYear ||
          user.batch_year.toString() === filters.batchYear) &&
        (!filters.course || user.course === filters.course);

      return matchesSearch && matchesFilters;
    });

    setFilteredUsers(filtered);
  }, [searchQuery, filters, users]);

  const ProfileModal = ({ user, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
      <div className="bg-background rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-darker-blue font-inter">
              User Profile
            </h2>
            <button
              onClick={onClose}
              className="text-green2 hover:text-text transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-8 font-inter">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-gold text-lg mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <p className="text-base">
                    <span className="font-bold text-sm text-text/90">
                      Full Name:
                    </span>{" "}
                    <span className="font-inter text-sm tracking-wide text-text/90">
                      {user.first_name} {user.last_name}
                    </span>
                  </p>
                  <p className="text-base">
                    <span className="font-bold text-sm">Gender:</span>{" "}
                    <span className="font-inter text-sm tracking-wide text-text/90">
                      {user.gender || "N/A"}
                    </span>
                  </p>
                  <p className="text-base">
                    <span className="font-bold text-sm">Email:</span>{" "}
                    <span className="font-inter text-sm tracking-wide text-text/90">
                      {user.email}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gold text-lg mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Academic Information
                </h3>
                <div className="space-y-3">
                  <p className="text-base">
                    <span className="font-bold text-sm">Course:</span>{" "}
                    <span className="font-inter text-sm tracking-wide text-text/90">
                      {user.course}
                    </span>
                  </p>
                  <p className="text-base">
                    <span className="font-bold text-sm">Batch Year:</span>{" "}
                    <span className="font-inter text-sm tracking-wide text-text/90">
                      {user.batch_year}
                    </span>
                  </p>
                  <p className="text-base">
                    <span className="font-bold text-sm">Year Level:</span>{" "}
                    <span className="font-inter text-sm tracking-wide text-text/90">
                      {user.year_level}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gold text-lg mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Professional Information
                </h3>
                <div className="space-y-3">
                  <p className="text-base">
                    <span className="font-bold text-sm">Current Company:</span>{" "}
                    <span className="font-inter text-sm tracking-wide text-text/90">
                      {user.current_company || "N/A"}
                    </span>
                  </p>
                  <p className="text-base">
                    <span className="font-bold text-sm">Job Title:</span>{" "}
                    <span className="font-inter text-sm tracking-wide text-text/90">
                      {user.job_title || "N/A"}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gold text-lg mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <p className="text-base">
                    <span className="font-bold text-sm">Contact Number:</span>{" "}
                    <span className="font-inter text-sm tracking-wide text-text/90">
                      {user.contact_number || "N/A"}
                    </span>
                  </p>
                  <p className="text-base">
                    <span className="font-bold text-sm">Address:</span>{" "}
                    <span className="font-inter text-sm tracking-wide text-text/90">
                      {user.address || "N/A"}
                    </span>
                  </p>
                  <p className="text-base">
                    <span className="font-bold text-sm">Messenger:</span>{" "}
                    <span className="font-inter text-sm tracking-wide text-text/90">
                      {user.messenger_link || "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {user.about_me && (
              <div className="border-2 border-green2 rounded-lg p-6">
                <h3 className="font-medium text-text text-lg mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  About Me
                </h3>
                <p className="text-base">
                  <span className="font-inter text-sm tracking-wide text-text/90">
                    {user.about_me}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const UserCard = ({ user }) => {
    const profileImageUrl = user.profile_picture
      ? `http://localhost:5000/uploads/${user.profile_picture}`
      : null;

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={`${user.first_name}'s profile`}
                className="size-16 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = "none";
                  const fallbackDiv = e.target.nextElementSibling;
                  if (fallbackDiv) {
                    fallbackDiv.style.display = "flex";
                  }
                }}
              />
            ) : null}
            <div
              className={`size-16 bg-blue1 rounded-full flex items-center justify-center ${
                profileImageUrl ? "hidden" : ""
              }`}
            >
              <span className="text-2xl text-white font-semibold font-inter">
                {user.first_name[0]}
                {isCurrentUserVerified && user.last_name[0]}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-text font-inter tracking-wide">
                {isCurrentUserVerified
                  ? `${user.first_name} ${user.last_name}`
                  : user.first_name}
              </h3>
            </div>
          </div>

          {isCurrentUserVerified && (
            <div className="mt-4 space-y-2 font-inter">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Course:</span> {user.course}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Batch Year:</span>{" "}
                {user.batch_year}
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            {isCurrentUserVerified ? (
              <button
                onClick={() => {
                  setSelectedUser(user);
                  setShowModal(true);
                }}
                className="text-blue3 hover:text-blue3/80 font-medium flex items-center font-inter"
              >
                View Profile
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => navigate("/profile")}
                className="text-darker-blue/80 hover:text-gold font-medium flex items-center font-inter text-sm"
              >
                Get Verified to View
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const batchYears = [...new Set(users.map((user) => user.batch_year))]
    .filter(Boolean)
    .sort();
  const courses = [...new Set(users.map((user) => user.course))].filter(
    Boolean
  );

  const batchYearItems = [
    {
      label: "All",
      path: "#",
      onClick: () => handleFilterChange("batchYear", ""),
    },
    ...batchYears.map((year) => ({
      label: year.toString(),
      path: "#",
      onClick: () => handleFilterChange("batchYear", year.toString()),
    })),
  ];

  const courseItems = [
    {
      label: "All",
      path: "#",
      onClick: () => handleFilterChange("course", ""),
    },
    ...courses.map((course) => ({
      label: course,
      path: "#",
      onClick: () => handleFilterChange("course", course),
    })),
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    if (filterType === "batchYear") {
      setIsYearDropdownOpen(false);
    } else {
      setIsCourseDropdownOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h3 className="text-6xl text-darker-blue leading-[3.25rem] mb-5 font-paralucent">
            Student{" "}
            <span className="text-gold font-paralucent font-semibold">
              Directory
            </span>
          </h3>
          <p className="text-text/60 font-inter font-medium">
            Connect with LCCB students and alumni
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="space-y-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-text/30 rounded-md pl-10 focus:border-blue3 focus:ring-blue3 focus:outline-none focus:ring focus:ring-opacity-40 font-inter"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2 font-inter">
                  Batch Year
                </label>
                <Dropdown
                  isOpen={isYearDropdownOpen}
                  onToggle={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                  label={filters.batchYear || "All"}
                  items={batchYearItems}
                  buttonClassName="w-full px-4 py-2 border border-text/30 rounded-md text-left font-inter text-gray-700"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-2 font-inter">
                  Course
                </label>
                <Dropdown
                  isOpen={isCourseDropdownOpen}
                  onToggle={() =>
                    setIsCourseDropdownOpen(!isCourseDropdownOpen)
                  }
                  label={filters.course || "All"}
                  items={courseItems}
                  buttonClassName="w-full px-4 py-2 border border-text/30 rounded-md text-left font-inter text-gray-700"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue3"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <UserCard key={user.user_id} user={user} />
            ))}
            {filteredUsers.length === 0 && (
              <div className="col-span-full text-center py-12 font-inter">
                <h3 className="text-xl font-medium text-text mb-2">
                  No users found
                </h3>
                <p className="text-text/70">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && selectedUser && (
        <ProfileModal
          user={selectedUser}
          onClose={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default AlumniDirectory;
