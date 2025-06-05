import React, { useState } from "react";
import { motion } from "framer-motion";
import { MdArchive, MdDeleteOutline } from "react-icons/md";

const NoteInput = ({ mode }) => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const MotionProps = {
    whileHover: {
      scale: 1.05,
      translateY: -10,
      boxShadow: "6px 6px 0px black",
      backgroundColor: "#2F4F4F", // matching green theme
    },
    transition: { duration: 0.3 },
  };

  function handleClick() {
    if (title.trim() === "" && desc.trim() === "") return;

    const newNote = {
      title: title.trim(),
      desc: desc.trim(),
    };

    setNotes((prev) => [...prev, newNote]);

    setTitle("");
    setDesc("");
  }

  return (
    <div className="w-230">
      <motion.div
        whileHover={{
          scale: 1.05,
          translateY: -10,
          boxShadow: "0px 6px 0px black",
        }}
        transition={{ duration: 0.3 }}
        className={`rounded-xl cursor-pointer w-180 ml-15 bg-gradient-to-br from-[#74c29b] via-[#355E3B] to-[#2F4F4F]
                backdrop-blur-sm bg-opacity-50 border border-white/20
                shadow-lg shadow-[#1a2e1f]/50 ${
          mode ? "bg-gray-300" : "bg-teal-600"
        }`}
      >
        <div className="ml-6">
          <textarea
            type="text"
            placeholder="Title"
            className={`text-3xl hover::border-none focus:outline-none w-full resize-none font-mono ${
              mode ? "text-black" : "text-black"
            }`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="ml-6">
          <textarea
            type="text"
            placeholder="Take a Note"
            className="hover::border-none focus:outline-none w-full resize-none font-mono"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        <div className="flex items-center ml-70 py-5">
          <motion.button
            whileHover={{
              scale: 1.05,
              translateY: -10,
              boxShadow: "6px 6px 0px black",
            }}
            whileTap={{ scale: 0.75 }}
            transition={{ duration: 0.3 }}
            className="px-4 py-2"
            onClick={handleClick}
           
            
          >
            Add note
          </motion.button>
        </div>
      </motion.div>

      <div
        className={`cursor-pointer rounded-3xl w-180 ml-15 shadow-sm mt-3 p-1.5 ${
          mode ? "bg-gray-300" : "bg-teal-100"
        }`}
      >
        <ul>
          {notes.map((note, index) => (
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
                <div className="text-3xl font-mono text-gray-800"> • {note.title}</div>
                <span className="text-black ml-10">{note.desc}</span>
                <div className="ml-142 flex space-x-2">
                  <motion.button
                    {...MotionProps}
                    className="p-1 bg-transparent border-none outline-none"
                  >
                    <MdArchive className="text-lg" />
                  </motion.button>
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
    </div>
  );
};

export default NoteInput;
