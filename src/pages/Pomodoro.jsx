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

// Circular Progress Clock Component
const ProgressClock = ({ totalTime, remainingTime, mode }) => {
  const radius = 150;
  const strokeWidth = 16;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  // Calculate progress percentage
  const progress = totalTime > 0 ? (remainingTime / totalTime) : 0;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress * circumference);

  // Format time display
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center mb-6"
    >
      <div className="relative">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            stroke={mode ? "#9ca3af" : "#c2d6c8"}
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <circle
            stroke="#285639"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        
        {/* Time display in center - Digital flip-clock style */}
        <div className={`absolute inset-0 flex items-center justify-center ${mode ? 'text-gray-800' : 'text-[#285639]'} font-bold text-3xl tracking-[0.2em]`} style={{ fontFamily: 'monospace', textShadow: '0 0 10px rgba(0,0,0,0.3)' }}>
          {formatTime(remainingTime)}
        </div>
      </div>
    </motion.div>
  );
};

const Pomodoro = ({mode}) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [initialTotalTime, setInitialTotalTime] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);

  const intervalRef = useRef(null);

  const totalSeconds = () => hours * 3600 + minutes * 60 + seconds;

  const handleToggle = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      return;
    }

    if (totalSeconds() <= 0) return;

    // Store initial time when starting
    if (!showReset) {
      const total = totalSeconds();
      setInitialTotalTime(total);
      setRemainingTime(total);
    }

    setIsRunning(true);
    setShowReset(true);

    intervalRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = prev - 1;
        
        if (newTime <= 0) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          setShowReset(true);
          
          // Show completion alert and update completed sessions
          const completedMinutes = Math.round(initialTotalTime / 60);
          setCompletedSessions(prev => prev + 1);
          alert(`🎉 Congratulations! You have completed ${completedMinutes} minutes of flow!`);
          
          // Reset inputs to zero
          setTimeout(() => {
            setHours(0);
            setMinutes(0);
            setSeconds(0);
            setShowReset(false);
            setInitialTotalTime(0);
            setRemainingTime(0);
          }, 100);
          
          return 0;
        }

        // Update the input fields to reflect remaining time
        const newHours = Math.floor(newTime / 3600);
        const newMinutes = Math.floor((newTime % 3600) / 60);
        const newSeconds = newTime % 60;

        setHours(newHours);
        setMinutes(newMinutes);
        setSeconds(newSeconds);

        return newTime;
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
    setInitialTotalTime(0);
    setRemainingTime(0);
  };

  const resetAllSessions = () => {
    setCompletedSessions(0);
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
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="https://mylivewallpapers.com/wp-content/uploads/Anime/PREVIEW-Guts-Chilling-Rain.mp4"
      />

      {/* Progress Clock - shown when timer is running or paused */}
      {(isRunning || showReset) && initialTotalTime > 0 && (
        <div className="absolute bottom-59 left-56 transform -translate-x-1/2 z-10">
          <ProgressClock 
            totalTime={initialTotalTime}
            remainingTime={remainingTime}
            mode={mode}
          />
        </div>
      )}

      {/* Timer Input Controls - Hidden when timer is running */}
      {!isRunning && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className={`flex absolute ${mode ? 'bg-gray-800' : 'bg-[#d3ecdbd7]'} items-center gap-4 justify-between left-10 px-3 py-1 ${showReset ? 'bottom-48' : 'bottom-51'} rounded-2xl border border-b-emerald-800  z-10`}
        >
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            onFocus={pauseOnInputFocus}
            className={`focus:outline-none w-16 text-center bg-transparent font-bold text-2xl tracking-[0.15em] ${mode ? 'text-white' : 'text-black'}`}
            style={{ fontFamily: 'monospace', textShadow: '0 0 8px rgba(0,0,0,0.2)' }}
            placeholder="00"
            min="0"
            max="23"
          />
          <span className={`font-bold text-2xl tracking-[0.15em] ${mode ? 'text-white' : 'text-black'}`} style={{ fontFamily: 'monospace', textShadow: '0 0 8px rgba(0,0,0,0.2)' }}>:</span>
          <input
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            onFocus={pauseOnInputFocus}
            className={`focus:outline-none w-16 text-center bg-transparent font-bold text-2xl tracking-[0.15em] ${mode ? 'text-white' : 'text-black'}`}
            style={{ fontFamily: 'monospace', textShadow: '0 0 8px rgba(0,0,0,0.2)' }}
            placeholder="00"
            min="0"
            max="59"
          />
          <span className={`font-bold text-2xl tracking-[0.15em] ${mode ? 'text-white' : 'text-black'}`} style={{ fontFamily: 'monospace', textShadow: '0 0 8px rgba(0,0,0,0.2)' }}>:</span>
          <input
            type="number"
            value={seconds}
            onChange={(e) => setSeconds(Number(e.target.value))}
            onFocus={pauseOnInputFocus}
            className={`focus:outline-none w-16 text-center bg-transparent font-bold text-2xl tracking-[0.15em] ${mode ? 'text-white' : 'text-black'}`}
            style={{ fontFamily: 'monospace', textShadow: '0 0 8px rgba(0,0,0,0.2)' }}
            placeholder="00"
            min="0"
            max="59"
          />
        </motion.div>
      )}

      {/* Control Buttons */}
      <div className="absolute left-36 bottom-32 flex gap-4 z-10">
        <motion.button
          {...iconMotionProps}
          onClick={handleToggle}
          className={`px-3 py-2 bg-white rounded-lg shadow font-semibold focus:outline-none ${mode ? 'text-white bg-gray-700' : 'text-white'}`}
        >
          {isRunning ? "Pause" : "Start"}
        </motion.button>

        {showReset && (
          <motion.button
            {...iconMotionProps}
            onClick={resetTimer}
            className={`px-6 py-2 rounded-lg shadow font-semibold focus:outline-none ${mode ? 'text-white bg-gray-700' : 'text-white'}`}
          >
            Reset
          </motion.button>
        )}
      </div>

      {/* Hourglass Icon */}
      {isRunning && (
        <FaHourglassHalf className="absolute bottom-82 left-53 hover:text-[#285639] hover:scale-130 transition-all duration-400 ease-in-out text-3xl text-gray-200 animate-pulse z-10" />
      )}
    </div>
  );
};

export default Pomodoro;