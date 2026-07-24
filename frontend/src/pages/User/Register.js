import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../../style/Register.css';


const Register = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        fullname: "",
        email: "",
        password: "",
        userid: "",
        department: "",
        phone: "",
        college: "",
        year: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formData = new FormData(e.target);
            const response = await API.post('/auth/register', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert(response.data.message);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="libraryRegisterPage">
            <div className="libraryCard">
                <h1 className="libraryTitle">Smart Library Management System</h1>
                <p className="librarySubtitle">Create your student account</p>

                {error && <div className="errorBox">{error}</div>}

                <form onSubmit={handleSubmit} className="libraryForm">
                    <Row>
                        <Col>
                            <label>Full Name</label>
                            <input type="text" name="fullname" value={user.fullname} className='fields' onChange={handleChange} placeholder="Your full name" required />

                            <label>Email</label>
                            <input type="email" name="email" value={user.email} className='fields' onChange={handleChange} placeholder="example@mail.com" required />

                            <label>Password</label>
                            <input type="password" name="password" value={user.password} className='fields' onChange={handleChange} placeholder="Create a password" required />

                            <label>User ID</label>
                            <input type="text" name="userid" value={user.userid} className='fields' onChange={handleChange} placeholder="Student ID" required />

                            <label>Department</label>
                            <input type="text" name="department" value={user.department} className='fields' onChange={handleChange} placeholder="CSE / IT / ECE..." required />
                        </Col>

                        <Col>
                            <label>Phone Number</label>
                            <input type="text" name="phone" value={user.phone} className='fields' onChange={handleChange} placeholder="10-digit phone number" required />

                            <label>College Name</label>
                            <input type="text" name="college" value={user.college} className='fields' onChange={handleChange} placeholder="Your college name" required />

                            <label>Year of Study</label>
                            <input type="number" name="year" value={user.year} className='fields' onChange={handleChange} placeholder="1 / 2 / 3 / 4" required />

                            <label>Profile Photo</label>
                            <input type="file" name="profile" className='fileInput' required />

                            <button type="submit" disabled={loading} className="registerBtn">
                                {loading ? "Creating Account..." : "Register"}
                            </button>
                        </Col>
                    </Row>
                </form>

                <p className="loginLink">
                    Already have an account? <span onClick={() => navigate('/login')}>Login</span>
                </p>
            </div>
        </div>
    )
}
export default Register;