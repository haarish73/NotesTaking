import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import Topics from "./Page/Topic.jsx"
import Notes from "./Page/Notes.jsx"
import Navbar from "./component/Navbar.jsx"
import Login from "./Page/Login.jsx"
import Register from './Page/Register.jsx';
import Profile from "./Page/Profile.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Navbar/>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Topics />} />

        <Route path="/topics/:topicName" element={<Notes />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
