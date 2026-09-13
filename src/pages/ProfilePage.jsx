import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import Loader from '../components/Loader';
import CheckInCard from '../components/CheckInCard';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { toPersianDigits } from '../utils/format';
import { Award } from '../components/Icons';
import './ProfilePage.css';

const REASON_LABELS = {
  checkin: 'امتیاز روزانه',
  checkin_streak_bonus: 'جایزه استریک ۷ روزه',
  purchase: 'امتیاز خرید',
  redemption: 'استفاده از امتیاز',
  admin_adjust: 'تنظیم توسط مدیر',
  reversal: 'برگشت امتیاز',
};

export default function ProfilePage() {
  const { user, logout, refresh } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const loadProfile = useCallback(async () => {
    try {
      const data = await api.get('/profile');
      setProfileData(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await loadProfile();
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [loadProfile]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setSaving(true);
    setSaveMsg('');
    try {
      await api.post('/profile', {
        displayName: (form.get('displayName') || '').trim(),
        phone: (form.get('phone') || '').trim(),
        address: (form.get('address') || '').trim(),
      });
      await Promise.all([loadProfile(), refresh()]);
      setSaveMsg('اطلاعات با موفقیت ذخیره شد ✓');
    } catch (err) {
      setSaveMsg(err.message || 'ذخیره ناموفق بود.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  if (loading) {
    return <Loader minHeight="70vh" />;
  }

  const currentUser = profileData?.user || user;
  const history = profileData?.history || [];

  return (
    <div className="page">
      <SEO title="حساب کاربری" path="/profile" noindex={true} description="پروفایل کاربری باشگاه مشتریان کیپ کافی" />
      
      <div className="page-hero">
        <div className="container">
          <h1>سلام، {currentUser?.displayName} 👋</h1>
          <p>به باشگاه مشتریان کیپ کافی خوش آمدید.</p>
        </div>
      </div>

      <div className="container profile-grid">
        <section className="profile-main">
          <div className="points-banner">
            <div className="points-banner-icon">
              <Award size={28} />
            </div>
            <div>
              <span className="points-value">{toPersianDigits(currentUser?.points || 0)}</span>
              <span className="points-label">امتیاز شما</span>
            </div>
          </div>

          <CheckInCard
            streak={currentUser?.streak || 0}
            checkedInToday={profileData?.checkedInToday}
            onUpdated={loadProfile}
          />

          <div className="profile-card">
            <h2 className="profile-card-title">اطلاعات من</h2>
            <form className="info-form" onSubmit={handleUpdate} key={currentUser?.id}>
              <div className="auth-field">
                <label htmlFor="pf-name">نام</label>
                <input
                  id="pf-name"
                  name="displayName"
                  type="text"
                  defaultValue={currentUser?.displayName || ''}
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="pf-email">ایمیل</label>
                <input
                  id="pf-email"
                  type="email"
                  dir="ltr"
                  value={currentUser?.email || ''}
                  readOnly
                  disabled
                />
                <span className="auth-hint">ایمیل ورود قابل تغییر نیست.</span>
              </div>

              <div className="auth-field">
                <label htmlFor="pf-phone">شماره تماس</label>
                <input
                  id="pf-phone"
                  name="phone"
                  type="tel"
                  dir="ltr"
                  defaultValue={currentUser?.phone || ''}
                  placeholder="۰۹۳۳۵۳۳۳۴۹۹"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="pf-address">آدرس</label>
                <textarea
                  id="pf-address"
                  name="address"
                  rows={2}
                  defaultValue={currentUser?.address || ''}
                  placeholder="آدرس برای ارسال سفارش"
                />
              </div>

              {saveMsg && <p className="info-save-msg">{saveMsg}</p>}

              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'در حال ذخیره…' : 'ذخیره اطلاعات'}
              </button>
            </form>
          </div>
        </section>

        <aside className="profile-side">
          <div className="profile-card">
            <h2 className="profile-card-title">سوابق امتیاز</h2>
            {history.length === 0 ? (
              <p className="profile-empty">هنوز امتیازی ثبت نشده است.</p>
            ) : (
              <ul className="ledger">
                {history.map((h, idx) => (
                  <li key={idx} className="ledger-row">
                    <span className="ledger-reason">{REASON_LABELS[h.reason] || h.reason}</span>
                    <span className={`ledger-delta ${h.delta >= 0 ? 'pos' : 'neg'}`}>
                      {h.delta >= 0 ? '+' : '−'}
                      {toPersianDigits(Math.abs(h.delta))}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="profile-card">
            <h2 className="profile-card-title">سوابق سفارش</h2>
            <p className="profile-empty">سفارش‌های تأییدشده شما اینجا نمایش داده می‌شوند.</p>
          </div>

          <button className="btn btn-outline profile-logout" onClick={handleLogout}>
            خروج از حساب
          </button>
        </aside>
      </div>
    </div>
  );
}
