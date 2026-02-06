import { NavLink, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import { FiHome, FiShoppingBag, FiBriefcase, FiUser, FiLogOut, FiShoppingCart, FiGrid, FiSearch } from 'react-icons/fi';
import logo from '../assets/logo.png';
import logoSmall from '../assets/logo-small.png';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 80) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // Mobile Top Header
    const MobileHeader = () => (
        <div className={`mobile-header ${isScrolled ? 'scrolled' : ''}`}>
            {!isScrolled ? (
                <div className="logo-container" onClick={() => navigate('/')}>
                    <img src={logo} alt="Etukas" className="navbar-logo" />
                </div>
            ) : (
                <div className="mobile-search-container">
                    <div className="small-logo-container" onClick={() => navigate('/')}>
                        <img src={logoSmall} alt="E" className="small-logo" />
                    </div>
                    <div className="compact-search-bar" onClick={() => navigate('/')}>
                        <FiSearch size={18} />
                        <span>Search Etukas...</span>
                    </div>
                </div>
            )}
        </div>
    );

    // Responsive Mobile Bottom Nav
    const MobileNav = () => (
        <div className="mobile-nav">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <FiHome size={24} />
                <span>Home</span>
            </NavLink>
            <NavLink to="/categories" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <FiGrid size={24} />
                <span>Categories</span>
            </NavLink>
            <NavLink to="/cart" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <div style={{ position: 'relative' }}>
                    <FiShoppingCart size={24} />
                    {cartItems.length > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            background: 'var(--primary-red)',
                            color: 'white',
                            fontSize: '0.7rem',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold'
                        }}>{cartItems.length}</span>
                    )}
                </div>
                <span>Cart</span>
            </NavLink>
            {/* Show different middle icon based on role logic later, keeping generic for now */}
            <NavLink to="/bookings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <FiBriefcase size={24} />
                <span>Bookings</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <FiUser size={24} />
                <span>Account</span>
            </NavLink>
        </div>
    );

    // Desktop Top Nav
    const DesktopNav = () => (
        <nav className={`desktop-nav ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container flex justify-between items-center h-full gap-6">
                <div className="logo-container" onClick={() => navigate('/')} style={{ cursor: 'pointer', flexShrink: 0 }}>
                    <img src={logo} alt="Etukas" className="navbar-logo" />
                </div>

                <div className="desktop-search-wrapper">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search for materials, services..."
                        className="desktop-search-input"
                    />
                </div>

                <div className="flex items-center gap-4" style={{ flexShrink: 0 }}>
                    <button className="btn btn-outline" onClick={() => navigate('/categories')}>
                        Categories
                    </button>
                    <button className="btn" onClick={() => navigate('/cart')} style={{ position: 'relative' }}>
                        <FiShoppingCart size={24} />
                        {cartItems.length > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '0',
                                right: '0',
                                background: 'var(--primary-red)',
                                color: 'white',
                                fontSize: '0.7rem',
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold'
                            }}>{cartItems.length}</span>
                        )}
                    </button>

                    {isAuthenticated ? (
                        <>
                            {['seller', 'worker', 'owner', 'admin'].includes(user?.role) && (
                                <button className="btn btn-outline" onClick={() => navigate('/dashboard')} style={{ marginRight: '0.5rem' }}>
                                    Dashboard
                                </button>
                            )}
                            <span style={{ fontWeight: 600 }} className="user-greeting">Hi, {user?.name.split(' ')[0]}</span>
                            <button className="btn btn-outline" onClick={handleLogout}>
                                <div className="flex items-center gap-2">
                                    <FiLogOut /> Logout
                                </div>
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-2">
                            <button className="btn btn-primary" onClick={() => navigate('/login')}>Login</button>
                            <button className="btn btn-outline" onClick={() => navigate('/register')}>Sign Up</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );

    return (
        <>
            <DesktopNav />
            <MobileHeader />
            <MobileNav />
        </>
    );
};

export default Navbar;
