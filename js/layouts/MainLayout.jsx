import React from "react";

export default function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <header>
        <h1>Dot Symphony</h1>
        {/* Navigation will go here */}
      </header>
      <main>{children}</main>
      <footer>
        <small>© 2025 Dot Symphony</small>
      </footer>
    </div>
  );
}
