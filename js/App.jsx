import React, { useState } from "react";
import MainLayout from "./layouts/MainLayout.jsx";
import NavBar from "./components/NavBar.jsx";
import DotLanguageComposer from "./pages/DotLanguageComposer.jsx";
import MindStateTracker from "./pages/MindStateTracker.jsx";
import DotMusicComposer from "./pages/DotMusicComposer.jsx";

export default function App() {
  const [page, setPage] = useState("composer");

  let content;
  if (page === "composer") content = <DotLanguageComposer />;
  else if (page === "tracker") content = <MindStateTracker />;
  else if (page === "music") content = <DotMusicComposer />;

  return (
    <MainLayout>
      <NavBar onNavigate={setPage} currentPage={page} />
      {content}
    </MainLayout>
  );
}