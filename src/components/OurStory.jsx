import React from 'react';
import { MapPin, Flame, Coffee } from './Icons';
import './OurStory.css';

const storySteps = [
  {
    step: '۱',
    stepLabel: 'مرحله اول',
    title: 'خاستگاه و دست‌چین دانه‌های سبز',
    desc: 'دانه‌های سبز ما با وسواس فراوان و به‌صورت مستقیم از مزارع برتر ارتفاعات آمریکای لاتین و آفریقا انتخاب می‌شوند؛ با کنترل دقیق رطوبت، چگالی استاندارد و سورتینگ دستی در مبدأ.',
    image: '/images/photo-1524350876685-500.webp',
    imageAlt: 'مزارع تخصصی کشت قهوه',
    icon: MapPin,
    tag: 'دست‌چین مزارع مرتفع',
  },
  {
    step: '۲',
    stepLabel: 'مرحله دوم',
    title: 'برشته‌کاری تخصصی در کارگاه تهران',
    desc: 'هر ترکیب و خاستگاه در کارگاه کیپ کافی با پروفایل حرارتی اختصاصی و نظارت دقیق برشته می‌شود. فرآیند رست هفتگی تضمین می‌کند که عطر و گاززدایی طبیعی دانه‌ها در بالاترین سطح به دست شما برسد.',
    image: '/images/photo-1599639957043-500.webp',
    imageAlt: 'کارگاه برشته‌کاری تخصصی کیپ کافی',
    icon: Flame,
    tag: 'رست تازه هفتگی کارگاهی',
  },
  {
    step: '۳',
    stepLabel: 'مرحله سوم',
    title: 'عصاره‌گیری شفاف و فنجان بی‌نقص',
    desc: 'از کرمای متراکم و ماندگار اسپرسوی صبحگاهی تا فنجانی شفاف و آروماتیک در ادوات دمی؛ دانه‌های تازه به شما اجازه می‌دهند در کافه یا خانه، اصالت یک فنجان قهوه تخصصی را بدون نقص لمس کنید.',
    image: '/images/photo-1497935586351-500.webp',
    imageAlt: 'عصاره‌گیری قهوه تخصصی',
    icon: Coffee,
    tag: 'طعم‌یادهای شفاف و زنده',
  },
];

export default function OurStory() {
  return (
    <section id="about" className="our-story-section">
      <div className="container">
        <div className="story-header text-center">
          <span className="story-subtitle">داستان کیپ کافی</span>
          <h2 className="story-title">از مزرعه تا فنجان شما</h2>
          <p className="story-desc">
            ما معتقدیم که هر دانه قهوه داستانی برای گفتن دارد. سفر قهوه‌های ما از بهترین مزارع در ارتفاعات کلمبیا و برزیل آغاز می‌شود و با دقت در برشته‌کاری تخصصی در تهران به پایان می‌رسد.
          </p>
        </div>

        <div className="story-timeline">
          {storySteps.map((item, idx) => {
            const IconComponent = item.icon;
            const isReversed = idx % 2 === 1;
            return (
              <div
                key={item.step}
                className={`timeline-card-item ${isReversed ? 'is-reversed' : ''}`}
              >
                {/* Central / Lateral Timeline Step Node */}
                <div className="timeline-marker" aria-hidden="true">
                  <div className="timeline-marker-circle">
                    <span className="marker-num">{item.step}</span>
                    <IconComponent size={18} className="marker-icon" />
                  </div>
                </div>

                {/* Optimized Media Card */}
                <div className="timeline-image-wrap">
                  <div className="timeline-img-box">
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      loading="lazy"
                      width="500"
                      height="330"
                    />
                    <div className="timeline-img-overlay" />
                    <span className="timeline-img-badge">{item.tag}</span>
                  </div>
                </div>

                {/* Content Card */}
                <div className="timeline-content-card">
                  <div className="timeline-step-header">
                    <span className="step-tag-pill">
                      <strong className="step-digit">{item.step}</strong>
                      <span className="step-name">{item.stepLabel}</span>
                    </span>
                  </div>
                  <h3 className="timeline-card-title">{item.title}</h3>
                  <p className="timeline-card-desc">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
