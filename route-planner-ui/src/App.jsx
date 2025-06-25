import { useState } from 'react'
import './App.css'
import LocationsPage from "./pages/Location.jsx";
import TransportationsPage from "./pages/Transportations.jsx";
import Sidebar from "./components/SideBar/SideBar.jsx";
import {Navigate, Route, BrowserRouter as Router, Routes} from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

    return (
        <Router>
            <div className="app-layout" style={{ display: 'flex' }}>
                <Sidebar />
                <div className="page-content" style={{ flex: 1, padding: '20px' }}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/locations" />} />
                        <Route path="/locations" element={<LocationsPage />} />
                        <Route path="/transportations" element={<TransportationsPage />} />
                        {/*<Route path="/routes" element={<RoutesPage />} />*/}
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App
