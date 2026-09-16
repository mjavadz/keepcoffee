import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import Loader from '../components/Loader';
import CheckInCard from '../components/CheckInCard';
import LuckyWheel from '../components/club/LuckyWheel';
import BrewAssistant from '../components/club/BrewAssistant';
import CoffeeJournal from '../components/club/CoffeeJournal';
import QuestsAndBadges from '../components/club/QuestsAndBadges';
import ReferralHub from '../components/club/ReferralHub';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { toPersianDigits, formatToman } from '../utils/format';
import { Award, Flame, Star, Gift, Clock, Coffee, Trophy, User, Send, Check } from '../components/Icons';
import './ProfilePage.css';

const REASON_LABELS = {
  checkin: 'امتیاز حضور روزانه',
  checkin_streak_bonus: 'جایزه استریک ۷ روزه متوالی',
  purchase: 'امتیاز خرید از فروشگاه',
  redemption: 'استفاده از امتیاز',
  wheel_prize: 'جایزه گردونه شانس',
  journal_award: 'ثبت تجربه در دفترچه طعم',
  admin_adjust: 'تنظیم توسط مدیر کارگاه',
  reversal: 'برگشت امتیاز',
};

const TABS = [
  { id: 'wheel', label: 'گردونه شانس و جوایز', icon: Gift },
  { id: 'brew', label: 'دستیار دم‌آوری', icon: Clock },
  { id: 'journal', label: 'دفترچه طعم‌یابی', icon: Coffee },
  { id: 'quests', label: 'ماموریت‌ها و نشان‌ها', icon: Trophy },
  { id: 'referral', label: 'کد معرف و دعوت', icon: Send },
  { id: 'settings', label: 'اطلاعات و سوابق', icon: User },
];

export default function ProfilePage() {
  const { user, logout, refresh } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('wheel');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [journalPrefill, setJournalPrefill] = useState(null);
  const [localBonusPoints, setLocalBonusPoints] = useState(0);
  const [journalCount, setJournalCount] = useState(0);

  const storageKey = user?.id ? `kc_user_${user.id}` : 'kc_user_guest';

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

  // Load local journal count
  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = localStorage.getItem(`${storageKey}_journal`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setJournalCount(parsed.length);
      }
      const savedBonus = localStorage.getItem(`${storageKey}_bonus_pts`);
      if (savedBonus) {
        setLocalBonusPoints(Number(savedBonus) || 0);
      }
    } catch (e) {}
  }, [storageKey]);

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

  // Add bonus points from lucky wheel / journal
  const handleAwardBonusPoints = (pts) => {
    const nextBonus = localBonusPoints + pts;
    setLocalBonusPoints(nextBonus);
    if (storageKey) {
      localStorage.setItem(`${storageKey}_bonus_pts`, String(nextBonus));
    }
  };

  // Journal entry added
  const handleJournalEntryAdded = () => {
    setJournalCount((prev) => prev + 1);
    handleAwardBonusPoints(20);
  };

  // Switch to journal from BrewAssistant
  const handleLogFromBrew = (prefillData) => {
    setJournalPrefill(prefillData);
    setActiveTab('journal');
  };

  if (loading) {
    return <Loader minHeight="70vh" />;
  }

  const currentUser = profileData?.user || user;
  const totalDisplayPoints = (currentUser?.points || 0) + localBonusPoints;
  const history = profileData?.history || [];

  // Determine user VIP badge
  const userTier = totalDisplayPoints >= 1000 ? 'VIP Roastery' : totalDisplayPoints >= 300 ? 'طلایی (Gold)' : 'نقره‌ای (Silver)';

  return (
    <div className="page profile-hub-page">
      <SEO title="باشگاه مشتریان و حساب من" path="/profile" noindex={true} description="داشبورد و اپ‌های تخصصی باشگاه مشتریان کیپ کافی" />

      {/* Luxury Club Hero Header */}
      <div className="club-dashboard-hero">
        <div className="container">
          <div className="dashboard-hero-content">
            <div className="user-avatar-wrap">
              <span className="user-avatar-text">{(currentUser?.displayName || 'K')[0]}</span>
              <span className="user-avatar-badge" title="عضو رسمی باشگاه">✓</span>
            </div>

            <div className="user-details-block">
              <div className="user-tier-pill">
                <Star size={14} className="star-icon" />
                <span>عضو سطح {userTier}</span>
              </div>
              <h1 className="user-greeting">سلام، {currentUser?.displayName} عزیز 👋</h1>
              <p className="user-hero-sub">به مرکز اختصاصی جوایز و ابزارهای باشگاه مشتریان کیپ کافی خوش آمدید.</p>
            </div>

            <div className="dashboard-hero-stats">
              <div className="hero-stat-box">
                <span className="stat-lbl">موجودی امتیاز:</span>
                <strong className="stat-val gold">{toPersianDigits(totalDisplayPoints)}</strong>
                <span className="stat-sub">معادل {formatToman(totalDisplayPoints * 1000)} تخفیف</span>
              </div>

              <div className="hero-stat-box">
                <span className="stat-lbl">استریک متوالی:</span>
                <strong className="stat-val">{toPersianDigits(currentUser?.streak || 0)} روز</strong>
                <span className="stat-sub">حضور پیوسته</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container club-hub-body">
        {/* Daily Check-in Widget (always visible at top of club) */}
        <div className="club-top-checkin">
          <CheckInCard
            streak={currentUser?.streak || 0}
            checkedInToday={profileData?.checkedInToday}
            onUpdated={loadProfile}
          />
        </div>

        {/* Dashboard Tabs Bar */}
        <nav className="club-tabs-nav" aria-label="بخش‌های باشگاه">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`club-tab-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
                {tab.id === 'wheel' && <span className="tab-pill-sparkle">رایگان</span>}
              </button>
            );
          })}
        </nav>

        {/* Active Tab Panel */}
        <div className="club-tab-content">
          {/* Tab 1: Lucky Wheel & Coupons */}
          {activeTab === 'wheel' && (
            <LuckyWheel
              user={currentUser}
              onPointsWon={handleAwardBonusPoints}
              storageKey={storageKey}
            />
          )}

          {/* Tab 2: Brew Assistant */}
          {activeTab === 'brew' && (
            <BrewAssistant onLogToJournal={handleLogFromBrew} />
          )}

          {/* Tab 3: Coffee Tasting Journal */}
          {activeTab === 'journal' && (
            <CoffeeJournal
              user={currentUser}
              storageKey={storageKey}
              onEntryAdded={handleJournalEntryAdded}
              prefill={journalPrefill}
            />
          )}

          {/* Tab 4: Quests & Badges */}
          {activeTab === 'quests' && (
            <QuestsAndBadges
              user={{ ...currentUser, points: totalDisplayPoints }}
              journalCount={journalCount}
              storageKey={storageKey}
            />
          )}

          {/* Tab 5: Referral Hub */}
          {activeTab === 'referral' && (
            <ReferralHub user={currentUser} />
          )}

          {/* Tab 6: Account Settings & History */}
          {activeTab === 'settings' && (
            <div className="profile-grid">
              <section className="profile-main">
                <div className="profile-card">
                  <h2 className="profile-card-title">اطلاعات من</h2>
                  <form className="info-form" onSubmit={handleUpdate} key={currentUser?.id}>
                    <div className="auth-field">
                      <label htmlFor="pf-name">نام و نام خانوادگی</label>
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
                      <label htmlFor="pf-phone">شماره همراه</label>
                      <input
                        id="pf-phone"
                        name="phone"
                        type="tel"
                        dir="ltr"
                        defaultValue={currentUser?.phone || ''}
                        placeholder="۰۹۱۲..."
                      />
                    </div>

                    <div className="auth-field">
                      <label htmlFor="pf-address">آدرس پیش‌فرض تحویل</label>
                      <textarea
                        id="pf-address"
                        name="address"
                        rows={2}
                        defaultValue={currentUser?.address || ''}
                        placeholder="آدرس دقیق جهت هماهنگی پیک و ارسال سفارش‌های کارگاه"
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
                  <h2 className="profile-card-title">ریز سوابق امتیازات</h2>
                  {history.length === 0 ? (
                    <p className="profile-empty">هنوز سابقه‌ای در دیتابیس ثبت نشده است.</p>
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

                <button className="btn btn-outline profile-logout" onClick={handleLogout}>
                  خروج از حساب کاربری
                </button>
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
