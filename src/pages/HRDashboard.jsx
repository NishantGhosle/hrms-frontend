import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeForm from '../components/EmployeeForm';
import toast from 'react-hot-toast';

const HRDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [month, setMonth] = useState('');

  useEffect(() => {
    fetchEmployees();
    fetchLeaves();
    fetchPayrolls();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetch Employees Token:', token);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data.employees);
    } catch (error) {
      console.log('Fetch Employees Error:', error.response);
      toast.error(error.response.data.message || 'Error fetching employees');
    }
  };

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetch Leaves Token:', token);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/leaves`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(res.data.leaves);
    } catch (error) {
      console.log('Fetch Leaves Error:', error.response);
      toast.error(error.response.data.message || 'Error fetching leaves');
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

  const handleLeaveAction = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Handle Leave Action Token:', token);
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/leaves/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      fetchLeaves();
    } catch (error) {
      console.log('Handle Leave Action Error:', error.response);
      toast.error(error.response.data.message || 'Error updating leave');
    }
  };

  const handleGeneratePayroll = async () => {
    if (!month) {
      toast.error('Please select a month');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      console.log('Generate Payroll Token:', token);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payroll/generate`,
        { month },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      fetchPayrolls();
    } catch (error) {
      console.log('Generate Payroll Error:', error.response);
      toast.error(error.response.data.message || 'Error generating payroll');
    }
  };

  return (
    <div className="dashboard">
      <h1>HR Dashboard</h1>
      <EmployeeForm />
      
      <div className="section">
        <h2>Employees</h2>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Profile Picture</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id}>
                  <td data-label="Profile Picture">
                    {emp.profilePicture ? (
                      <img src={emp.profilePicture} alt={emp.name} className="profile-pic" />
                    ) : (
                      <svg className="profile-pic no-profile-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="11" stroke="#9ca3af" strokeWidth="2"/>
                        <path d="M12 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" fill="#9ca3af"/>
                        <path d="M6 18c0-2.2 1.8-4 4-4h4c2.2 0 4 1.8 4 4" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    )}
                  </td>
                  <td data-label="Name">{emp.name}</td>
                  <td data-label="Email">{emp.email}</td>
                  <td data-label="Contact">{emp.contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <h2>Leave Requests</h2>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave._id}>
                  <td data-label="Employee">{leave.employeeId.name}</td>
                  <td data-label="Type">{leave.type}</td>
                  <td data-label="Start Date">{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td data-label="End Date">{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td data-label="Status">{leave.status}</td>
                  <td data-label="Action">
                    {leave.status === 'pending' && (
                      <>
                        <button onClick={() => handleLeaveAction(leave._id, 'approved')}>
                          Approve
                        </button>
                        <button onClick={() => handleLeaveAction(leave._id, 'rejected')}>
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <h2>Payroll</h2>
        <div className="payroll-controls">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder="Select Month"
          />
          <button onClick={handleGeneratePayroll}>Generate Payroll</button>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
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
                  <td data-label="Employee">{payroll.employeeId.name}</td>
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

export default HRDashboard;