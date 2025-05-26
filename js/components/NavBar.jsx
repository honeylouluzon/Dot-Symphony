import React from "react";

export default function NavBar({ onNavigate, currentPage }) {
  return (
    <nav className="navbar" aria-label="Main Navigation">
      <ul>
        <li>
          <button
            className={currentPage === "composer" ? "active" : ""}
            onClick={() => onNavigate("composer")}
            aria-current={currentPage === "composer" ? "page" : undefined}
          >
            Dot Language Composer
          </button>
        </li>
        <li>
          <button
            className={currentPage === "tracker" ? "active" : ""}
            onClick={() => onNavigate("tracker")}
            aria-current={currentPage === "tracker" ? "page" : undefined}
          >
            Mind State Tracker
          </button>
        </li>
        <li>
          <button
            className={currentPage === "music" ? "active" : ""}
            onClick={() => onNavigate("music")}
            aria-current={currentPage === "music" ? "page" : undefined}
          >
            Dot Music Composer
          </button>
        </li>
      </ul>
    </nav>
  );
}
