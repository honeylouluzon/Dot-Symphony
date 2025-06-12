import React from "react";
import NavBar from "../components/NavBar.jsx";

export default function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <header>
        <h1>Dot Symphony</h1>
      </header>
      <NavBar />
      <main>{children}</main>
      <footer>
        <small>© 2025 Dot Symphony</small>
      </footer>
    </div>
  );
}
