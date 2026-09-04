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

import ProtectedRoute from "./component/ProtectedRoute.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar/>
      <Routes>

        {/* ✅ Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Topics />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/topics/:topicName" 
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />

        {/* ✅ Public Routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>
)
