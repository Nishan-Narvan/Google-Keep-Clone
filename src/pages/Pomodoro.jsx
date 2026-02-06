import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaHourglassHalf } from "react-icons/fa";
import { useAppContext } from "../context/AppContext";

const iconMotionProps = {
  whileHover: {
    scale: 1.05,
    translateY: -10,
    boxShadow: "0px 6px 0px black",
    backgroundColor: "#477f5f",
  },
  whileTap: { scale: 1 },
  transition: { duration: 0.25 },
};

// Circular Progress Clock Component
const ProgressClock = ({ totalTime, remainingTime, mode }) => {
  const radius = 250;
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
            stroke="#5a5a5a" /* muted steel for background ring */
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <circle
            stroke="#1f1f1f" /* deep charcoal for progress arc */
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
  const { addFocusedTime } = useAppContext();
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [initialTotalTime, setInitialTotalTime] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isBerserkPlaying, setIsBerserkPlaying] = useState(false);

  const intervalRef = useRef(null);
  const berserkAudioRef = useRef(null);
  const initialTotalTimeRef = useRef(0);
  const completionRef = useRef(false);

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
      initialTotalTimeRef.current = total;
      setInitialTotalTime(total);
      setRemainingTime(total);
    } else if (initialTotalTimeRef.current === 0) {
      // Safety: ensure ref mirrors state when resuming after a pause
      const total = initialTotalTime || totalSeconds();
      initialTotalTimeRef.current = total;
    }

    completionRef.current = false;

    setIsRunning(true);
    setShowReset(true);

    intervalRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = prev - 1;
        
        if (newTime <= 0) {
          if (completionRef.current) return 0;
          completionRef.current = true;
          clearInterval(intervalRef.current);
          setIsRunning(false);
          setShowReset(true);
          
          // Show completion alert and update completed sessions
          const completedMinutes = Math.max(1, Math.round(initialTotalTimeRef.current / 60));
          setCompletedSessions(prev => prev + 1);
          
          // Add focused time to context
          addFocusedTime(initialTotalTimeRef.current);
          
          alert(`🎉 Congratulations! You have completed the timer!`);
          
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
    initialTotalTimeRef.current = 0;
    completionRef.current = false;
  };

  const resetAllSessions = () => {
    setCompletedSessions(0);
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      if (berserkAudioRef.current) {
        berserkAudioRef.current.pause();
        berserkAudioRef.current.src = "";
      }
    };
  }, []);

  const toggleBerserkTheme = () => {
    // If audio is already initialized, just toggle play/pause
    if (berserkAudioRef.current) {
      const audio = berserkAudioRef.current;
      
      if (isBerserkPlaying) {
        audio.pause();
        audio.currentTime = 0;
        setIsBerserkPlaying(false);
      } else {
        audio.currentTime = 0;
        audio.play().then(() => {
          console.log("Audio playing");
          setIsBerserkPlaying(true);
        }).catch(err => {
          console.error("Audio play failed:", err);
          alert(`Audio error: ${err.message}`);
          setIsBerserkPlaying(false);
        });
      }
      return;
    }

    // First time - create audio instance
    const newAudio = new Audio("/src/public/assets/audio/guts theme [slowed to perfection+soft rain].mp3");
    newAudio.loop = true;
    newAudio.volume = 0.7;
    newAudio.preload = 'auto';
    
    berserkAudioRef.current = newAudio;
    
    newAudio.play().then(() => {
      console.log("Audio loaded and playing");
      setIsBerserkPlaying(true);
    }).catch(err => {
      console.error("Failed to load/play audio:", err);
      alert(`Audio error: ${err.message}`);
      setIsBerserkPlaying(false);
    });
  };

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
          className={`flex absolute ${mode ? 'bg-gray-800' : 'bg-[#f7fbf8d7]'} items-center gap-6  justify-between left-10 px-4 py-2 ${showReset ? 'bottom-48' : 'bottom-51'} rounded-2xl border-r border-l border-b border-[#a8a89a] z-10`}
        >
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            onFocus={pauseOnInputFocus}
            className={`focus:outline-none w-20 text-center rounded-md bg-transparent font-bold text-3xl tracking-[0.15em] transition-colors hover:bg-[#AABDB0] cursor-pointer ${mode ? 'text-white' : 'text-black'}`}
            style={{ fontFamily: 'monospace', textShadow: '0 0 8px rgba(0,0,0,0.2)', paddingRight: '0.5rem' }}
            placeholder="00"
            min="0"
            max="23"
          />
          <span className={`font-bold text-3xl tracking-[0.15em] ${mode ? 'text-white' : 'text-black'}`} style={{ fontFamily: 'monospace', textShadow: '0 0 8px rgba(0,0,0,0.2)' }}>:</span>
          <input
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            onFocus={pauseOnInputFocus}
            className={`focus:outline-none w-20 text-center rounded-md bg-transparent font-bold text-3xl tracking-[0.15em] transition-colors hover:bg-[#AABDB0] cursor-pointer ${mode ? 'text-white' : 'text-black'}`}
            style={{ fontFamily: 'monospace', textShadow: '0 0 8px rgba(0,0,0,0.2)', paddingRight: '0.5rem' }}
            placeholder="00"
            min="0"
            max="59"
          />
          <span className={`font-bold text-3xl tracking-[0.15em] ${mode ? 'text-white' : 'text-black'}`} style={{ fontFamily: 'monospace', textShadow: '0 0 8px rgba(0,0,0,0.2)' }}>:</span>
          <input
            type="number"
            value={seconds}
            onChange={(e) => setSeconds(Number(e.target.value))}
            onFocus={pauseOnInputFocus}
            className={`focus:outline-none w-20 text-center rounded-md bg-transparent font-bold text-3xl tracking-[0.15em] transition-colors hover:bg-[#AABDB0] cursor-pointer ${mode ? 'text-white' : 'text-black'}`}
            style={{ fontFamily: 'monospace', textShadow: '0 0 8px rgba(0,0,0,0.2)', paddingRight: '0.5rem' }}
            placeholder="00"
            min="0"
            max="59"
          />
        </motion.div>
      )}

      {/* Control Buttons + Berserk trigger */}
      <div className="absolute left-36 bottom-16 flex flex-col items-center gap-6 z-10">
      <div className={`flex gap-4 ${isRunning ? '-ml-[5rem]' : ''}`}>
          <motion.button
            {...iconMotionProps}
            onClick={handleToggle}
            className={`px-6 py-2 rounded-lg shadow ml-15 font-semibold focus:outline-none ${mode ? 'text-white bg-gray-700' : 'text-white'}`}
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

        <motion.button
          type="button"
          onClick={toggleBerserkTheme}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`relative h-14 w-14 rounded-full ${isRunning ? '-ml-[1rem]' : 'ml-15'} shadow-lg ring-2 transition-all duration-200 focus:outline-none flex items-center justify-center overflow-hidden opacity-90 blur-xs ${
            isBerserkPlaying
              ? "ring-black bg-transparent"
              : "ring-black hover:ring-black bg-transparent"
          }`}
          title="Play/Pause Berserk theme"
        >
          <img
            src="https://images.cults3d.com/GkjSoJRetb9X0ZlhM_2-_psGWU8=/516x516/filters:no_upscale():format(webp)/https://fbi.cults3d.com/uploaders/22814621/illustration-file/4feabc25-eae9-405f-87d7-f93c0a95aa7e/berserk-symbole-2.png"
            alt="Berserk Brand"
            className={`w-full h-full object-cover rounded-full transition-all ${isBerserkPlaying ? "animate-pulse scale-110 brightness-70" : "brightness-100"}`}
          />
        </motion.button>
      </div>

      {/* Hourglass Icon */}
      {isRunning && (
        <FaHourglassHalf className="absolute bottom-82 left-53 hover:text-[#285639] hover:scale-130 transition-all duration-400 ease-in-out text-3xl text-gray-200 animate-pulse z-10" />
      )}
    </div>
  );
};

export default Pomodoro;