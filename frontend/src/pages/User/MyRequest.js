import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import '../../style/UserMyRequest.css';

const MyRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const response = await API.get('/user/my-request');
        setRequests(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch requests');
      } finally {
        setLoading(false);
      }
    };

    fetchMyRequests();
  }, []);

  if (loading) return <div className="container">Loading requests...</div>;
  if (error) return <div className="container error-message">{error}</div>;

  return (
    <div className="container">
      <h2 className="page-title">My Requests</h2>

      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <table className="employee-table">
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Author</th>
              <th>Rent/Fees</th>
              <th>Rent Period (months)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r._id}>
                <td>{r.book?.title || 'Book not found'}</td>
                <td>{r.book?.author || '-'}</td>
                <td>{r.book?.rent || '-'}</td>
                <td>{r.rentPeriod || '-'}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyRequest;