import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import styles from './Auth.module.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { email, password } = formData;
    const { login, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        // Capture start time to ensure at least 1s delay
        const startTime = Date.now();

        try {
            await login({ email, password });

            // Calculate remaining time for 1s delay
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, 1000 - elapsedTime);

            setTimeout(() => {
                setIsSubmitting(false);
                navigate('/');
            }, remainingTime);

        } catch (err) {
            console.error("Login component error:", err);
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, 1000 - elapsedTime);

            setTimeout(() => {
                setIsSubmitting(false);
                setError(err.response?.data?.message || 'Server Error. Please try again.');
            }, remainingTime);
        }
    };


    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <h2 className="text-primary" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login to Etukas</h2>
                {error && <div className={styles.errorMessage}>{error}</div>}
                <form onSubmit={onSubmit}>
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
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <div className="loader" style={{ borderTopColor: '#fff' }}></div> : 'Login'}
                    </button>

                </form>
                <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                    Don't have an account? <Link to="/register" className="text-primary">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
