import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Phone, Check, ShieldCheck, Flame, Coffee, Sparkles } from '../components/Icons';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import { getProduct, getRelated, grindOptions } from '../data/products';
import { categoryLabel } from '../data/categories';
import { useCart } from '../context/CartContext';
import { formatToman, toPersianDigits } from '../utils/format';
import { roastColor } from '../utils/roast';
import { site, links } from '../data/site';
import './ProductPage.css';

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = getProduct(slug);
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedGrind, setSelectedGrind] = useState('whole-bean');
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
  const isBean = product.category === 'beans';

  const handleAdd = () => {
    addItem(product.slug, qty, isBean ? selectedGrind : null);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const breadcrumbItems = [
    { name: 'خانه', url: '/' },
    { name: 'فروشگاه', url: '/shop' },
    { name: categoryLabel(product.category), url: `/shop?category=${product.category}` },
    { name: product.name, url: `/product/${product.slug}` }
  ];

  const productFAQ = isBean ? [
    {
      question: `بهترین روش نگهداری از ${product.name} چیست؟`,
      answer: "دانه‌های قهوه کیپ کافی در بسته‌بندی متالایز زیپ‌کیپ و مجهز به سوپاپ یک‌طرفه عرضه می‌شوند. بهترین محل نگهداری، داخل همان پاکت اصلی در محیط خشک، خنک و دور از نور مستقیم خورشید است. از قرار دادن قهوه در یخچال خودداری فرمایید."
    },
    {
      question: "تاریخ برشته‌کاری (روست) دانه‌ها به چه صورت است؟",
      answer: "تمامی میکس‌های کارگاه کیپ کافی به‌صورت هفتگی در بچ‌های محدود (Small Batch) برشته می‌شوند تا محصولی با حداکثر تازگی و عطر به دست مشتری برسد."
    }
  ] : null;

  return (
    <div className="page product-page-wrapper">
      <SEO
        title={product.name}
        path={`/product/${product.slug}`}
        description={product.description}
        image={product.image}
        product={product}
        breadcrumbs={breadcrumbItems}
        faq={productFAQ}
      />

      <div className="container product-detail">
        <nav className="breadcrumb breadcrumb-start" aria-label="مسیر صفحه">
          <Link to="/">خانه</Link>
          <span>/</span>
          <Link to="/shop">فروشگاه</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`}>{categoryLabel(product.category)}</Link>
          <span>/</span>
          <span className="current">{product.name}</span>
        </nav>

        <div className="product-detail-grid">
          {/* Gallery Column */}
          <div className="product-gallery">
            <div className="gallery-main">
              <img src={gallery[activeImg]} alt={product.name} />
              {product.badge && <span className="product-badge">{product.badge}</span>}
              {isBean && <span className="roast-badge-overlay">{product.roast}</span>}
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

            {/* Roastery Craft Trust Box */}
            <div className="roastery-trust-box">
              <div className="trust-item">
                <ShieldCheck size={20} className="trust-icon" />
                <div>
                  <strong>برشت تازه هفتگی</strong>
                  <p>برشته‌کاری تخصصی در کارگاه کیپ کافی با کنترل دقیق منحنی دما</p>
                </div>
              </div>
              <div className="trust-item">
                <Sparkles size={20} className="trust-icon" />
                <div>
                  <strong>بسته‌بندی زیپ‌کیپ و سوپاپ‌دار</strong>
                  <p>خروج گازهای طبیعی قهوه بدون ورود هوا جهت ماندگاری عطر دانه</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Column */}
          <div className="product-detail-info">
            <div className="detail-header-tags">
              <span className="detail-category">{categoryLabel(product.category)}</span>
              {product.caffeine && <span className="caffeine-pill">کافئین: {product.caffeine}</span>}
            </div>
            
            <h1>{product.name}</h1>
            {product.origin && <p className="detail-origin">{product.origin}</p>}
            
            <div className="detail-price-box">
              <div className="detail-price">{formatToman(product.price)}</div>
              {product.unit && <span className="price-unit-label">/ هر {product.unit}</span>}
            </div>

            <p className="detail-desc">{product.description}</p>

            {/* Sensory & Tasting Radar / Gauges (Exclusive for Beans) */}
            {isBean && product.sensory && (
              <div className="sensory-profile-box">
                <h3 className="sensory-title">
                  <Coffee size={18} /> شناسنامه طعمی و حسی دانه
                </h3>
                <div className="sensory-bars">
                  <div className="sensory-row">
                    <span className="sensory-name">تن‌واری و بادی (Body)</span>
                    <div className="sensory-track">
                      <div className="sensory-fill" style={{ width: `${product.sensory.body * 20}%` }} />
                    </div>
                    <span className="sensory-score">{toPersianDigits(product.sensory.body)} / ۵</span>
                  </div>

                  <div className="sensory-row">
                    <span className="sensory-name">عطر و رایحه (Aroma)</span>
                    <div className="sensory-track">
                      <div className="sensory-fill" style={{ width: `${product.sensory.aroma * 20}%` }} />
                    </div>
                    <span className="sensory-score">{toPersianDigits(product.sensory.aroma)} / ۵</span>
                  </div>

                  <div className="sensory-row">
                    <span className="sensory-name">تلخی و گیرایی (Bitterness)</span>
                    <div className="sensory-track">
                      <div className="sensory-fill" style={{ width: `${product.sensory.bitterness * 20}%` }} />
                    </div>
                    <span className="sensory-score">{toPersianDigits(product.sensory.bitterness)} / ۵</span>
                  </div>

                  <div className="sensory-row">
                    <span className="sensory-name">اسیدیته و زنده بودن (Acidity)</span>
                    <div className="sensory-track">
                      <div className="sensory-fill" style={{ width: `${product.sensory.acidity * 20}%` }} />
                    </div>
                    <span className="sensory-score">{toPersianDigits(product.sensory.acidity)} / ۵</span>
                  </div>

                  {product.sensory.crema && (
                    <div className="sensory-row">
                      <span className="sensory-name">کرمای اسپرسو (Crema)</span>
                      <div className="sensory-track">
                        <div className="sensory-fill" style={{ width: `${product.sensory.crema * 20}%` }} />
                      </div>
                      <span className="sensory-score">{toPersianDigits(product.sensory.crema)} / ۵</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Grind Selection (If Beans) */}
            {isBean && (
              <div className="grind-selector-box">
                <label className="grind-title">انتخاب نوع و درجه آسیاب:</label>
                <div className="grind-options-grid">
                  {grindOptions.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      className={`grind-chip ${selectedGrind === g.id ? 'is-selected' : ''}`}
                      onClick={() => setSelectedGrind(g.id)}
                    >
                      {selectedGrind === g.id && <Check size={14} className="grind-check" />}
                      <span>{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tasting Notes */}
            {product.notes?.length > 0 && (
              <div className="meta-tasting-notes">
                <span className="meta-notes-label">طعم‌یادهای غالب:</span>
                <div className="note-chips">
                  {product.notes.map((n) => (
                    <span key={n} className="note-chip">☕ {n}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Brew */}
            {product.recommendedBrew?.length > 0 && (
              <div className="recommended-brew-box">
                <span className="brew-label">پیشنهاد ابزار دم‌آوری:</span>
                <div className="brew-chips">
                  {product.recommendedBrew.map((b) => (
                    <span key={b} className="brew-chip">{b}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Purchase / Inquiry Actions */}
            {product.price ? (
              <div className="detail-actions">
                <div className="qty-stepper" role="group" aria-label="تعداد">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty === 1} aria-label="کاهش">−</button>
                  <span>{toPersianDigits(qty)}</span>
                  <button onClick={() => setQty((q) => q + 1)} aria-label="افزایش">+</button>
                </div>
                <button
                  className={`btn btn-primary btn-lg add-btn ${added ? 'is-added' : ''}`}
                  onClick={handleAdd}
                >
                  <ShoppingCart size={18} />
                  {added ? 'به سبد اضافه شد ✓' : 'افزودن به سبد خرید'}
                </button>
                <button className="btn btn-outline btn-lg" onClick={() => navigate('/cart')}>
                  مشاهده سبد
                </button>
              </div>
            ) : (
              <div className="detail-actions">
                <a href={links.tel(site.phoneHref)} className="btn btn-primary btn-lg detail-phone-btn">
                  <Phone size={18} />
                  تماس جهت استعلام قیمت ({site.phone})
                </a>
                <a
                  href={links.whatsapp(`سلام، برای استعلام قیمت و موجودی ${product.name} پیام دادم.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-lg"
                >
                  استعلام در واتساپ
                </a>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Accordion Section for SEO & User Help */}
        {productFAQ && (
          <section className="product-faq-section">
            <h2 className="section-title">پرسش‌های پرتکرار درباره این دانه</h2>
            <div className="faq-cards">
              {productFAQ.map((faqItem, idx) => (
                <div key={idx} className="faq-card">
                  <h4>{faqItem.question}</h4>
                  <p>{faqItem.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <section className="related-section">
            <div className="section-header">
              <h2 className="section-title">ترکیب‌های دیگر کارگاه</h2>
              <Link to={`/shop?category=${product.category}`} className="view-all">مشاهده همه کاتالوگ ←</Link>
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
