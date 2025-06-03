import { useState } from 'react'
import Navbar from "./components/Navbar";
import Sidebar from './components/Sidebar';
import NoteInput from './components/NoteInput';
import NoteList from './components/NoteList';

function App() {
  const [mode, setMode] = useState(false);
  
  return (
    <div className={`min-h-screen ${mode ? 'bg-gray-700' : 'light bg-gray-100'} transition-colors duration-300`}>
      <Navbar mode={mode} setMode={setMode} />
      
      <div className="flex flex-row h-[calc(100vh-4rem)]">
        <Sidebar mode={mode} setMode={setMode} >
          dfdfsdfd
        </Sidebar>
        
        <div id='Maincontent' className={`flex-1 flex flex-col items-center px-44 py-10 ${mode ? 'bg-gray-800' : 'bg-gray-100'}`}> 
          <NoteInput mode={mode} />
          <NoteList mode={mode} />
        </div>
      </div>
    </div>
  )
}

export default App