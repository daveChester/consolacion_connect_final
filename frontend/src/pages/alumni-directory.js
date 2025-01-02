import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import axios from "axios";

const AlumniDirectory = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    batchYear: "",
    course: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data);
        setFilteredUsers(response.data);
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

  const FilterSelect = ({ label, name, options, value, onChange }) => (
    <div className="w-full md:w-auto">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-text mb-2"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-text/30 rounded-md focus:border-blue3 focus:ring-blue3 focus:outline-none focus:ring focus:ring-opacity-40 bg-white text-gray-700"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  const UserCard = ({ user }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue1 rounded-full flex items-center justify-center">
            <span className="text-2xl text-white font-semibold">
              {`${user.first_name[0]}${user.last_name[0]}`}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-text">
              {`${user.first_name} ${user.last_name}`}
            </h3>
            <p className="text-blue3 font-medium">{user.student_id}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Course:</span> {user.course}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Batch Year:</span> {user.batch_year}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Status:</span>{" "}
            {user.is_verified ? "Verified" : "Pending Verification"}
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <Link
            to={`/users/${user.user_id}`}
            className="text-blue3 hover:text-blue3/80 font-medium flex items-center"
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
          </Link>
        </div>
      </div>
    </div>
  );

  // Get unique batch years and courses from users
  const batchYears = [...new Set(users.map((user) => user.batch_year))]
    .filter(Boolean)
    .sort();
  const courses = [...new Set(users.map((user) => user.course))].filter(
    Boolean
  );

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
                className="w-full px-4 py-3 border border-text/30 rounded-md pl-10 focus:border-blue3 focus:ring-blue3 focus:outline-none focus:ring focus:ring-opacity-40"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FilterSelect
                label="Batch Year"
                name="batchYear"
                options={batchYears}
                value={filters.batchYear}
                onChange={(e) =>
                  setFilters({ ...filters, batchYear: e.target.value })
                }
              />
              <FilterSelect
                label="Course"
                name="course"
                options={courses}
                value={filters.course}
                onChange={(e) =>
                  setFilters({ ...filters, course: e.target.value })
                }
              />
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
              <div className="col-span-full text-center py-12">
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
    </div>
  );
};

export default AlumniDirectory;
