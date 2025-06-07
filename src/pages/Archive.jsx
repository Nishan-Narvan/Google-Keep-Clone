import React from "react";
import { motion } from "framer-motion";
import { MdArchive, MdDeleteOutline } from "react-icons/md";
import { useState } from "react";
const Archive = ({ mode, archieved }) => {
 
 

  return (
    // mapping from the archieved array
    <div
      className={`cursor-pointer rounded-3xl w-180 ml-15 shadow-sm mt-3 p-1.5 ${
        mode ? "bg-gray-300" : "bg-teal-100"
      }`}
    >
      <ul>
        {archieved.map((note, index) => (
          <li
            key={index}
            className={`my-2 p-2 shadow-sm rounded-2xl ${
              mode ? "bg-[#252d3a]" : "bg-green-700"
            }`}
          >
            <motion.div
              whileHover={{
                scale: 1.05,
                translateY: -10,
                boxShadow: "0px 6px 0px black",
              }}
              transition={{ duration: 0.3 }}
              className={`items-center  cursor-pointer w-173  bg-gradient-to-br from-[#74c29b] via-[#355E3B] to-[#2F4F4F]
                backdrop-blur-sm bg-opacity-50 border border-white/20
                shadow-lg shadow-[#1a2e1f]/50   rounded-2xl ${
                  mode ? "bg-[#e9ecf0]" : "bg-teal-200 "
                }`}
            >
              <div className="text-3xl font-mono text-gray-800">
                {" "}
                • {archieved.title}
              </div>
              <span className="text-black ml-10">{archieved.desc}</span>
              <div className="ml-142 flex space-x-2">
                <motion.button
                  {...MotionProps}
                  className="p-1 bg-transparent border-none outline-none place-items-end"
                >
                  <MdDeleteOutline className="text-lg" />
                </motion.button>
              </div>
            </motion.div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Archive;
