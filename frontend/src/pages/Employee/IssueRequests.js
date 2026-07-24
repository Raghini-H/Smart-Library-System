import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import '../../style/EmployeeIssueRequests.css';

const IssueRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const res = await API.get('/employee/issue-request');
    setRequests(res.data);
  };

  const updateStatus = async (id, status) => {
    await API.put(`/employee/issue-request/${id}`, { status });
    fetchRequests();
  };

  return (
    <div className="container">
      <h2>Issue Requests</h2>

      {requests.length === 0 ? (
        <p>No requests</p>
      ) : (
        <table className="employee-table">
          <thead>
            <tr>
              <th>FullName</th>
              <th>Email</th>
              <th>Book</th>
              <th>Category</th>
              <th>Rent Fees/month</th>
              <th>Rent Period (months)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((r) => (
              <tr key={r._id}>
                <td>{r.user?.fullname || 'User not found'}</td>
                <td>{r.user?.email || '-'}</td>
                <td>{r.book?.title || 'Book not found'}</td>
                <td>{r.book.category}</td>
                <td>{r.book.rent}</td>
                <td>{r.rentPeriod || '-'}</td>
                <td>
                  {r.status === 'pending' ? (
                    <>
                      <button onClick={() => updateStatus(r._id, 'approved')}>Approve</button>
                      <button onClick={() => updateStatus(r._id, 'rejected')}>Decline</button>
                    </>
                  ) : (
                    <button disabled>{r.status}</button>
                  )}
                </td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default IssueRequests;