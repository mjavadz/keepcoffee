import React from 'react';
import { Coffee, Monitor, ShoppingCart } from './Icons'; // Using available icons as placeholders for features
import './Features.css';

const features = [
  {
    id: 1,
    icon: <Coffee size={32} />,
    title: 'رست تازه',
    desc: 'قهوه‌های ما هر هفته رست می‌شوند تا عطر و طعم بی‌نظیر آن‌ها حفظ شود.'
  },
  {
    id: 2,
    icon: <ShoppingCart size={32} />,
    title: 'ارسال سریع',
    desc: 'سفارشات شما در سریع‌ترین زمان ممکن در سراسر ایران به دستتان می‌رسد.'
  },
  {
    id: 3,
    icon: <Monitor size={32} />,
    title: 'ضمانت اصالت',
    desc: 'تمامی تجهیزات دم‌آوری ما از برندهای معتبر و با ضمانت اصل بودن کالا هستند.'
  }
];

export default function Features() {
  return (
    <section id="features" className="features-section">
      <div className="container">
        <div className="features-header">
          <h2>چرا کیپ کافی؟</h2>
          <p>تعهد ما، ارائه بالاترین کیفیت و بهترین تجربه برای شماست</p>
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
