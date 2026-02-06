import { useContext, useState } from 'react';
import { FiMapPin, FiStar } from 'react-icons/fi';
import CartContext from '../context/CartContext';
import BookingModal from './BookingModal';
import styles from './ListingCard.module.css';

const ListingCard = ({ listing }) => {
    const { addToCart } = useContext(CartContext);
    const [showBooking, setShowBooking] = useState(false);

    const handleAction = (e) => {
        e.stopPropagation();
        if (listing.type === 'product') {
            addToCart(listing);
            alert('Added to cart!'); // Temporary feedback
        } else {
            setShowBooking(true);
        }
    };

    return (
        <>
            <div className={styles.card}>
                <div className={styles.imageContainer}>
                    {listing.images && listing.images.length > 0 ? (
                        <img src={listing.images[0]} alt={listing.title} className={styles.image} />
                    ) : (
                        <div className={styles.placeholderImage}>No Image</div>
                    )}
                    {listing.type === 'service' && <span className={styles.badgeService}>Pro</span>}
                    {listing.type === 'machine' && <span className={styles.badgeMachine}>Rent</span>}
                </div>

                <div className={styles.content}>
                    <div className="flex justify-between items-center mb-1">
                        <h3 className={styles.title}>{listing.title}</h3>
                        <div className={styles.rating}>
                            <span className={styles.ratingBox}>{listing.rating || 4.5} <FiStar size={10} fill="white" /></span>
                        </div>
                    </div>

                    <p className={styles.category}>{listing.category}</p>

                    <div className={styles.location}>
                        <FiMapPin size={14} />
                        <span>{listing.location?.formattedAddress || 'Nearby'}</span>
                    </div>

                    <div className={styles.footer}>
                        <div className={styles.price}>
                            {listing.type === 'product' && `₹${listing.price}/${listing.unit}`}
                            {listing.type === 'service' && `₹${listing.dailyRate}/day`}
                            {listing.type === 'machine' && `₹${listing.hourlyRate}/${listing.machineRateUnit || 'hr'}`}
                        </div>
                        <button className={styles.actionButton} onClick={handleAction}>
                            {listing.type === 'product' && 'Add'}
                            {listing.type === 'service' && 'Book'}
                            {listing.type === 'machine' && 'Rent'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {showBooking && <BookingModal listing={listing} onClose={() => setShowBooking(false)} />}
        </>
    );
};

export default ListingCard;
