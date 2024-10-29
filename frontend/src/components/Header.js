// frontend/src/components/Header.js
import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { AuthContext } from "../AuthContext";

const Header = () => {
  const location = useLocation();
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const MOBILE_BREAKPOINT = 1024;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (path) => {
    return location.pathname === path
      ? "text-gold font-medium"
      : "hover:text-gold";
  };

  const connectSubmenu = [
    { path: "/events", label: "Events" },
    { path: "/mentorship", label: "Mentorship" },
    { path: "/journeys", label: "Journeys" },
    { path: "/honorem", label: "Honorem" },
  ];

  const handleNavigation = (path) => {
    if (path === "/home") {
      navigate(path);
    } else if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/landing-page");
  };

  const NavItems = ({ mobile = false }) => (
    <ul
      className={`${
        mobile ? "flex flex-col space-y-4" : "flex space-x-9"
      } text-text font-inter text-[15px] font-normal`}
    >
      <li>
        <Link to="/home" className={`${isActive("/home")} transition-colors`}>
          Home
        </Link>
      </li>
      <li>
        <Link
          onClick={() => handleNavigation("/alumni-directory")}
          className={`${isActive("/alumni-directory")} transition-colors`}
        >
          Alumni Directory
        </Link>
      </li>
      <li>
        <Link
          onClick={() => handleNavigation("/job-board")}
          className={`${isActive("/job-board")} transition-colors`}
        >
          Job Board
        </Link>
      </li>
      <li>
        <Link
          onClick={() => handleNavigation("/news")}
          className={`${isActive("/news")} transition-colors`}
        >
          News
        </Link>
      </li>
      <li className="relative">
        <button
          className={`${isActive(
            "/connect"
          )} transition-colors flex items-center`}
          onClick={() => setIsConnectOpen(!isConnectOpen)}
        >
          Connect
          <ChevronDown className="ml-1 size-3.5" />
        </button>
        {isConnectOpen && (
          <ul className="absolute left-0 mt-2 w-36 bg-background shadow-lg rounded-md overflow-hidden z-10">
            {connectSubmenu.map((item) => (
              <li key={item.path}>
                <Link
                  onClick={() => handleNavigation(item.path)}
                  className="block px-4 py-2 text-sm text-text hover:bg-gold/90"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
      <li>
        <Link
          onClick={() => handleNavigation("/give-back")}
          className={`${isActive("/give-back")} transition-colors`}
        >
          Give Back
        </Link>
      </li>
      {!isAuthenticated && <></>}
    </ul>
  );

  return (
    <header className="bg-background h-[60px] flex items-center justify-between sticky top-0 z-50">
      <div className="flex-shrink-0">
        <Link to="/home" className="flex items-center">
          <img
            src={`${process.env.PUBLIC_URL}/images/HomepageLogo.svg`}
            alt="Consolacion Connect Logo"
            className="h-[60px] w-[230.85px]"
          />
        </Link>
      </div>

      {isMobile ? (
        <button
          className="p-2 text-text"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      ) : (
        <nav className="flex items-center pr-4">
          <NavItems />
          {isAuthenticated ? (
            <div className="ml-6 flex items-center">
              <button
                onClick={handleLogout}
                className="bg-gold text-darker-blue rounded hover:bg-opacity-90 px-4 py-2 font-inter text-[15px] font-normal"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="ml-10 flex items-center">
              <Link
                to="/sign-up"
                className="mr-4 font-inter text-[15px] font-normal hover:text-gold"
              >
                Join Now
              </Link>
              <Link
                to="/login"
                className="bg-gold text-text rounded hover:bg-opacity-90 hover:text-text/40 px-4 py-2 font-inter text-[15px] font-normal"
              >
                Log in
              </Link>
            </div>
          )}
        </nav>
      )}

      {isMobile && isMobileMenuOpen && (
        <div className="absolute top-[60px] left-0 w-full bg-background shadow-lg rounded-md">
          <nav className="p-4">
            <NavItems mobile />
            {!isAuthenticated && (
              <div className="mt-7 flex flex-col space-y-2">
                <Link
                  to="/sign-up"
                  className="bg-darker-blue font-inter text-background rounded hover:bg-opacity-90 text-center py-2"
                >
                  Join Now
                </Link>
                <Link
                  to="/login"
                  className="bg-gold text-darker-blue rounded hover:bg-opacity-90 text-center py-2"
                >
                  Log in
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}

      <div
        className="w-full h-[1.3px] absolute bottom-[-0.2px]"
        style={{
          background: "linear-gradient(to right, #252540, #F3F6FB)",
        }}
      />
    </header>
  );
};

export default Header;
