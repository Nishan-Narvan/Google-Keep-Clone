import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route,Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from './components/Sidebar';
import Home from "./pages/Home";
import Archive from "./pages/Archive";
import Trash from "./pages/Trash";
import NoPage from "./pages/NoPage";

export default function App() {
  return (
    
    <BrowserRouter>
     <div className={`max-h-screen ${mode ? 'bg-gray-700' : 'light bg-gray-100'} transition-colors duration-300`}>
      <Navbar mode={mode} setMode={setMode} />
      
      <div className="flex flex-row h-[calc(100vh-4rem)]">
        <Sidebar mode={mode} setMode={setMode} >
          dfdfsdfd
        </Sidebar>
        <div/>
        <div/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trash" element={<Trash/>} />
        <Route path="/archive" element={<Archive/>} />
        <Route path="*" element={<NoPage />} />
      </Routes>
      </div>
     </div>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);