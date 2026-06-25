import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { Star, Crown, Gem } from '../components/Icons';
import SEO from '../components/SEO';
import './ClubPage.css';

const CustomerClub = lazy(() => import('../components/CustomerClub'));

const tiers = [
  { icon: Star, name: 'عضو نقره‌ای', spend: 'از ابتدای عضویت', perks: ['۱ امتیاز به ازای هر ۱۰٬۰۰۰ تومان', 'دسترسی به تخفیف‌های فصلی', 'خبرنامه اختصاصی'] },
  { icon: Gem, name: 'عضو طلایی', spend: 'بالای ۵ میلیون تومان خرید', perks: ['۵٪ تخفیف دائمی', 'ارسال رایگان سفارش‌ها', 'پیش‌خرید محصولات جدید'], featured: true },
  { icon: Crown, name: 'عضو ویژه', spend: 'بالای ۱۵ میلیون تومان خرید', perks: ['۱۵٪ تخفیف دائمی', 'هدیه تولد اختصاصی', 'مشاوره خصوصی باریستا'] },
];

export default function ClubPage() {
  return (
    <div className="page">
      <SEO title="باشگاه مشتریان" path="/club" description="عضویت در باشگاه مشتریان کیپ کافی؛ امتیاز، تخفیف پلکانی و هدایای ویژه." />

      <div className="page-hero">
        <div className="container">
          <h1>باشگاه مشتریان کیپ کافی</h1>
          <p>هر فنجان قهوه، شما را به مزایای بیشتری نزدیک می‌کند.</p>
        </div>
      </div>

      <Suspense fallback={null}>
        <CustomerClub />
      </Suspense>

      <div className="container section-pad">
        <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <h2 className="section-title">سطوح عضویت</h2>
        </div>
        <div className="tiers-grid">
          {tiers.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.name} className={`tier-card ${t.featured ? 'is-featured' : ''}`}>
                {t.featured && <span className="tier-flag">محبوب‌ترین</span>}
                <span className="tier-icon"><Icon size={28} /></span>
                <h3>{t.name}</h3>
                <span className="tier-spend">{t.spend}</span>
                <ul>
                  {t.perks.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link to="/contact" className="btn btn-primary btn-lg">عضویت در باشگاه</Link>
        </div>
      </div>
    </div>
  );
}
