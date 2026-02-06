import { useState, useContext } from 'react';
import axios from 'axios';
import { FiX, FiCalendar, FiClock } from 'react-icons/fi';
import LocationContext from '../context/LocationContext';
import styles from './BookingModal.module.css';

const BookingModal = ({ listing, onClose }) => {
    const { location } = useContext(LocationContext);
    const [date, setDate] = useState('');
    const [duration, setDuration] = useState(1);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const isMachine = listing.type === 'machine';
    const unitLabel = isMachine ? 'hours' : 'days';
    const rate = isMachine ? listing.hourlyRate : listing.dailyRate;
    const visitCharge = listing.type === 'service' ? (listing.visitCharge || 0) : 0;

    // Calculate total
    const total = (rate * duration) + visitCharge;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = { withCredentials: true };
            await axios.post('http://localhost:5000/api/bookings', {
                listingId: listing._id,
                date,
                duration,
                notes,
                customerLocation: location ? { type: 'Point', coordinates: [location.lng, location.lat] } : null
            }, config);

            alert('Booking Requested Successfully!');
            onClose();
        } catch (err) {
            alert('Booking Failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h3>Book {listing.title}</h3>
                    <button onClick={onClose}><FiX size={24} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label><FiCalendar /> Date Required</label>
                        <input
                            type="date"
                            required
                            className={styles.input}
                            min={new Date().toISOString().split('T')[0]}
                            value={date}
                            onChange={e => setDate(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label><FiClock /> Duration ({unitLabel})</label>
                        <input
                            type="number"
                            min="1"
                            max="30"
                            required
                            className={styles.input}
                            value={duration}
                            onChange={e => setDuration(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Notes (Optional)</label>
                        <textarea
                            className={styles.input}
                            rows="2"
                            placeholder="Describe your requirement..."
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                        ></textarea>
                    </div>

                    <div className={styles.summary}>
                        <div className="flex justify-between mb-1">
                            <span>Rate ({rate}/{unitLabel}) x {duration}</span>
                            <span>₹{rate * duration}</span>
                        </div>
                        {visitCharge > 0 && (
                            <div className="flex justify-between mb-1">
                                <span>Visit Charge</span>
                                <span>₹{visitCharge}</span>
                            </div>
                        )}
                        <div className={styles.totalRow}>
                            <span>Total Estimated</span>
                            <span>₹{total}</span>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Processing...' : 'Confirm Booking'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
