import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import '../../style/AdminViewUsers.css';

const ViewUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await API.get('/admin/view-users');
                setUsers(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    if (loading) return <div className="container">Loading users...</div>;
    if (error) return <div className="container error-message">{error}</div>;

    return (
        <div className="container">
            <h2 className="page-title">View Users</h2>
            <div className="employee-grid">
                {users.length === 0 ? (
                    <p>No users found.</p>
                ) : (
                    <table className="employee-table">
                        <thead>
                            <tr>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>User ID</th>
                                <th>Contact</th>
                                <th>College</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((us) => (
                                <tr key={us._id}>
                                    <td>{us.fullname}</td>
                                    <td>{us.email}</td>
                                    <td>{us.userid}</td>
                                    <td>{us.phone}</td>
                                    <td>{us.college}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ViewUsers;  
