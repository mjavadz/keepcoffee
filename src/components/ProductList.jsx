import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { products } from '../data/products';
import './ProductList.css';

export default function ProductList({ limit = 4 }) {
  const featured = products.slice(0, limit);

  return (
    <section id="products" className="products-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">محصولات منتخب</h2>
          <Link to="/shop" className="view-all">مشاهده همه ←</Link>
        </div>

        <div className="products-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
