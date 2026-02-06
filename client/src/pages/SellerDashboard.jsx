import { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { CATEGORIES } from '../utils/categories';
import { FiPlus, FiList, FiTrendingUp, FiShoppingBag, FiCheck, FiX, FiMapPin, FiPackage, FiTrash2 } from 'react-icons/fi';
import { calculateDistance } from '../utils/distance';
import styles from './SellerDashboard.module.css';

const SellerDashboard = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(
        location.pathname === '/orders' ? 'orders' : 'listings'
    );
    const [showAddForm, setShowAddForm] = useState(false);
    const [listings, setListings] = useState([]);
    const [requests, setRequests] = useState([]); // Combined Bookings & Orders
    const [loading, setLoading] = useState(false);

    // Sync active tab with URL and fetch data
    useEffect(() => {
        if (location.pathname === '/orders') {
            setActiveTab('orders');
        } else {
            setActiveTab('listings');
        }
        fetchAllData();
    }, [location.pathname]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const config = { withCredentials: true };

            // Fetch Listings
            const listingsRes = await axios.get(`http://localhost:5000/api/listings?user=${user._id}`, config);
            if (listingsRes.data.success) {
                setListings(listingsRes.data.data);
            }

            // Fetch Bookings (Services/Machines)
            const bookingsRes = await axios.get('http://localhost:5000/api/bookings/seller', config);

            // Fetch Orders (Products)
            const ordersRes = await axios.get('http://localhost:5000/api/orders/seller', config);

            let allRequests = [];
            if (bookingsRes.data.success) {
                allRequests = [...allRequests, ...bookingsRes.data.data.map(b => ({ ...b, reqType: 'booking' }))];
            }
            if (ordersRes.data.success) {
                allRequests = [...allRequests, ...ordersRes.data.data.map(o => ({ ...o, reqType: 'order' }))];
            }

            // Sort by date newest first
            allRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setRequests(allRequests);

        } catch (err) {
            console.error("Error fetching dashboard data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status, type) => {
        try {
            const config = { withCredentials: true };

            const url = type === 'order'
                ? `http://localhost:5000/api/orders/${id}`
                : `http://localhost:5000/api/bookings/${id}`;

            await axios.put(url, { status }, config);
            alert(`Status updated to ${status}`);
            fetchAllData();
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        }
    };

    const handleDeleteListing = async (id) => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;
        try {
            const config = { withCredentials: true };
            await axios.delete(`http://localhost:5000/api/listings/${id}`, config);
            alert('Listing deleted');
            fetchAllData();
        } catch (err) {
            alert('Error deleting listing');
        }
    }

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        unit: '',
        category: '',
        type: 'product',
        latitude: '',
        longitude: '',
        address: '',
        hourlyRate: '',
        dailyRate: '',
        machineRateUnit: 'hour', // Default to per hour
    });


    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTypeChange = (e) => {
        setFormData({ ...formData, type: e.target.value, category: '' });
    };

    const availableCategories = CATEGORIES.filter(cat => cat.type === formData.type);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            };

            const payload = { ...formData };
            if (payload.type === 'product') {
                delete payload.hourlyRate;
                delete payload.dailyRate;
            }

            await axios.post('http://localhost:5000/api/listings', payload, config);
            alert('Listing Created Successfully!');
            setShowAddForm(false);
            fetchAllData();
        } catch (err) {
            console.error(err);
            alert('Error creating listing: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className={styles.dashboardWrapper}>
            <div className={styles.dashboardContainer}>
                <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                    <div style={{ flex: 1 }}>
                        <h2 className={styles.heading}>Seller Dashboard</h2>
                        <div className="flex items-center gap-2" style={{ flexWrap: 'wrap', marginTop: '0.25rem' }}>
                            <p className="text-gray" style={{ margin: 0 }}>Welcome back, {user?.name}</p>
                            {user?.sellerId && (
                                <span className={styles.sellerIdBadge}>
                                    ID: {user.sellerId}
                                </span>
                            )}
                        </div>
                    </div>
                    {activeTab === 'listings' && !showAddForm && (
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowAddForm(true)}
                            style={{ flexShrink: 0 }}
                        >
                            <FiPlus style={{ marginRight: '0.5rem' }} /> Add New
                        </button>
                    )}
                </div>


                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                    borderBottom: '1px solid #ddd',
                    overflowX: 'auto',
                    WebkitOverflowScrolling: 'touch'
                }}>
                    <div
                        onClick={() => setActiveTab('listings')}
                        className={`${styles.tab} ${activeTab === 'listings' ? styles.activeTab : ''}`}
                    >
                        My Listings ({listings.length})
                    </div>
                    <div
                        onClick={() => setActiveTab('orders')}
                        className={`${styles.tab} ${activeTab === 'orders' ? styles.activeTab : ''}`}
                    >
                        Requests ({requests.length})
                    </div>
                </div>

                {activeTab === 'listings' && (
                    <>
                        {showAddForm ? (
                            <div className={styles.formCard}>
                                <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0 }}>Create New Listing</h3>
                                    <button className="btn btn-outline" onClick={() => setShowAddForm(false)}>Cancel</button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className={styles.formGroup}>
                                        <label>Listing Type</label>
                                        <select name="type" className={styles.input} value={formData.type} onChange={handleTypeChange}>
                                            <option value="product">Product (Sell Material)</option>
                                            <option value="service">Service (Worker Profile)</option>
                                            <option value="machine">Machine (Rental)</option>
                                        </select>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Title</label>
                                        <input type="text" name="title" className={styles.input} placeholder="e.g. Red Bricks" value={formData.title} onChange={handleInputChange} required />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Category</label>
                                        <select name="category" className={styles.input} value={formData.category} onChange={handleInputChange} required>
                                            <option value="">Select Category</option>
                                            {availableCategories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {formData.type === 'product' && (
                                        <div className="flex gap-4">
                                            <div className={styles.formGroup} style={{ flex: 1 }}>
                                                <label>Price</label>
                                                <input type="number" name="price" className={styles.input} placeholder="0.00" value={formData.price} onChange={handleInputChange} required />
                                            </div>
                                            <div className={styles.formGroup} style={{ flex: 1 }}>
                                                <label>Unit</label>
                                                <input type="text" name="unit" className={styles.input} placeholder="e.g. piece, kg, ton" value={formData.unit} onChange={handleInputChange} required />
                                            </div>
                                        </div>
                                    )}

                                    {formData.type === 'service' && (
                                        <div className={styles.formGroup}>
                                            <label>Daily Rate (₹)</label>
                                            <input type="number" name="dailyRate" className={styles.input} value={formData.dailyRate} onChange={handleInputChange} required />
                                        </div>
                                    )}


                                    {formData.type === 'machine' && (
                                        <div className="flex gap-4">
                                            <div className={styles.formGroup} style={{ flex: 1 }}>
                                                <label>Rate (₹)</label>
                                                <input
                                                    type="number"
                                                    name="hourlyRate"
                                                    className={styles.input}
                                                    placeholder="0.00"
                                                    value={formData.hourlyRate}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className={styles.formGroup} style={{ flex: 1 }}>
                                                <label>Per</label>
                                                <select
                                                    name="machineRateUnit"
                                                    className={styles.input}
                                                    value={formData.machineRateUnit}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    <option value="hour">Hour</option>
                                                    <option value="day">Day</option>
                                                    <option value="feet">Feet</option>
                                                    <option value="meter">Meter</option>
                                                    <option value="trip">Trip</option>
                                                    <option value="load">Load</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}


                                    <div className={styles.formGroup}>
                                        <label>Description</label>
                                        <textarea name="description" className={styles.input} rows="3" value={formData.description} onChange={handleInputChange} required></textarea>
                                    </div>

                                    <h4 style={{ margin: '1rem 0 0.5rem', fontSize: '0.9rem', color: '#666' }}>Location Details</h4>
                                    <div className={styles.formGroup}>
                                        <label>Address</label>
                                        <input type="text" name="address" className={styles.input} placeholder="Full address" value={formData.address} onChange={handleInputChange} required />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className={styles.formGroup} style={{ flex: 1 }}>
                                            <label>Latitude</label>
                                            <input type="text" name="latitude" className={styles.input} placeholder="e.g. 17.3850" value={formData.latitude} onChange={handleInputChange} required />
                                        </div>
                                        <div className={styles.formGroup} style={{ flex: 1 }}>
                                            <label>Longitude</label>
                                            <input type="text" name="longitude" className={styles.input} placeholder="e.g. 78.4867" value={formData.longitude} onChange={handleInputChange} required />
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1rem' }}>Create Listing</button>
                                </form>
                            </div>
                        ) : (
                            <div className={styles.listingsGrid}>
                                {listings.length === 0 ? (
                                    <div className={styles.emptyState}>
                                        <FiPackage size={48} />
                                        <p>You haven't added any listings yet.</p>
                                        <button className="btn btn-primary mt-2" onClick={() => setShowAddForm(true)}>Add Your First Listing</button>
                                    </div>
                                ) : (
                                    listings.map(item => (
                                        <div key={item._id} className={styles.listingCard}>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className={styles.typeTag}>{item.type}</span>
                                                    <h4 className={styles.listingTitle}>{item.title}</h4>
                                                    <p className={styles.listingPrice}>
                                                        {item.type === 'product' && `₹${item.price}/${item.unit}`}
                                                        {item.type === 'service' && `₹${item.dailyRate}/day`}
                                                        {item.type === 'machine' && `₹${item.hourlyRate}/${item.machineRateUnit || 'hr'}`}
                                                    </p>
                                                </div>
                                                <button className={styles.deleteBtn} onClick={() => handleDeleteListing(item._id)}>
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                            <div className={styles.listingLoc}>
                                                <FiMapPin size={12} /> {item.location?.formattedAddress || 'No address'}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'orders' && (
                    <div className={styles.ordersList}>
                        {requests.length === 0 ? (
                            <div className={styles.emptyState}>No incoming requests yet.</div>
                        ) : (
                            requests.map(req => {
                                // Calculate Distance
                                let dist = "Unknown";
                                let custLoc = req.customerLocation || req.shippingAddress?.coordinates;
                                if (custLoc && custLoc.coordinates) custLoc = custLoc.coordinates; // Handle GeoJSON or direct array

                                // Normalize coordinates [lng, lat]
                                if (Array.isArray(custLoc) && custLoc.length === 2) {
                                    // Target listing
                                    const targetListing = req.reqType === 'booking' ? req.listing : req.items[0].listing;
                                    const sellerLoc = targetListing?.location?.coordinates;

                                    if (sellerLoc) {
                                        dist = `${calculateDistance(sellerLoc[1], sellerLoc[0], custLoc[1], custLoc[0])} km`;
                                    }
                                }

                                return (
                                    <div key={req._id} className={styles.requestCard} style={{
                                        borderLeft: `5px solid ${req.status === 'pending' ? 'orange' : req.status === 'confirmed' ? 'green' : '#ccc'}`
                                    }}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className={styles.reqTypeBadge}>{req.reqType}</span>
                                                    <h4 className={styles.reqTitle}>
                                                        {req.reqType === 'booking' ? req.listing?.title : `${req.items.length} Product(s)`}
                                                    </h4>
                                                </div>
                                                <div className={styles.customerInfo}>
                                                    Customer: <strong>{req.user?.name}</strong> • {req.user?.phone}
                                                </div>
                                            </div>
                                            <div className={styles.distBadge}>
                                                <FiMapPin /> {dist} away
                                            </div>
                                        </div>

                                        <div className={styles.reqMetaGrid}>
                                            <div>
                                                <div className={styles.metaLabel}>Date</div>
                                                <div>{new Date(req.date || req.createdAt).toLocaleDateString()}</div>
                                            </div>
                                            <div>
                                                <div className={styles.metaLabel}>Price</div>
                                                <div className={styles.metaValue}>₹{req.totalPrice || req.totalAmount}</div>
                                            </div>
                                            <div style={{ gridColumn: 'span 2' }}>
                                                <div className={styles.metaLabel}>Address</div>
                                                <div style={{ fontSize: '0.85rem' }}>{req.shippingAddress?.addressLine || 'Store Pickup'}</div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center" style={{ marginTop: '1rem' }}>
                                            <span className={styles.statusBadge} data-status={req.status}>{req.status}</span>
                                            {req.status === 'pending' && (
                                                <div className="flex gap-2" style={{ width: 'auto' }}>
                                                    <button className="btn btn-sm" style={{ background: '#4caf50', color: 'white' }} onClick={() => handleUpdateStatus(req._id, 'confirmed', req.reqType)}>Confirm</button>
                                                    <button className="btn btn-sm" style={{ background: '#f44336', color: 'white' }} onClick={() => handleUpdateStatus(req._id, 'cancelled', req.reqType)}>Reject</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerDashboard;

