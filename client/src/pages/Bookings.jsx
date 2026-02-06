import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { FiCalendar, FiClock, FiShoppingBag, FiTool, FiTruck } from 'react-icons/fi';

const Bookings = () => {
    const { user } = useContext(AuthContext);
    const [activities, setActivities] = useState([]); // Combined bookings and orders
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { withCredentials: true };
                // Fetch bookings where I am the customer
                const bookingsRes = await axios.get('http://localhost:5000/api/bookings/my', config);
                const ordersRes = await axios.get('http://localhost:5000/api/orders/my', config);

                let combined = [];
                if (bookingsRes.data.success) {
                    combined = [...combined, ...bookingsRes.data.data.map(b => ({ ...b, type: 'booking' }))];
                }
                if (ordersRes.data.success) {
                    combined = [...combined, ...ordersRes.data.data.map(o => ({ ...o, type: 'order' }))];
                }

                // Sort by date newest first
                combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setActivities(combined);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#ff9800';
            case 'confirmed': return '#4caf50';
            case 'cancelled': return '#f44336';
            case 'completed':
            case 'delivered': return '#2196f3';
            default: return '#999';
        }
    };

    return (
        <div style={{ paddingBottom: '80px', minHeight: '100vh', background: '#f8f8f8' }}>
            <div className="container" style={{ paddingTop: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>My Activities</h2>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>Loading your history...</div>
                ) : activities.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '3rem', color: '#888' }}>
                        <p>No active history.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {activities.map(item => (
                            <div key={item._id} style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '1rem',
                                boxShadow: 'var(--shadow-sm)',
                                borderTop: `4px solid ${getStatusColor(item.status)}`
                            }}>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        {item.type === 'order' ? <FiTruck color="#e53935" /> : <FiTool color="#4caf50" />}
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                                            {item.type === 'booking' ? (item.listing?.title || 'Unknown Item') : `${item.items?.length || 0} Material(s) Order`}
                                        </h3>
                                    </div>
                                    <span style={{
                                        fontSize: '0.8rem',
                                        fontWeight: 700,
                                        color: getStatusColor(item.status),
                                        textTransform: 'uppercase'
                                    }}>
                                        {item.status}
                                    </span>
                                </div>

                                <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <FiCalendar /> {new Date(item.date || item.createdAt).toLocaleDateString()}
                                    </div>
                                    {item.type === 'booking' && (
                                        <div className="flex items-center gap-2 mb-1">
                                            <FiClock /> {item.duration} {item.listing?.type === 'machine' ? 'Hours' : 'Days'}
                                        </div>
                                    )}
                                </div>

                                <div style={{
                                    marginTop: '0.5rem',
                                    paddingTop: '0.5rem',
                                    borderTop: '1px dashed #eee',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontWeight: 700
                                }}>
                                    <span>Total Price</span>
                                    <span>₹{item.totalPrice || item.totalAmount}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
};

export default Bookings;

