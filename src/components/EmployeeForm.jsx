import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', contact: '', aadhaar: '', pan: '',
    bankDetails: { accountNo: '', ifsc: '' }, emergencyContact: '',
    address: '', baseSalary: '', password: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('bankDetails')) {
      const key = name.split('.')[1];
      setFormData({
        ...formData,
        bankDetails: { ...formData.bankDetails, [key]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      profilePicture: profilePicture ? preview : null,
    };

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/employees`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success(res.data.message);
      setFormData({
        name: '', email: '', contact: '', aadhaar: '', pan: '',
        bankDetails: { accountNo: '', ifsc: '' }, emergencyContact: '',
        address: '', baseSalary: '', password: '',
      });
      setProfilePicture(null);
      setPreview(null);
    } catch (error) {
      toast.error(error.response.data.message || 'Error adding employee');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Add Employee</h2>
      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
      <input type="text" name="contact" placeholder="Contact" value={formData.contact} onChange={handleChange} />
      <input type="text" name="aadhaar" placeholder="Aadhaar" value={formData.aadhaar} onChange={handleChange} />
      <input type="text" name="pan" placeholder="PAN" value={formData.pan} onChange={handleChange} />
      <input type="text" name="bankDetails.accountNo" placeholder="Account No" value={formData.bankDetails.accountNo} onChange={handleChange} />
      <input type="text" name="bankDetails.ifsc" placeholder="IFSC" value={formData.bankDetails.ifsc} onChange={handleChange} />
      <input type="text" name="emergencyContact" placeholder="Emergency Contact" value={formData.emergencyContact} onChange={handleChange} />
      <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange}></textarea>
      <input type="number" name="baseSalary" placeholder="Base Salary" value={formData.baseSalary} onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
      <input type="file" name="profilePicture" accept="image/*" onChange={handleFileChange} />
      {preview && (
        <img src={preview} alt="Preview" className="profile-pic preview" />
      )}
      <button type="submit">Add Employee</button>
    </form>
  );
};

export default EmployeeForm;