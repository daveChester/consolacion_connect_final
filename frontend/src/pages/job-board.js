import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { ChevronRight } from "lucide-react";

const mockJobs = [
  {
    id: 1,
    title: "Software Engineer",
    description: "Join our team to develop innovative software solutions.",
  },
  {
    id: 2,
    title: "Product Manager",
    description: "Lead product strategy and drive product development.",
  },
  {
    id: 3,
    title: "UX Designer",
    description: "Create user-friendly designs for our applications.",
  },
  {
    id: 4,
    title: "Data Analyst",
    description: "Analyze data to help make informed business decisions.",
  },
];

const JobBoard = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJobs = mockJobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const JobItem = ({ job }) => (
    <div className="p-4 border-b border-text/20">
      <h3 className="text-xl font-bold text-text mb-2 font-paralucent">
        {job.title}
      </h3>
      <p className="text-text mb-4 font-inter">{job.description}</p>
      <Link
        to={`/jobs/${job.id}`}
        className="text-gold font-medium flex items-center"
      >
        View Details
        <ChevronRight className="ml-2" />
      </Link>
    </div>
  );

  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-6xl font-paralucent text-text mb-5 text-center tracking-wide">
          Job <span className="text-gold">Board</span>
        </h2>
        <p className="text-text mb-10 text-lg text-center font-inter">
          Explore the latest job opportunities and connect with employers.
        </p>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search jobs..."
            className="p-3 border border-text/30 rounded w-full font-inter"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          {filteredJobs.length === 0 ? (
            <p className="text-text text-center">
              No job listings available at the moment.
            </p>
          ) : (
            filteredJobs.map((job) => <JobItem key={job.id} job={job} />)
          )}
        </div>

        {isAuthenticated && (
          <div className="mt-10 text-center">
            <Link
              to="/post-job"
              className="bg-gold text-darker-blue py-2 px-4 rounded font-medium hover:bg-gold/90 transition-all duration-300"
            >
              Post a New Job
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default JobBoard;
