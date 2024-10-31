import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser) {
          setIsAuthenticated(true);
          setUser(parsedUser);
          setIsAdmin(parsedUser.isAdmin || false);
        }
      }
    } catch (error) {
      console.error("Error loading auth state:", error);
      // Clean up potentially corrupted data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUser(null);
    }
  }, []);

  const login = (userData) => {
    try {
      if (!userData || !userData.user) {
        throw new Error("Invalid user data received");
      }

      console.log("Login userData:", userData);
      setIsAuthenticated(true);
      setUser(userData.user);
      setIsAdmin(userData.user.isAdmin || false);

      if (userData.token) {
        localStorage.setItem("token", userData.token);
      }
      localStorage.setItem("user", JSON.stringify(userData.user));
    } catch (error) {
      console.error("Error during login:", error);
      logout(); // Clean up if something goes wrong
    }
  };

  const logout = () => {
    try {
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        user,
        login,
        logout,
        getAuthHeaders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
