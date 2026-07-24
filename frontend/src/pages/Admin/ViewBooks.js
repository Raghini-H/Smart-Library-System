import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import '../../style/AdminViewBooks.css';

const ViewBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await API.get('/admin/view-books');
                setBooks(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch books');
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
                {books.length === 0 ? (
                    <p>No employees found.</p>
                ) : (
                    <table className="employee-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Category</th>
                                <th>Rent Fees/month</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((bk) => (
                                <tr key={bk._id}>
                                    <td>{bk.title}</td>
                                    <td>{bk.author}</td>
                                    <td>{bk.category}</td>
                                    <td>{bk.rent}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ViewBooks;
