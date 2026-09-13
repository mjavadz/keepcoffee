import React from 'react';
import { Flame, Truck, Award, BadgePercent } from './Icons';
import './Features.css';

const features = [
  {
    id: 1,
    icon: <Flame size={28} />,
    title: 'رست تازه هفتگی',
    desc: 'قهوه‌های ما به صورت هفتگی و بر اساس سفارش با دستگاه صنعتی کرون رست می‌شوند تا اوج تازگی عطر و طعم حفظ شود.'
  },
  {
    id: 2,
    icon: <Truck size={28} />,
    title: 'ارسال رایگان در تهران',
    desc: 'ارسال شهری داخل تهران برای سفارش‌های بالای ۲۰ کیلوگرم (کافه‌ها، همکاران و خریدهای تجمعی) کاملاً رایگان است.'
  },
  {
    id: 3,
    icon: <Award size={28} />,
    title: '۶ ترکیب اصیل کارگاه',
    desc: 'از ۱۰۰٪ روبوستا تا ۵۰/۵۰ پرمیوم؛ فرمولاسیون مهندسی‌شده با پروفایل حرارتی دقیق برای عصاره‌گیری بی‌نقص.'
  },
  {
    id: 4,
    icon: <BadgePercent size={28} />,
    title: 'باشگاه مشتریان و تخفیف',
    desc: 'با هر خرید و ثبت حضور روزانه امتیاز بگیرید و از تخفیف‌های دائمی تا ۱۵٪ در سفارش‌های بعدی بهره‌مند شوید.'
  }
];

export default function Features() {
  return (
    <section id="features" className="features-section">
      <div className="container">
        <div className="features-header">
          <span className="features-badge">ارزش‌های بنیادین کارگاه</span>
          <h2>چرا برشته‌کاری کیپ کافی؟</h2>
          <p>تعهد ما، ارائه بالاترین کیفیت دانه، تازگی برشت و بهترین تجربه برای همراهان است.</p>
        </div>
        
        <div className="features-grid">
          {features.map(feature => (
            <div key={feature.id} className="feature-card">
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
