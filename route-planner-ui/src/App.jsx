import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LocationsPage from "./pages/Location.jsx";
import Transportations from "./pages/Transportations.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
      <><LocationsPage/>
      <Transportations/></>
  )
}

export default App
