import styles from './CategoryRail.module.css';
import { CATEGORIES } from '../utils/categories';

const CategoryRail = ({ onSelectCategory, selectedCategory }) => {
    return (
        <div className={styles.railContainer}>
            {CATEGORIES.map((cat, index) => {
                if (!cat.icon) return null; // Skip headers for now or handle differently

                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;

                return (
                    <div
                        key={cat.id}
                        className={`${styles.categoryItem} ${isSelected ? styles.selected : ''}`}
                        onClick={() => onSelectCategory(cat.id)}
                    >
                        <div className={styles.iconCircle}>
                            <Icon size={24} />
                        </div>
                        <span className={styles.label}>{cat.label}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default CategoryRail;
