import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import axios from "axios";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const userData = response.data;
        console.log("Login successful:", userData);
        login(userData);
        navigate("/home");
      } else {
        setErrorMessage("Invalid credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-white">
      <div className="hidden lg:block lg:w-2/5 relative overflow-hidden">
        <img
          src={`${process.env.PUBLIC_URL}/images/signupbg.jpg`}
          alt="Background"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      <div className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
        <div className="w-full">
          <h1 className="text-2xl font-semibold tracking-wider text-gold capitalize mb-6 text-center">
            Log in to Consolacion Connect
          </h1>
          <form
            onSubmit={handleSubmit}
            className="mt-12 font-inter text-[15px]"
          >
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 text-sm text-text">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juandelacruz@gmail.com"
                className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-background bg-white border border-text/30 rounded-md focus:border-blue3 focus:ring-blue3 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            <div className="mb-6">
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-text/30 rounded-md focus:border-blue3 focus:ring-blue3 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            {errorMessage && (
              <div className="text-red-500 mb-4 text-center">
                {errorMessage}
              </div>
            )}
            <div className="mb-6 text-right">
              <Link
                to="/forgot-password"
                className="text-text/70 hover:text-text text-sm font-light"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center w-full px-6 py-3 text-sm tracking-wide text-background capitalize transition-colors duration-300 transform bg-blue3 rounded-md hover:bg-blue3/80 focus:outline-none focus:ring focus:ring-blue3 focus:ring-opacity-50"
            >
              <span>Log In</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 rtl:-scale-x-100 ml-2"
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
          </form>
          <div className="mt-6 text-center">
            <Link
              to="/sign-up"
              className="text-text/70 hover:text-text text-sm font-light"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
