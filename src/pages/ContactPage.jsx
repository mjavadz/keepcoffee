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
        {/* 4 Balanced Cards in 2x2 Grid */}
        <div className="contact-cards">
          {/* Card 1: Merged Rahimi & Rabiee */}
          <div className="contact-card contact-card-highlight">
            <span className="contact-icon"><Phone size={22} /></span>
            <div className="contact-info-block">
              <span className="contact-label">تماس مستقیم و سفارشات</span>
              <div className="contact-dual-phones">
                <a href="tel:+989120142210" className="contact-phone-item" title="تماس با رحیمی">
                  <span className="phone-person">رحیمی:</span>
                  <span className="phone-num">۰۹۱۲۰۱۴۲۲۱۰</span>
                </a>
                <a href="tel:+989335333499" className="contact-phone-item" title="تماس با ربیعی">
                  <span className="phone-person">ربیعی:</span>
                  <span className="phone-num">۰۹۳۳۵۳۳۳۴۹۹</span>
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: Workshop Location (without yellow delivery text) */}
          <div className="contact-card">
            <span className="contact-icon"><MapPin size={22} /></span>
            <div className="contact-info-block">
              <span className="contact-label">محل کارگاه برشته‌کاری</span>
              <span className="contact-value">{site.address}</span>
            </div>
          </div>

          {/* Card 3: Working Hours */}
          <div className="contact-card">
            <span className="contact-icon"><Clock size={22} /></span>
            <div className="contact-info-block">
              <span className="contact-label">ساعات کاری و پاسخگویی</span>
              <span className="contact-value">{site.hours}</span>
              <span className="contact-sub">همه‌روزه</span>
            </div>
          </div>

          {/* Card 4: Official Email */}
          <a href={links.email()} className="contact-card">
            <span className="contact-icon"><Mail size={22} /></span>
            <div className="contact-info-block">
              <span className="contact-label">ایمیل رسمی</span>
              <span className="contact-value">{site.email}</span>
              <span className="contact-sub">پشتیبانی و مکاتبات</span>
            </div>
          </a>
        </div>

        {/* CTA Panel: Messenger Links */}
        <div className="contact-cta-panel">
          <span className="cta-panel-tag">پاسخگویی سریع</span>
          <h2>ارتباط در پیام‌رسان‌ها</h2>
          <p>برای ثبت سفارش، دریافت مشاوره طعمی یا هماهنگی ارسال نمونه، از طریق پیام‌رسان‌های زیر با ما در ارتباط باشید:</p>
          
          <div className="contact-social-btns">
            <a href={links.whatsapp('سلام، درباره محصولات کیپ کافی سوالی داشتم.')} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
              <Send size={18} /> پیام در واتساپ
            </a>
            <a href={links.telegram()} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
              <Send size={18} /> کانال و پشتیبانی تلگرام
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
