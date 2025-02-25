import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <h1>HRMS</h1>
      {token && (
        <div className="nav-actions">
          <Link to={role === 'hr' ? '/hr' : '/employee'} className="nav-link">
            Dashboard
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;