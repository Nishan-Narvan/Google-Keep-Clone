import React, { useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { MdLightbulbOutline, MdTimer, MdArchive, MdDeleteOutline, MdAccountCircle } from "react-icons/md";
import { useAppContext } from "../context/AppContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { mode, lines, focusedTimeToday } = useAppContext();
  const collapsed = !lines;

  const formatFocusedTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const SIDEBAR_ITEMS = useMemo(
    () => [
      { label: "Notes", icon: MdLightbulbOutline, to: "/" },
      { label: "Focus", icon: MdTimer, to: "/pomodoro" },
      { label: "Archive", icon: MdArchive, to: "/archive" },
      { label: "Trash", icon: MdDeleteOutline, to: "/trash" },
    ],
    []
  );

  const panelBg = useMemo(() => mode ? "bg-gray-800" : "bg-[#bcd3c3e5]", [mode]);
  const baseText = useMemo(() => mode ? "text-white" : "text-black", [mode]);
  const buttonBg = useMemo(() => mode ? "bg-gray-900/40 group-hover:bg-gray-900/70" : "bg-white/60 group-hover:bg-white", [mode]);
  const bottomButtonClass = useMemo(() => collapsed ? "h-16 w-16 flex-none" : "h-16 flex-1", [collapsed]);

  const bottomInnerBoxSize = useMemo(() => ({
    height: collapsed ? "3.5rem" : "2.5rem",
    width: collapsed ? "3.5rem" : "2.5rem",
    marginRight: collapsed ? "0rem" : "1rem",
  }), [collapsed]);

  const handleNavigate = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  const handleKeyDown = useCallback((e, path) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNavigate(path);
    }
  }, [handleNavigate]);

  return (
    <motion.div
      className={`relative h-full w-full ${panelBg} transition-all duration-300 ease-in-out ${
        collapsed ? "px-2 py-4" : "px-5 py-5"
      } flex flex-col`}
    >
      <nav className={`flex flex-col ${collapsed ? "gap-2" : "gap-4"} flex-1`}>
        {SIDEBAR_ITEMS.map(({ label, icon: Icon, to }) => (
          <motion.button
            key={label}
            type="button"
            whileHover={{ scale: collapsed ? 1.06 : 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigate(to)}
            onKeyDown={(e) => handleKeyDown(e, to)}
            className={`group rounded-xl cursor-pointer select-none transition-colors duration-200
              ${collapsed ? "flex items-center justify-center h-14" : "flex items-center px-4 h-14 shadow-lg"}
              ${mode ? "hover:bg-gray-700/70" : "hover:bg-green-200/70"}
            `}
          >
            <motion.div
              className={`flex items-center justify-center rounded-2xl transition-all
                ${buttonBg}
                group-hover:shadow-md
              `}
              animate={{
                height: collapsed ? "2.75rem" : "2.5rem",
                width: collapsed ? "2.75rem" : "2.5rem",
                marginRight: collapsed ? "0rem" : "1rem",
              }}
            >
              <Icon className={`${collapsed ? "text-2xl" : "text-xl"} ${baseText}`} />
            </motion.div>

            {!collapsed && (
              <span className={`font-medium ${baseText}`}>{label}</span>
            )}
          </motion.button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="flex flex-col gap-4 pt-2 pb-4 min-h-[7.5rem]">

        {/* Focus Box */}
        <motion.div
          whileHover={{ scale: collapsed ? 1.06 : 1.02 }}
          whileTap={{ scale: 0.95 }}
          className={`group rounded-xl cursor-default select-none transition-colors duration-200
            ${collapsed ? "flex items-center justify-center h-16 w-16" : "flex items-center px-4 h-16 shadow-lg"}
            ${mode ? "hover:bg-gray-700/70" : "hover:bg-green-200/70"}
          `}
        >
          <motion.div
            className={`flex flex-col items-center justify-center rounded-2xl transition-all ${buttonBg} group-hover:shadow-md`}
            animate={bottomInnerBoxSize}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className={`text-[0.85rem] font-semibold ${baseText}`}>F</div>
            <div className={`text-[0.85rem]  font-bold ${mode ? "text-green-400" : "text-green-700"}`}>
              {formatFocusedTime(focusedTimeToday)}
            </div>
          </motion.div>

          {!collapsed && (
            <div className="ml-2 flex flex-col justify-center">
              <div className={`text-sm font-medium ${baseText}`}>Focus</div>
              <div className={`text-sm  font-bold ${mode ? "text-green-400" : "text-green-700"}`}>
                {formatFocusedTime(focusedTimeToday)}
              </div>
            </div>
          )}
        </motion.div>

        {/* ✅ Profile Button – now height-matched */}
        <motion.button
          type="button"
          whileHover={{ scale: collapsed ? 1.06 : 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavigate('/profile')}
          onKeyDown={(e) => handleKeyDown(e, '/profile')}
          className={`group rounded-xl cursor-pointer select-none transition-colors duration-200
            ${collapsed ? "flex items-center justify-center h-16 w-16" : "flex items-center px-4 h-16 shadow-lg"}
            ${mode ? "hover:bg-gray-700/70" : "hover:bg-green-200/70"}
          `}
        >
          <motion.div
            className={`flex items-center justify-center rounded-2xl transition-all ${buttonBg} group-hover:shadow-md`}
            animate={bottomInnerBoxSize}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <MdAccountCircle className={`${collapsed ? "text-3xl" : "text-xl"} ${baseText}`} />
          </motion.div>

          {!collapsed && (
            <span className={`ml-2 font-medium ${baseText}`}>Profile</span>
          )}
        </motion.button>

      </div>
    </motion.div>
  );
};

export default Sidebar;
