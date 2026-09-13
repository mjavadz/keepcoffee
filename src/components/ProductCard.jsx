import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check, Phone } from './Icons';
import { useCart } from '../context/CartContext';
import { formatToman } from '../utils/format';
import { categoryLabel } from '../data/categories';
import { roastColor } from '../utils/roast';
import { site } from '../data/site';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!product.price) {
      window.location.href = `tel:${site.phoneHref}`;
      return;
    }
    addItem(product.slug, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const hasPrice = product.price !== null && product.price !== undefined && product.price > 0;

  return (
    <div className={`product-card ${!hasPrice ? 'is-inquiry-card' : ''}`}>
      <Link to={`/product/${product.slug}`} className="product-image-wrapper">
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
        <button
          className={`add-to-cart-btn ${added ? 'is-added' : ''} ${!hasPrice ? 'inquiry-btn' : ''}`}
          aria-label={hasPrice ? `افزودن ${product.name} به سبد خرید` : `استعلام قیمت و تماس برای ${product.name}`}
          onClick={handleAdd}
          title={hasPrice ? 'افزودن به سبد خرید' : 'تماس جهت استعلام قیمت'}
          disabled={added}
        >
          {added ? <Check size={20} /> : hasPrice ? <ShoppingCart size={20} /> : <Phone size={18} />}
        </button>
      </Link>
      <div className="product-info">
        <span className="product-category">{categoryLabel(product.category)}</span>
        <h3 className="product-name">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        {product.roast && (
          <div className="product-taste-profile">
            <span className="roast-level">
              <span
                className="roast-dot"
                style={{ backgroundColor: roastColor(product.roast) }}
                aria-hidden="true"
              />
              {product.roast}
            </span>
            {product.notes?.length > 0 && (
              <span className="tasting-notes">{product.notes.join('، ')}</span>
            )}
          </div>
        )}
        <span className={`product-price ${!hasPrice ? 'price-inquiry' : ''}`}>
          {formatToman(product.price)}
        </span>
      </div>
      {added && <span className="added-toast" role="status">به سبد اضافه شد ✓</span>}
    </div>
  );
}
