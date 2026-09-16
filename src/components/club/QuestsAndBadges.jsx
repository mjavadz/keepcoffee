import React, { useMemo } from 'react';
import { Trophy, Check, Star, Award, Crown, Gem, Flame, Coffee, Sparkles } from '../Icons';
import { toPersianDigits } from '../../utils/format';
import './QuestsAndBadges.css';

export default function QuestsAndBadges({ user, journalCount = 0, onClaimReward, storageKey }) {
  const points = user?.points || 0;
  const streak = user?.streak || 0;
  const hasProfile = Boolean(user?.displayName && user?.phone && user?.address);

  // Level & XP calculation
  const levelInfo = useMemo(() => {
    if (points >= 1000) {
      return { level: 4, title: 'لیدر VIP کیپ کافی', icon: Gem, color: '#E0B589', min: 1000, next: 2500, percent: 100 };
    }
    if (points >= 300) {
      return { level: 3, title: 'مستر روستر طلایی', icon: Crown, color: '#DE9E48', min: 300, next: 1000, percent: Math.round(((points - 300) / 700) * 100) };
    }
    if (points >= 100) {
      return { level: 2, title: 'باریستای نقره‌ای', icon: Award, color: '#A8BDB1', min: 100, next: 300, percent: Math.round(((points - 100) / 200) * 100) };
    }
    return { level: 1, title: 'باریستای برنزی', icon: Coffee, color: '#C88D4E', min: 0, next: 100, percent: Math.round((points / 100) * 100) };
  }, [points]);

  // Quests definitions
  const quests = [
    {
      id: 'profile',
      title: 'تکمیل شناسنامه کاربری',
      desc: 'ثبت نام، شماره همراه و آدرس تحویل سفارش در فرم اطلاعات من',
      reward: 50,
      completed: hasProfile,
      progress: hasProfile ? '۱ / ۱' : '۰ / ۱',
    },
    {
      id: 'journal',
      title: 'ثبت اولین ارزیابی در دفترچه طعم',
      desc: 'استفاده از دستیار دم‌آوری یا ثبت یک یادداشت چشایی در دفترچه',
      reward: 30,
      completed: journalCount > 0,
      progress: `${toPersianDigits(Math.min(1, journalCount))} / ۱`,
    },
    {
      id: 'streak3',
      title: 'استریک ۳ روزه وفاداری',
      desc: 'ورود متوالی به باشگاه مشتریان برای ۳ روز پشت سر هم',
      reward: 60,
      completed: streak >= 3,
      progress: `${toPersianDigits(Math.min(3, streak))} / ۳`,
    },
    {
      id: 'wheel',
      title: 'چرخش گردونه شانس',
      desc: 'یک‌بار چرخاندن گردونه جوایز و دریافت کوپن تخفیف اختصاصی',
      reward: 15,
      completed: true,
      progress: '۱ / ۱',
    },
    {
      id: 'referral',
      title: 'معرفی یک دوست به باشگاه',
      desc: 'ارسال کد معرف اختصاصی به یک دوست و اولین بازدید او',
      reward: 150,
      completed: false,
      progress: '۰ / ۱',
    },
  ];

  // Badges definitions
  const badges = [
    {
      id: 'novice',
      title: 'عضو خانواده کیپ کافی',
      desc: 'آغاز مسیر همراهی با روستری',
      icon: Coffee,
      unlocked: true,
      tier: 'برنز',
    },
    {
      id: 'cupper',
      title: 'ماجراجوی طعم‌ها',
      desc: 'ثبت ارزیابی طعمی در دفترچه',
      icon: Star,
      unlocked: journalCount > 0,
      tier: 'نقره',
    },
    {
      id: 'streak',
      title: 'قهوه‌نوش وفادار',
      desc: 'رسیدن به استریک ۳ روزه متوالی',
      icon: Flame,
      unlocked: streak >= 3,
      tier: 'طلا',
    },
    {
      id: 'master',
      title: 'مستر روستر',
      desc: 'کسب بیش از ۳۰۰ امتیاز باشگاه',
      icon: Trophy,
      unlocked: points >= 300,
      tier: 'پلاتین',
    },
  ];

  const LevelIcon = levelInfo.icon;

  return (
    <div className="quests-badges-container">
      {/* Level & XP Progress Card */}
      <div className="level-progression-card">
        <div className="level-badge-header">
          <div className="level-icon-wrap" style={{ color: levelInfo.color }}>
            <LevelIcon size={28} />
          </div>
          <div>
            <span className="level-rank-pill">سطح {toPersianDigits(levelInfo.level)} باشگاه</span>
            <h3 className="level-title">{levelInfo.title}</h3>
            <p className="level-sub">
              {levelInfo.percent === 100
                ? 'شما به بالاترین سطح باشگاه وفاداری دست یافته‌اید!'
                : `تا سطح بعدی فقط ${toPersianDigits(levelInfo.next - points)} امتیاز دیگر نیاز دارید.`}
            </p>
          </div>
          <div className="level-xp-display">
            <strong className="xp-num">{toPersianDigits(points)}</strong>
            <span className="xp-label">امتیاز کل</span>
          </div>
        </div>

        <div className="level-progress-track">
          <div
            className="level-progress-bar"
            style={{ width: `${levelInfo.percent}%`, background: `linear-gradient(90deg, #C88D4E, ${levelInfo.color})` }}
          />
        </div>
      </div>

      <div className="quests-badges-grid">
        {/* Weekly Quests / Missions */}
        <div className="quests-panel">
          <div className="panel-title-row">
            <Trophy size={20} className="gold-icon" />
            <h4>ماموریت‌های فعال کسب امتیاز</h4>
            <span className="quests-count">
              {toPersianDigits(quests.filter((q) => q.completed).length)} از {toPersianDigits(quests.length)} انجام‌شده
            </span>
          </div>

          <div className="quests-list">
            {quests.map((q) => (
              <div key={q.id} className={`quest-item-card ${q.completed ? 'is-done' : ''}`}>
                <div className="quest-status-icon">
                  {q.completed ? <Check size={18} /> : <div className="dot-pending" />}
                </div>

                <div className="quest-text-content">
                  <div className="quest-header-line">
                    <h5>{q.title}</h5>
                    <span className="quest-reward-badge">+{toPersianDigits(q.reward)} امتیاز</span>
                  </div>
                  <p>{q.desc}</p>
                  <div className="quest-progress-sub">
                    <span>پیشرفت: <strong>{q.progress}</strong></span>
                    {q.completed && <span className="quest-done-label">انجام شد ✓</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges / Trophy Room */}
        <div className="badges-panel">
          <div className="panel-title-row">
            <Award size={20} className="gold-icon" />
            <h4>ویترین مدال‌ها و افتخارات باریستا</h4>
          </div>

          <div className="badges-grid">
            {badges.map((b) => {
              const BIcon = b.icon;
              return (
                <div key={b.id} className={`badge-trophy-card ${b.unlocked ? 'is-unlocked' : 'is-locked'}`}>
                  <div className="trophy-icon-circle">
                    <BIcon size={24} />
                  </div>
                  <h5>{b.title}</h5>
                  <p>{b.desc}</p>
                  <span className="badge-tier-tag">{b.unlocked ? `نشان ${b.tier}` : 'قفل شده 🔒'}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
