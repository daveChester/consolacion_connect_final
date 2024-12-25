import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Search } from "lucide-react";
import { AuthContext } from "../AuthContext";

const mockJobs = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Accenture Philippines",
    location: "Remote",
    description:
      "Develop and maintain enterprise-level software solutions for global clients.",
  },
  {
    id: 2,
    title: "Front-end Developer",
    company: "Exist Software Labs",
    location: "Local",
    description:
      "Create responsive and intuitive web applications using modern front-end technologies.",
  },
  {
    id: 3,
    title: "Cloud Solutions Architect",
    company: "IBM Philippines",
    location: "Local",
    description:
      "Design and implement cloud infrastructure solutions for enterprise clients.",
  },
  {
    id: 4,
    title: "Data Scientist",
    company: "Globe Telecom",
    location: "Out of Country",
    description:
      "Apply advanced analytics and machine learning techniques to solve complex business problems.",
  },
];

const JobBoard = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
  });

  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters =
      !filters.location || job.location === filters.location;

    return matchesSearch && matchesFilters;
  });

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
        className="w-full px-4 py-2 border border-text/30 rounded-md focus:border-primary focus:ring-primary focus:outline-none focus:ring focus:ring-opacity-40 bg-white text-text"
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

  const JobCard = ({ job }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 mt-8">
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-darker-blue rounded-full flex items-center justify-center">
            <span className="text-2xl text-white font-semibold">
              {job.company.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-text">{job.title}</h3>
            <p className="text-primary font-medium">{job.company}</p>
            <p className="text-text/70">{job.location}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-sm text-text/80">{job.description}</p>
        </div>

        <div className="mt-6 flex justify-end">
          <Link
            to={`/jobs/${job.id}`}
            className="text-primary hover:text-primary/80 font-medium flex items-center"
          >
            View Details
            <ChevronRight className="size-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background px-6 py-12 font-inter">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h3 className="text-6xl text-darker-blue leading-[3.25rem] mb-5 font-paralucent">
            Job{" "}
            <span className="text-gold text-6xl font-paralucent font-semibold">
              Board
            </span>
          </h3>
          <p className="text-text/60 font-medium">
            Explore the latest job opportunities and connect with employers.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="space-y-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by job title or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="font-inter w-full px-4 py-3 border border-text/30 rounded-md pl-10 focus:border-primary focus:ring-primary focus:outline-none focus:ring focus:ring-opacity-40"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-text/50" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FilterSelect
                label="Location"
                name="location"
                options={["Remote", "Local", "Out of Country"]}
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium text-text mb-2">
                No job listings found
              </h3>
              <p className="text-text/70">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobBoard;
