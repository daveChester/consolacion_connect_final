import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import FormField from "../components/FormField";

const SignUpPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    batch_year: "",
    course: "",
  });

  const [signupError, setSignupError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSignupError(null);

    console.log("Form Data:", formData);

    try {
      if (
        !formData.email ||
        !formData.password ||
        !formData.first_name ||
        !formData.last_name
      ) {
        setSignupError("Please fill in all required fields");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setSignupError("Passwords do not match");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/signup",
        formData
      );

      if (response.data) {
        login({
          token: response.data.token,
          user: response.data.user,
        });
        navigate("/profile");
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
            <FormField
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Juan"
              required
            />

            <FormField
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Dela Cruz"
              required
            />

            <FormField
              label="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="juandelacruz@gmail.com"
              required
            />

            <FormField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />

            <FormField
              label="Confirm password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />

            <FormField
              label="Batch Year"
              type="number"
              name="batch_year"
              value={formData.batch_year}
              onChange={handleChange}
              placeholder="YYYY"
            />

            <FormField
              label="Course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              placeholder="Bachelor of Science in..."
            />

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
