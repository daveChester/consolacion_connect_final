// frontend/src/App.js
import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./AuthContext";

// Import your page components
import LandingPage from "./pages/landing-page";
import HomePage from "./pages/home";
import SignUp from "./pages/sign-up";
import Header from "./components/Header";
import LoginPage from "./pages/login";
import AlumniDirectory from "./pages/alumni-directory";
import Events from "./pages/events";
import Mentorship from "./pages/mentorship";
import Journeys from "./pages/journeys";
import Honorem from "./pages/honorem";
import JobBoard from "./pages/job-board";
import NewsPage from "./pages/news";
import GiveBack from "./pages/give-back";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  const { logout } = useContext(AuthContext);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/landing-page" />} />
          <Route path="/landing-page" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUp />} />

          {/* Public route */}
          <Route
            path="/home"
            element={
              <>
                <Header logout={logout} />
                <HomePage />
              </>
            }
          />

          {/* Protected routes */}
          <Route
            path="/alumni-directory"
            element={
              <PrivateRoute>
                <>
                  <Header logout={logout} />
                  <AlumniDirectory />
                </>
              </PrivateRoute>
            }
          />
          <Route
            path="/events"
            element={
              <PrivateRoute>
                <>
                  <Header logout={logout} />
                  <Events />
                </>
              </PrivateRoute>
            }
          />
          <Route
            path="/mentorship"
            element={
              <PrivateRoute>
                <>
                  <Header logout={logout} />
                  <Mentorship />
                </>
              </PrivateRoute>
            }
          />
          <Route
            path="/journeys"
            element={
              <PrivateRoute>
                <>
                  <Header logout={logout} />
                  <Journeys />
                </>
              </PrivateRoute>
            }
          />
          <Route
            path="/honorem"
            element={
              <PrivateRoute>
                <>
                  <Header logout={logout} />
                  <Honorem />
                </>
              </PrivateRoute>
            }
          />
          <Route
            path="/job-board"
            element={
              <PrivateRoute>
                <>
                  <Header logout={logout} />
                  <JobBoard />
                </>
              </PrivateRoute>
            }
          />
          <Route
            path="/news"
            element={
              <PrivateRoute>
                <>
                  <Header logout={logout} />
                  <NewsPage />
                </>
              </PrivateRoute>
            }
          />
          <Route
            path="/give-back"
            element={
              <PrivateRoute>
                <>
                  <Header logout={logout} />
                  <GiveBack />
                </>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
