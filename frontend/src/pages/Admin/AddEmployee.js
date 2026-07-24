import React, { useState } from 'react';
import API from '../../api/axios';
import '../../style/AdminAddEmployee.css';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employeeId: '',
    password: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('employeeId', formData.employeeId);
    data.append('password', formData.password);
    if (file) {
      data.append('image', file);
    }

    try {
      const response = await API.post('/employee/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(response.data.message);
      setFormData({ name: '', email: '', employeeId: '', password: '' });
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employee-reg-page">
      <div className="employee-reg-card">
        <h2 className="employee-reg-title">Add Employee</h2>
        <p className="employee-reg-subtitle">
          Admin can create employee accounts. Login details will be emailed.
        </p>

        {error && <div className="employee-reg-error">{error}</div>}
        {success && <div className="employee-reg-success">{success}</div>}

        <form onSubmit={handleSubmit} className="employee-reg-form">
          <div className="employee-reg-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter employee name"
              required
            />
          </div>

          <div className="employee-reg-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter employee email"
              required
            />
          </div>

          <div className="employee-reg-group">
            <label>Employee ID</label>
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="Enter employee ID"
              required
            />
          </div>

          <div className="employee-reg-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create password"
              required
            />
          </div>

          <div className="employee-reg-group file-input">
            <label>ID Proof</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
            />
          </div>

          <button type="submit" className="employee-reg-btn" disabled={loading}>
            {loading ? 'Adding...' : 'Add Employee'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;

