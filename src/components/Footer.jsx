import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Phone } from './Icons';
import { links } from '../data/site';
import './Footer.css';

const InstagramIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="social-svg">
    <defs>
      <radialGradient id="ig-grad" cx="30%" cy="107%" r="120%" fx="30%" fy="107%">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    {/* Clean vector circle background for Instagram */}
    <circle cx="24" cy="24" r="23.5" fill="url(#ig-grad)" className="brand-bg" />
    {/* Instagram Camera glyph */}
    <rect x="13.5" y="13.5" width="21" height="21" rx="5.5" className="camera-stroke" strokeWidth="2.2" fill="none" />
    <circle cx="24" cy="24" r="5.2" className="camera-stroke" strokeWidth="2.2" fill="none" />
    <circle cx="29.8" cy="18.2" r="1.3" className="camera-fill" />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="social-svg">
    {/* Clean vector circle background for Telegram */}
    <circle cx="24" cy="24" r="23.5" fill="#229ED9" className="brand-bg" />
    {/* Official Telegram Paper Airplane */}
    <g transform="translate(12, 12)">
      <path
        d="m9.88 15.48-.36 5.12c.52 0 .74-.22 1.01-.49l2.42-2.33 5.02 3.69c.92.51 1.57.24 1.82-.85l3.29-15.44c.33-1.35-.51-1.96-1.4-1.56L2.3 11.23c-1.31.52-1.3 1.25-.24 1.58l4.95 1.55 11.47-7.23c.54-.33 1.04-.15.63.21z"
        className="tg-airplane"
      />
    </g>
  </svg>
);

const TwitterXIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="social-svg">
    {/* Clean vector circle background for X / Twitter */}
    <circle cx="24" cy="24" r="23.5" fill="#000000" className="brand-bg x-bg" />
    {/* Official X Logo Glyph */}
    <path
      d="M28.47 14h3.19l-6.97 7.97 8.2 10.84h-6.42l-5.03-6.58-5.76 6.58h-3.19l7.46-8.52L13.7 14h6.58l4.55 6.01L28.47 14zm-1.12 16.93h1.77L19.43 15.82h-1.9l9.82 15.11z"
      className="x-glyph"
    />
  </svg>
);

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <Coffee size={28} className="logo-icon" />
              <span className="logo-text">Keep Coffee</span>
            </Link>
            <p className="footer-desc">
              ارائه دهنده بهترین کیفیت قهوه و مدرن‌ترین تجهیزات دم‌آوری در ایران.
              هدف ما تجربه‌ای بی‌نظیر از نوشیدن قهوه است.
            </p>
          </div>

          <div className="footer-links">
            <h4>دسترسی سریع</h4>
            <ul>
              <li><Link to="/shop">فروشگاه</Link></li>
              <li><Link to="/shop?category=equipment">تجهیزات دم‌آوری</Link></li>
              <li><Link to="/club">باشگاه مشتریان</Link></li>
              <li><Link to="/about">درباره کیپ کافی</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>راهنما</h4>
            <ul>
              <li><Link to="/blog">مجله قهوه</Link></li>
              <li><Link to="/wholesale">همکاری عمده</Link></li>
              <li><Link to="/contact">تماس با ما</Link></li>
              <li><Link to="/cart">سبد خرید</Link></li>
            </ul>
          </div>

          <div className="footer-social">
            <h4>ما را دنبال کنید</h4>
            <p>از طریق شبکه‌های اجتماعی با ما در ارتباط باشید.</p>
            <div className="social-icons">
              <a
                href={links.instagram()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="social-link social-instagram"
                title="صفحه رسمی اینستاگرام کیپ کافی"
              >
                <InstagramIcon />
              </a>
              <a
                href={links.telegram()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="social-link social-telegram"
                title="کانال تلگرام کیپ کافی"
              >
                <TelegramIcon />
              </a>
              <a
                href={links.twitter()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="social-link social-twitter"
                title="صفحه رسمی توییتر / X کیپ کافی"
              >
                <TwitterXIcon />
              </a>
            </div>

            {/* Contacts directly below Instagram and social icons aligned to the right */}
            <div className="footer-contacts-list">
              <a href={links.telRahimi()} className="footer-contact-link" title="تماس با رحیمی">
                <Phone size={14} className="contact-mini-icon" />
                <span>۰۹۱۲۰۱۴۲۲۱۰ (رحیمی)</span>
              </a>
              <a href={links.telRabiee()} className="footer-contact-link" title="تماس با ربیعی">
                <Phone size={14} className="contact-mini-icon" />
                <span>۰۹۳۳۵۳۳۳۴۹۹ (ربیعی)</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Keep Coffee Roastery — تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}
