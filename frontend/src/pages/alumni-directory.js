import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AlumniDirectory = () => {
  const [alumni, setAlumni] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    graduationYear: "",
    degree: "",
    industry: "",
    mentorStatus: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/alumni");
        setAlumni(response.data);
        setFilteredAlumni(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching alumni:", error);
        setIsLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  useEffect(() => {
    const filtered = alumni.filter((alumnus) => {
      const matchesSearch =
        `${alumnus.first_name} ${alumnus.last_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        alumnus.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alumnus.current_job.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilters =
        (!filters.graduationYear ||
          alumnus.graduation_year.toString() === filters.graduationYear) &&
        (!filters.degree || alumnus.degree.includes(filters.degree)) &&
        (!filters.industry || alumnus.industry === filters.industry) &&
        (!filters.mentorStatus ||
          alumnus.mentor_status.toString() === filters.mentorStatus);

      return matchesSearch && matchesFilters;
    });

    setFilteredAlumni(filtered);
  }, [searchQuery, filters, alumni]);

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

  const AlumniCard = ({ alumnus }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue1 rounded-full flex items-center justify-center">
            <span className="text-2xl text-white font-semibold">
              {`${alumnus.first_name[0]}${alumnus.last_name[0]}`}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-text">
              {`${alumnus.first_name} ${alumnus.last_name}`}
            </h3>
            <p className="text-blue3 font-medium">{alumnus.current_job}</p>
            <p className="text-gray-600">{alumnus.company}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Degree:</span> {alumnus.degree}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Graduation Year:</span>{" "}
            {alumnus.graduation_year}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Industry:</span> {alumnus.industry}
          </p>
        </div>

        {alumnus.mentor_status && (
          <div className="mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gold/20 text-gold">
              Available for Mentoring
            </span>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Link
            to={`/alumni/${alumnus.id}`}
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

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h3 className="text-4xl font-paralucent text-gold mb-2">
            Alumni Directory
          </h3>
          <p className="text-text/60 font-inter font-medium">
            Connect with fellow LCCB alumni and expand your professional
            network.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="space-y-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, company, or job title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-text/30 rounded-md pl-10 focus:border-blue3 focus:ring-blue3 focus:outline-none focus:ring focus:ring-opacity-40"
              />
              <svg
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FilterSelect
                label="Graduation Year"
                name="graduationYear"
                options={["2020", "2021", "2022", "2023"]}
                value={filters.graduationYear}
                onChange={(e) =>
                  setFilters({ ...filters, graduationYear: e.target.value })
                }
              />
              <FilterSelect
                label="Degree"
                name="degree"
                options={[
                  "BS Information Technology",
                  "BS Computer Science",
                  "BS Business Administration",
                ]}
                value={filters.degree}
                onChange={(e) =>
                  setFilters({ ...filters, degree: e.target.value })
                }
              />
              <FilterSelect
                label="Industry"
                name="industry"
                options={["Technology", "Finance", "Healthcare", "Education"]}
                value={filters.industry}
                onChange={(e) =>
                  setFilters({ ...filters, industry: e.target.value })
                }
              />
              <FilterSelect
                label="Mentor Status"
                name="mentorStatus"
                options={["true", "false"]}
                value={filters.mentorStatus}
                onChange={(e) =>
                  setFilters({ ...filters, mentorStatus: e.target.value })
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
            {filteredAlumni.map((alumnus) => (
              <AlumniCard key={alumnus.id} alumnus={alumnus} />
            ))}
            {filteredAlumni.length === 0 && (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-medium text-text mb-2">
                  No alumni found
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
