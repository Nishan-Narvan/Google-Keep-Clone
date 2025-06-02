import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";

const NoteInput = () => {
  const [notes, setNotes] = useState([]);
  const [title,setTitle] = useState("");
  const [desc,setDesc] = useState("");

  return (
    <div className="hover:bg-gray-200 rounded-xl cursor-pointer w-180 ml-15 shadow-sm ">
      <div className="ml-6">
        <textarea 
          type="text" 
          placeholder="Title" 
          className="text-3xl hover::border-none focus:outline-none w-full resize-none" onChange={(e)=>setTitle(e.target.value)}
        />
      </div>
      
      <div className="ml-6">
        <textarea 
          type="text" 
          placeholder="Take a Note" 
          className="hover::border-none focus:outline-none w-full resize-none" onChange={(e)=>setDesc(e.target.value)}
        />
      </div>

      <div className="flex items-center ml-70 py-5">
        <motion.button 
          whileHover={{ scale: 1.05,  translateY: -10, boxShadow: "6px 6px 0px black" }}
          whileTap={{ scale: 0.75, }}
          transition={{ duration: 0.3 }}
          className="px-4 py-2 "
        >
          Add note
        </motion.button>
      </div>
    </div>
  );
};

export default NoteInput;