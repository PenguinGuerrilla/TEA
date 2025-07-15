import { useState } from 'react'
import './App.css'
import MainTable from './Components/Table/CumulativeTable'
import CumulativeTable from './Components/Table/CumulativeTable'
import HomePage from './Pages/HomePage'
import { Route, Routes } from 'react-router-dom'
import PsTable from './Components/Table/PsTable'
import Navbar from './Components/Navbar.jsx'
import About from './Pages/About.jsx'

function App() {

  return (
    <Routes >
      <Route path='/' element={<HomePage/>}></Route>
      <Route path='/about' element={<About/>}></Route>
      <Route path='/cumulative' element={<CumulativeTable/>}></Route>
      <Route path='/ps' element={<PsTable/>}></Route>
    </Routes>
  )
}

export default App
