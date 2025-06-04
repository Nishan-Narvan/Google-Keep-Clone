import { FaBars, FaSearch, FaMoon, FaLightbulb } from "react-icons/fa";

const Navbar = ({ mode, setMode }) => {
  const setToggle = () => {
    setMode(prev => !prev);
  };

  return (
    <div className={`flex h-16 px-4 items-center gap-24 justify-between ${mode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Left Navbar */}
      <div className='flex items-center gap-4 py-4 px-2 cursor-pointer'>
        <div className='px-2 py-2'>
          <FaBars className={`text-3xl ${mode ? 'text-gray-300' : 'text-gray-700'}`} />
        </div>
        <img
          className='w-12 h-12'
          src="https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png"
          alt="Google Keep Logo"
        />
        <h2 className={`text-3xl font-medium font-serif py-2 px-2 ${mode ? 'text-gray-300' : 'text-gray-800'}`}>
          Keep
        </h2>
      </div>

      {/* Center Navbar */}
      <div className={`flex items-center px-4 py-2 rounded-md shadow-sm w-[800px] max-w-full ${mode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <FaSearch className={`mr-3 ${mode ? 'text-gray-400' : 'text-gray-500'}`} />
        <input 
          type="text" 
          placeholder='Search' 
          className={`bg-transparent outline-none flex-1 text-sm ${mode ? 'text-gray-300 placeholder-gray-400' : 'text-gray-700'}`} 
        />
      </div>

      {/* Right Navbar */}
      <div className="relative h-8 w-8">
        <FaMoon 
          onClick={setToggle}
          className={`absolute inset-0 text-gray-300 text-3xl transition-all duration-300 ease-in-out ${
            mode ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
          }`}
        />
        <FaLightbulb 
          onClick={setToggle}
          className={`absolute inset-0 border border-black px-1 text-yellow-400 text-2xl transition-all duration-300 ease-in-out ${
            !mode ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
          }`}
        />
      </div>
    </div>
  );
};

export default Navbar;