import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee } from './Icons';
import { MessageCircle } from './Icons';
import { site, links } from '../data/site';
import './Footer.css';

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
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
              <a href={links.instagram()} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-link"><InstagramIcon /></a>
              <a href={links.telegram()} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="social-link"><MessageCircle size={24} /></a>
            </div>
            <p className="footer-contact">{site.phone}</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Keep Coffee. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}
