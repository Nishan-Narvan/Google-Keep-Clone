import React, { useState } from 'react';
import { color, motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { 
  MdLightbulbOutline, 
  MdOutlineNotificationsNone, 
  MdLabelOutline,
  MdArchive, 
  MdDeleteOutline
} from "react-icons/md";

const iconMotionProps = {
  whileHover: { scale: 1.05, translateY: -10,  boxShadow: "6px 6px 0px black",  backgroundColor: "#FACC15"  },
  whileTap: { scale: 0.75 },
  transition: { duration: 0.3 }
};

const Sidebar = ({ mode, setMode }) => {
  const [linespressed, setLinespressed] = useState(true);


  const navigate = useNavigate();

  function redirectTrash() {
    navigate("/trash");
  }

  function redirectArchive() {
    navigate("/archive");
  }


  return (
    <div className='flex flex-col gap-5 px-8 py-5'>
      <div className="flex items-center rounded cursor-pointer shadow-sm px-4 py-2 border border-solid border-s-black">
        <motion.button {...iconMotionProps} className="p-1 bg-transparent border-none outline-none">
          <MdLightbulbOutline className="text-lg" />
        </motion.button>
        <span className={`ml-4 hover:text-gray-600 ${mode ? "text-white" : "text-black"}`}>Notes</span>
      </div>

      <div className="flex items-center rounded cursor-pointer shadow-sm px-4 py-2 border border-solid border-s-black">
        <motion.button {...iconMotionProps} className="p-1 bg-transparent border-none outline-none">
          <MdOutlineNotificationsNone className="text-lg" />
        </motion.button>
        <span className={`ml-4 hover:text-gray-600 ${mode ? "text-white" : "text-black"}`}>Reminders</span>
      </div>

      <div className="flex items-center rounded cursor-pointer shadow-sm px-4 py-2 border border-solid border-s-black">
        <motion.button {...iconMotionProps} className="p-1 bg-transparent border-none outline-none">
          <MdLabelOutline className="text-lg" />
        </motion.button>
        <span className={`ml-4 hover:text-gray-600 ${mode ? "text-white" : "text-black"}`}>Edit labels</span>
      </div>

      <div className="flex items-center rounded cursor-pointer shadow-sm border border-solid border-s-black px-4 py-2">
        <motion.button {...iconMotionProps} onClick={redirectArchive} className="p-1 bg-transparent border-none outline-none">
          <MdArchive className="text-lg" />
        </motion.button>
        <span className={`ml-4 hover:text-gray-600 ${mode ? "text-white" : "text-black"}`}>Archive</span>
      </div>

      <div className="flex items-center rounded cursor-pointer shadow-sm border border-solid border-s-black px-4 py-2">
        <motion.button {...iconMotionProps} onClick={redirectTrash} className="p-1 bg-transparent border-none outline-none">
          <MdDeleteOutline className="text-lg" />
        </motion.button>
        <span className={`ml-4 hover:text-gray-600 ${mode ? "text-white" : "text-black"}`}>Trash</span>
      </div>
    </div>
  );
};

export default Sidebar;
