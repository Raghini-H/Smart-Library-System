import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import '../../style/EmployeeLogin.css';


const EmployeeLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { employeeLogin } = useAuth();
    const navigate =useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await employeeLogin(formData.email, formData.password);
            navigate('/employee-dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="employee-auth-page">
            <div className="employee-auth-card">
                <h2 className="employee-title">Employee Login</h2>
                <p className="employee-subtitle">Welcome back! Login with your official email.</p>

                {error && <div className="employee-error">{error}</div>}

                <form onSubmit={handleSubmit} className="employee-auth-form">
                    <div className="employee-form-group">
                        <label>Employee Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter employee email"
                            required
                        />
                    </div>

                    <div className="employee-form-group">
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

                    <button type="submit" className="employee-auth-btn" disabled={loading}>
                        {loading ? "Logging in..." : "Login as Employee"}
                    </button>
                    <p className="employee-hint">
                        Don't have an account? <Link to="/employee-register">Register</Link><br/><br/>
                        Are you an admin? <Link to="/admin-login">Go to Admin Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default EmployeeLogin;
