import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from './Icons';
import { useCart } from '../context/CartContext';
import { formatToman } from '../utils/format';
import { categoryLabel } from '../data/categories';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    addItem(product.slug, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.slug}`} className="product-image-wrapper">
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
        <button
          className={`add-to-cart-btn ${added ? 'is-added' : ''}`}
          aria-label={`افزودن ${product.name} به سبد خرید`}
          onClick={handleAdd}
        >
          <ShoppingCart size={20} />
        </button>
      </Link>
      <div className="product-info">
        <span className="product-category">{categoryLabel(product.category)}</span>
        <h3 className="product-name">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        {product.roast && (
          <div className="product-taste-profile">
            <span className="roast-level">{product.roast}</span>
            {product.notes?.length > 0 && (
              <span className="tasting-notes">{product.notes.join('، ')}</span>
            )}
          </div>
        )}
        <span className="product-price">{formatToman(product.price)}</span>
      </div>
      {added && <span className="added-toast" role="status">به سبد اضافه شد ✓</span>}
    </div>
  );
}
