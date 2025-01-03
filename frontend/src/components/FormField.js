import React from "react";

const FormField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  required = false,
  disabled = false,
  className = "",
  inputClassName = "",
  rows,
  accept,
  options = [],
  fullWidth = false,
}) => {
  const baseInputStyles =
    "block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-text/30 rounded-md focus:border-blue3 focus:ring-blue3 focus:outline-none focus:ring focus:ring-opacity-40";

  const fileInputStyles =
    "block w-full px-5 py-3 mt-2 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue3 file:text-white hover:file:bg-blue3/80";

  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            name={name}
            value={value || ""}
            onChange={onChange}
            className={`${baseInputStyles} ${inputClassName}`}
            rows={rows || 4}
            disabled={disabled}
            required={required}
          />
        );

      case "select":
        return (
          <select
            name={name}
            value={value || ""}
            onChange={onChange}
            className={`${baseInputStyles} ${inputClassName}`}
            disabled={disabled}
            required={required}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "file":
        return (
          <input
            type="file"
            name={name}
            onChange={onChange}
            className={`${fileInputStyles} ${inputClassName}`}
            accept={accept}
            disabled={disabled}
            required={required}
          />
        );

      default:
        return (
          <input
            type={type}
            name={name}
            value={value || ""}
            onChange={onChange}
            className={`${baseInputStyles} ${inputClassName}`}
            disabled={disabled}
            required={required}
          />
        );
    }
  };

  return (
    <div className={`${fullWidth ? "col-span-2" : ""} ${className}`}>
      <label className="block mb-2 text-sm text-text">{label}</label>
      {renderInput()}
    </div>
  );
};

export default FormField;
