import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import '../../style/AdminViewEmployees.css';

const ViewEmployee = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await API.get('/admin/view-employee');
                setEmployees(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch employees');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    if (loading) return <div className="container">Loading employees...</div>;
    if (error) return <div className="container error-message">{error}</div>;

    return (
        <div className="container">
            <h2 className="page-title">View Employees</h2>
            <div className="employee-grid">
                {employees.length === 0 ? (
                    <p>No employees found.</p>
                ) : (
                    <table className="employee-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Employee ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp) => (
                                <tr key={emp._id}>
                                    <td>{emp.name}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.employeeId}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ViewEmployee;
