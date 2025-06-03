import React from 'react'
import { useState } from 'react';
import { 
  MdLightbulbOutline, 
  MdOutlineNotificationsNone, 
  MdLabelOutline ,MdArchive, MdDeleteOutline
} from "react-icons/md";

const Sidebar = ({mode,setMode}) => {


  const[linespressed, setLinespressed] = useState(true);
  return (
    <div className='flex flex-col gap-5 px-8 py-5'>

      <div className={`flex items-center hover:bg-gray-200 rounded cursor-pointer shadow-sm  px-4 py-2`}>
        <MdLightbulbOutline className="text-2xl" />
        <span className={`ml-4 hover:text-gray-600 ${mode ? "text-amber-200": 'text-black'}`}>Notes</span>
      </div>

      <div className={`flex items-center hover:bg-gray-200 rounded cursor-pointer shadow-sm  px-4 py-2`}>
        <MdOutlineNotificationsNone className="text-2xl" />
         <span className={`ml-4 hover:text-gray-600 ${mode ? "text-amber-200": 'text-black'}`}>Reminders</span>
      </div>

      <div className={`flex items-center hover:bg-gray-200 rounded cursor-pointer shadow-sm  px-4 py-2`}>
        <MdLabelOutline className="text-2xl" />
        <span className={`ml-4 hover:text-gray-600 ${mode ? "text-amber-200": 'text-black'}`}>Edit labels</span>
      </div>
     
     {/* Archive */}
<div className='flex items-center hover:bg-gray-200 rounded cursor-pointer shadow-sm '>
  <div className='px-4'><MdArchive className="text-2xl" /></div>
   <span className={`hover:text-gray-600 py-1 ${mode ? "text-amber-200": 'text-black'}`}>Archive</span>
</div>

{/* Trash */}
<div className='flex items-center hover:bg-gray-200 rounded cursor-pointer shadow-sm '>
  <div className='px-4'><MdDeleteOutline className="text-2xl" /></div>

   <span className={`hover:text-gray-600 py-1 ${mode ? "text-amber-200": 'text-black'}`}>Trash</span>
</div>


    </div>
  )
}

export default Sidebar;