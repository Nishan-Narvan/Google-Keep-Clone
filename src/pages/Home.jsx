import { useState } from 'react'


import NoteInput from '../components/NoteInput';
import NoteList from '../components/NoteList';

function Home() {
  const [mode, setMode] = useState(false);

  
  return (
   
        <div id='Maincontent' className={`flex-1 flex flex-col items-center  py-10 overflow-y-auto ${mode ? 'bg-gray-800' : 'bg-gray-100'}`}> 
          <NoteInput mode={mode} />
          <NoteList mode={mode} />
        </div>
    
  )
}

export default Home;