import React, { useState } from 'react';
import API from '../../api/axios';
import '../../style/AdminAddPlan.css';

const AddPlan = () => {
    const [formData, setFormData] = useState({
        name: '',
        bookLimit: '',
        discount: '',
        description: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await API.post('/admin/add-plan', {
                name: formData.name,
                bookLimit: Number(formData.bookLimit),
                discount: Number(formData.discount),
                description: formData.description,
            });

            setSuccess('Plan added successfully');
            setFormData({
                name: '',
                bookLimit: '',
                discount: '',
                description: '',
            });
        } catch (err) {
            
            setError(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="employee-reg-page">
            <div className="employee-reg-card">
                <h2>Add Plan</h2>

                {error && <div className="employee-reg-error">{error}</div>}
                {success && <div className="employee-reg-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Plan name (e.g. 10 books plan)"
                        required
                    />

                    <input
                        type="number"
                        name="bookLimit"
                        value={formData.bookLimit}
                        onChange={handleChange}
                        placeholder="Number of books (e.g. 10)"
                        min="1"
                        required
                    />

                    <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        placeholder="Discount (%) (e.g. 20)"
                        min="0"
                        max="100"
                        required
                    />

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Optional description"
                        rows="3"
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Plan'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddPlan;

