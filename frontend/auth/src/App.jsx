import { useState } from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"

import './App.css'

// Context
import { AuthProvider } from './context/AuthContext'

// Components
import Navbar from './components/Navbar'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Perfil from './pages/Perfil'
import Photo from './pages/Photo'

function App() {
  
  return (
    <>
      
      <BrowserRouter>

        <AuthProvider>

          <Navbar/>

          <Routes>

            <Route path="/" element={<Home/>} />
          
            <Route path="/login" element={<Login/>} />

            <Route path="/register" element={<Register/>} />

            <Route path="/perfil" element={<Perfil/>} />

            <Route path="/:id" element={<Photo/>} />

          </Routes>

        </AuthProvider>

      </BrowserRouter>

    </>
  )
}

export default App
