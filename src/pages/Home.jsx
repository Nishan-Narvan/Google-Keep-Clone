import { useState } from "react";

import NoteInput from "../components/NoteInput";


function Home({ mode, setArchieved,  setTrashed }) {
  return (
    <div className="relative flex-1">
<img src={mode ? "https://i.pinimg.com/originals/74/fa/be/74fabe0ac2588f7f052170708b5136b8.gif" : "https://i.pinimg.com/originals/c2/44/5d/c2445dd759cf52be7e37d294c62d730e.gif"}  className="absolute z-0 object-cover w-full h-full"></img>
      <div
        id="Maincontent"
        className={` relative z-10 flex-1 flex flex-col items-center h-full py-10 overflow-y-auto `}
      >
        <NoteInput mode={mode}  setArchieved={setArchieved}  setTrashed={setTrashed}  />
      
      </div>
    </div>
  );
}

export default Home;
 