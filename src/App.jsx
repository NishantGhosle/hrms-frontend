import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import HRDashboard from './pages/HRDashboard';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/hr" element={<HRDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;