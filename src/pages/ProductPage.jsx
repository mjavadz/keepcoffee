import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart } from '../components/Icons';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import { getProduct, getRelated } from '../data/products';
import { categoryLabel } from '../data/categories';
import { useCart } from '../context/CartContext';
import { formatToman, toPersianDigits } from '../utils/format';
import { roastColor } from '../utils/roast';
import './ProductPage.css';

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = getProduct(slug);
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="page container product-missing">
        <SEO title="محصول یافت نشد" path={`/product/${slug}`} />
        <h1>محصول مورد نظر پیدا نشد</h1>
        <Link to="/shop" className="btn btn-primary">بازگشت به فروشگاه</Link>
      </div>
    );
  }

  const related = getRelated(slug);
  const gallery = product.gallery?.length ? product.gallery : [product.image];

  const handleAdd = () => {
    addItem(product.slug, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="page">
      <SEO
        title={product.name}
        path={`/product/${product.slug}`}
        description={product.description}
      />

      <div className="container product-detail">
        <nav className="breadcrumb breadcrumb-start">
          <Link to="/">خانه</Link>
          <span>/</span>
          <Link to="/shop">فروشگاه</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`}>{categoryLabel(product.category)}</Link>
        </nav>

        <div className="product-detail-grid">
          <div className="product-gallery">
            <div className="gallery-main">
              <img src={gallery[activeImg]} alt={product.name} />
              {product.badge && <span className="product-badge">{product.badge}</span>}
            </div>
            {gallery.length > 1 && (
              <div className="gallery-thumbs">
                {gallery.map((img, i) => (
                  <button
                    key={img}
                    className={`gallery-thumb ${i === activeImg ? 'is-active' : ''}`}
                    onClick={() => setActiveImg(i)}
                    aria-label={`تصویر ${toPersianDigits(i + 1)}`}
                  >
                    <img src={img} alt={`${product.name} - نمای ${toPersianDigits(i + 1)}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-detail-info">
            <span className="detail-category">{categoryLabel(product.category)}</span>
            <h1>{product.name}</h1>
            {product.origin && <p className="detail-origin">{product.origin}</p>}
            <div className="detail-price">{formatToman(product.price)}</div>

            <p className="detail-desc">{product.description}</p>

            <div className="detail-meta">
              {product.roast && (
                <div className="meta-row">
                  <span>درجه برشت:</span>
                  <strong className="roast-meta">
                    <span
                      className="roast-dot"
                      style={{ backgroundColor: roastColor(product.roast) }}
                      aria-hidden="true"
                    />
                    {product.roast}
                  </strong>
                </div>
              )}
              {product.notes?.length > 0 && (
                <div className="meta-row">
                  <span>طعم‌یادها:</span>
                  <div className="note-chips">
                    {product.notes.map((n) => <span key={n} className="note-chip">{n}</span>)}
                  </div>
                </div>
              )}
            </div>

            <div className="detail-actions">
              <div className="qty-stepper" role="group" aria-label="تعداد">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty === 1} aria-label="کاهش">−</button>
                <span>{toPersianDigits(qty)}</span>
                <button onClick={() => setQty((q) => q + 1)} aria-label="افزایش">+</button>
              </div>
              <button className={`btn btn-primary btn-lg add-btn ${added ? 'is-added' : ''}`} onClick={handleAdd}>
                <ShoppingCart size={18} />
                {added ? 'به سبد اضافه شد ✓' : 'افزودن به سبد خرید'}
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => navigate('/cart')}>
                مشاهده سبد
              </button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="related-section">
            <div className="section-header">
              <h2 className="section-title">محصولات مرتبط</h2>
              <Link to={`/shop?category=${product.category}`} className="view-all">مشاهده همه ←</Link>
            </div>
            <div className="products-grid">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
