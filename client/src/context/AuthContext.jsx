import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // API URL
    const API_URL = 'http://localhost:5000/api/auth';

    // Need credential setup for axios to send/receive cookies
    axios.defaults.withCredentials = true;

    // Check if user is logged in on load
    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        try {
            const res = await axios.get(`${API_URL}/me`);
            if (res.data.success) {
                setUser(res.data.data);
                setIsAuthenticated(true);
            }
        } catch (err) {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        const res = await axios.post(`${API_URL}/register`, userData);
        if (res.data.success) {
            setUser(res.data.user);
            setIsAuthenticated(true);
        }
        return res.data;
    };

    const login = async (userData) => {
        const res = await axios.post(`${API_URL}/login`, userData);
        if (res.data.success) {
            setUser(res.data.user);
            setIsAuthenticated(true);
        }
        return res.data;
    };

    const logout = async () => {
        await axios.get(`${API_URL}/logout`);
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
