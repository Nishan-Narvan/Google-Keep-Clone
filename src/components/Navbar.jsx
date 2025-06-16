import { useState } from "react";
import { FaBars, FaSearch, FaMoon, FaLightbulb } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../public/assets/logo.png";

const Navbar = ({ mode, setMode, lines, setLines }) => {


  const navigate = useNavigate();
  function redirectSearch() {
    navigate("/search");
  }


  const setToggle = () => {
    setMode((prev) => !prev);
  };

  const openLines = () => {
    setLines((prev) => !prev);
  };


  return (
    <div
      className={`flex h-16 px-8 items-center shadow-md border-r border-solid border-gray-300 gap-24 justify-between ${
        mode ? "bg-gray-900" : "bg-[#d4e6dae0]"
      }`}
    >
      {/* Left Navbar */}
      <div className="flex items-center gap-4 py-4 px-2 cursor-pointer">
        <div className="px-2 py-2">
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
      <div
        className={`flex items-center px-4 mr-9.5 py-2 rounded-md shadow-sm w-[800px] max-w-full ${
          mode ? "bg-gray-700" : "bg-gray-100"
        }`}
      >
        <FaSearch
          className={`mr-3 ${mode ? "text-gray-400" : "text-gray-500"}`}
        />
        <input
          type="text"
          placeholder="Search"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              redirectSearch(); // Call your search redirect logic
            }
          }}
          className={`flex-1 bg-transparent  focus:outline-none text-sm ${
            mode ? "text-gray-300 placeholder-gray-400" : "text-gray-700"
          }`}
        />
      </div>
      {/* Right Navbar */}
      <div className="relative h-8 w-8 border border-gray-500 rounded-full shadow-md bg-[#acc5b423]">
        <FaMoon
          onClick={setToggle}
          className={`absolute inset-0  cursor-pointer shadow-lg  border text-shadow-gray-950 rounded-2xl text-3xl transition-all duration-300 ease-in-out ${
            mode ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
          }`}
        />
        <FaLightbulb
          onClick={setToggle}
          className={`absolute inset-0 left-0.5 top-0.5 px-1 rounded-xl cursor-pointer shadow-lg border border-gray-300  text-[#c9c070] hover:text-gray-800 text-2xl transition-all duration-300 ease-in-out ${
            !mode ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
          }`}
        />
      </div>
    </div>
  );
};

export default Navbar;
