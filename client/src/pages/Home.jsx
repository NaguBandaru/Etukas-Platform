import { useState, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import LocationContext from '../context/LocationContext';
import CategoryRail from '../components/CategoryRail';
import ListingCard from '../components/ListingCard';
import BannerCarousel from '../components/BannerCarousel';
import PromoCardGrid from '../components/PromoCardGrid';
import { FiMapPin, FiSearch } from 'react-icons/fi';

const Home = () => {
    const { location, locationLoading, detectLocation } = useContext(LocationContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const initialCategory = searchParams.get('category');

    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Sync state with URL if needed, but here we just use state for the UI
        if (initialCategory !== selectedCategory) {
            setSelectedCategory(initialCategory);
        }
    }, [initialCategory]);

    useEffect(() => {
        // Fetch listings when specific conditions change
        // For now, if we have location, we fetch. If cat changes, we fetch.
        const fetchListings = async () => {
            setLoading(true);
            try {
                let url = 'http://localhost:5000/api/listings?';
                const params = new URLSearchParams();

                if (location) {
                    // Use location if available
                    // Skipping actual check for now to allow viewing products without precise location in dev
                    // params.append('lat', location.lat);
                    // params.append('lng', location.lng);
                    // params.append('distance', 50); // 50km radius default
                }

                if (selectedCategory) {
                    params.append('category', selectedCategory);
                }

                const res = await axios.get(url + params.toString());
                if (res.data.success) {
                    setListings(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch listings", err);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, [location, selectedCategory]);

    const handleCategorySelect = (id) => {
        const nextCategory = selectedCategory === id ? null : id;
        setSelectedCategory(nextCategory);
        if (nextCategory) {
            setSearchParams({ category: nextCategory });
        } else {
            setSearchParams({});
        }
    };

    return (
        <div style={{ paddingBottom: '2rem' }}>
            {/* Location Header (Mobile style mostly) */}
            <div className="container" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                <div className="flex items-center gap-2" onClick={detectLocation} style={{ cursor: 'pointer' }}>
                    <FiMapPin className="text-primary" size={20} />
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            Etukas Location
                            <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>▼</span>
                        </div>
                        <div className="text-gray" style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                            {locationLoading ? 'Locating...' : (location?.address || 'Detecting Location...')}
                        </div>
                    </div>
                </div>

                {/* Search Bar - Hidden on Desktop as it is in Header */}
                <div className="hidden-desktop" style={{ marginTop: '1rem', position: 'relative' }}>
                    <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={20} />
                    <input
                        type="text"
                        placeholder="Search for 'Cement', 'Plumber'..."
                        style={{
                            width: '100%',
                            padding: '0.8rem 1rem 0.8rem 2.8rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid #ddd',
                            fontSize: '1rem',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            outline: 'none'
                        }}
                    />
                </div>

            </div>

            {/* Categories */}
            <div style={{ marginBottom: '0.5rem' }}>
                <CategoryRail selectedCategory={selectedCategory} onSelectCategory={handleCategorySelect} />
            </div>

            {/* Banner Carousel */}
            {!selectedCategory && <BannerCarousel />}

            {/* Promotional Grid */}
            {!selectedCategory && <PromoCardGrid />}

            {/* Listings Grid */}
            <div className="container" style={{ marginTop: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>
                    {selectedCategory ? `Nearby ${selectedCategory}` : 'Recommended Nearby'}
                </h3>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>Loading nearby items...</div>
                ) : listings.length > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {listings.map(item => (
                            <ListingCard key={item._id} listing={item} />
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
                        <p>No listings found nearby.</p>
                        <p style={{ fontSize: '0.9rem' }}>Try changing your location or category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
