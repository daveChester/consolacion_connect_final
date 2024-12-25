import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import { ArrowRight } from "lucide-react";

const SignUpPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [degree, setDegree] = useState("");
  const [currentJob, setCurrentJob] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [mentorStatus, setMentorStatus] = useState("no");

  const [signupError, setSignupError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSignupError(null);

    try {
      if (!email || !password || !fullName) {
        setSignupError("Please fill in all required fields");
        return;
      }

      if (password !== confirmPassword) {
        setSignupError("Passwords do not match");
        return;
      }

      const nameParts = fullName.split(" ");
      const signupData = {
        email,
        password,
        first_name: nameParts[0],
        last_name: nameParts.slice(1).join(" ") || "",
        graduation_year: graduationYear,
        degree,
        current_job: currentJob,
        company,
        industry,
        mentor_status: mentorStatus === "yes",
      };

      const response = await axios.post(
        "http://localhost:5000/api/signup",
        signupData
      );

      if (response.data) {
        login({
          token: response.data.token,
          user: response.data.user,
        });
        navigate("/home");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setSignupError(
        error.response?.data?.message ||
          "An error occurred during signup. Please try again."
      );
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-background">
      <div className="hidden lg:block lg:w-2/5 relative overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/images/videobg.mp4"
        >
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
        <div className="w-full">
          <h1 className="text-2xl font-semibold tracking-wider text-gold capitalize mb-6 text-center">
            Sign up for Consolacion Connect
          </h1>
          {signupError && (
            <p className="text-red-500 text-center mb-4">{signupError}</p>
          )}
          <form
            className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-2 font-inter text-[15px]"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="fullName"
                className="block mb-2 text-sm text-text"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Juan Dela Cruz"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-text/30 rounded-md focus:border-blue3 focus:ring-blue3 focus:outline-none focus:ring focus:ring-opacity-40"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 text-sm text-text">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="juandelacruz@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-text/30 rounded-md focus:border-blue3 focus:ring-blue3 focus:outline-none focus:ring focus:ring-opacity-40"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm text-text"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-text/30 rounded-md focus:border-blue3 focus:ring-blue3 focus:outline-none focus:ring focus:ring-opacity-40"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block mb-2 text-sm text-text"
              >
                Confirm password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-text/30 rounded-md focus:border-blue3 focus:ring-blue3 focus:outline-none focus:ring focus:ring-opacity-40"
                required
              />
            </div>

            <div>
              <label
                htmlFor="graduationYear"
                className="block mb-2 text-sm text-text"
              >
                Graduation Year
              </label>
              <input
                type="number"
                id="graduationYear"
                name="graduationYear"
                placeholder="YYYY"
                min="1900"
                max="2099"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-text/30 rounded-md focus:border-blue3 focus:ring-blue3 focus:outline-none focus:ring focus:ring-opacity-40"
                required
              />
            </div>

            <div>
              <label htmlFor="degree" className="block mb-2 text-sm text-text">
                Degree
              </label>
              <input
                type="text"
                id="degree"
                name="degree"
                placeholder="Bachelor of Science in..."
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-text/30 rounded-md focus:border-blue3 focus:ring-blue3 focus:outline-none focus:ring focus:ring-opacity-40"
                required
              />
            </div>
            <div>
              <label
                htmlFor="currentJob"
                className="block mb-2 text-sm text-text"
              >
                Current Job Title
              </label>
              <input
                type="text"
                id="currentJob"
                name="currentJob"
                placeholder="Software Engineer"
                value={currentJob}
                onChange={(e) => setCurrentJob(e.target.value)}
                className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-text/30 rounded-md focus:border-blue3 focus:ring-blue3 focus:outline-none focus:ring focus:ring-opacity-40"
                required
              />
            </div>

            <div>
              <label htmlFor="company" className="block mb-2 text-sm text-text">
                Current Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                placeholder="Company name..."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-text/30 rounded-md focus:border-blue3 focus:ring-blue3 focus:outline-none focus:ring focus:ring-opacity-40"
                required
              />
            </div>

            <div>
              <label
                htmlFor="industry"
                className="block mb-2 text-sm text-text"
              >
                Industry
              </label>
              <input
                type="text"
                id="industry"
                name="industry"
                placeholder="Technology"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-text/30 rounded-md focus:border-blue3 focus:ring-blue3 focus:outline-none focus:ring focus:ring-opacity-40"
                required
              />
            </div>

            <div>
              <label
                htmlFor="mentorStatus"
                className="block mb-2 text-sm text-text"
              >
                Are you willing to be a mentor?
              </label>
              <select
                id="mentorStatus"
                name="mentorStatus"
                value={mentorStatus}
                onChange={(e) => setMentorStatus(e.target.value)}
                className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-text/30 rounded-md focus:border-blue3 focus:ring-blue3 focus:outline-none focus:ring focus:ring-opacity-40"
                required
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="maybe">Maybe in the future</option>
              </select>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center w-full col-span-2 px-6 py-3 text-sm tracking-wide text-background capitalize transition-colors duration-300 transform bg-blue3 rounded-md hover:bg-blue3/80 focus:outline-none focus:ring focus:ring-blue3 focus:ring-opacity-50"
            >
              <span>Sign Up</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/landing-page"
              className="text-text/70 hover:text-text text-sm font-light"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
