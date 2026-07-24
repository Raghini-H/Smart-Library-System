import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../style/Navbar.css';

const UserNavbar = () => {
  const { user } = useAuth();

  if (!user || user.type !== 'user') return null;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <ul className="nav-links">
          <li><Link to="/dashboard" className="nav-logo">Smart Library</Link></li>
          <li><Link to="/user/search-books">Search Books</Link></li>
          <li><Link to="/user/plans">Plans</Link></li>
          <li><Link to="/user/my-issued-books">My Issued Books</Link></li>
          <li><Link to="/user/my-request">My Requests</Link></li>
          <li><Link to="/user/profile">Profile</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default UserNavbar;