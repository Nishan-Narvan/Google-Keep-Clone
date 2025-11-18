import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import {
  MdLightbulbOutline,
  MdTimer,
  MdArchive,
  MdDeleteOutline
} from "react-icons/md";

const Sidebar = ({ mode, lines }) => {
  const navigate = useNavigate();
  const collapsed = !lines;

  const items = [
    { label: "Notes", icon: MdLightbulbOutline, to: "/" },
    { label: "Focus", icon: MdTimer, to: "/pomodoro" },
    { label: "Archive", icon: MdArchive, to: "/archive" },
    { label: "Trash", icon: MdDeleteOutline, to: "/trash" },
  ];

  const baseText = mode ? "text-white" : "text-black";
  const panelBg = mode ? "bg-gray-800" : "bg-[#bcd3c3e5]";

  function handleActivate(path) {
    navigate(path);
  }

  function keyActivate(e, path) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleActivate(path);
    }
  }

  return (
    <div
      className={`relative h-full w-full ${panelBg} transition-all duration-300 ease-in-out
        ${collapsed ? "px-2 py-4" : "px-5 py-5"}`}
    >
      <nav className={`flex flex-col ${collapsed ? "gap-2" : "gap-4"}`}>
        {items.map(({ label, icon: Icon, to }) => (
          <motion.div
            key={label}
            whileHover={{ scale: collapsed ? 1.06 : 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleActivate(to)}
            onKeyDown={(e) => keyActivate(e, to)}
            role="button"
            tabIndex={0}
            className={`group rounded-xl cursor-pointer select-none transition-colors duration-200
              ${collapsed
                ? "flex items-center justify-center h-14"
                : "flex items-center px-4 h-14 shadow-lg"
              }
              ${mode ? "hover:bg-gray-700/70" : "hover:bg-green-200/70"}
            `}
          >
            <div
              className={`flex items-center justify-center rounded-2xl transition-all duration-200
                ${collapsed ? "h-12 w-12" : "h-11 w-11 mr-4"}
                ${mode ? "bg-gray-900/40 group-hover:bg-gray-900/70" : "bg-white/60 group-hover:bg-white"}
                group-hover:shadow-md group-hover:scale-105
              `}
            >
              <Icon
                className={`${collapsed ? "text-2xl" : "text-xl"} ${baseText} transition-colors duration-200 group-hover:text-red-500`}
              />
            </div>
            {lines && (
              <span className={`font-medium ${baseText} transition-colors duration-200 group-hover:text-red-600`}>
                {label}
              </span>
            )}
          </motion.div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;