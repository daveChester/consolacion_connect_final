import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, LayoutDashboard, Users, FileText } from "lucide-react";

const AdminHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/admin/login");
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const getLinkClass = (path) => {
    const baseClasses =
      "flex items-center gap-2 px-4 py-2 hover:bg-base-200 rounded-lg transition-colors";
    const activeClasses = isActiveLink(path)
      ? "text-primary font-medium"
      : "text-base-content/70";
    return `${baseClasses} ${activeClasses}`;
  };

  return (
    <header className="border-b bg-base-100">
      <div className="navbar min-h-16 px-6">
        <nav className="flex-1">
          <ul className="flex space-x-2">
            <li>
              <Link
                to="/admin/dashboard"
                className={getLinkClass("/admin/dashboard")}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="text-sm">Dashboard</span>
              </Link>
            </li>

            <li>
              <Link to="/admin/users" className={getLinkClass("/admin/users")}>
                <Users className="h-4 w-4" />
                <span className="text-sm">Users</span>
              </Link>
            </li>

            <li>
              <Link
                to="/admin/content"
                className={getLinkClass("/admin/content")}
              >
                <FileText className="h-4 w-4" />
                <span className="text-sm">Content</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex-none">
          <button onClick={handleLogout} className="btn btn-ghost btn-sm gap-2">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
