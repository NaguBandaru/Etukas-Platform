import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../utils/categories';
import { FiChevronRight, FiBox, FiUsers, FiTruck } from 'react-icons/fi';
import './Categories.css';

const Categories = () => {
    const navigate = useNavigate();

    // Group categories by their nature or headers
    const sections = [
        {
            title: 'Building Materials',
            items: CATEGORIES.filter(cat => cat.type === 'product'),
            icon: <FiBox size={24} />,
            color: '#FF4D4D'
        },
        {
            title: 'Professionals & Workers',
            items: CATEGORIES.filter(cat => cat.type === 'service'),
            icon: <FiUsers size={24} />,
            color: '#333333'
        },
        {
            title: 'Machine Vehicles',
            items: CATEGORIES.filter(cat => cat.type === 'machine'),
            icon: <FiTruck size={24} />,
            color: '#FF4D4D'
        }
    ];

    const handleCategoryClick = (category) => {
        // Navigate to home with category filter
        navigate(`/?category=${category}`);
    };

    return (
        <div className="categories-page">
            <div className="container">
                <header className="categories-header">
                    <h1>Explore Categories</h1>
                    <p>Everything you need for your construction project</p>
                </header>

                <div className="sections-container">
                    {sections.map((section, idx) => (
                        <section key={idx} className="category-section">
                            <div className="section-title" style={{ borderLeft: `4px solid ${section.color}` }}>
                                {section.icon}
                                <h2>{section.title}</h2>
                            </div>
                            <div className="category-grid">
                                {section.items.map(cat => {
                                    const Icon = cat.icon;
                                    return (
                                        <div
                                            key={cat.id}
                                            className="category-card"
                                            onClick={() => handleCategoryClick(cat.id)}
                                        >
                                            <div className="icon-wrapper">
                                                {Icon && <Icon size={28} />}
                                            </div>
                                            <span>{cat.label}</span>
                                            <FiChevronRight className="chevron" />
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Categories;
