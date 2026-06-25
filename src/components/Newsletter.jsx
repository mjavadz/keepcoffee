import React, { useState } from 'react';
import { Mail, Check } from './Icons';
import './Newsletter.css';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | error | success

  const handleSubmit = (e) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setStatus('error');
      return;
    }
    // Static site (no backend): confirm locally so the user gets clear feedback.
    setStatus('success');
    setEmail('');
  };

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

          {status === 'success' ? (
            <div className="newsletter-success" role="status">
              <span className="newsletter-success-icon"><Check size={28} /></span>
              <strong>عضویت شما ثبت شد!</strong>
              <span>به‌زودی تازه‌ترین خبرها به دستتان می‌رسد. ☕</span>
            </div>
          ) : (
            <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
              <div className={`input-group ${status === 'error' ? 'has-error' : ''}`}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="آدرس ایمیل خود را وارد کنید..."
                  aria-label="آدرس ایمیل"
                  aria-invalid={status === 'error'}
                  className="newsletter-input"
                />
                <button type="submit" className="btn btn-primary newsletter-btn">
                  عضویت
                </button>
              </div>
              {status === 'error' ? (
                <span className="newsletter-error" role="alert">
                  لطفاً یک آدرس ایمیل معتبر وارد کنید.
                </span>
              ) : (
                <span className="newsletter-disclaimer">ما هرگز به شما اسپم نمی‌فرستیم. لغو عضویت در هر زمان امکان‌پذیر است.</span>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
