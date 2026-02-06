import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FiUser, FiLogOut, FiMapPin, FiSettings } from 'react-icons/fi';

const Profile = () => {
    const { user, logout, loading, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <div className="flex flex-col items-center gap-2">
                    <div className="loader"></div>
                    <p>Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                    background: '#fff5f5',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    color: 'var(--primary-red)'
                }}>
                    <FiUser size={40} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Join Etukas</h2>
                <p style={{ color: '#666', marginBottom: '2rem', maxWidth: '300px' }}>
                    Login to track your bookings, orders, and manage your profile.
                </p>
                <div className="flex flex-col gap-3" style={{ width: '100%', maxWidth: '300px' }}>
                    <button className="btn btn-primary" onClick={() => navigate('/login')} style={{ width: '100%', padding: '0.8rem' }}>
                        Login
                    </button>
                    <button className="btn btn-outline" onClick={() => navigate('/register')} style={{ width: '100%', padding: '0.8rem' }}>
                        Sign Up
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: '80px', minHeight: '100vh', background: '#f8f8f8' }}>

            <div className="container" style={{ paddingTop: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>My Account</h2>

                {/* Profile Card */}
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    marginBottom: '1.5rem'
                }}>
                    <div style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        background: 'var(--primary-red)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        fontWeight: 'bold'
                    }}>
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{user.name}</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>{user.email}</p>
                        <span style={{
                            display: 'inline-block',
                            marginTop: '0.5rem',
                            padding: '0.25rem 0.75rem',
                            background: '#eee',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            textTransform: 'capitalize',
                            fontWeight: 600
                        }}>
                            {user.role} Account
                        </span>
                    </div>
                </div>

                {/* Menu Options */}
                <div style={{ background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>

                    <div className="profile-menu-item" style={menuItemStyle} onClick={() => alert('Address Management Coming Soon')}>
                        <div className="flex items-center gap-3">
                            <FiMapPin className="text-primary" />
                            <span>Saved Addresses</span>
                        </div>
                        <span style={{ color: '#ccc' }}>&gt;</span>
                    </div>

                    <div className="profile-menu-item" style={menuItemStyle} onClick={() => alert('Settings Coming Soon')}>
                        <div className="flex items-center gap-3">
                            <FiSettings className="text-primary" />
                            <span>Settings</span>
                        </div>
                        <span style={{ color: '#ccc' }}>&gt;</span>
                    </div>

                    <div className="profile-menu-item" style={{ ...menuItemStyle, borderBottom: 'none', color: '#d32f2f' }} onClick={handleLogout}>
                        <div className="flex items-center gap-3">
                            <FiLogOut />
                            <span>Logout</span>
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '2rem', color: '#aaa', fontSize: '0.8rem' }}>
                    Etukas v1.0.0
                </div>
            </div>
        </div>
    );
};

const menuItemStyle = {
    padding: '1rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '1rem',
    fontWeight: 500,
    color: '#333'
};

export default Profile;
