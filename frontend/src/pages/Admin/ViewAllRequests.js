import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import '../../style/AdminViewAllRequests.css';

const ViewAllRequests = () => {
    const [request, setRequest] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await API.get('/admin/view-all-requests');
                setRequest(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch requests');
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    if (loading) return <div className="container">Loading books...</div>;
    if (error) return <div className="container error-message">{error}</div>;

    return (
        <div className="container">
            <h2 className="page-title">View Books</h2>
            <div className="employee-grid">
                {request.length === 0 ? (
                    <p>No requests found.</p>
                ) : (
                    <table className="employee-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Book Title</th>
                                <th>Rent Period</th>
                                <th>Issue Date</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Return Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {request.map((rq) => (
                                <tr key={rq._id}>
                                    <td>{rq.user?.fullname}</td>
                                    <td>{rq.book?.title}</td>
                                    <td>{rq.rentPeriod}</td>
                                    <td>{new Date(rq.issueDate).toLocaleDateString()}</td>
                                    <td>{new Date(rq.dueDate).toLocaleDateString()}</td>
                                    <td>{rq.status}</td>
                                    <td>{rq.returnStatus}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ViewAllRequests;
