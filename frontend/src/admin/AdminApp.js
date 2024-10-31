// frontend/src/admin/AdminApp.js
import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import AdminHeader from "./components/AdminHeader";
import AdminDashboard from "./pages/AdminDashboard";

const AdminApp = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <>
      <AdminHeader logout={logout} />
      <Routes>
        <Route
          path="/admin-dashboard"
          element={
            isAuthenticated ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />
        {/* Default route for /admin */}
        <Route path="/" element={<Navigate to="/admin-dashboard" replace />} />
      </Routes>
    </>
  );
};

export default AdminApp;
