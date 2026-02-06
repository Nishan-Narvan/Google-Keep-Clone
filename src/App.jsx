import React, { useMemo } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AppProvider, useAppContext } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Pomodoro from "./pages/Pomodoro";
import Archive from "./pages/Archive";
import Trash from "./pages/Trash";
import NoPage from "./pages/NoPage";
import Search from "./pages/Search";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import OAuthCallback from "./pages/OAuthCallback";
import Profile from "./pages/Profile";

// AppShell component to use context
const AppShell = () => {
  const location = useLocation();
  const { mode, lines, bgImage } = useAppContext();
  
  const isAuthPage = useMemo(
    () => location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/auth/callback",
    [location.pathname]
  );

  const gridTemplateColumns = useMemo(
    () => (!isAuthPage ? (lines ? "16rem 1fr" : "6rem 1fr") : "1fr"),
    [isAuthPage, lines]
  );

  return (
    <>
      {!isAuthPage && (
        <header
          className={`fixed inset-x-0 top-0 z-50 h-16 border-b ${
            mode ? "bg-gray-200 border-gray-300" : "bg-gray-100 border-gray-200"
          } transition-colors`}
        >
          <Navbar />
        </header>
      )}

      <main className={`${isAuthPage ? "min-h-screen" : "pt-16 min-h-screen"}`}>
        <div
          className={`${isAuthPage ? "h-screen" : "min-h-[calc(100vh-4rem)]"} mx-auto grid`}
          style={{
            gridTemplateColumns,
            transition: "grid-template-columns 300ms ease-in-out",
          }}
        >
          {!isAuthPage && (
            <aside className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto bg-transparent">
              <Sidebar />
            </aside>
          )}

          <section
            className="relative min-w-0 overflow-y-auto"
            style={{
              backgroundImage: bgImage ? `url('${bgImage}')` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed"
            }}
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/auth/callback" element={<OAuthCallback />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pomodoro"
                element={
                  <ProtectedRoute>
                    <Pomodoro />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/archive"
                element={
                  <ProtectedRoute>
                    <Archive />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trash"
                element={
                  <ProtectedRoute>
                    <Trash />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <Search />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NoPage />} />
            </Routes>
          </section>
        </div>
      </main>
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AppProvider>
  );
}

