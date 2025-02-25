import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const LeaveForm = () => {
  const [formData, setFormData] = useState({
    type: 'CL',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/leaves`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success(res.data.message);
      setFormData({ type: 'CL', startDate: '', endDate: '' });
    } catch (error) {
      toast.error(error.response.data.message || 'Error applying leave');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Apply Leave</h2>
      <select name="type" value={formData.type} onChange={handleChange}>
        <option value="CL">Casual Leave</option>
        <option value="SL">Sick Leave</option>
        <option value="EL">Earned Leave</option>
      </select>
      <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
      <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
      <button type="submit">Apply Leave</button>
    </form>
  );
};

export default LeaveForm;