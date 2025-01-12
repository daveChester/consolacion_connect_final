import React, { useContext, useEffect, useState } from "react";
import { Search, ChevronRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

const AuthOverlay = () => (
  <div className="group">
    <div className="absolute inset-0 bg-text/85 group-hover:bg-text/95 transition ease-linear backdrop-blur-md rounded-3xl z-10 flex items-center justify-center">
      <div className="bg-background group-hover:shadow-neon rounded-xl p-8 max-w-md mx-4 relative transition ease-linear">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-darker-blue mb-8">
            Access exclusive alumni stories
          </h3>
          <div className="flex gap-4 justify-center">
            <Link
              to="/login"
              className="bg-gold text-darker-blue px-6 py-2 rounded-full font-medium hover:bg-gold/90 transition-all duration-300"
            >
              Log In
            </Link>
            <p className="text-text mt-2 font-inter font-medium">or</p>
            <Link
              to="/signup"
              className="border border-gold text-gold px-6 py-2 rounded-full font-medium hover:bg-gold/10 transition-all duration-300"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const JourneyModal = ({ journey, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-background rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-text" />
          </button>
        </div>
        <div className="flex items-center space-x-4 mb-6">
          {journey.image ? (
            <img
              src={`${BASE_URL}${journey.image}`}
              alt={`${journey.first_name} ${journey.last_name}`}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-3xl text-white font-semibold">
                {`${journey.first_name[0]}${journey.last_name[0]}`}
              </span>
            </div>
          )}
          <div>
            <h2 className="text-4xl font-paralucent font-medium text-darker-blue">
              {`${journey.first_name} ${journey.last_name}`}
            </h2>
            <p className="text-gold font-inter font-medium">
              {journey.current_job}
            </p>
            <p className="text-text/90">{journey.company}</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="p-6 bg-gray-50 rounded-2xl">
            <h3 className="text-xl font-paralucent font-medium text-darker-blue mb-4">
              Details
            </h3>
            <div className="space-y-3 font-inter">
              <p className="flex items-start gap-2">
                <span className="font-medium">Graduation Year:</span>
                <span className="text-text/90">{journey.graduationYear}</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-medium">Industry:</span>
                <span className="text-text/90">{journey.industry}</span>
              </p>
            </div>
          </div>
          <div className="text-text/90 font-inter text-lg leading-relaxed whitespace-pre-wrap">
            {journey.story}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Journeys = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [journeys, setJourneys] = useState([]);
  const [filteredJourneys, setFilteredJourneys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    graduationYear: "",
    industry: "",
  });

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}/api/journeys`);
        setJourneys(response.data);
        setFilteredJourneys(response.data);
      } catch (error) {
        console.error("Failed to fetch journeys:", error);
      } finally {
        setIsLoading(false);
      }
    };
    const intervalId = setInterval(fetchJourneys, 30000);
    fetchJourneys();
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const filtered = journeys.filter((journey) => {
      const matchesSearch =
        `${journey.first_name} ${journey.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        journey.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        journey.current_job.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters =
        (!filters.graduationYear ||
          journey.graduationYear.toString() === filters.graduationYear) &&
        (!filters.industry || journey.industry === filters.industry);

      return matchesSearch && matchesFilters;
    });
    setFilteredJourneys(filtered);
  }, [searchTerm, filters, journeys]);

  const getUniqueValues = (field) => {
    return [
      ...new Set(journeys.map((journey) => journey[field].toString())),
    ].sort();
  };

  if (isLoading) return null;

  return (
    <section className="py-20 bg-background relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-6xl text-darker-blue leading-[3.25rem] mb-5 font-paralucent">
            Alumni <span className="text-gold font-semibold">Journeys</span>
          </h2>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-md pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full">
                <label
                  htmlFor="graduationYear"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Graduation Year
                </label>
                <select
                  id="graduationYear"
                  value={filters.graduationYear}
                  onChange={(e) =>
                    setFilters({ ...filters, graduationYear: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">All Years</option>
                  {getUniqueValues("graduationYear").map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full">
                <label
                  htmlFor="industry"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Industry
                </label>
                <select
                  id="industry"
                  value={filters.industry}
                  onChange={(e) =>
                    setFilters({ ...filters, industry: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">All Industries</option>
                  {getUniqueValues("industry").map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          {!isAuthenticated && <AuthOverlay />}
          {filteredJourneys.length === 0 ? (
            <div className="flex justify-center items-center min-h-[300px] border-2 border-dashed border-text/20 rounded-3xl">
              <p className="text-text/50 text-lg">No alumni stories found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJourneys.map((journey) => (
                <div
                  key={journey.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4">
                      {journey.image ? (
                        <img
                          src={`${BASE_URL}${journey.image}`}
                          alt={`${journey.first_name} ${journey.last_name}`}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-2xl text-white font-semibold">
                            {`${journey.first_name[0]}${journey.last_name[0]}`}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {`${journey.first_name} ${journey.last_name}`}
                        </h3>
                        <p className="text-blue-600 font-medium">
                          {journey.current_job}
                        </p>
                        <p className="text-gray-600">{journey.company}</p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Graduation Year:</span>{" "}
                        {journey.graduationYear}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Industry:</span>{" "}
                        {journey.industry}
                      </p>
                    </div>

                    <div className="mt-4 text-gray-700 italic line-clamp-3">
                      "{journey.story}"
                    </div>

                    {isAuthenticated && (
                      <button
                        onClick={() => setSelectedJourney(journey)}
                        className="mt-6 cursor-pointer flex items-center gap-2 text-lg text-gold font-inter font-medium"
                      >
                        Read more
                        <ChevronRight className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedJourney && (
          <JourneyModal
            journey={selectedJourney}
            onClose={() => setSelectedJourney(null)}
          />
        )}
      </div>
    </section>
  );
};

export default Journeys;
