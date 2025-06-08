import React, { useState } from 'react';
import { color, motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import {
  MdLightbulbOutline,
  MdTimer,
  MdLabelOutline,
  MdArchive,
  MdDeleteOutline
} from "react-icons/md";

const iconMotionProps = {
  whileHover: { scale: 1.05, translateY: -10, boxShadow: "6px 6px 0px black", backgroundColor: "#477f5f" },
  whileTap: { scale: 0.75 },
  transition: { duration: 0.15 },
   
};

const Sidebar = ({ mode, lines }) => {
  const navigate = useNavigate();
  
  function redirectTrash() {
    navigate("/trash");
  }
  
  function redirectArchive() {
    navigate("/archive");
  }
  
  function redirectNotes() {
    navigate("/");
  }

    function redirectPomodoro() {
    navigate("/Pomodoro");
  }
  
  return (
    <div className={`flex relative flex-col gap-5 pr-8 px-5 py-5 h-full ${mode ? 'bg-gray-800' : 'bg-[#bcd3c3e5]'} shadow-md border-r border-solid border-gray-300 transition-all duration-300 ease-in-out ${
      lines ? 'w-64' : 'w-26'
    } ${lines? 'pl-6':'pr-6'} `}>
      
      <div className={`flex items-center rounded-xl cursor-pointer px-4 py-3 ${lines ? 'shadow-lg border border-gray-300 ' : ''} transition-all duration-150 ease-in-out`}>
        <motion.button {...iconMotionProps} onClick={redirectNotes} className="p-1 bg-transparent border-none outline-none">
          <MdLightbulbOutline className="text-lg" />
        </motion.button>
         {lines && (
          <span className={`ml-4 hover:text-gray-600 transition-opacity duration-300 ${mode ? "text-white" : "text-black"}`}>
            Notes
          </span>
        )}
      </div>
      
      <div className={`flex items-center rounded-xl cursor-pointer px-4  py-3 ${lines ? 'shadow-lg border border-gray-300 hover:shadow' : ''} transition-all duration-150 ease-in-out`}>
        <motion.button {...iconMotionProps} onClick={redirectPomodoro} className="p-1 bg-transparent border-none outline-none">
          <MdTimer className="text-lg" />
        </motion.button>
         {lines && (
          <span className={`ml-4 hover:text-gray-600 transition-opacity duration-300 ${mode ? "text-white" : "text-black"}`}>
            Focus
          </span>
        )}
      </div>
       
      <div className={`flex items-center rounded-xl cursor-pointer px-4  py-3 ${lines ? 'shadow-lg border border-gray-300 hover:shadow' : ''} transition-all duration-150 ease-in-out`}>
        <motion.button {...iconMotionProps} className="p-1 bg-transparent border-none outline-none">
          <MdLabelOutline className="text-lg" />
        </motion.button>
         {lines && (
          <span className={`ml-4 hover:text-gray-600 transition-opacity duration-300 ${mode ? "text-white" : "text-black"}`}>
            Edit labels
          </span>
        )}
      </div>
      
      <div className={`flex items-center rounded-xl cursor-pointer px-4  py-3 ${lines ? 'shadow-lg border border-gray-300 hover:shadow' : ''} transition-all duration-150 ease-in-out`}>
        <motion.button {...iconMotionProps} onClick={redirectArchive} className="p-1 bg-transparent border-none outline-none">
          <MdArchive className="text-lg" />
        </motion.button>
         {lines && (
          <span className={`ml-4 hover:text-gray-600 transition-opacity duration-300 ${mode ? "text-white" : "text-black"}`}>
            Archive
          </span>
        )}
      </div>


       
      <div className={`flex items-center rounded-xl cursor-pointer px-4  py-3 ${lines ? 'shadow-lg border border-gray-300 hover:shadow' : ''} transition-all duration-150 ease-in-out`}>
        <motion.button {...iconMotionProps} onClick={redirectTrash} className="p-1 bg-transparent border-none outline-none">
          <MdDeleteOutline className="text-lg" />
        </motion.button>
         {lines && (
          <span className={`ml-4 hover:text-gray-600 transition-opacity duration-300 ${mode ? "text-white" : "text-black"}`}>
            Trash
          </span>
        
        
        )}

        <div className="w-full h-6 bg-gradient-to-t from-[#1e3f29] to-transparent absolute bottom-0 left-0 z-10 pointer-events-none" />
      </div>
      
    

    </div>
  );
};

export default Sidebar;