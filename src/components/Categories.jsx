import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../data/categories';
import './Categories.css';

export default function Categories() {
  return (
    <section id="categories" className="categories-section">
      <div className="container">
        <div className="categories-header">
          <h2>دسته‌بندی‌های ما</h2>
          <p>برای شروع خرید، دسته‌بندی مورد نظر خود را انتخاب کنید</p>
        </div>

        <div className="categories-grid">
          {categories.map((cat) => (
            <Link to={`/shop?category=${cat.key}`} key={cat.key} className="category-card">
              <div className="category-image">
                <img src={cat.image} alt={cat.title} loading="lazy" />
                <div className="category-overlay"></div>
              </div>
              <div className="category-content">
                <h3>{cat.title}</h3>
                <p>{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
