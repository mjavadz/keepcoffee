import React from 'react';
import { Phone, MapPin, Clock, Mail, Send } from '../components/Icons';
import SEO from '../components/SEO';
import { site, links } from '../data/site';
import './ContactPage.css';

const Instagram = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const contactCards = [
  { 
    icon: Phone, 
    label: 'مدیریت و هماهنگی کارگاه', 
    value: '۰۹۱۲۰۱۴۲۲۱۰', 
    sub: 'رحیمی',
    href: 'tel:+989120142210',
    highlight: true 
  },
  { 
    icon: Phone, 
    label: 'سفارشات و تأمین قهوه', 
    value: '۰۹۳۳۵۳۳۳۴۹۹', 
    sub: 'ربیعی',
    href: 'tel:+989335333499' 
  },
  { 
    icon: MapPin, 
    label: 'محل کارگاه برشته‌کاری', 
    value: site.address,
    sub: 'ارسال رایگان در تهران بالای ۲۰ کیلو'
  },
  { 
    icon: Clock, 
    label: 'ساعات کاری و پاسخگویی', 
    value: site.hours,
    sub: 'همه‌روزه'
  },
  { 
    icon: Mail, 
    label: 'ایمیل رسمی', 
    value: site.email, 
    href: links.email() 
  },
];

export default function ContactPage() {
  return (
    <div className="page contact-page">
      <SEO 
        title="تماس با ما" 
        path="/contact" 
        description="راه‌های ارتباط مستقیم با کارگاه برشته‌کاری کیپ کافی؛ تماس با آقای رحیمی ۰۹۱۲۰۱۴۲۲۱۰ و آقای ربیعی ۰۹۳۳۵۳۳۳۴۹۹، واتساپ، تلگرام و آدرس کارگاه در تهران." 
      />

      <div className="page-hero">
        <div className="container">
          <span className="contact-badge">کارگاه تخصصی برشته‌کاری</span>
          <h1>تماس با کیپ کافی</h1>
          <p>برای مشاوره، خرید خانگی، تأمین کافه‌ها و سفارش عمده در کنارتان هستیم.</p>
        </div>
      </div>

      <div className="container contact-layout">
        <div className="contact-cards">
          {contactCards.map((c, idx) => {
            const Icon = c.icon;
            const inner = (
              <>
                <span className="contact-icon"><Icon size={22} /></span>
                <div className="contact-info-block">
                  <span className="contact-label">{c.label}</span>
                  <span className="contact-value">{c.value}</span>
                  {c.sub && <span className="contact-sub">{c.sub}</span>}
                </div>
              </>
            );
            return c.href ? (
              <a 
                key={idx} 
                href={c.href} 
                className={`contact-card ${c.highlight ? 'contact-card-highlight' : ''}`}
              >
                {inner}
              </a>
            ) : (
              <div 
                key={idx} 
                className={`contact-card ${c.highlight ? 'contact-card-highlight' : ''}`}
              >
                {inner}
              </div>
            );
          })}
        </div>

        <div className="contact-cta-panel">
          <span className="cta-panel-tag">پاسخگویی سریع</span>
          <h2>سریع‌ترین راه ارتباط</h2>
          <p>برای ثبت سفارش، دریافت مشاوره طعمی یا هماهنگی ارسال نمونه، از طریق تماس تلفنی یا پیام‌رسان‌ها با ما در ارتباط باشید:</p>
          
          <div className="contact-quick-calls">
            <a href="tel:+989120142210" className="btn btn-primary btn-lg contact-call-btn">
              <Phone size={18} /> تماس با رحیمی: ۰۹۱۲۰۱۴۲۲۱۰
            </a>
            <a href="tel:+989335333499" className="btn btn-outline btn-lg contact-call-btn">
              <Phone size={18} /> تماس با ربیعی: ۰۹۳۳۵۳۳۳۴۹۹
            </a>
          </div>

          <div className="contact-social-btns">
            <a href={links.whatsapp('سلام، درباره محصولات کیپ کافی سوالی داشتم.')} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
              <Send size={18} /> پیام در واتساپ
            </a>
            <a href={links.telegram()} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
              <Send size={18} /> کانال تلگرام
            </a>
            <a href={links.instagram()} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
              <Instagram size={18} /> صفحه اینستاگرام
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
