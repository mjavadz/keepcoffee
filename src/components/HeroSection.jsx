import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Truck, Flame, Coffee } from './Icons';
import './HeroSection.css';

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-background" style={{ backgroundImage: "url('/hero_bg_simple.webp')" }}></div>
      <div className="hero-overlay"></div>
      
      <div className="container hero-container">
        <div className="hero-content">
          <span className="hero-badge">
            <Coffee size={16} />
            <span>روستری کیپ کافی</span>
          </span>
          <h1 className="hero-title">
            طعم اصیل قهوه، <br />
            مستقیم از <span className="highlight" style={{ whiteSpace: 'nowrap' }}>کارگاه برشته‌کاری</span>
          </h1>
          <p className="hero-subtitle">
            از شکوهِ خاستگاه‌های دوردست تا طنین عطر تازه در فنجان شما؛ جایی که دانه‌های دست‌چین با صبوری و تخصص برشته می‌شوند تا هر جرعه، ضیافتی آرام از اصالت، گرما و بیداری باشد.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn btn-primary btn-lg">
              مشاهده محصولات و ثبت سفارش
              <ArrowLeft size={18} />
            </Link>
            <Link to="/club" className="btn btn-secondary btn-lg">
              باشگاه مشتریان و تخفیف‌ها
            </Link>
          </div>

          <div className="hero-trust-row">
            <div className="trust-item">
              <Truck size={18} />
              <span>ارسال رایگان در تهران (بالای ۲۰ کیلو)</span>
            </div>
            <div className="trust-item">
              <Flame size={18} />
              <span>رست تازه هفتگی</span>
            </div>
            <div className="trust-item">
              <Coffee size={18} />
              <span>ترکیب‌های تخصصی کارگاه</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
