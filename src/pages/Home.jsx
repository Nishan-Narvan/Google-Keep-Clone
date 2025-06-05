import { useState } from "react";

import NoteInput from "../components/NoteInput";
import NoteList from "../components/NoteList";

function Home({ mode }) {
  return (
    <div className="relative flex-1">
<img src="https://i.pinimg.com/originals/c2/44/5d/c2445dd759cf52be7e37d294c62d730e.gif" className="absolute z-0 object-cover w-full h-full"></img>
      <div
        id="Maincontent"
        className={` relative z-10 flex-1 flex flex-col items-center h-full py-10 overflow-y-auto ${
          mode ? "bg-gray-800" : "bg-[]#f3f4f6]"
        }`}
      >
        <NoteInput mode={mode} />
        <NoteList mode={mode} />
      </div>
    </div>
  );
}

export default Home;
 