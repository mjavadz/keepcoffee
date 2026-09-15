import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Phone } from './Icons';
import { site, links } from '../data/site';
import './Footer.css';

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TelegramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
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
          <span className="footer-shipping-policy">ارسال شهری رایگان در تهران برای سفارش‌های بالای ۲۰ کیلوگرم</span>
        </div>
      </div>
    </footer>
  );
}
