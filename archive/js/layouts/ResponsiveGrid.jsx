import React from "react";

export default function ResponsiveGrid({ children, columns = 2, className = "" }) {
  return (
    <div
      className={`ds-grid ${className}`}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "1rem",
      }}
    >
      {children}
    </div>
  );
}
