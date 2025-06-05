import React from "react";
import { motion } from "framer-motion";

const Pomodoro = () => {
  const handleClick = () => {
    console.log("Button clicked");
  };

  return (
    <div className="relative flex flex-1 w-full h-full">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="https://mylivewallpapers.com/wp-content/uploads/Anime/PREVIEW-Guts-Chilling-Rain.mp4"
      ></video>

      <div className="flex absolute bg-gray-100 items-center gap-6 justify-between left-10 px-4 py-2 bottom-50 rounded-2xl border border-solid border-black p-4 z-10">
        <input type="text" className="focus:outline-none w-20" placeholder="Hrs" />
        <input type="text" className="focus:outline-none w-20" placeholder="Min" />
        <input type="text" className="focus:outline-none w-20" placeholder="Sec" />
      </div>

      <motion.button
        whileHover={{
          scale: 1.05,
          translateY: -10,
          
        }}
        whileTap={{ scale: 0.75 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-33 left-10 px-5 ml-23 py-2 bg-white shadow-lg z-10"
        onClick={handleClick}
      >
        Start Timer
      </motion.button>
    </div>
  );
};

export default Pomodoro;
