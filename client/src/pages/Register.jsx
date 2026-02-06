import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import styles from './Auth.module.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'customer', // default role
        sellerCategory: 'Cement'
    });
    const { name, email, password, phone, role, sellerCategory } = formData;
    const { register, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            console.error('Registration error detail:', err.response?.data || err.message);
            const msg = err.response?.data?.message;
            setError(Array.isArray(msg) ? msg.join(', ') : (msg || 'Registration failed'));
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <h2 className="text-primary" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Join Etukas</h2>
                {error && <div className={styles.errorMessage}>{error}</div>}
                <form onSubmit={onSubmit}>
                    <div className={styles.formGroup}>
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            value={phone}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                            minLength="6"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>I want to:</label>
                        <select name="role" value={role} onChange={onChange} className={styles.selectInput}>
                            <option value="customer">Buy Materials / Book Services</option>
                            <option value="seller">Sell Building Materials</option>
                            <option value="worker">Offer Services (Worker)</option>
                            <option value="owner">Rent Machinery</option>
                        </select>
                    </div>
                    {role === 'seller' && (
                        <div className={styles.formGroup}>
                            <label>Categories (Select one or more)</label>
                            <div className={styles.categoryGrid}>
                                {['Cement', 'Steel', 'Bricks', 'Sand', 'Paint', 'Electrical', 'Plumbing', 'Other'].map(cat => {
                                    const isSelected = Array.isArray(sellerCategory)
                                        ? sellerCategory.includes(cat)
                                        : sellerCategory === cat;

                                    return (
                                        <div
                                            key={cat}
                                            className={`${styles.categoryChip} ${isSelected ? styles.active : ''}`}
                                            onClick={() => {
                                                const currentCats = Array.isArray(sellerCategory) ? [...sellerCategory] : [sellerCategory];
                                                if (currentCats.includes(cat)) {
                                                    if (currentCats.length > 1) { // Keep at least one
                                                        setFormData({ ...formData, sellerCategory: currentCats.filter(c => c !== cat) });
                                                    }
                                                } else {
                                                    setFormData({ ...formData, sellerCategory: [...currentCats, cat] });
                                                }
                                            }}
                                        >
                                            {cat}
                                        </div>
                                    );
                                })}
                            </div>
                            <small style={{ color: '#666', marginTop: '0.5rem', display: 'block' }}>
                                Your Seller ID will be generated based on: <strong>{Array.isArray(sellerCategory) ? sellerCategory[0] : sellerCategory}</strong>
                            </small>
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                </form>
                <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                    Already have an account? <Link to="/login" className="text-primary">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
