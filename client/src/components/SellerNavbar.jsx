import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { FiHome, FiList, FiTrendingUp, FiShoppingBag, FiUser, FiLogOut, FiPlusSquare, FiSettings } from 'react-icons/fi';
import logo from '../assets/logo.png';
import './SellerNavbar.css';

const SellerNavbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="seller-header">
            <div className="seller-sidebar">
                <div className="sidebar-logo" onClick={() => navigate('/')}>
                    <img src={logo} alt="Etukas" />
                    <span className="logo-badge">Seller</span>
                </div>

                <div className="sidebar-links">
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}>
                        <FiHome size={22} />
                        <span>Overview</span>
                    </NavLink>
                    <NavLink to="/listings" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}>
                        <FiList size={22} />
                        <span>My Listings</span>
                    </NavLink>
                    <NavLink to="/orders" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}>
                        <FiShoppingBag size={22} />
                        <span>Orders</span>
                    </NavLink>
                    <NavLink to="/earnings" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}>
                        <FiTrendingUp size={22} />
                        <span>Earnings</span>
                    </NavLink>
                </div>

                <div className="sidebar-footer">
                    <NavLink to="/profile" className="sidebar-item">
                        <FiUser size={22} />
                        <span>Profile</span>
                    </NavLink>
                    <button className="sidebar-item logout-btn" onClick={handleLogout}>
                        <FiLogOut size={22} />
                        <span>Logout</span>
                    </button>

                    <div className="seller-info">
                        <div className="seller-id-chip">
                            ID: {user?.sellerId || 'PENDING'}
                        </div>
                        <div className="seller-name">{user?.name}</div>
                    </div>
                </div>
            </div>

            <div className="seller-top-nav">
                <div className="top-nav-title">Seller Console</div>
                <div className="top-nav-actions">
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/dashboard')}>
                        <FiPlusSquare /> Post New Listing
                    </button>
                    <div className="user-avatar">
                        {user?.name.charAt(0)}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default SellerNavbar;
