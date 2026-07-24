import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import '../../style/EmployeeReturnRequests.css';


const ReturnRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    try {
      const res = await API.get('/employee/return-requests');
      setRequests(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch return requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const confirmReturn = async (id) => {
    try {
      const res = await API.put(`/employee/return-requests/${id}`);
      alert(res.data.message);
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to confirm return');
    }
  };

  const requestReturnFromUser = async (id) => {
    try {
      const res = await API.put(`/employee/return-requests/${id}/request`);
      alert(res.data.message);
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to request return');
    }
  };

  const formatDate = (value) => {
    if (!value) return '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleDateString();
  };

  if (loading) return <div className="container">Loading return requests...</div>;
  if (error) return <div className="container error-message">{error}</div>;

  return (
    <div className="container">
      <h2>Return Requests</h2>

      {requests.length === 0 ? (
        <p>No return requests</p>
      ) : (
        <table className="employee-table">
          <thead>
            <tr>
              <th>FullName</th>
              <th>Email</th>
              <th>Book</th>
              <th>Category</th>
              <th>Rent Fees/month</th>
              <th>Issued On</th>
              <th>Due Date</th>
              <th>Return Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => {
              const isReturned = r.status === 'returned' || r.returnStatus === 'confirmed';
              const hasUserReturnPending = r.returnStatus === 'pending';
              const hasEmployeeRequestedReturn = r.returnStatus === 'due';


              const displayReturnStatus =
                r.returnStatus === 'none' && r.status === 'approved'
                  ? 'approved'
                  : r.returnStatus;

              return (
                <tr key={r._id}>
                  <td>{r.user?.fullname || 'User not found'}</td>
                  <td>{r.user?.email || '-'}</td>
                  <td>{r.book?.title || 'Book not found'}</td>
                  <td>{r.book?.category || '-'}</td>
                  <td>{r.book?.rent || '-'}</td>
                  <td>{formatDate(r.issueDate)}</td>
                  <td>{formatDate(r.dueDate)}</td>
                  <td>{displayReturnStatus}</td>
                  <td>
                    {!isReturned && r.status === 'approved' && r.returnStatus === 'none' && (
                      <button onClick={() => requestReturnFromUser(r._id)}>
                        Request to Return
                      </button>
                    )}
                    {hasUserReturnPending && (
                      <button onClick={() => confirmReturn(r._id)}>
                        Confirm
                      </button>
                    )}
                    {isReturned && (
                      <button disabled>returned</button>
                    )}
                    {hasEmployeeRequestedReturn && (
                      <button disabled>due</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReturnRequests;

