import React, { useState } from 'react';
import './BrewingGuide.css';

const guides = [
  {
    id: 'v60',
    title: 'کمکس / V60',
    image: '/images/photo-1447933601403-500.webp',
    steps: [
      'نسبت قهوه به آب: ۱ به ۱۵ (مثلاً ۲۰ گرم قهوه برای ۳۰۰ گرم آب)',
      'درجه آسیاب: متوسط (شبیه نمک دریایی)',
      'دمای آب: ۹۰ تا ۹۳ درجه سانتی‌گراد',
      'زمان دم‌آوری: حدود ۳ دقیقه',
    ],
  },
  {
    id: 'espresso',
    title: 'اسپرسو',
    image: '/images/photo-1498804103079-500.webp',
    steps: [
      'نسبت قهوه به آب: ۱ به ۲ (مثلاً ۱۸ گرم قهوه برای ۳۶ گرم عصاره)',
      'درجه آسیاب: بسیار ریز',
      'دمای آب: ۹۲ تا ۹۴ درجه سانتی‌گراد',
      'زمان عصاره‌گیری: ۲۵ تا ۳۰ ثانیه',
    ],
  },
  {
    id: 'french-press',
    title: 'فرنچ پرس',
    image: '/images/photo-1559056199-500.webp',
    steps: [
      'نسبت قهوه به آب: ۱ به ۱۵',
      'درجه آسیاب: درشت',
      'دمای آب: ۹۳ درجه سانتی‌گراد',
      'زمان دم‌آوری: ۴ دقیقه (سپس پیستون را فشار دهید)',
    ],
  },
];

export default function BrewingGuide() {
  const [activeTab, setActiveTab] = useState(guides[0].id);
  const activeGuide = guides.find(g => g.id === activeTab);

  return (
    <section className="brewing-guide-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">آموزش دم‌آوری</h2>
          <p className="section-subtitle">راهنمای قدم به قدم برای رسیدن به بهترین طعم قهوه</p>
        </div>

        <div className="guide-container">
          <div className="guide-tabs">
            {guides.map((guide) => (
              <button
                key={guide.id}
                className={`guide-tab ${activeTab === guide.id ? 'active' : ''}`}
                onClick={() => setActiveTab(guide.id)}
              >
                {guide.title}
              </button>
            ))}
          </div>

          <div className="guide-content">
            <div className="guide-image-wrapper">
              <img src={activeGuide.image} alt={activeGuide.title} loading="lazy" />
            </div>
            <div className="guide-steps">
              <h3>{activeGuide.title}</h3>
              <ul>
                {activeGuide.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
