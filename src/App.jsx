import ReactDOM from "react-dom/client";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Pomodoro from "./pages/Pomodoro";
import Archive from "./pages/Archive";
import Trash from "./pages/Trash";
import NoPage from "./pages/NoPage";
import Search from "./pages/Search";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

export default function App() {
  const [mode, setMode] = useState(false);
  const [lines, setLines] = useState(true);

  const [notes, setNotes] = useState([]);
  const [trashed, setTrashed] = useState([]);
  const [archieved, setArchieved] = useState([]);

  const handleRestoreFromArchive = (note, index) => {
    setArchieved((prev) => prev.filter((_, i) => i !== index));
    setNotes((prev) => [...prev, note]);
  };

  const handleDeleteFromArchive = (note, index) => {
    setArchieved((prev) => prev.filter((_, i) => i !== index));
    setTrashed((prev) => [...prev, note]);
  };

  const handleRestoreFromTrash = (note, index) => {
    setTrashed((prev) => prev.filter((_, i) => i !== index));
    setNotes((prev) => [...prev, note]);
  };

  const handleDeletePermanentlyFromTrash = (_note, index) => {
    setTrashed((prev) => prev.filter((_, i) => i !== index));
  };

  const AppShell = () => {
    const location = useLocation();
    const hideChrome = location.pathname === "/login" || location.pathname === "/signup";

    return (
      <>
        {!hideChrome && (
          <header
            className={`fixed inset-x-0 top-0 z-50 h-16 border-b ${
              mode ? "bg-gray-200 border-gray-300" : "bg-gray-100 border-gray-200"
            } transition-colors`}
          >
            <Navbar mode={mode} setMode={setMode} lines={lines} setLines={setLines} />
          </header>
        )}

        <main className={`${hideChrome ? "min-h-screen" : "pt-16 min-h-screen"}`}>
          <div
            className={`${hideChrome ? "h-screen" : "min-h-[calc(100vh-4rem)]"} mx-auto grid transition-[grid-template-columns] duration-300 ease-in-out`}
            style={{
              // Open: 16rem, Closed: 5.5rem (thicker and more aesthetic)
              gridTemplateColumns: !hideChrome ? (lines ? "16rem 1fr" : "6rem 1fr") : "1fr",
            }}
          >
            {!hideChrome && (
              <aside className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto bg-transparent">
                <Sidebar mode={mode} lines={lines} />
              </aside>
            )}

            <section className="relative min-w-0 overflow-y-auto">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/"
                  element={
                    <Home
                      mode={mode}
                      notes={notes}
                      setNotes={setNotes}
                      setArchieved={setArchieved}
                      setTrashed={setTrashed}
                    />
                  }
                />
                <Route path="/pomodoro" element={<Pomodoro mode={mode} />} />
                <Route
                  path="/archive"
                  element={
                    <Archive
                      mode={mode}
                      archieved={archieved}
                      onRestore={handleRestoreFromArchive}
                      onDelete={handleDeleteFromArchive}
                    />
                  }
                />
                <Route
                  path="/trash"
                  element={
                    <Trash
                      trashed={trashed}
                      mode={mode}
                      onRestore={handleRestoreFromTrash}
                      onDeletePermanently={handleDeletePermanentlyFromTrash}
                    />
                  }
                />
                <Route path="/search" element={<Search />} />
                <Route path="*" element={<NoPage />} />
              </Routes>
            </section>
          </div>
        </main>
      </>
    );
  };

  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

