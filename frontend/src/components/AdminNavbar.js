import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Dropdown from 'react-bootstrap/Dropdown';
import '../style/Navbar.css';

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user || user.type !== 'admin') return null;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <ul className="nav-links">
          <li><Link to="/admin-dashboard" className="nav-logo">Smart Library</Link></li>
          <li><Link to="/admin/view-users">View Users</Link></li>

          <li>
            <Dropdown>
              <Dropdown.Toggle variant="link" className="nav-dropdown-toggle" id="dropdown-basic">
                Manage Employees
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/admin/add-employee">
                  Add Employee
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/admin/view-employee">
                  View Employees
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>

          <li>
            <Dropdown>
              <Dropdown.Toggle variant="link" className="nav-dropdown-toggle" id="dropdown-basic">
                Manage Books
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/admin/add-books">Add Books</Dropdown.Item>
                <Dropdown.Item as={Link} to="/admin/add-plan">Add Plan</Dropdown.Item>
                <Dropdown.Item as={Link} to="/admin/view-books">
                  View Books
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
          <li><Link to="/admin/view-all-requests">View All Requests</Link></li>

          
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;