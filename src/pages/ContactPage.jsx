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
  { icon: Phone, label: 'تلفن', value: site.phone, href: links.tel() },
  { icon: Mail, label: 'ایمیل', value: site.email, href: links.email() },
  { icon: MapPin, label: 'آدرس', value: site.address },
  { icon: Clock, label: 'ساعات کاری', value: site.hours },
];

export default function ContactPage() {
  return (
    <div className="page">
      <SEO title="تماس با ما" path="/contact" description="راه‌های ارتباط با کیپ کافی؛ تلفن، آدرس، ایمیل و شبکه‌های اجتماعی." />

      <div className="page-hero">
        <div className="container">
          <h1>تماس با ما</h1>
          <p>سوالی دارید؟ خوشحال می‌شویم کمکتان کنیم.</p>
        </div>
      </div>

      <div className="container contact-layout">
        <div className="contact-cards">
          {contactCards.map((c) => {
            const Icon = c.icon;
            const inner = (
              <>
                <span className="contact-icon"><Icon size={22} /></span>
                <div>
                  <span className="contact-label">{c.label}</span>
                  <span className="contact-value">{c.value}</span>
                </div>
              </>
            );
            return c.href ? (
              <a key={c.label} href={c.href} className="contact-card">{inner}</a>
            ) : (
              <div key={c.label} className="contact-card">{inner}</div>
            );
          })}
        </div>

        <div className="contact-cta-panel">
          <h2>سریع‌ترین راه ارتباط</h2>
          <p>برای ثبت سفارش یا پرسش، از طریق شبکه‌های اجتماعی پیام دهید؛ در کوتاه‌ترین زمان پاسخ می‌دهیم.</p>
          <div className="contact-social-btns">
            <a href={links.whatsapp('سلام، سوالی درباره محصولات کیپ کافی داشتم.')} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
              <Send size={18} /> واتساپ
            </a>
            <a href={links.telegram()} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
              <Send size={18} /> تلگرام
            </a>
            <a href={links.instagram()} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
              <Instagram size={18} /> اینستاگرام
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
