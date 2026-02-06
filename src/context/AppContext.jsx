import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [mode, setMode] = useState(false);
  const [lines, setLines] = useState(true);
  const [bgImage, setBgImage] = useState("");
  const [focusedTimeToday, setFocusedTimeToday] = useState(0); // seconds

  const todayKey = useCallback(() => new Date().toISOString().slice(0, 10), []);

  // Load persisted focus time and reset if the stored date is not today
  useEffect(() => {
    const stored = localStorage.getItem('focusedTimeToday');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.date === todayKey()) {
          setFocusedTimeToday(Number(parsed.seconds) || 0);
          return;
        }
      } catch (_) {
        // fall through to reset
      }
    }
    localStorage.setItem('focusedTimeToday', JSON.stringify({ date: todayKey(), seconds: 0 }));
    setFocusedTimeToday(0);
  }, [todayKey]);

  const toggleMode = useCallback(() => setMode(prev => !prev), []);
  const toggleSidebar = useCallback(() => setLines(prev => !prev), []);
  const setBackground = useCallback((url) => setBgImage(url), []);
  const addFocusedTime = useCallback((seconds) => {
    const safeSeconds = Number(seconds) || 0;
    const today = todayKey();

    setFocusedTimeToday(prev => {
      let base = prev;
      // If the stored date is stale, reset before adding
      try {
        const stored = JSON.parse(localStorage.getItem('focusedTimeToday') || '{}');
        if (stored?.date !== today) base = 0;
      } catch (_) {
        base = 0;
      }

      const updated = base + safeSeconds;
      localStorage.setItem('focusedTimeToday', JSON.stringify({ date: today, seconds: updated }));
      return updated;
    });
  }, [todayKey]);

  const value = {
    mode,
    lines,
    bgImage,
    focusedTimeToday,
    setMode,
    setLines,
    toggleMode,
    toggleSidebar,
    setBackground,
    addFocusedTime,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
