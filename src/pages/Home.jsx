import { useState } from "react";

import NoteInput from "../components/NoteInput";


function Home({ mode, setArchieved,  setTrashed }) {
  return (
    <div className="relative flex-1">
<img src={mode ? "https://i.pinimg.com/originals/0b/e7/48/0be748204b77ec2211c3230442e468a9.gif" : "https://i.pinimg.com/originals/be/63/08/be63089e483cb06b226f6976723f5e5f.gif"}  className="absolute z-0 object-cover w-full h-full  "></img>
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
 