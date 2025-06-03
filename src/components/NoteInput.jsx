import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";

const NoteInput = () => {
  
  const [notes, setNotes] = useState([]);
  const [title,setTitle] = useState("");
  const [desc,setDesc] = useState("");



  function handleClick(){


   if (title.trim()=== "" && desc.trim()==="" ) return ;

   const newNote ={
    title: title.trim(),
    desc: desc.trim(),
   }

    setNotes(prev=>[...prev,newNote]);

    setTitle("");
    setDesc("");
  }

  return (
    <div>
      
    <div className="hover:bg-gray-200 rounded-xl cursor-pointer w-180 ml-15 shadow-sm ">
      <div className="ml-6">
        <textarea 
          type="text" 
          placeholder="Title" 
          className="text-3xl hover::border-none focus:outline-none w-full resize-none"
          value={title} onChange={(e)=>setTitle(e.target.value)}
        />
      </div>
      
      <div className="ml-6">
        <textarea 
          type="text" 
          placeholder="Take a Note" 
          className="hover::border-none focus:outline-none w-full resize-none" 
          value={desc}
          onChange={(e)=>setDesc(e.target.value)}
        />
      </div>

      <div className="flex items-center ml-70 py-5">
        <motion.button 
          whileHover={{ scale: 1.05,  translateY: -10, boxShadow: "6px 6px 0px black" }}
          whileTap={{ scale: 0.75, }}
          transition={{ duration: 0.3 }}
          className="px-4 py-2 " onClick={handleClick}
        >
          Add note
        </motion.button>
      </div>




    </div>
    
      <div className="bg-amber-300">
        
        <ul>
          {notes.map((note, index) => (
            <li key={index} className="my-2 p-2 bg-white rounded shadow-sm">
              
              <div className=" hover:bg-gray-200 rounded-xl cursor-pointer w-180 ml-15 shadow-sm">
                <h1>{note.title}</h1>
                <span>{note.desc}</span>
               </div>
            </li>
          ))}
        </ul>
      </div>

    </div>

  );
};

export default NoteInput;