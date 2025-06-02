import React, { useState } from 'react';
import { FaBars, FaSearch } from "react-icons/fa";

const Navbar = () => {
  const [isLines, setlinesPressed] = useState(false);

  const LeftNavbar = () => (
    <div
      className='flex items-center gap-4 py-4 px-2 cursor-pointer'
      onClick={() => setlinesPressed(prev => !prev)}
    >
      {/* Hamburger icon */}
      <div className='px-2 py-2'>
        <FaBars className="text-gray-700 text-3xl" />
      </div>

      {/* Icon */}
      <img
        className='w-12 h-12'
        src="https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png"
        alt="Google Keep Logo"
      />

      {/* Conditional Text */}
      
        <div>
          <h2 className='text-3xl font-medium text-gray-800 font-serif py-2 px-2'>Keep</h2>
        </div>
   
    </div>
  );

  const Centernavbar = () => (
    <div className='flex items-center bg-gray-100 px-4 py-2 rounded-md shadow-sm w-[800px] max-w-full '>
      <FaSearch className="text-gray-500 mr-3" />
      <input type="text" placeholder='Search' className='bg-transparent outline-none flex-1 text-sm text-gray-700' />
    </div>
  );

  return (
    <>
      <div className='flex h-16 px-4 items-center gap-24 justify-between'>
        <LeftNavbar />
        <Centernavbar />
        {/* <Rightbar /> */}
      </div>
    </>
  );
};

export default Navbar;

