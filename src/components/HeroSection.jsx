import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from './Icons';
import './HeroSection.css';

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-background" style={{ backgroundImage: "url('/hero_bg_simple.webp')" }}></div>
      <div className="hero-overlay"></div>
      
      <div className="container hero-container">
        <div className="hero-content">
          <span className="hero-badge">کیمیاگریِ طعم‌ها</span>
          <h1 className="hero-title">
            بیداری تنها آغاز مسیر است؛ <br /> عطر و طعم‌های شگفت‌انگیز را با <span className="highlight" style={{ whiteSpace: 'nowrap' }}>کیپ کافی</span> تجربه کنید.
          </h1>
          <p className="hero-subtitle">
            دعوتی به کشفِ جغرافیای قهوه. مجموعه‌ای از کمیاب‌ترین دانه‌های تخصصی و ادواتِ حرفه‌ایِ دم‌آوری، تا شما معمارِ فنجانِ بی‌نقصِ خود باشید.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn btn-primary">
              شروع خرید
              <ArrowLeft size={18} />
            </Link>
            <Link to="/about" className="btn btn-secondary">
              داستان ما
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
