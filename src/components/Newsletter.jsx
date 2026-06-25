import React from 'react';
import { Mail } from './Icons';
import './Newsletter.css';

export default function Newsletter() {
  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-wrapper">
          <div className="newsletter-content">
            <div className="newsletter-icon">
              <Mail size={32} />
            </div>
            <h2>از تازه‌ترین روست‌ها باخبر شوید!</h2>
            <p>
              با عضویت در خبرنامه کیپ کافی، قبل از بقیه از موجود شدن دانه‌های کمیاب، تخفیف‌های ویژه و مقالات آموزشی جدید مطلع شوید.
            </p>
          </div>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <div className="input-group">
              <input 
                type="email" 
                placeholder="آدرس ایمیل خود را وارد کنید..." 
                required 
                className="newsletter-input"
              />
              <button type="submit" className="btn btn-primary newsletter-btn">
                عضویت
              </button>
            </div>
            <span className="newsletter-disclaimer">ما هرگز به شما اسپم نمی‌فرستیم. لغو عضویت در هر زمان امکان‌پذیر است.</span>
          </form>
        </div>
      </div>
    </section>
  );
}
