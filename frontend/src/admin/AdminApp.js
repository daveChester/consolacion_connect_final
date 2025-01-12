import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import AdminDashboard from "./pages/AdminDashboard";

const AdminApp = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
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
        <Route path="/" element={<Navigate to="/admin-dashboard" replace />} />
      </Routes>
    </>
  );
};

export default AdminApp;
