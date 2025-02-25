import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LeaveForm from '../components/LeaveForm';
import toast from 'react-hot-toast';

const EmployeeDashboard = () => {
  const [attendance, setAttendance] = useState(null);
  const [checkInTime, setCheckInTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(null);
  const [totalDuration, setTotalDuration] = useState(null);
  const [payrolls, setPayrolls] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchPayrolls();
    fetchProfile();

    let timer;
    if (attendance && !attendance.checkOut) {
      timer = setInterval(() => {
        const now = new Date();
        const checkIn = new Date(attendance.checkIn);
        const diff = Math.floor((now - checkIn) / 1000);
        setElapsedTime(diff);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [attendance]);

  const handleCheckIn = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Check In Token:', token);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/attendance/check-in`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAttendance(res.data);
      const time = new Date(res.data.checkIn).toLocaleTimeString();
      setCheckInTime(time);
      setTotalDuration(null);
      toast.success(res.data.message + ` at ${time}`);
    } catch (error) {
      console.log('Check In Error:', error.response);
      toast.error(error.response.data.message || 'Error checking in');
    }
  };

  const handleCheckOut = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Check Out Token:', token);
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/attendance/check-out`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const checkOutTime = new Date().toLocaleTimeString();
      const checkIn = new Date(attendance.checkIn);
      const checkOut = new Date();
      const diff = Math.floor((checkOut - checkIn) / 1000);
      setTotalDuration(diff);
      setAttendance(null);
      setCheckInTime(null);
      setElapsedTime(null);
      toast.success(res.data.message + ` at ${checkOutTime}`);
    } catch (error) {
      console.log('Check Out Error:', error.response);
      toast.error(error.response.data.message || 'Error checking out');
    }
  };

  const fetchPayrolls = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetch Payrolls Token:', token);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/payroll`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayrolls(res.data.payrolls);
    } catch (error) {
      console.log('Fetch Payrolls Error:', error.response);
      toast.error(error.response.data.message || 'Error fetching payrolls');
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetch Profile Token:', token);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/employees/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.employee);
    } catch (error) {
      console.log('Fetch Profile Error:', error.response);
      toast.error(error.response.data.message || 'Error fetching profile');
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="dashboard">
      <h1>Employee Dashboard</h1>

      <div className="section">
        <h2>My Profile</h2>
        {profile && (
          <div className="profile-section">
            {profile.profilePicture ? (
              <img src={profile.profilePicture} alt="Profile" className="profile-pic" />
            ) : (
              <svg className="profile-pic no-profile-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="11" stroke="#9ca3af" strokeWidth="2"/>
                <path d="M12 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" fill="#9ca3af"/>
                <path d="M6 18c0-2.2 1.8-4 4-4h4c2.2 0 4 1.8 4 4" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
            <p>Name: {profile.name}</p>
            <p>Email: {profile.email}</p>
          </div>
        )}
      </div>

      <div className="attendance-section">
        <h2>Attendance</h2>
        <button onClick={handleCheckIn} disabled={attendance}>
          Check In
        </button>
        <button onClick={handleCheckOut} disabled={!attendance}>
          Check Out
        </button>
        {checkInTime && (
          <p className="check-in-time">Checked in at: {checkInTime}</p>
        )}
        {elapsedTime !== null && (
          <p className="elapsed-time">Time Elapsed: {formatTime(elapsedTime)}</p>
        )}
        {totalDuration !== null && (
          <p className="total-duration">Total Time Today: {formatTime(totalDuration)}</p>
        )}
      </div>

      <LeaveForm />

      <div className="section">
        <h2>My Payroll</h2>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Base Salary</th>
                <th>Present Days</th>
                <th>Total Days</th>
                <th>Calculated Salary</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.map((payroll) => (
                <tr key={payroll._id}>
                  <td data-label="Month">{payroll.month}</td>
                  <td data-label="Base Salary">{payroll.baseSalary}</td>
                  <td data-label="Present Days">{payroll.presentDays}</td>
                  <td data-label="Total Days">{payroll.totalDays}</td>
                  <td data-label="Calculated Salary">{payroll.calculatedSalary.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;