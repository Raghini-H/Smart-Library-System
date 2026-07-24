import React, { useState } from 'react';
import API from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import '../../style/EmployeeRegister.css';

const EmployeeRegister = () => {
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
    const navigate = useNavigate();

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
            navigate('/employee-login');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="employee-reg-page">
            <div className="employee-reg-card">
                <h2 className="employee-reg-title">Employee Register</h2>
                <p className="employee-reg-subtitle">
                    Registered employees will get an email.
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
                            placeholder="Enter your name"
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
                            placeholder="Enter your email"
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
                            placeholder="Enter your employee ID"
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
                            placeholder="Create a password"
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
                        {loading ? "Registering..." : "Register Employee"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EmployeeRegister;
