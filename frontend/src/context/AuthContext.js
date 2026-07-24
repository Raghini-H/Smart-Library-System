import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    const persistUser = (data) => {
        if (data) {
            const nextUser = { ...data, type: data.role };
            setUser(nextUser);
            localStorage.setItem('user', JSON.stringify(nextUser));
        } else {
            setUser(null);
            localStorage.removeItem('user');
        }
    };

    useEffect(() => {
        if (user) {
            setLoading(false);
            return;
        }
        const checkAuth = async () => {
            try {
                const response = await API.get('/auth/me');
                persistUser(response.data);
            } catch (error) {
                persistUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const userLogin = async (email, password) => {
        const response = await API.post('/auth/login', { email, password });
        persistUser(response.data);
        return response.data;
    };

    const employeeLogin = async (email, password) => {
        const response = await API.post('/employee/login', { email, password });
        persistUser(response.data);
        return response.data;
    };

    const adminLogin = async (name, password) => {
        const response = await API.post('/admin/login', { name, password });
        persistUser(response.data);
        return response.data;
    };

    const register = async (username, email, password) => {
        const response = await API.post('/auth/register', { username, email, password });
        persistUser(response.data);
        return response.data;
    };

    const logout = async () => {
        try {
            await API.post('/auth/logout');
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            persistUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, userLogin, employeeLogin, adminLogin, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
