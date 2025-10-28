import { getAllCategories } from '@/services/categories.service';
import '@/styles/CategoryList.scss';
import { useEffect, useState } from 'react';

const CategoryList = (props) => {
    const { selectedCategoryId, onSelectCategory } = props;

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const response = await getAllCategories();
                setCategories(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError(err.message);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading)
        return (
            <p className="category-loading-message">Loading categories...</p>
        );
    if (error) return <p className="category-error-message">Error: {error}</p>;
    return (
        <>
            <aside className="category-list-component">
                <h3 className="category-list-title">Product Categories</h3>{' '}
                <ul className="category-list-ul">
                    <li
                        className={`category-list-item ${
                            !selectedCategoryId
                                ? 'category-list-item-active'
                                : ''
                        }`}
                        onClick={() => onSelectCategory(null)}
                    >
                        All Products
                    </li>
                    {categories.map((category) => (
                        <li
                            key={category._id}
                            className={`category-list-item ${
                                selectedCategoryId === category._id
                                    ? 'category-list-item-active'
                                    : ''
                            }`}
                            onClick={() => onSelectCategory(category._id)}
                        >
                            {category.category_name}
                        </li>
                    ))}
                </ul>
            </aside>
        </>
    );
};

export default CategoryList;
