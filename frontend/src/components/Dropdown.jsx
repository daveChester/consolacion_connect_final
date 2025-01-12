import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export const Dropdown = ({
  isOpen,
  onToggle,
  label,
  items,
  className = "",
  buttonClassName = "",
}) => {
  return (
    <div className="dropdown-container relative">
      <button
        className={`transition-colors flex items-center ${buttonClassName}`}
        onClick={onToggle}
      >
        {label}
        <ChevronDown
          className={`ml-1 size-3.5 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <ul
          className={`border border-gray-300 absolute mt-2 py-1 w-36 bg-background shadow-lg rounded-md overflow-hidden z-50 ${className}`}
        >
          {items.map((item) => (
            <li key={item.path}>
              {item.onClick ? (
                <button
                  onClick={item.onClick}
                  className="w-full text-left px-4 py-2 text-sm text-text hover:bg-gold/90"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  to={item.path}
                  className="block px-4 py-2 text-sm text-text hover:bg-gold/90"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
