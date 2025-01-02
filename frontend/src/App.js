import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./AuthContext";

// Import your page components
import LandingPage from "./pages/landing-page";
import HomePage from "./pages/home";
import SignUp from "./pages/sign-up";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginPage from "./pages/login";
import AlumniDirectory from "./pages/alumni-directory";
import Events from "./pages/events";
import Journeys from "./pages/journeys";
import NewsPage from "./pages/news";
import GiveBack from "./pages/give-back";
import Profile from "./pages/profile"; // Add this import

// Import admin-related components
import AdminApp from "./admin/AdminApp";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);
  return isAuthenticated && isAdmin ? children : <Navigate to="/admin/login" />;
};

const App = () => {
  const { logout } = useContext(AuthContext);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin-dashboard/*"
            element={
              <AdminRoute>
                <AdminApp />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminApp />
              </AdminRoute>
            }
          />

          {/* Main App Routes */}
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
            path="/profile"
            element={
              <PrivateRoute>
                <>
                  <Header logout={logout} />
                  <Profile />
                  <Footer />
                </>
              </PrivateRoute>
            }
          />
          <Route
            path="/alumni-directory"
            element={
              <PrivateRoute>
                <>
                  <Header logout={logout} />
                  <AlumniDirectory />
                  <Footer />
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
                  <Footer />
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
                  <Footer />
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
                  <Footer />
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
                  <Footer />
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
