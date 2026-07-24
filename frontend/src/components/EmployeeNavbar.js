import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Dropdown from 'react-bootstrap/Dropdown';
import '../style/Navbar.css';

const EmployeeNavbar = () => {
  const { user } = useAuth();
  if (!user || user.type !== 'employee') return null;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <ul className="nav-links">
          <li><Link to="/employee-dashboard" className="nav-logo">Smart Library</Link></li>
          <li><Dropdown>
            <Dropdown.Toggle variant="link" className="nav-dropdown-toggle" id="dropdown-basic">
              Manage Books
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/employee/add-books">
                Add Books
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/employee/view-books">
                View Books
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown></li>
          <li><Link to="/employee/issue-request">Issue Requests</Link></li>
          <li><Link to="/employee/return-requests">Return Requests</Link></li>
          <li><Link to="/employee/profile">Profile</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default EmployeeNavbar;