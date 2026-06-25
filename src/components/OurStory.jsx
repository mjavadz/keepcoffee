import React from 'react';
import { MapPin, Flame, CupSoda } from './Icons';
import './OurStory.css';

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
          <div className="timeline-item">
            <div className="timeline-image">
              <div className="timeline-frame">
                <img src="/images/photo-1524350876685-500.webp" alt="مزارع قهوه" loading="lazy" />
              </div>
              <div className="timeline-icon"><MapPin size={24} /></div>
            </div>
            <div className="timeline-content">
              <h3>۱. خواستگاه و دست‌چین</h3>
              <p>دانه‌های سبز ما با وسواس فراوان و به صورت مستقیم از کشاورزان محلی در آفریقا و آمریکای لاتین تهیه می‌شوند.</p>
            </div>
          </div>

          <div className="timeline-item reversed">
            <div className="timeline-image">
              <div className="timeline-frame">
                <img src="/images/photo-1599639957043-500.webp" alt="برشته کاری قهوه" loading="lazy" />
              </div>
              <div className="timeline-icon"><Flame size={24} /></div>
            </div>
            <div className="timeline-content">
              <h3>۲. برشته‌کاری تخصصی</h3>
              <p>ما هر خواستگاه را با پروفایل حرارتی مختص به خود برشته می‌کنیم تا پتانسیل طعمی واقعی دانه‌ها آزاد شود.</p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-image">
              <div className="timeline-frame">
                <img src="/images/photo-1497935586351-500.webp" alt="عصاره گیری" loading="lazy" />
              </div>
              <div className="timeline-icon"><CupSoda size={24} /></div>
            </div>
            <div className="timeline-content">
              <h3>۳. عصاره‌گیری بی‌نقص</h3>
              <p>در نهایت، دانه‌های تازه برشته شده به دست شما می‌رسد تا با دستورالعمل‌های استاندارد، یک فنجان قهوه استثنایی خلق کنید.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
