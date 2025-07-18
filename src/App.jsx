import './App.css'
import HomePage from './Pages/HomePage'
import { Route, Routes } from 'react-router-dom'
import About from './Pages/About.jsx'
import CumulativeKeplerData from './Pages/CumulativeKeplerData'
import PlanetarySystemsData from './Pages/PlanetarySystemsData'

function App() {

  return (
    <Routes >
      <Route path='/' element={<HomePage/>}></Route>
      <Route path='/about' element={<About/>}></Route>
      <Route path='/cumulative' element={<CumulativeKeplerData/>}></Route>
      <Route path='/ps' element={<PlanetarySystemsData/>}></Route>
    </Routes>
  )
}

export default App
