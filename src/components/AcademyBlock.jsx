import React from 'react';
import { Link } from 'react-router-dom';
import './AcademyBlock.css';

export default function AcademyBlock() {
  return (
    <section className="academy-section">
      <div className="container">
        <div className="academy-content">
          <div className="academy-image">
            <img src="/images/photo-1497935586351-800.webp" alt="آکادمی و آموزش قهوه" loading="lazy" />
          </div>
          <div className="academy-text">
            <span className="academy-badge">آکادمی تخصصی</span>
            <h2>آموزش باریستا و راه‌اندازی کافه</h2>
            <p>
              اگر به دنبال ورود حرفه‌ای به دنیای قهوه هستید، دوره‌های آموزشی آکادمی ما با ارائه مدرک معتبر و انتقال تجربه‌های عملی بهترین نقطه شروع است. همچنین تیم متخصص ما آماده ارائه مشاوره در زمینه راه‌اندازی و تجهیز کافه شماست.
            </p>
            <ul className="academy-features">
              <li>دوره‌های باریستا پایه تا پیشرفته</li>
              <li>آموزش دم‌آوری (Brewing)</li>
              <li>مشاوره خرید تجهیزات</li>
              <li>طراحی منو و کالیبراسیون</li>
            </ul>
            <Link to="/contact" className="btn btn-outline">اطلاعات بیشتر و ثبت نام</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
