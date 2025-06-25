import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const linkStyle = (path) => ({
        padding: '10px 20px',
        display: 'block',
        backgroundColor: location.pathname === path ? '#eee' : 'transparent',
        textDecoration: 'none',
        color: 'black',
    });

    return (
        <div style={{ width: '20%', borderRight: '1px solid #ccc', backgroundColor: '#2C3E50' }}>
            <h2 style={{ padding: '10px' }}>HEADER</h2>
            <Link to="/locations" style={linkStyle('/locations')}>Locations</Link>
            <Link to="/transportations" style={linkStyle('/transportations')}>Transportations</Link>
            <Link to="/routes" style={linkStyle('/routes')}>Routes</Link>
        </div>
    );
};

export default Sidebar;