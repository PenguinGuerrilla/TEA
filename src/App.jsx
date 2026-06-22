import './App.css'
import HomePage from './Pages/HomePage'
import { Route, Routes } from 'react-router-dom'
import About from './Pages/About.jsx'
import CumulativeKeplerData from './Pages/CumulativeKeplerData/CumulativeKeplerData'
import PlanetarySystemsData from './Pages/PlanetarySystemsData/PlanetarySystemsData'
import CombinedData from './Pages/CombinedData/CombinedData'
import PapersExplored from './Pages/PapersExplored/PapersExplored'
import { lazy, Suspense } from 'react'

const Statistics = lazy(() => import('./Pages/Statistics/Statistics'))
const Predictions = lazy(() => import('./Pages/Predictions/Predictions'))

function App() {

  return (
    <Routes >
      <Route path='/' element={<HomePage/>}></Route>
      <Route path='/about' element={<About/>}></Route>
      <Route path='/cumulative' element={<CumulativeKeplerData/>}></Route>
      <Route path='/ps' element={<PlanetarySystemsData/>}></Route>
      <Route path='/combined' element={<CombinedData/>}></Route>
      <Route path='/predictions' element={<Suspense fallback={null}><Predictions/></Suspense>}></Route>
      <Route path='/papers' element={<PapersExplored/>}></Route>
      <Route path='/stats' element={<Suspense fallback={null}><Statistics/></Suspense>}></Route>
    </Routes>
  )
}

export default App
