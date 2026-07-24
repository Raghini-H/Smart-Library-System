import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import '../../style/UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/user/profile');
        setUser(res.data);
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
      const res = await API.put('/user/profile', formData);
      setUser(res.data.user);
      setEditing(false);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setEditing(false);
    setMessage('');
  };

  if (loading) return <div className="profile-container">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>My Profile</h2>

        {message && <div className="profile-message">{message}</div>}

        {!editing ? (
          <>
            <div className="profile-field"><strong>Name:</strong> {user.fullname}</div>
            <div className="profile-field"><strong>Email:</strong> {user.email}</div>
            <div className="profile-field"><strong>User ID:</strong> {user.userid}</div>
            <div className="profile-field"><strong>Department:</strong> {user.department}</div>
            <div className="profile-field"><strong>Phone:</strong> {user.phone}</div>
            <div className="profile-field"><strong>College:</strong> {user.college}</div>
            <div className="profile-field"><strong>Year:</strong> {user.year}</div>

            <button className="edit-btn" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          </>
        ) : (
      
          <>
            <input name="fullname" value={formData.fullname || ''} onChange={handleChange} />
            <input name="email" value={formData.email || ''} onChange={handleChange} />
            <input name="department" value={formData.department || ''} onChange={handleChange} />
            <input name="phone" value={formData.phone || ''} onChange={handleChange} />
            <input name="college" value={formData.college || ''} onChange={handleChange} />
            <input name="year" value={formData.year || ''} onChange={handleChange} />
            <input
              type="password"
              name="password"
              placeholder="New password (optional)"
              onChange={handleChange}
            />

            <div className="profile-actions">
              <button className="save-btn" onClick={handleSave}>
                Save Changes
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;