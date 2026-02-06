import { useState, useEffect } from 'react';
import './BannerCarousel.css';
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';
import banner3 from '../assets/banner3.png';

const banners = [
    {
        id: 1,
        image: banner1,
        title: 'Premium Building Materials',
        subtitle: 'Quality Bricks, Cement & Steel at your fingertips'
    },
    {
        id: 2,
        image: banner2,
        title: 'Expert Professionals',
        subtitle: 'Hire the best Masons, Plumbers & Electricians'
    },
    {
        id: 3,
        image: banner3,
        title: 'Heavy Machinery Rental',
        subtitle: 'JCBs, Cranes & Borewells available nearby'
    }
];

const BannerCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 5000); // Auto-scroll every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="banner-carousel">
            <div
                className="banner-inner"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {banners.map((banner) => (
                    <div key={banner.id} className="banner-item">
                        <img src={banner.image} alt={banner.title} className="banner-image" />
                        <div className="banner-overlay">
                            <div className="banner-content">
                                <h2>{banner.title}</h2>
                                <p>{banner.subtitle}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="banner-dots">
                {banners.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default BannerCarousel;
