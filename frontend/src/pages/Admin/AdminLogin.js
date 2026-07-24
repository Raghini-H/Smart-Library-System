import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../style/AdminLogin.css';

const AdminLogin = () => {
    
    const [formData, setFormData] = useState({
        name: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { adminLogin } = useAuth();
    const navigate = useNavigate();


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await adminLogin(formData.name, formData.password);
            navigate('/admin-dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Admin login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-auth-page">
            <div className="admin-auth-card">
                <h2 className="admin-title">Admin Login</h2>
                <p className="admin-subtitle">Restricted access.</p>

                {error && <div className="admin-error">{error}</div>}

                <form onSubmit={handleSubmit} className="admin-auth-form">
                    <div className="admin-form-group">
                        <label>Admin Username</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter admin name"
                            required
                        />
                    </div>

                    <div className="admin-form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit" className="admin-auth-btn" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
