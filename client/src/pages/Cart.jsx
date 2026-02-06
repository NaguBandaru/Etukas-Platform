import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import LocationContext from '../context/LocationContext';
import axios from 'axios';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useContext(CartContext);
    const { location } = useContext(LocationContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        if (!location) {
            alert('Please allow location access to proceed with delivery.');
            return;
        }

        setLoading(true);
        try {
            const config = {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            };

            const orderData = {
                items: cartItems.map(item => ({
                    listing: item._id,
                    title: item.title,
                    price: item.price,
                    quantity: item.quantity,
                    seller: item.user?._id || item.user // Ensure we get the ID
                })),
                totalAmount: cartTotal,
                shippingAddress: {
                    addressLine: location.address,
                    coordinates: [location.lng, location.lat]
                }
            };

            const res = await axios.post('http://localhost:5000/api/orders', orderData, config);

            if (res.data.success) {
                alert('Order Placed Successfully!');
                clearCart();
                navigate('/bookings'); // Redirect to orders/bookings page
            }
        } catch (err) {
            console.error(err);
            alert('Checkout failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ paddingBottom: '80px', minHeight: '100vh', background: '#f8f8f8' }}>

            <div className="container" style={{ paddingTop: '1rem' }}>
                <div className="flex items-center gap-2 mb-4">
                    <FiArrowLeft size={20} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
                    <h2 style={{ fontSize: '1.25rem' }}>Your Cart</h2>
                </div>

                {cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '3rem', color: '#888' }}>
                        <p>Your cart is empty.</p>
                        <button
                            className="btn btn-primary mt-4"
                            onClick={() => navigate('/')}
                        >
                            Browse Materials
                        </button>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {cartItems.map(item => (
                                <div key={item._id} style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    boxShadow: 'var(--shadow-sm)',
                                    display: 'flex',
                                    gap: '1rem'
                                }}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        background: '#eee',
                                        borderRadius: '8px',
                                        overflow: 'hidden'
                                    }}>
                                        {item.images && item.images[0] && (
                                            <img src={item.images[0]} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        )}
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ marginBottom: '0.25rem' }}>{item.title}</h4>
                                        <div style={{ fontWeight: '600', color: '#181818' }}>₹{item.price} / {item.unit}</div>

                                        <div className="flex justify-between items-end mt-2">
                                            <div className="flex items-center gap-3" style={{ background: '#f0f0f0', borderRadius: '6px', padding: '2px 8px' }}>
                                                <FiMinus
                                                    size={16}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                />
                                                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{item.quantity}</span>
                                                <FiPlus
                                                    size={16}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                />
                                            </div>

                                            <FiTrash2
                                                size={18}
                                                color="#e53935"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => removeFromCart(item._id)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bill Summary */}
                        <div style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            marginTop: '2rem',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Bill Details</h3>
                            <div className="flex justify-between mb-2" style={{ color: '#666' }}>
                                <span>Item Total</span>
                                <span>₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-between mb-2" style={{ color: '#666' }}>
                                <span>Delivery Fee</span>
                                <span style={{ color: 'green' }}>FREE</span>
                            </div>
                            <div style={{ height: '1px', background: '#eee', margin: '0.5rem 0' }}></div>
                            <div className="flex justify-between" style={{ fontWeight: '700', fontSize: '1.1rem' }}>
                                <span>To Pay</span>
                                <span>₹{cartTotal}</span>
                            </div>
                        </div>

                        {/* Sticky Action Button */}
                        <div style={{
                            position: 'fixed',
                            bottom: '70px',
                            left: 0,
                            right: 0,
                            padding: '1rem',
                            background: 'white',
                            borderTop: '1px solid #eee'
                        }}>
                            <div className="container">
                                <button
                                    className="btn btn-primary btn-block"
                                    onClick={handleCheckout}
                                    disabled={loading || cartItems.length === 0}
                                >
                                    {loading ? 'Processing...' : `Pay ₹${cartTotal}`}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;
