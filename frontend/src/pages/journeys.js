import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const journeyStories = [
  {
    id: 1,
    first_name: "Cristina",
    last_name: "Mendoza",
    graduationYear: 2015,
    current_job: "Senior Software Developer",
    company: "Accenture Philippines",
    industry: "Technology",
    story:
      "LCCB equipped me with technical skills and confidence to excel in the competitive IT industry. My journey from student to tech professional started here.",
  },
  {
    id: 2,
    first_name: "Roberto",
    last_name: "Garcia",
    graduationYear: 2012,
    current_job: "Hospital Administrator",
    company: "Vicente Sotto Memorial Medical Center",
    industry: "Healthcare",
    story:
      "The values I learned at LCCB guided me in healthcare management, teaching me the importance of compassionate service and leadership.",
  },
  {
    id: 3,
    first_name: "Maria Elena",
    last_name: "Santos",
    graduationYear: 2018,
    current_job: "Marketing Manager",
    company: "SM Investments Corporation",
    industry: "Marketing",
    story:
      "LCCB nurtured my creativity and strategic thinking, preparing me for the dynamic world of corporate marketing.",
  },
  {
    id: 4,
    first_name: "Joseph",
    last_name: "Reyes",
    graduationYear: 2016,
    current_job: "Business Development Specialist",
    company: "Cebu Landmasters",
    industry: "Real Estate",
    story:
      "The entrepreneurial mindset I developed at LCCB has been crucial in my career in real estate development and business strategy.",
  },
];

const Journeys = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    graduationYear: "",
    industry: "",
  });

  const filteredStories = journeyStories.filter((story) => {
    const matchesSearch =
      `${story.first_name} ${story.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      story.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.current_job.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters =
      (!filters.graduationYear ||
        story.graduationYear.toString() === filters.graduationYear) &&
      (!filters.industry || story.industry === filters.industry);

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

  const JourneyCard = ({ story }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue1 rounded-full flex items-center justify-center">
            <span className="text-2xl text-white font-semibold">
              {`${story.first_name[0]}${story.last_name[0]}`}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-text">
              {`${story.first_name} ${story.last_name}`}
            </h3>
            <p className="text-blue3 font-medium">{story.current_job}</p>
            <p className="text-gray-600">{story.company}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Graduation Year:</span>{" "}
            {story.graduationYear}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Industry:</span> {story.industry}
          </p>
        </div>

        <div className="mt-4 italic text-text/80">"{story.story}"</div>

        <div className="mt-6 flex justify-end">
          <Link
            to={`/alumni/${story.id}`}
            className="text-blue3 hover:text-blue3/80 font-medium flex items-center"
          >
            View Full Profile
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
          <h3 className="text-6xl text-darker-blue leading-[3.25rem] mb-5 font-paralucent">
            Alumni <span className="text-gold font-semibold">Journeys</span>
          </h3>
          <p className="text-text/60 font-inter font-medium">
            Real stories of LCCB graduates making an impact in their industries.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="space-y-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, company, or job title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-text/30 rounded-md pl-10 focus:border-blue3 focus:ring-blue3 focus:outline-none focus:ring focus:ring-opacity-40"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FilterSelect
                label="Graduation Year"
                name="graduationYear"
                options={["2012", "2015", "2016", "2018"]}
                value={filters.graduationYear}
                onChange={(e) =>
                  setFilters({ ...filters, graduationYear: e.target.value })
                }
              />
              <FilterSelect
                label="Industry"
                name="industry"
                options={[
                  "Technology",
                  "Healthcare",
                  "Marketing",
                  "Real Estate",
                ]}
                value={filters.industry}
                onChange={(e) =>
                  setFilters({ ...filters, industry: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <JourneyCard key={story.id} story={story} />
          ))}

          {filteredStories.length === 0 && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium text-text mb-2">
                No stories found
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

export default Journeys;
