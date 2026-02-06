import { useState, useEffect, useRef } from "react";
import { FaBars, FaMoon, FaLightbulb, FaVolumeUp, FaPlay, FaPause, FaMusic, FaStop, FaPalette, FaCloudRain, FaFireAlt, FaLeaf, FaCoffee } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../public/assets/logo.png";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const {
    mode,
    lines,
    toggleMode,
    toggleSidebar,
    bgImage,
    setBackground,
  } = useAppContext();
  const [playingSounds, setPlayingSounds] = useState(new Set());
  const [showSoundMenu, setShowSoundMenu] = useState(false);
  const [showBgDialog, setShowBgDialog] = useState(false);
  const [bgInput, setBgInput] = useState("");
  
  const audioInstancesRef = useRef(new Map()); // Map of soundType -> Audio instance
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
      audioInstancesRef.current.forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
      });
      audioInstancesRef.current.clear();
    };
  }, []);

  function redirectSearch() {
    navigate("/search");
  }

  const setToggle = () => {
    toggleMode();
  };

  const openLines = () => {
    toggleSidebar();
  };

  const stopAllSounds = () => {
    console.log('Stopping all sounds');
    audioInstancesRef.current.forEach((audio, soundType) => {
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
    });
    audioInstancesRef.current.clear();
    setPlayingSounds(new Set());
  };

  const stopSound = (soundType) => {
    const audio = audioInstancesRef.current.get(soundType);
    if (audio) {
      console.log('Stopping sound:', soundType);
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
      audioInstancesRef.current.delete(soundType);
      setPlayingSounds(prev => {
        const newSet = new Set(prev);
        newSet.delete(soundType);
        return newSet;
      });
    }
  };

  const playSound = (soundType) => {
    console.log('=== SOUND DEBUG ===');
    console.log('Button clicked for:', soundType);
    console.log('Currently playing:', Array.from(playingSounds));
    
    // If this sound is already playing, stop it
    if (playingSounds.has(soundType)) {
      console.log('Stopping sound:', soundType);
      stopSound(soundType);
      return;
    }

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
    
    // Store in Map
    audioInstancesRef.current.set(soundType, newAudio);
    
    // Try to play the audio
    newAudio.play().then(() => {
      console.log('Audio started playing successfully for:', soundType);
      setPlayingSounds(prev => new Set([...prev, soundType]));
    }).catch(err => {
      console.log("Audio play failed for", soundType, ":", err);
      console.log("Error details:", err.message);
      
      // Handle autoplay policy errors
      if (err.name === 'NotAllowedError') {
        alert(`Browser blocked autoplay for ${soundType}. Click the sound button again to play.`);
      } else {
        alert(`Could not play ${soundType} sound. Error: ${err.message}`);
      }
      
      stopSound(soundType);
    });
  };

  const toggleSoundMenu = () => {
    setShowSoundMenu(!showSoundMenu);
  };

  const isValidUrl = (url) => {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (e) {
      return false;
    }
  };

  // Helper function to get the correct icon for each sound button
  const getSoundIcon = (soundType) => {
    if (playingSounds.has(soundType)) {
      return <FaPause className="text-xs" />;
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
          className="w-8 h-8 rounded-xl text-3xl"
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
            className={`relative h-8 w-8 rounded-full shadow-md flex items-center justify-center transition-all duration-300 ${
              playingSounds.size > 0
                ? mode
                  ? 'bg-[#1F2939] hover:bg-[#243249] ring-2 ring-[#1F2939]'
                  : 'bg-[#AABDB0] hover:bg-[#98b3a1] ring-2 ring-[#7fa08d]'
                : mode
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-200 hover:bg-gray-300'
            }`}
            title={playingSounds.size > 0 ? `Playing: ${Array.from(playingSounds).join(', ')}` : "Ambient Sounds"}
          >
            {playingSounds.size > 0 ? (
              <FaVolumeUp className="text-white text-sm" />
            ) : (
              <FaMusic className={`text-sm ${mode ? 'text-gray-900' : 'text-black'}`} />
            )}
          </button>

          {/* Dropdown Menu */}
          {showSoundMenu && (
            <div className={`absolute top-10 right-0 w-40 rounded-lg shadow-lg border z-50 overflow-hidden ${
              mode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="divide-y divide-gray-200/40">
                {/* Stop All Button */}
                {playingSounds.size > 0 && (
                  <button
                    onClick={stopAllSounds}
                    className={`w-full h-10 flex items-center justify-center transition-colors text-sm font-medium ${
                      mode ? 'text-red-400 hover:bg-gray-800' : 'text-red-600 hover:bg-gray-50'
                    }`}
                    title="Stop All"
                  >
                    <FaStop className="text-xs" />
                  </button>
                )}
                
                <button
                  onClick={() => playSound('rain')}
                  className={`w-full h-10 px-3 flex items-center justify-between transition-colors text-sm ${
                    playingSounds.has('rain') 
                      ? mode ? 'bg-[#1F2939] text-white' : 'bg-[#AABDB0] text-gray-900' 
                      : mode ? 'text-gray-200 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  title="Rain"
                >
                  <div className="flex items-center gap-2">
                    <FaCloudRain className={`${playingSounds.has('rain') ? 'text-current' : 'text-gray-400'} text-base`} />
                    <span>Rain</span>
                  </div>
                  {getSoundIcon('rain')}
                </button>
                
                <button
                  onClick={() => playSound('fire')}
                  className={`w-full h-10 px-3 flex items-center justify-between transition-colors text-sm ${
                    playingSounds.has('fire') 
                      ? mode ? 'bg-[#1F2939] text-white' : 'bg-[#AABDB0] text-gray-900' 
                      : mode ? 'text-gray-200 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  title="Fireplace"
                >
                  <div className="flex items-center gap-2">
                    <FaFireAlt className={`${playingSounds.has('fire') ? 'text-current' : 'text-gray-400'} text-base`} />
                    <span>Fireplace</span>
                  </div>
                  {getSoundIcon('fire')}
                </button>
                
                <button
                  onClick={() => playSound('spring')}
                  className={`w-full h-10 px-3 flex items-center justify-between transition-colors text-sm ${
                    playingSounds.has('spring') 
                      ? mode ? 'bg-[#1F2939] text-white' : 'bg-[#AABDB0] text-gray-900' 
                      : mode ? 'text-gray-200 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  title="Spring Weather"
                >
                  <div className="flex items-center gap-2">
                    <FaLeaf className={`${playingSounds.has('spring') ? 'text-current' : 'text-gray-400'} text-base`} />
                    <span>Spring</span>
                  </div>
                  {getSoundIcon('spring')}
                </button>
                
                <button
                  onClick={() => playSound('cafe')}
                  className={`w-full h-10 px-3 flex items-center justify-between transition-colors text-sm ${
                    playingSounds.has('cafe') 
                      ? mode ? 'bg-[#1F2939] text-white' : 'bg-[#AABDB0] text-gray-900' 
                      : mode ? 'text-gray-200 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  title="Cafe"
                >
                  <div className="flex items-center gap-2">
                    <FaCoffee className={`${playingSounds.has('cafe') ? 'text-current' : 'text-gray-400'} text-base`} />
                    <span>Café</span>
                  </div>
                  {getSoundIcon('cafe')}
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

        {/* Background Changer Button */}
        <div className="relative">
          <button
            onClick={() => setShowBgDialog(true)}
            className={`h-8 w-8 shadow-md rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300 ${
              bgImage
                ? mode
                  ? 'bg-[#1F2939] hover:bg-[#243249] ring-2 ring-[#1F2939]'
                  : 'bg-[#1F402B] hover:bg-[#98b3a1] ring-2 ring-[#7fa08d]'
                : mode
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-200 hover:bg-gray-300'
            }`}
            title="Change Background Image"
          >
            <FaPalette className={`text-base ${bgImage ? 'text-white' : mode ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>

          {/* Background Dialog */}
          {showBgDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
              <div className={`rounded-2xl p-6 w-full max-w-md shadow-2xl border ${mode ? 'text-white border-gray-800' : 'text-gray-900 border-gray-200'}`}
                   style={{ background: mode ? '#1F2939' : '#AABDB0' }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Background image</h2>
                    <p className={`text-sm mt-1 ${mode ? 'text-gray-400' : 'text-gray-500'}`}>Paste an image or GIF URL.</p>
                  </div>
                  <button
                    onClick={() => { setShowBgDialog(false); setBgInput(''); }}
                    className={`h-9 w-9 flex items-center justify-center rounded-full border transition cursor-pointer ${
                      mode
                        ? 'border-gray-700 text-gray-300 bg-[#114234] hover:bg-[#09221b] hover:text-white'
                        : 'border-gray-300 text-white bg-[#9fc4aa] hover:bg-[#12503e] hover:text-white'
                    }`}
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="-mt-1 -ml-1">
                    
                    <input
                      type="url"
                      value={bgInput}
                      onChange={(e) => setBgInput(e.target.value.trim())}
                      placeholder="https://example.com/wallpaper.gif"
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        mode
                          ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                          : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {!bgInput ? null : isValidUrl(bgInput) ? (
                      <p className={`mt-3  text-xs ${mode ? 'text-green-600' : 'text-black'}`}>Looks good.</p>
                    ) : (
                      <p className="mt-3  text-xs text-red-400">Enter a valid http/https image link.</p>
                    )}
                  </div>

                  {isValidUrl(bgInput) && (
                    <div>
                      <p className="text-sm font-medium mb-2">Preview</p>
                      <div
                        className={`w-full h-32 rounded-xl bg-cover bg-center  border ${mode ? 'border-gray-700' : 'border-gray-200'}`}
                        style={{ backgroundImage: `url('${bgInput}')` }}
                      ></div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => {
                      if (!isValidUrl(bgInput)) return;
                      setBackground(bgInput);
                      setShowBgDialog(false);
                      setBgInput('');
                    }}
                    className={`flex-1 rounded-lg py-2 cursor-pointer transition-all transform-0.5 font-medium text-white ${isValidUrl(bgInput) ? 'bg-[#185744] hover:bg-[#0b2e24]' : 'bg-gray-400 cursor-not-allowed'}`}
                    disabled={!isValidUrl(bgInput)}
                  >
                    Apply
                  </button>
                  {bgImage && (
                    <button
                      onClick={() => {
                        setBackground('');
                        setShowBgDialog(false);
                        setBgInput('');
                      }}
                      className="flex-1 rounded-lg cursor-pointer py-2 font-medium transition-all transform-0.5 text-white/80 bg-red-500 hover:bg-red-800"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => { setShowBgDialog(false); setBgInput(''); }}
                    className={`flex-1 rounded-lg py-2 cursor-pointer transition-all transform-0.5 font-medium ${mode ? 'bg-gray-600 text-gray-200 hover:bg-gray-900' : 'bg-gray-600 text-white/90 hover:bg-gray-800'}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;