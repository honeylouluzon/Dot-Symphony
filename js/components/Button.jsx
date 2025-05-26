import React from "react";

export default function Button({ children, onClick, type = "button", className = "", ...props }) {
  return (
    <button
      type={type}
      className={`ds-btn ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
