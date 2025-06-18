import React from "react";
import { motion } from "framer-motion";
import { MdDeleteOutline } from "react-icons/md";
import { LuArchiveRestore } from "react-icons/lu";

// Define motion properties
const iconMotionProps = {
  whileHover: { scale: 1.05, translateY: -10, boxShadow: "6px 6px 0px black"},
  whileTap: { scale: 0.75 },
  transition: { duration: 0.25 },
};

const Archive = ({ mode, archieved, onRestore, onDelete }) => {
  return (
    <div className={`flex relative flex-1 w-full h-full justify-center ${mode ? "" : ""}`}>
      <img 
        src={mode ? 
          "https://i.pinimg.com/originals/0b/e7/48/0be748204b77ec2211c3230442e468a9.gif" : 
          "https://i.pinimg.com/originals/be/63/08/be63089e483cb06b226f6976723f5e5f.gif"
        }  
        className="absolute z-0 object-cover w-full h-full"
        alt="Background"
      />
      
      <div className={`relative z-10 cursor-pointer rounded-3xl w-fit shadow-sm mt-8 p-1.5 px-4 ${
          mode ? "bg-gray-800" : "bg-[#b1d6bcc2]"
        }`}
        style={{ height: 'fit-content', minHeight: '100px' }}
      >
        <ul>
          {archieved.map((note, index) => (
            <li
              key={index}
              className={`my-2 p-2 shadow-sm rounded-2xl ${
                mode ? "bg-[#4d815f]" : "bg-[#4d815f]"
              }`}
            >
              <motion.div
                whileHover={{
                  scale: 1.05,
                  translateY: -10,
                  boxShadow: "0px 7px 0px black",
                }}
                transition={{ duration: 0.3 }}
                className={`items-center cursor-pointer w-173 bg-gradient-to-br from-[#74c29b] via-[#355E3B] to-[#2F4F4F]
                  backdrop-blur-sm bg-opacity-50 border border-white/20
                  shadow-lg shadow-[#1a2e1f]/50 rounded-2xl ${
                    mode ? "bg-[#e9ecf0]" : "bg-teal-200"
                  }`}
              >
                <div className="text-3xl font-mono text-gray-800">
                  • {note.title}
                </div>
                <span className="text-black ml-10">{note.desc}</span>
                <div className="ml-138 mb-3 mr-4 flex space-x-2">
                  {/* Restore Icon */}
                  <motion.button
                    {...iconMotionProps}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRestore && onRestore(note, index);
                    }}
                    className="p-1 bg-transparent border-none outline-none pr-3 hover:bg-green-500/20 rounded"
                    title="Restore to notes"
                  >
                    <LuArchiveRestore className="text-lg text-green-600" />
                  </motion.button>
                 
                  {/* Delete Icon */}
                  <motion.button
                    {...iconMotionProps}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete && onDelete(note, index);
                    }}
                    className="p-1 bg-transparent border-none outline-none hover:bg-red-500/20 rounded"
                    title="Delete permanently"
                  >
                    <MdDeleteOutline className="text-lg text-green-600" />
                  </motion.button>
                </div>
              </motion.div>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
};
ddddddd
export default Archive;