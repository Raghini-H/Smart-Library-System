import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import '../../style/UserSearchBooks.css';
import '../../style/Popup.css';

const SearchBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [requestStatusByBook, setRequestStatusByBook] = useState({});
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedBookIds, setSelectedBookIds] = useState([]);
    const [popup, setPopup] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedPlan = localStorage.getItem('selectedPlan');
        if (storedPlan) {
            try {
                setSelectedPlan(JSON.parse(storedPlan));
            } catch {
                localStorage.removeItem('selectedPlan');
            }
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [booksRes, requestsRes] = await Promise.all([
                    API.get('/user/search-books'),
                    API.get('/user/my-request'),
                ]);

                setBooks(booksRes.data || []);

                const map = {};
                (requestsRes.data || []).forEach((req) => {
                    const bookId = req.book?._id;
                    if (bookId && !map[bookId]) {
                        map[bookId] = {
                            status: req.status,
                            returnStatus: req.returnStatus,
                        };
                    }
                });
                setRequestStatusByBook(map);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch books');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="container">Loading books...</div>;
    if (error) return <div className="container error-message">{error}</div>;

    const handleNormalRequest = async (bookId) => {
        const periodInput = window.prompt('Enter rent period in months:', '1');
        const rentPeriod = Number(periodInput);

        if (!periodInput || Number.isNaN(rentPeriod) || rentPeriod <= 0) {
            return;
        }

        try {
            const res = await API.post('/user/request-book', { bookId, rentPeriod });
            setPopup({
                title: 'Request sent',
                message: res.data.message || 'Request sent successfully.',
                okText: 'OK',
            });
            setRequestStatusByBook((prev) => ({
                ...prev,
                [bookId]: { status: 'pending', returnStatus: 'none' },
            }));
        } catch (err) {
            setPopup({
                title: 'Error',
                message: err.response?.data?.message || 'Failed to send request',
                okText: 'OK',
            });
        }
    };

    const canRentBook = (statusInfo) => {
        if (!statusInfo) return true;
        const { status, returnStatus } = statusInfo;

        if (status === 'pending') return false;
        if (status === 'approved') return false; 

        if (status === 'returned' || status === 'rejected') return true;

        return false;
    };

    const handleRequest = (book) => {
        const statusInfo = requestStatusByBook[book._id];

        if (!canRentBook(statusInfo)) {
            setPopup({
                title: 'Cannot rent this book',
                message:
                    'You already have this book issued or a request is pending. You can only rent books that show "Request to rent" or "Rent again".',
                okText: 'OK',
            });
            return;
        }

        if (selectedPlan) {
            setSelectedBookIds((prev) => {
                const already = prev.includes(book._id);
                if (already) {
                    return prev.filter((id) => id !== book._id);
                }
                if (prev.length >= (selectedPlan.bookLimit || 0)) {
                    setPopup({
                        title: 'Limit reached',
                        message: `You must choose exactly ${selectedPlan.bookLimit} books in this plan.`,
                        okText: 'OK',
                    });
                    return prev;
                }
                return [...prev, book._id];
            });
            return;
        }

        setPopup({
            title: 'Choose plan?',
            message:
                'Do you want to choose a plan before renting?\n\nOK: Show Plans\nCancel: Rent this single book.',
            okText: 'Show Plans',
            cancelText: 'Rent without plan',
            onOk: () => {
                setPopup(null);
                navigate('/user/plans');
            },
            onCancel: () => {
                setPopup(null);
                handleNormalRequest(book._id);
            },
        });
    };

    const handleConfirmPlan = async () => {
        if (!selectedPlan || selectedBookIds.length === 0) return;

        if (selectedBookIds.length !== (selectedPlan.bookLimit || 0)) {
            setPopup({
                title: 'Select more books',
                message: `You must choose exactly ${selectedPlan.bookLimit} books for this plan.`,
                okText: 'OK',
            });
            return;
        }

        const periodInput = window.prompt('Enter rent period in months for this plan:', '1');
        const rentPeriod = Number(periodInput);

        if (!periodInput || Number.isNaN(rentPeriod) || rentPeriod <= 0) {
            return;
        }

        const selectedBooks = books.filter((b) => selectedBookIds.includes(b._id));
        const totalBefore = selectedBooks.reduce(
            (sum, b) => sum + Number(b.rent || 0) * rentPeriod,
            0
        );
        const discountAmount = (totalBefore * (selectedPlan.discount || 0)) / 100;
        const totalAfter = totalBefore - discountAmount;

        const summary =
            `Plan: ${selectedPlan.name}\n` +
            `Books: ${selectedBookIds.length} / ${selectedPlan.bookLimit}\n\n` +
            `Total rent before discount: ${totalBefore}\n` +
            `Discount (${selectedPlan.discount}%): -${discountAmount}\n` +
            `Total rent after discount: ${totalAfter}\n\n` +
            `Press Confirm to send requests for all selected books.`;

        setPopup({
            title: 'Confirm plan requests',
            message: summary,
            okText: 'Confirm',
            cancelText: 'Cancel',
            onOk: async () => {
                setPopup(null);
                try {
                    for (const bookId of selectedBookIds) {
                        
                        await API.post('/user/request-book', { bookId, rentPeriod });
                    }

                    setPopup({
                        title: 'Requests sent',
                        message: 'Requests sent for all selected books in the plan.',
                        okText: 'OK',
                    });

                    setRequestStatusByBook((prev) => {
                        const next = { ...prev };
                        selectedBookIds.forEach((id) => {
                            next[id] = 'pending';
                        });
                        return next;
                    });

                    setSelectedBookIds([]);
                    localStorage.removeItem('selectedPlan');
                    setSelectedPlan(null);
                } catch (err) {
                    setPopup({
                        title: 'Error',
                        message:
                            err.response?.data?.message ||
                            'Failed to send plan requests',
                        okText: 'OK',
                    });
                }
            },
            onCancel: () => setPopup(null),
        });
    };

    const renderRequestCell = (bk) => {
        const info = requestStatusByBook[bk._id];
        const inPlanSelection = selectedBookIds.includes(bk._id);

        if (selectedPlan) {
            const rentable = canRentBook(info);
            if (!rentable) {
                return (
                    <button disabled>
                        Not available
                    </button>
                );
            }
            return (
                <button onClick={() => handleRequest(bk)}>
                    {inPlanSelection ? 'Remove from plan' : 'Add to plan'}
                </button>
            );
        }

        if (!info) {
            return (
                <button onClick={() => handleRequest(bk)}>
                    Request to rent
                </button>
            );
        }

        if (info.status === 'pending') {
            return (
                <button disabled>
                    Pending
                </button>
            );
        }

        if (info.status === 'approved') {
            let label = 'Already issued';
            if (info.returnStatus === 'pending') label = 'Return pending';
            if (info.returnStatus === 'due') label = 'Return due';
            return <span style={{ color: 'green', fontWeight: 'bold' }}>{label}</span>;
        }

        if (info.status === 'rejected' || info.status === 'returned') {
            return (
                <button onClick={() => handleRequest(bk)}>
                    Rent again
                </button>
            );
        }

        return info.status;
    };

    return (
        <div className="container">
            <h2 className="page-title">Search Books</h2>

            {popup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <div className="popup-title">{popup.title || 'Message'}</div>
                        <div className="popup-message">{popup.message}</div>
                        <div className="popup-actions">
                            {popup.cancelText && (
                                <button
                                    className="popup-btn popup-btn-secondary"
                                    onClick={popup.onCancel || (() => setPopup(null))}
                                >
                                    {popup.cancelText}
                                </button>
                            )}
                            <button
                                className="popup-btn popup-btn-primary"
                                onClick={popup.onOk || (() => setPopup(null))}
                            >
                                {popup.okText || 'OK'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedPlan && (
                <div className="plan-summary" style={{ marginBottom: '16px' }}>
                    <p>
                        <strong>Selected plan:</strong> {selectedPlan.name} —{' '}
                        {selectedPlan.bookLimit} books, {selectedPlan.discount}% discount
                    </p>
                    <p>
                        <strong>Selected books in this plan:</strong>{' '}
                        {selectedBookIds.length} / {selectedPlan.bookLimit}
                    </p>
                    {selectedBookIds.length > 0 && (
                        <button className="confirm-plan-btn" onClick={handleConfirmPlan}>
                            Confirm plan request with selected books
                        </button>
                    )}
                </div>
            )}

            <div className="employee-grid">
                {books.length === 0 ? (
                    <p>No books found.</p>
                ) : (
                    <table className="employee-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Category</th>
                                <th>Rent Fees/month</th>
                                <th>Request Status / Plan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((bk) => (
                                <tr key={bk._id}>
                                    <td>{bk.title}</td>
                                    <td>{bk.author}</td>
                                    <td>{bk.category}</td>
                                    <td>{bk.rent}</td>
                                    <td>
                                        {renderRequestCell(bk)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default SearchBooks;



