import ReactDOM from "react-dom/client";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Pomodoro from "./pages/Pomodoro";
import Archive from "./pages/Archive";
import Trash from "./pages/Trash";
import NoPage from "./pages/Nopage";
import Search from "./pages/Search";

export default function App() {
  const [mode, setMode] = useState(false);
  const [lines, setLines] = useState(true);
  
  const [notes, setNotes] = useState([]);
  const [trashed, setTrashed] = useState([]);
  const [archieved, setArchieved] = useState([]);
  const [archievedtitle, setArchievedtitle] = useState([]);
  const [archieveddesc, setArchieveddesc] = useState([]);

  // Function to restore archived note back to main notes
  const handleRestoreFromArchive = (note, index) => {
    // Remove from archived
    setArchieved((prev) => prev.filter((_, i) => i !== index));
    // Add back to main notes
    setNotes((prev) => [...prev, note]);
  };

  // Function to move archived note to trash
  const handleDeleteFromArchive = (note, index) => {
    // Remove from archived
    setArchieved((prev) => prev.filter((_, i) => i !== index));
    // Add to trash
    setTrashed((prev) => [...prev, note]);
  };

  // Function to restore note from trash back to main notes
  const handleRestoreFromTrash = (note, index) => {
    // Remove from trash
    setTrashed((prev) => prev.filter((_, i) => i !== index));
    // Add back to main notes
    setNotes((prev) => [...prev, note]);
  };

  // Function to delete note permanently from trash
  const handleDeletePermanentlyFromTrash = (note, index) => {
    // Remove from trash permanently
    setTrashed((prev) => prev.filter((_, i) => i !== index));
    // Note is permanently deleted, no need to add anywhere
  };

  return (
    <BrowserRouter>
      <div
        className={`z-50 b-2 fixed top-0 left-0 right-0  h-16 w-full max-h-screen ${
          mode ? "bg-gray-200" : "light bg-gray-100"
        } transition-colors duration-300`}
      >
        <Navbar
          mode={mode}
          setMode={setMode}
          lines={lines}
          setLines={setLines}
        />

        <div className=" z-40 b-2 flex  flex-row h-[calc(100vh-4rem)]">
          <Sidebar mode={mode} lines={lines} />

          <div />
          <div className="relative "/>
          <Routes>
            <Route path="/" element={<Home mode={mode} notes={notes} setNotes={setNotes} setArchieved={setArchieved} setTrashed={setTrashed} />} />
            <Route path="/pomodoro" element={<Pomodoro mode={mode} />} />
            <Route path="/archive" element={<Archive mode={mode} archieved={archieved} onRestore={handleRestoreFromArchive} onDelete={handleDeleteFromArchive} />} />
            <Route path="/trash" element={<Trash trashed={trashed} mode={mode} onRestore={handleRestoreFromTrash} onDeletePermanently={handleDeletePermanentlyFromTrash} />} />
            <Route path="/search" element={<Search />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
            <div className="w-full h-5 bg-gradient-to-t from-[#255335] to-transparent absolute bottom-0 left-0 z-10 pointer-events-none" />
  </div>
        </div>
    
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
