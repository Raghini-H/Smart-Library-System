import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import '../../style/UserPlans.css';
import '../../style/Popup.css';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [popup, setPopup] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await API.get('/user/plans');
        setPlans(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch plans');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleChoosePlan = (plan) => {
    localStorage.setItem('selectedPlan', JSON.stringify(plan));
    setPopup({
      title: 'Plan selected',
      message: 'Plan choosed successfully. You can now select books in Search Books page.',
      okText: 'Go to Search Books',
      onOk: () => {
        setPopup(null);
        navigate('/user/search-books');
      },
    });
  };

  if (loading) return <div className="container">Loading plans...</div>;
  if (error) return <div className="container error-message">{error}</div>;

  return (
    <div className="container">
      <h2 className="page-title">Plans</h2>

      {popup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <div className="popup-title">{popup.title || 'Message'}</div>
            <div className="popup-message">{popup.message}</div>
            <div className="popup-actions">
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

      {plans.length === 0 ? (
        <p>No plans available.</p>
      ) : (
        <table className="employee-table">
          <thead>
            <tr>
              <th>Plan</th>
              <th>Books</th>
              <th>Discount (%)</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan._id || plan.name}>
                <td>{plan.name}</td>
                <td>{plan.bookLimit}</td>
                <td>{plan.discount}</td>
                <td>{plan.description || '-'}</td>
                <td>
                  <button onClick={() => handleChoosePlan(plan)}>
                    Choose Plan
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Plans;

