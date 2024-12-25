import React, { useState } from "react";
import { Search } from "lucide-react";

const memoriam = [
  {
    id: 1,
    first_name: "Eduardo",
    last_name: "Reyes",
    graduationYear: 1985,
    degree: "Business Administration",
    memorialMessage:
      "A visionary entrepreneur who inspired countless students and made significant contributions to local business development.",
    dateOfPassing: "2022-03-15",
    contributedBy: "LCCB Alumni Association",
  },
  {
    id: 2,
    first_name: "Maria Clara",
    last_name: "Santos",
    graduationYear: 1990,
    degree: "Education",
    memorialMessage:
      "A dedicated educator who transformed countless lives through her passion for teaching and commitment to student success.",
    dateOfPassing: "2021-11-22",
    contributedBy: "College of Education Alumni Chapter",
  },
  {
    id: 3,
    first_name: "Roberto",
    last_name: "Cruz",
    graduationYear: 1978,
    degree: "Engineering",
    memorialMessage:
      "A pioneering engineer who was instrumental in developing critical infrastructure in Negros Occidental.",
    dateOfPassing: "2023-01-10",
    contributedBy: "Engineering Alumni Network",
  },
];

const Honorem = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    graduationYear: "",
    degree: "",
  });

  const filteredMemorials = memoriam.filter((memorial) => {
    const matchesSearch =
      `${memorial.first_name} ${memorial.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      memorial.contributedBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters =
      (!filters.graduationYear ||
        memorial.graduationYear.toString() === filters.graduationYear) &&
      (!filters.degree || memorial.degree === filters.degree);

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

  const MemorialCard = ({ memorial }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue1 rounded-full flex items-center justify-center">
            <span className="text-2xl text-white font-semibold">
              {`${memorial.first_name[0]}${memorial.last_name[0]}`}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-text">
              {`${memorial.first_name} ${memorial.last_name}`}
            </h3>
            <p className="text-blue3 font-medium">{memorial.degree}</p>
            <p className="text-gray-600">Class of {memorial.graduationYear}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Date of Passing:</span>{" "}
            {new Date(memorial.dateOfPassing).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Contributed By:</span>{" "}
            {memorial.contributedBy}
          </p>
        </div>

        <div className="mt-4 italic text-text/80">
          "{memorial.memorialMessage}"
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h3 className="text-6xl text-darker-blue leading-[3.25rem] mb-5 font-paralucent">
            In <span className="text-gold font-semibold">Honorem</span>
          </h3>
          <p className="text-text/60 font-inter font-medium">
            A sacred space to remember and honor our beloved LCCB alumni who
            have passed, celebrating their lives, contributions, and enduring
            impact on our community.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="space-y-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or contributing group..."
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
                options={["1978", "1985", "1990", "2000"]}
                value={filters.graduationYear}
                onChange={(e) =>
                  setFilters({ ...filters, graduationYear: e.target.value })
                }
              />
              <FilterSelect
                label="Degree"
                name="degree"
                options={[
                  "Business Administration",
                  "Education",
                  "Engineering",
                ]}
                value={filters.degree}
                onChange={(e) =>
                  setFilters({ ...filters, degree: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemorials.map((memorial) => (
            <MemorialCard key={memorial.id} memorial={memorial} />
          ))}

          {filteredMemorials.length === 0 && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium text-text mb-2">
                No memorial entries found
              </h3>
              <p className="text-text/70">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-6 text-center">
          <h4 className="text-2xl text-darker-blue mb-4">Help Us Remember</h4>
          <p className="text-text/80 mb-6">
            If you would like to add or contribute a memorial for an alumni
            member, please contact the LCCB Alumni Association or submit details
            through our platform.
          </p>
          <button className="px-6 py-3 bg-blue1 text-white rounded-md hover:bg-blue3/90 transition-colors">
            Submit Memorial Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default Honorem;
