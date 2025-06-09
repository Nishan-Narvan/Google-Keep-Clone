import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaHourglassHalf } from "react-icons/fa";

const iconMotionProps = {
  whileHover: {
    scale: 1.05,
    translateY: -10,
    boxShadow: "6px 6px 0px black",
    backgroundColor: "#477f5f",
    focus: { outline: "none" },
  },
  whileTap: { scale: 1 },
  transition: { duration: 0.25 },
};

const Pomodoro = ({mode}) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const intervalRef = useRef(null);

  const totalSeconds = () => hours * 3600 + minutes * 60 + seconds;

  const handleToggle = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      return;
    }

    if (totalSeconds() <= 0) return;

    setIsRunning(true);
    setShowReset(true);

    intervalRef.current = setInterval(() => {
      setSeconds((prevSec) => {
        const total = totalSeconds() - 1;

        if (total <= 0) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          setShowReset(true);
          return 0;
        }

        setHours(Math.floor(total / 3600));
        setMinutes(Math.floor((total % 3600) / 60));
        return total % 60;
      });
    }, 1000);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setIsRunning(false);
    setShowReset(false);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const pauseOnInputFocus = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      setShowReset(false);
    }
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
      />

      <div className={`flex absolute ${mode ? 'bg-gray-800' : 'bg-gray-200'} items-center gap-6 justify-between left-10 px-4 py-2 bottom-42 rounded-2xl border border-solid border-black z-10`}>
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          onFocus={pauseOnInputFocus}
          className={`focus:outline-none w-20 text-center ${mode ? 'text-white' : 'text-black'}`}
          placeholder="Hrs"
        />
        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          onFocus={pauseOnInputFocus}
        className={`focus:outline-none w-20 text-center ${mode ? 'text-white' : 'text-black'}`}
          placeholder="Min"
        />
        <input
          type="number"
          value={seconds}
          onChange={(e) => setSeconds(Number(e.target.value))}
          onFocus={pauseOnInputFocus}
           className={`focus:outline-none w-20 text-center ${mode ? 'text-white' : 'text-black'}`}
          placeholder="Sec"
        />
      </div>

      {/* Buttons */}
      <div className="absolute bottom-24 left-10 flex gap-4 z-10 ">
        <motion.button
          {...iconMotionProps}
          onClick={handleToggle}
          className="px-6 py-2 ml-2 bg-white rounded-lg shadow  text-black font-semibold focus:outline-none"
        >
          {isRunning ? "Pause" : "Start"}
        </motion.button>

        {showReset && (
          <motion.button
            {...iconMotionProps}
            onClick={resetTimer}
            className="px-6 ml-4 py-2 bg-white rounded-lg shadow   text-black font-semibold focus:outline-none "
          >
            Reset
          </motion.button>
        )}
      </div>

      {/* Hourglass Icon */}
      {isRunning && (
        <FaHourglassHalf className="absolute bottom-25 hover:text-[#285639] hover:scale-130 transform transition-all duration-300 ease-in-out  left-67 ml-2 text-5xl text-gray-300 animate-pulse z-10" />
      )}
    </div>
  );
};

export default Pomodoro;
