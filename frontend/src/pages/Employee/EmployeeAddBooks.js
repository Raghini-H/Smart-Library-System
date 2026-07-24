import React, { useState } from 'react';
import API from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import '../../style/EmployeeAddBooks.css';

const EmployeeAddBooks = () => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        category: '',
        rent: '',
    });

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("author", formData.author);
            data.append("category", formData.category);
            data.append("rent", formData.rent);
            data.append("bookcover", file);

            const response = await API.post('/employee/add-books', data);

            setSuccess('Book Added Successfully');
            setFormData({ title: '', author: '', category: '', rent: '' });
            setFile(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="employee-reg-page">
            <div className="employee-reg-card">
                <h2>Add Books</h2>

                {error && <div className="employee-reg-error">{error}</div>}
                {success && <div className="employee-reg-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter title"
                        required
                    />

                    <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        placeholder="Enter author"
                        required
                    />

                    <input
                        type="file"
                        name="bookcover"
                        onChange={handleFileChange}
                        required
                    />

                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Enter category"
                        required
                    />

                    <input
                        type="text"
                        name="rent"
                        value={formData.rent}
                        onChange={handleChange}
                        placeholder="Enter rent"
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Adding..." : "Add Books"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EmployeeAddBooks;