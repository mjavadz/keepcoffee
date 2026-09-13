import React, { Suspense, lazy, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import CheckInCard from '../components/CheckInCard';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { toPersianDigits } from '../utils/format';
import { Award, Crown, Gem } from '../components/Icons';
import './ClubPage.css';

const CustomerClub = lazy(() => import('../components/CustomerClub'));

function MemberPanel() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  const refreshProfile = useCallback(async () => {
    if (user) {
      try {
        const data = await api.get('/profile');
        setProfile(data);
      } catch {}
    }
  }, [user]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  if (!user) {
    return (
      <div className="club-cta-box">
        <h2>همین حالا عضو شوید</h2>
        <p>با ثبت‌نام رایگان، هر روز با ورود به سایت امتیاز بگیرید و با خرید، امتیازتان را بالا ببرید.</p>
        <div className="club-cta-actions">
          <Link to="/register" className="btn btn-primary btn-lg">ثبت‌نام رایگان</Link>
          <Link to="/login" className="btn btn-outline btn-lg">ورود به حساب</Link>
        </div>
      </div>
    );
  }

  const points = profile?.user?.points ?? user.points ?? 0;
  const streak = profile?.user?.streak ?? user.streak ?? 0;

  return (
    <div className="club-member-panel">
      <div className="club-member-points">
        <span className="club-member-num">{toPersianDigits(points)}</span>
        <span className="club-member-label">امتیاز شما</span>
      </div>
      <CheckInCard streak={streak} checkedInToday={profile?.checkedInToday} onUpdated={refreshProfile} />
    </div>
  );
}

const tiers = [
  {
    icon: Award,
    name: 'عضو نقره‌ای',
    spend: 'از ابتدای عضویت',
    perks: ['۱ امتیاز به ازای هر ۱۰٬۰۰۰ تومان خرید', 'دسترسی به تخفیف‌های فصلی', 'خبرنامه تخصصی روستری'],
  },
  {
    icon: Crown,
    name: 'عضو طلایی',
    spend: 'بالای ۵ میلیون تومان خرید',
    perks: ['۵٪ تخفیف دائمی روی سفارش‌ها', 'ارسال رایگان در سراسر تهران', 'پیش‌خرید میکس‌های جدید روستری'],
    featured: true,
  },
  {
    icon: Gem,
    name: 'عضو ویژه (VIP)',
    spend: 'بالای ۱۵ میلیون تومان خرید',
    perks: ['۱۵٪ تخفیف دائمی', 'هدیه سالانه اختصاصی', 'مشاوره اختصاصی تنظیم و کالیبراسیون آسیاب'],
  },
];

export default function ClubPage() {
  const { user } = useAuth();

  return (
    <div className="page">
      <SEO title="باشگاه مشتریان" path="/club" description="عضویت در باشگاه مشتریان کیپ کافی؛ امتیاز روزانه، تخفیف پلکانی و مزایای ویژه." />
      
      <div className="page-hero">
        <div className="container">
          <h1>باشگاه مشتریان کیپ کافی</h1>
          <p>هر فنجان قهوه، شما را به مزایای بیشتری نزدیک می‌کند.</p>
        </div>
      </div>

      <div className="container club-member-section">
        <MemberPanel />
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
                  {t.perks.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {!user && (
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              عضویت در باشگاه
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
