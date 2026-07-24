import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import '../../style/UserMyIssuedBooks.css';

const MyIssuedBooks = () => {
  const [issued, setIssued] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchIssued = async () => {
      try {
        const res = await API.get('/user/my-issued-books');
        setIssued(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch issued books');
      } finally {
        setLoading(false);
      }
    };

    fetchIssued();
  }, []);

  const handleReturn = async (requestId) => {
    try {
      const res = await API.post(`/user/return-book/${requestId}`);
      alert(res.data.message);

      setIssued((prev) =>
        prev.map((r) =>
          r._id === requestId ? { ...r, returnStatus: 'pending' } : r
        )
      );
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

  if (loading) return <div className="container">Loading issued books...</div>;
  if (error) return <div className="container error-message">{error}</div>;

  return (
    <div className="container">
      <h2 className="page-title">My Issued Books</h2>

      {issued.length === 0 ? (
        <p>No issued books.</p>
      ) : (
        <table className="employee-table">
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Author</th>
              <th>Rent/Fees</th>
              <th>Issued On</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {issued.map((r) => {
              const isReturned =
                r.status === 'returned' || r.returnStatus === 'confirmed';
              const isPendingReturn = r.returnStatus === 'pending';
              const isReturnDue = r.returnStatus === 'due';

              let statusLabel = 'Issued';
              let statusStyle = {};

              if (isReturned) {
                statusLabel = 'Returned';
              } else if (isPendingReturn) {
                statusLabel = 'Return Pending';
              } else if (isReturnDue) {
                statusLabel = 'Return Due';
                statusStyle = { color: 'red', fontWeight: 'bold' };
              }

              const canReturn = !isReturned && !isPendingReturn;

              return (
                <tr key={r._id}>
                  <td>{r.book?.title || 'Book not found'}</td>
                  <td>{r.book?.author || '-'}</td>
                  <td>{r.book?.rent || '-'}</td>
                  <td>{formatDate(r.issueDate)}</td>
                  <td>{formatDate(r.dueDate)}</td>
                  <td style={statusStyle}>{statusLabel}</td>
                  <td>
                    {canReturn ? (
                      <button onClick={() => handleReturn(r._id)}>
                        Return Book
                      </button>
                    ) : (
                      <button disabled>{statusLabel}</button>
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

export default MyIssuedBooks;

