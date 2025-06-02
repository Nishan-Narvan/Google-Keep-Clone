import { useState } from 'react'
import Navbar from "./components/Navbar";
import Sidebar from './components/Sidebar';
import NoteInput from './components/NoteInput';
import NoteList from './components/NoteList';

function App() {

  return (
    <>

    <div className="flex flex-col h-screen">
       <Navbar />

       <div className="flex flex-row h-screen">


      <Sidebar className=''>dfdfsdfd</Sidebar>
        
      <div id='Maincontent ' className='flex flex-col items-center px-44 py-10'> 
    
        <NoteInput  ></NoteInput>
       
      </div>
       </div>
            
    
   
          </div>
        
   
  
   
    </>
  )
}

export default App

App