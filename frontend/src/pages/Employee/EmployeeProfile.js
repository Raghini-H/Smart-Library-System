import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import '../../style/EmployeeProfile.css';

const EmployeeProfile = () => {
  const [employee, setEmployee] = useState({});
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/employee/profile');
        setEmployee(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await API.put('/employee/profile', formData);
      setEmployee(res.data.employee);
      setEditing(false);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    }
  };

  const handleCancel = () => {
    setFormData(employee);
    setEditing(false);
    setMessage('');
  };

  if (loading) return <div className="profile-container">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Employee Profile</h2>

        {message && <div className="profile-message">{message}</div>}

        {!editing ? (
          <>
            <div className="profile-field"><strong>Name:</strong> {employee.name}</div>
            <div className="profile-field"><strong>Email:</strong> {employee.email}</div>
            <div className="profile-field"><strong>Employee ID:</strong> {employee.employeeId}</div>
            <div className="profile-field"><strong>Department:</strong> {employee.department}</div>
            <div className="profile-field"><strong>Phone:</strong> {employee.phone}</div>
            <div className="profile-field"><strong>Designation:</strong> {employee.designation}</div>
            <div className="profile-field"><strong>Address:</strong> {employee.address}</div>

            <button className="edit-btn" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          </>
        ) : (
          <>
            <input name="name" placeholder='Name' value={formData.name || ''} onChange={handleChange} />
            <input name="email" placeholder='Email' value={formData.email || ''} onChange={handleChange} />
            <input name="department" placeholder='Department' value={formData.department || ''} onChange={handleChange} />
            <input name="phone" placeholder='Phone Number' value={formData.phone || ''} onChange={handleChange} />
            <input name="designation" placeholder='Designation' value={formData.designation || ''} onChange={handleChange} />
            <input name="address" placeholder='Address' value={formData.address || ''} onChange={handleChange} />
            <input type="date" placeholder='Joining Date' name="joiningDate" value={formData.joiningDate || ''} onChange={handleChange} />
            <input type="password" name="password" placeholder="New password (optional)" onChange={handleChange} />

            <div className="profile-actions">
              <button className="save-btn" onClick={handleSave}>Save</button>
              <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfile;