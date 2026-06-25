import React from 'react';
import { Link } from 'react-router-dom';
import './WholesaleBanner.css';

export default function WholesaleBanner() {
  return (
    <section className="wholesale-section">
      <div className="container">
        <div className="wholesale-content">
          <div className="wholesale-text">
            <h2>همکاری با کافه‌ها (لاین هورکا)</h2>
            <p>
              ما در مجموعه‌ی خود، باکیفیت‌ترین دانه‌های قهوه را با پروفایل‌های برشته‌کاری تخصصی برای کافه‌ها و رستوران‌ها تأمین می‌کنیم. برای دریافت مشاوره و لیست قیمت عمده با ما در ارتباط باشید.
            </p>
            <Link to="/wholesale" className="btn btn-primary">درخواست لیست قیمت</Link>
          </div>
          <div className="wholesale-image">
            <img src="/images/photo-1511920170033-800.webp" alt="قهوه عمده برای کافه‌ها" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}
