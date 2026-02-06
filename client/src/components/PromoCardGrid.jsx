import './PromoCardGrid.css';
import promo1 from '../assets/promo1.png'; // Bricks
import promo2 from '../assets/promo2.png'; // Tiles
import promo3 from '../assets/promo3.png'; // Paints
import logo from '../assets/logo.png';   // Fallback for 4th card

const promoData = [
    {
        id: 1,
        image: promo1,
        subtitle: 'bricks, cement, sand & more',
        offer: 'Min 50% Off'
    },
    {
        id: 2,
        image: promo2,
        subtitle: 'Premium Tiles',
        offer: 'Under ₹299'
    },
    {
        id: 3,
        image: promo3,
        subtitle: 'Grab Big Discounts!',
        offer: 'Upto 70% off'
    },
    {
        id: 4,
        image: logo, // Fallback tool icon representation
        subtitle: 'Hardware & Tools',
        offer: 'Min. 40% Off'
    }
];

const PromoProductCard = ({ item }) => (
    <div className="promo-product-card">
        <div className="card-image-container">
            <img src={item.image} alt={item.subtitle} className="card-image" />
        </div>
        <div className="card-content">
            <p className="card-subtitle">{item.subtitle}</p>
            <p className="card-highlight-text">{item.offer}</p>
        </div>
    </div>
);

const PromoCardGrid = () => {
    return (
        <div className="promo-section-container">
            <div className="promo-card-grid">
                {promoData.map(item => (
                    <PromoProductCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default PromoCardGrid;
