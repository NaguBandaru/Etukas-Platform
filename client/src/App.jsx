import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import SellerNavbar from './components/SellerNavbar';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import Categories from './pages/Categories';
import SellerDashboard from './pages/SellerDashboard';
import SellerRoute from './components/SellerRoute';
import SplashScreen from './components/SplashScreen';
import './App.css';

function AppContent() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const isSeller = isAuthenticated && user?.role === 'seller';

  if (isSeller) {
    return (
      <div className="seller-app-container">
        <SellerNavbar />
        <div className="seller-main-content">
          <Routes>
            <Route path="/" element={<SellerDashboard />} />
            <Route path="/dashboard" element={<SellerDashboard />} />
            <Route path="/listings" element={<SellerDashboard />} />
            <Route path="/orders" element={<SellerDashboard />} />
            <Route path="/profile" element={<Profile />} />
            {/* Catch all for seller mode */}
            <Route path="*" element={<SellerDashboard />} />
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <ChatBot />
      <div className="main-content pb-nav">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Seller Routes */}
          <Route element={<SellerRoute />}>
            <Route path="/dashboard" element={<SellerDashboard />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
