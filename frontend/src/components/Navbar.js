import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminNavbar from './AdminNavbar';
import EmployeeNavbar from './EmployeeNavbar';
import UserNavbar from './UserNavbar';

import '../style/Navbar.css';

const Navbar = () => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (user?.type === 'admin') return <AdminNavbar />;
    if (user?.type === 'employee') return <EmployeeNavbar />;
    if (user?.type === 'user') return <UserNavbar />;

    return (
        <nav className="navbar">
            <div className="nav-container">
                <ul className="nav-links">
                    <li><Link to="/" className="nav-logo">Smart Library</Link></li>
                    <li><Link to="/login">Student Login</Link></li>
                    <li><Link to="/employee-login">Staff Login</Link></li>
                    <li><Link to="/admin-login">Admin Login</Link></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;