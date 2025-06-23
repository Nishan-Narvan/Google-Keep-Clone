import React, { useState } from "react";
import { motion } from "framer-motion";
import { MdArchive, MdDeleteOutline } from "react-icons/md";

const NoteInput = ({ mode, setArchieved,  setTrashed }) => {
  const [notes, setNotes] = useState([]);
  // notes array
  const [title, setTitle] = useState("");
  // title state
  const [desc, setDesc] = useState("");
  // desc state

  const MotionProps = {
    whileHover: {
      scale: 1.05,
      translateY: -10,
      boxShadow: "6px 6px 0px black",
      backgroundColor: "#2F4F4F", // matching green theme
    },
    transition: { duration: 0.3 },
  };
  // How to add to the notes array using the button:
  // Check if the value in title and description  states are empty
  // a object with title and desc as properties is created
  // the notes array is updated with this new object
  // again the title and desc states are cleared
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


function archieveNote(index) {
    const noteToArchive = notes[index];
    setArchieved((prev) => [...prev, noteToArchive]);
    setNotes((prev) => prev.filter((_, i) => i !== index));
  }


  function deleteNote(index) {
    const noteToDelete = notes[index];
    setTrashed((prev) => [...prev, noteToDelete]);
    setNotes((prev) => prev.filter((_, i) => i !== index));
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
                  mode ? "bg-gray-300" : "bg-[#1e3f29]"
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

        <div className="flex items-center ml-70 py-5 ">
          <motion.button







            whileHover={{
              scale: 1.05,
              translateY: -10,
              boxShadow: "6px 6px 0px black",
              backgroundColor: "bg-[#2F4F4F]",
            }}
            whileTap={{ scale: 0.75 }}
            transition={{ duration: 0.15 }}
            className="px-4 py-2 border border-black focus:outline-none rounded-md"
            onClick={handleClick}
          >
            Add note
          </motion.button>
        </div>
      </motion.div>

      <div
        className={`cursor-pointer rounded-3xl w-180 ml-15 shadow-sm mt-3 p-1.5 ${
          mode ? "bg-[#1e3f29]" : "bg-[#4d815f]"
        }`}
      >
        <ul>
{/* How to map from the notes array to the div----> unordered list we map the notes array of objects notes.map((note,index)---arrow function to map,there is a list,  key  as index ,  and then there are two divs inside a div, with note.title and note.desc 
          array.map(callbackFunction)

Breakdown:

array: the array you want to iterate over (in this case, notes)
callbackFunction: a function that will be called for each element in the array
callbackFunction takes two arguments:
element: the current element being processed (in this case, note)
index: the index of the current element in the array (in this case, index)
          

const numbers = [1, 2, 3, 4, 5];
const doubledNumbers = numbers.map((number, index) => {
  return number * 2;
});
console.log(doubledNumbers); // [2, 4, 6, 8, 10]

          

onst notes = [
  { id: 1, title: 'Note 1' },
  { id: 2, title: 'Note 2' },
  { id: 3, title: 'Note 3' },
];

const NoteList = () => {
  return (
    <ul>
      {notes.map((note, index) => (
        <li key={index}>{note.title}</li>
      ))}
    </ul>
  );
};
          
Important:
You are correct, there is no explicit return statement in the map() callback function in this code below.

In this case, the syntax (note, index) => (...) is using a feature of JavaScript called "expression syntax" or "concise body" for arrow functions.

When you use parentheses () around the function body, it's an implicit expression that returns the value of the expression inside the parentheses
          
*/}
          {notes.map((note, index) => (
            <li
              key={index}
              className={`my-2 p-2 shadow-sm rounded-2xl ${
                mode ? "bg-[#25353a]" : "bg-[#69796ee5]"
              }`}
            >
              <motion.div
                whileHover={{
                  scale: 1.05,
                  translateY: -10,
                  boxShadow: "0px 6px 0px black",
                }}
                transition={{ duration: 0.16 }}
                className={`items-center  cursor-pointer w-173  bg-gradient-to-br from-[#74c29b] via-[#355E3B] to-[#2F4F4F]
                backdrop-blur-sm bg-opacity-50 border border-white/20
                shadow-lg shadow-[#1a2e1f]/50   rounded-2xl ${
                  mode ? "bg-[#e9ecf0]" : "bg-[#1e3f29] "
                }`}
              >
                <div className="text-3xl font-mono text-gray-800">
                  {" "}
                  • {note.title}
                </div>
                <span className="text-black ml-10">{note.desc}</span>
                <div className="ml-142 flex space-x-2">
                  <motion.button onClick={() =>archieveNote(index)}
                    {...MotionProps}
                    className="p-1 bg-transparent border-none outline-none"
                  >
                    <MdArchive className="text-lg" />
                  </motion.button>
                  <motion.button onClick={() =>deleteNote(index)}
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
skldfjsopdfj
fsdklfjsdf\f
sdkfsdlkf\
difjsdf
dfjsdf
dlfjklsdfj
dfjsdlfjdfdfdfsdfsdfsdf
fgdfgdfgdf
dklfjdf
dkfjsdf
dfkjsdlfjl