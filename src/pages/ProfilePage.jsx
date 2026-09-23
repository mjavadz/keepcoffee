import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import Loader from '../components/Loader';
import CheckInCard from '../components/CheckInCard';
import WalletHub from '../components/club/WalletHub';
import LuckyWheel from '../components/club/LuckyWheel';
import BrewAssistant from '../components/club/BrewAssistant';
import CoffeeJournal from '../components/club/CoffeeJournal';
import QuestsAndBadges from '../components/club/QuestsAndBadges';
import ReferralHub from '../components/club/ReferralHub';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { toPersianDigits, formatToman } from '../utils/format';
import {
  Award,
  Flame,
  Star,
  Gift,
  Clock,
  Coffee,
  Trophy,
  User,
  Send,
  Check,
  Wallet,
  Camera,
  Trash2,
  Shield,
  CheckCircle
} from '../components/Icons';
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
  { id: 'wallet', label: 'کیف پول و دارایی', icon: Wallet },
  { id: 'wheel', label: 'گردونه جوایز', icon: Gift, badge: 'رایگان' },
  { id: 'brew', label: 'دستیار دم‌آوری', icon: Clock },
  { id: 'journal', label: 'دفترچه طعم‌یابی', icon: Coffee },
  { id: 'quests', label: 'ماموریت و نشان‌ها', icon: Trophy },
  { id: 'referral', label: 'دعوت از دوستان', icon: Send },
  { id: 'settings', label: 'مشخصات و امنیت', icon: User },
];

export default function ProfilePage() {
  const { user, logout, refresh } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('wallet');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [twoFaLoading, setTwoFaLoading] = useState(false);
  const [twoFaMsg, setTwoFaMsg] = useState('');

  const handleToggle2FA = async (newVal) => {
    setTwoFaLoading(true);
    setTwoFaMsg('');
    try {
      const res = await api.post('/profile/2fa/toggle', { enable: newVal });
      await Promise.all([loadProfile(), refresh()]);
      setTwoFaMsg(res.message);
      setTimeout(() => setTwoFaMsg(''), 4500);
    } catch (err) {
      setTwoFaMsg(err.message || 'خطا در تغییر وضعیت تایید دو مرحله‌ای');
    } finally {
      setTwoFaLoading(false);
    }
  };
  const [saveMsg, setSaveMsg] = useState('');
  const [userAvatar, setUserAvatar] = useState(null);
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

  // Load avatar and local journal count
  useEffect(() => {
    if (!storageKey) return;
    try {
      const savedAvatar = localStorage.getItem(`${storageKey}_avatar`);
      if (savedAvatar) setUserAvatar(savedAvatar);

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

  // Handle avatar upload and compression
  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setSaveMsg('لطفاً یک فایل تصویری معتبر انتخاب کنید.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 160;
        canvas.height = 160;
        const ctx = canvas.getContext('2d');
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, 160, 160);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setUserAvatar(dataUrl);
        if (storageKey) {
          localStorage.setItem(`${storageKey}_avatar`, dataUrl);
        }
        setSaveMsg('عکس پروفایل با موفقیت به‌روزرسانی شد ✓');
        setTimeout(() => setSaveMsg(''), 3500);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setUserAvatar(null);
    if (storageKey) {
      localStorage.removeItem(`${storageKey}_avatar`);
    }
    setSaveMsg('عکس پروفایل حذف شد.');
    setTimeout(() => setSaveMsg(''), 3000);
  };

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
      setSaveMsg('مشخصات حساب با موفقیت در دیتابیس ذخیره شد ✓');
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
  const userTier =
    totalDisplayPoints >= 1000
      ? 'VIP Roastery'
      : totalDisplayPoints >= 300
      ? 'طلایی (Gold)'
      : 'نقره‌ای (Silver)';

  return (
    <div className="page profile-hub-page">
      <SEO
        title="باشگاه مشتریان و حساب من"
        path="/profile"
        noindex={true}
        description="داشبورد و اپ‌های تخصصی باشگاه مشتریان کیپ کافی"
      />

      {/* Hidden File Input for Avatar */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleAvatarFileChange}
      />

      {/* Luxury Club Hero Header */}
      <div className="club-dashboard-hero">
        <div className="container">
          <div className="dashboard-hero-content">
            {/* Interactive Avatar Container */}
            <div className="user-avatar-wrap">
              {userAvatar ? (
                <img src={userAvatar} alt={currentUser?.displayName} className="user-avatar-img" />
              ) : (
                <span className="user-avatar-text">{(currentUser?.displayName || 'K')[0]}</span>
              )}
              <button
                type="button"
                className="avatar-edit-badge"
                title="تغییر عکس پروفایل"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={13} />
              </button>
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
                {tab.badge && (
                  <span className={`tab-pill-sparkle ${tab.badge === 'جدید' ? 'new-badge' : ''}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Active Tab Panel */}
        <div className="club-tab-content">
          {/* Tab 1: Multi-Asset Wallet & Bank Cards */}
          {activeTab === 'wallet' && (
            <WalletHub user={currentUser} storageKey={storageKey} />
          )}

          {/* Tab 2: Lucky Wheel & Coupons */}
          {activeTab === 'wheel' && (
            <LuckyWheel
              user={currentUser}
              onPointsWon={handleAwardBonusPoints}
              storageKey={storageKey}
            />
          )}

          {/* Tab 3: Brew Assistant */}
          {activeTab === 'brew' && (
            <BrewAssistant onLogToJournal={handleLogFromBrew} />
          )}

          {/* Tab 4: Coffee Tasting Journal */}
          {activeTab === 'journal' && (
            <CoffeeJournal
              user={currentUser}
              storageKey={storageKey}
              onEntryAdded={handleJournalEntryAdded}
              prefill={journalPrefill}
            />
          )}

          {/* Tab 5: Quests & Badges */}
          {activeTab === 'quests' && (
            <QuestsAndBadges
              user={{ ...currentUser, points: totalDisplayPoints }}
              journalCount={journalCount}
              storageKey={storageKey}
            />
          )}

          {/* Tab 6: Referral Hub */}
          {activeTab === 'referral' && (
            <ReferralHub user={currentUser} />
          )}

          {/* Tab 7: Account Settings & Profile Picture */}
          {activeTab === 'settings' && (
            <div className="profile-grid">
              <section className="profile-main">
                <div className="profile-card">
                  <h2 className="profile-card-title">ویرایش مشخصات و عکس کاربری</h2>

                  {/* Avatar Upload Control Row inside settings */}
                  <div className="avatar-settings-box">
                    <div className="avatar-preview-circle">
                      {userAvatar ? (
                        <img src={userAvatar} alt="Profile" className="preview-img" />
                      ) : (
                        <span className="preview-letter">{(currentUser?.displayName || 'K')[0]}</span>
                      )}
                    </div>
                    <div className="avatar-actions-col">
                      <strong>عکس پروفایل</strong>
                      <p>تصویر دلخواه خود را برای نمایش در باشگاه مشتریان بارگذاری کنید.</p>
                      <div className="avatar-btns-row">
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Camera size={15} />
                          <span>انتخاب عکس جدید</span>
                        </button>
                        {userAvatar && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={handleRemoveAvatar}
                          >
                            <Trash2 size={14} />
                            <span>حذف عکس</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <form className="info-form" onSubmit={handleUpdate} key={currentUser?.id}>
                    <div className="auth-field">
                      <label htmlFor="pf-name">نام و نام خانوادگی (نام نمایشی)</label>
                      <input
                        id="pf-name"
                        name="displayName"
                        type="text"
                        defaultValue={currentUser?.displayName || ''}
                        required
                      />
                    </div>

                    <div className="auth-field">
                      <label htmlFor="pf-email">ایمیل حساب</label>
                      <input
                        id="pf-email"
                        type="email"
                        dir="ltr"
                        value={currentUser?.email || ''}
                        readOnly
                        disabled
                      />
                      <span className="auth-hint">ایمیل ورود برای امنیت حساب غیرقابل تغییر است.</span>
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
                      {saving ? 'در حال ذخیره…' : 'ذخیره تغییرات در دیتابیس'}
                    </button>
                  </form>
                </div>

                {/* Security & 2FA Section */}
                <div className="profile-card" style={{ marginTop: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Shield size={22} />
                    </div>
                    <div>
                      <h2 className="profile-card-title" style={{ margin: 0, fontSize: '1.15rem' }}>امنیت و ورود دو مرحله‌ای (2FA)</h2>
                      <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                        حفاظت مضاعف از حساب و موجودی امتیازات وفاداری شما
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <strong style={{ fontSize: '0.98rem' }}>ارسال کد تایید یکبار مصرف به ایمیل</strong>
                        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '6px', background: currentUser?.twoFactorEnabled ? 'rgba(16,185,129,0.18)' : 'rgba(239,68,68,0.15)', color: currentUser?.twoFactorEnabled ? '#34d399' : '#f87171', fontWeight: 800 }}>
                          {currentUser?.twoFactorEnabled ? '● فعال' : '○ غیرفعال'}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--color-text-secondary)', maxWidth: '440px', lineHeight: 1.6 }}>
                        با فعال‌سازی این گزینه، در هر بار ورود به حساب علاوه بر رمز عبور، یک کد تایید ۶ رقمی به آدرس ایمیل شما ارسال می‌شود تا هیچ فرد دیگری نتواند به حساب شما دسترسی یابد.
                      </p>
                    </div>

                    <button
                      type="button"
                      className={`btn btn-sm ${currentUser?.twoFactorEnabled ? 'btn-outline-danger' : 'btn-primary'}`}
                      disabled={twoFaLoading}
                      onClick={() => handleToggle2FA(!currentUser?.twoFactorEnabled)}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {twoFaLoading ? 'در حال اعمال…' : currentUser?.twoFactorEnabled ? 'غیرفعال‌سازی ۲FA' : 'فعال‌سازی ورود دو مرحله‌ای'}
                    </button>
                  </div>

                  {twoFaMsg && (
                    <div style={{ marginTop: '0.85rem', padding: '0.75rem 1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', color: '#34d399', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle size={16} /> <span>{twoFaMsg}</span>
                    </div>
                  )}
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
