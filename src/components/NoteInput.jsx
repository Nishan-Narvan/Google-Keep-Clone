import React from "react";
import { useState } from "react";
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
      backgroundColor: "#FACC15",
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
        className={` rounded-xl cursor-pointer w-180 ml-15 shadow-sm   ${
          mode ? "bg-gray-300" : "bg-amber-300"
        }`}
      >
        <div className="ml-6">
          <textarea
            type="text"
            placeholder="Title"
            className={`text-3xl hover::border-none focus:outline-none w-full resize-none ${
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
            className="hover::border-none focus:outline-none w-full resize-none"
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
            className="px-4 py-2 "
            onClick={handleClick}
          >
            Add note
          </motion.button>
        </div>
      </motion.div>

      <div
        className={` rounded-xl cursor-pointer w-180 ml-15 shadow-sm   ${
          mode ? "bg-gray-300" : "bg-yellow-400"
        }`}
      >
        <ul>
          {notes.map((note, index) => (
            <li
              key={index}
              className="my-2 p-2 bg-amber-300 shadow-sm rounded-2xl "
            >
              <motion.div
                whileHover={{
                  scale: 1.05,
                  translateY: -10,
                  boxShadow: "0px 6px 0px black",
                }}
                transition={{ duration: 0.3 }}
                className=" bg-gray-100   items-center hover:bg-gray-200 rounded-2xl cursor-pointer shadow-sm w-full h-full"
              >
                <div className="text-3xl"> • {note.title}</div>
                <span className="text-black ml-6">{note.desc}</span>
                <div class="ml-142 flex space-x-2">
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
