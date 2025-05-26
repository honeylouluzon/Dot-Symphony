import React from "react";

export default function InputField({ label, value, onChange, type = "text", placeholder = "", required = false, ...props }) {
  return (
    <label className="ds-input-label">
      {label && <span>{label}</span>}
      <input
        className="ds-input"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        {...props}
      />
    </label>
  );
}
