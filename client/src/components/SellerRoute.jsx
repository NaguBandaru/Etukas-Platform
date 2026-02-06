import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const SellerRoute = () => {
    const { user, isAuthenticated, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    if (!isAuthenticated) return <Navigate to="/login" />;

    if (['seller', 'worker', 'owner', 'admin'].includes(user.role)) {
        return <Outlet />;
    }

    return <Navigate to="/" />;
};

export default SellerRoute;
