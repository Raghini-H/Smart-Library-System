import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../style/Home.css'

const Home = () => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (user) {
        if (user.type === 'admin') return <Navigate to="/admin-dashboard" replace />;
        if (user.type === 'employee') return <Navigate to="/employee-dashboard" replace />;
        if (user.type === 'user') return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="homePage">
            <div className="homeCard">
                <h1 className="homeTitle">Smart Library Management System</h1>
                <p className="homeSubtitle">
                    Manage books, issue & return, and track your library activity — all in one place.
                </p>
            </div>
        </div>
    );
};

export default Home;
