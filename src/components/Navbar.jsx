import { useState, useEffect } from "react";
import { FaBars, FaSearch, FaMoon, FaLightbulb, FaVolumeUp, FaPlay, FaPause, FaMusic, FaStop } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../public/assets/logo.png";

const Navbar = ({ mode, setMode, lines, setLines, searchQuery, setSearchQuery }) => {
  const [currentSound, setCurrentSound] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSoundMenu, setShowSoundMenu] = useState(false);

  const navigate = useNavigate();
  
  // Close sound menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSoundMenu && !event.target.closest('.sound-menu-container')) {
        setShowSoundMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSoundMenu]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
      }
    };
  }, []);

  function redirectSearch() {
    navigate("/search");
  }

  const setToggle = () => {
    setMode((prev) => !prev);
  };

  const openLines = () => {
    setLines((prev) => !prev);
  };

  const stopCurrentSound = () => {
    if (audio) {
      console.log('Stopping current audio');
      audio.pause();
      audio.currentTime = 0;
      setAudio(null);
      setCurrentSound(null);
      setIsPlaying(false);
    }
  };

  const playSound = (soundType) => {
    console.log('=== SOUND DEBUG ===');
    console.log('Button clicked for:', soundType);
    console.log('Current state:', { 
      currentSound, 
      isPlaying, 
      audio: !!audio
    });
    
    // If clicking the same sound that's currently playing, stop it
    if (currentSound === soundType && audio && isPlaying) {
      console.log('Stopping current sound');
      stopCurrentSound();
      return;
    }

    // If clicking the same sound that's paused, resume it
    if (currentSound === soundType && audio && !isPlaying) {
      console.log('Resuming paused sound');
      audio.play().then(() => {
        console.log('Audio resumed successfully');
        setIsPlaying(true);
      }).catch(err => {
        console.log("Audio resume failed:", err);
        stopCurrentSound();
      });
      return;
    }

    // Stop any currently playing sound
    stopCurrentSound();

    console.log('Starting new sound:', soundType);

    // Create new audio with local sources
    const soundUrls = {
      rain: "/assets/audio/rain-03.mp3",
      fire: "/assets/audio/lit-fireplace-6307.mp3", 
      spring: "/assets/audio/spring-weather-1.mp3",
      cafe: "/assets/audio/cafe-noise-32940.mp3"
    };

    const newAudio = new Audio(soundUrls[soundType]);
    newAudio.loop = true;
    newAudio.volume = 0.3;
    newAudio.preload = 'auto';
    
    // Add event listeners for state management
    newAudio.addEventListener('play', () => {
      console.log('Audio play event for:', soundType);
      setIsPlaying(true);
    });
    
    newAudio.addEventListener('pause', () => {
      console.log('Audio pause event for:', soundType);
      setIsPlaying(false);
    });
    
    newAudio.addEventListener('ended', () => {
      console.log('Audio ended for:', soundType);
      // This shouldn't happen with loop=true, but just in case
      setIsPlaying(false);
    });
    
    newAudio.addEventListener('error', (e) => {
      console.log('Audio error for', soundType, ':', e);
      alert(`Could not load ${soundType} sound. Please check if the audio file exists at: ${soundUrls[soundType]}`);
      stopCurrentSound();
    });

    newAudio.addEventListener('loadeddata', () => {
      console.log('Audio data loaded for:', soundType);
    });
    
    // Set the new audio state
    setAudio(newAudio);
    setCurrentSound(soundType);
    
    // Try to play the audio
    newAudio.play().then(() => {
      console.log('Audio started playing successfully for:', soundType);
      setIsPlaying(true);
    }).catch(err => {
      console.log("Audio play failed for", soundType, ":", err);
      console.log("Error details:", err.message);
      
      // Handle autoplay policy errors
      if (err.name === 'NotAllowedError') {
        alert(`Browser blocked autoplay for ${soundType}. Click the sound button again to play.`);
      } else {
        alert(`Could not play ${soundType} sound. Error: ${err.message}`);
      }
      
      stopCurrentSound();
    });
  };

  const toggleSoundMenu = () => {
    setShowSoundMenu(!showSoundMenu);
  };

  // Helper function to get the correct icon for each sound button
  const getSoundIcon = (soundType) => {
    if (currentSound === soundType) {
      return isPlaying ? <FaPause className="text-xs" /> : <FaPlay className="text-xs" />;
    }
    return <FaPlay className="text-xs" />;
  };

  return (
    <div
      className={`flex h-16 px-7 items-center shadow-md border-r border-solid border-gray-300 gap-8 justify-between ${
        mode ? "bg-gray-900" : "bg-[#d4e6dae0]"
      }`}
    >
      {/* Left Navbar */}
      <div className="flex items-center gap-4 py-4  cursor-pointer">
        <div className=" py-2">
          <FaBars
            onClick={openLines}
            className={`text-4xl px-2 transition-transform duration-300 ease-in-out rotate-0  ${
              mode ? "text-gray-300 " : "text-gray-700"
            } ${lines ? "rotate-0" : "rotate-90"}`}
          />
        </div>
        <img
          className="w-8 h-8 rounded-xl  text-3xl"
          src={logo}
          alt="Google Keep Logo"
        />
        <h2
          className={`text-2xl font-light font-serif py-2 px-2 ${
            mode ? "text-gray-300" : "text-gray-800"
          }`}
        >
          NOTY
        </h2>
      </div>

      {/* Center Navbar */}

      {/* Right Navbar */}
      <div className="flex items-center gap-4">
        {/* Sound Button with Dropdown */}
        <div className="relative sound-menu-container">
          <button
            onClick={toggleSoundMenu}
            className={`relative h-8 w-8 border border-gray-500 rounded-full shadow-md flex items-center justify-center transition-all duration-200 ${
              mode 
                ? 'bg-green-900 hover:bg-green-800' 
                : 'bg-green-400 hover:bg-green-500'
            } ${
              currentSound && isPlaying ? 'ring-2 ring-green-500' : ''
            }`}
          >
            <span className="mr-1 text-lg" style={{ filter: 'brightness(0) invert(1)' }}>🎵</span>
            {currentSound && isPlaying ? (
              <FaVolumeUp
                className={`text-lg transition-all duration-300 ease-in-out text-green-500`}
              />
            ) : (
              <FaMusic
                className={`text-lg transition-all duration-300 ease-in-out ${
                  mode ? "text-gray-300" : "text-gray-700"
                }`}
              />
            )}
          </button>

          {/* Dropdown Menu */}
          {showSoundMenu && (
            <div className={`absolute top-10 right-0 w-20 rounded-lg shadow-lg border z-50 ${
              mode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
            }`}>
              <div className="py-2 space-y-1">
                {/* Stop All Button */}
                {currentSound && (
                  <button
                    onClick={stopCurrentSound}
                    className={`w-full h-8 flex items-center justify-center transition-colors border-b ${
                      mode ? 'text-red-400 hover:bg-gray-700 border-gray-600' : 'text-red-500 hover:bg-gray-100 border-gray-200'
                    }`}
                    title="Stop All"
                  >
                    <FaStop className="text-xs" />
                  </button>
                )}
                
                <button
                  onClick={() => playSound('rain')}
                  className={`w-full h-8 flex items-center justify-center transition-colors ${
                    currentSound === 'rain' 
                      ? 'bg-blue-500 text-white' 
                      : mode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Rain"
                >
                  <div className="flex items-center gap-1">
                    <span className="text-sm">🌧️</span>
                    {getSoundIcon('rain')}
                  </div>
                </button>
                
                <button
                  onClick={() => playSound('fire')}
                  className={`w-full h-8 flex items-center justify-center transition-colors ${
                    currentSound === 'fire' 
                      ? 'bg-orange-500 text-white' 
                      : mode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Fireplace"
                >
                  <div className="flex items-center gap-1">
                    <span className="text-sm">🔥</span>
                    {getSoundIcon('fire')}
                  </div>
                </button>
                
                <button
                  onClick={() => playSound('spring')}
                  className={`w-full h-8 flex items-center justify-center transition-colors ${
                    currentSound === 'spring' 
                      ? 'bg-green-500 text-white' 
                      : mode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Spring Weather"
                >
                  <div className="flex items-center gap-1">
                    <span className="text-sm">🌸</span>
                    {getSoundIcon('spring')}
                  </div>
                </button>
                
                <button
                  onClick={() => playSound('cafe')}
                  className={`w-full h-8 flex items-center justify-center transition-colors ${
                    currentSound === 'cafe' 
                      ? 'bg-yellow-500 text-white' 
                      : mode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Cafe"
                >
                  <div className="flex items-center gap-1">
                    <span className="text-sm">☕</span>
                    {getSoundIcon('cafe')}
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dark Mode Button */}
        <div className="relative h-8 w-8 shadow-md bg-black rounded-full">
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${mode ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"}`}>
            <FaMoon
              onClick={setToggle}
              className="cursor-pointer shadow-lg text-shadow-gray-950 text-lg text-white"
            />
          </div>
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${!mode ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`}>
            <FaLightbulb
              onClick={setToggle}
              className="cursor-pointer shadow-lg text-white hover:text-gray-200 text-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;