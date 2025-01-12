import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { AuthContext } from "../AuthContext";
import { Dropdown } from "./Dropdown";

const Header = () => {
  const location = useLocation();
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setIsConnectOpen(false);
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleConnectClick = () => {
    setIsConnectOpen(!isConnectOpen);
    setIsProfileOpen(false);
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsConnectOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path
      ? "text-gold font-medium"
      : "hover:text-gold";
  };

  const connectSubmenu = [
    { path: "/events", label: "Events" },
    { path: "/journeys", label: "Journeys" },
  ];

  const profileSubmenu = [{ path: "/profile", label: "View Profile" }];

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
      {isAuthenticated ? (
        <>
          <li>
            <Link
              to="/home"
              className={`${isActive("/home")} transition-colors`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/alumni-directory"
              className={`${isActive("/alumni-directory")} transition-colors`}
            >
              Alumni Directory
            </Link>
          </li>
          <li>
            <Link
              to="/news"
              className={`${isActive("/news")} transition-colors`}
            >
              News
            </Link>
          </li>
          <li>
            <Dropdown
              isOpen={isConnectOpen}
              onToggle={handleConnectClick}
              label="Connect"
              items={connectSubmenu}
              buttonClassName={isActive("/connect")}
              className="left-1/2 -translate-x-1/2"
            />
          </li>
          <li>
            <Link
              to="/give-back"
              className={`${isActive("/give-back")} transition-colors`}
            >
              Give Back
            </Link>
          </li>
        </>
      ) : null}
    </ul>
  );

  return (
    <header className="bg-background h-[60px] flex items-center justify-between sticky top-0 z-40">
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
            <div className="ml-6">
              <Dropdown
                isOpen={isProfileOpen}
                onToggle={handleProfileClick}
                label={
                  <div className="flex items-center space-x-2">
                    <User size={20} />
                    <span>Profile</span>
                  </div>
                }
                items={[
                  ...profileSubmenu,
                  { path: "#", label: "Log out", onClick: handleLogout },
                ]}
                buttonClassName="text-text hover:text-gold transition-colors"
                className="right-0"
              />
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
        <div className="absolute top-[60px] left-0 w-full bg-background shadow-lg rounded-md z-45">
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
