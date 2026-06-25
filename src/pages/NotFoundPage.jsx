import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee } from '../components/Icons';
import SEO from '../components/SEO';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="page notfound">
      <SEO title="صفحه یافت نشد" path="/404" />
      <div className="container notfound-inner">
        <Coffee size={64} className="notfound-icon" />
        <h1>۴۰۴</h1>
        <h2>صفحه مورد نظر پیدا نشد</h2>
        <p>به نظر می‌رسد فنجان شما خالی است! صفحه‌ای که دنبالش بودید وجود ندارد.</p>
        <div className="notfound-actions">
          <Link to="/" className="btn btn-primary btn-lg">بازگشت به خانه</Link>
          <Link to="/shop" className="btn btn-outline btn-lg">رفتن به فروشگاه</Link>
        </div>
      </div>
    </div>
  );
}
