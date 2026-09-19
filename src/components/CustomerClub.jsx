import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Crown, Gem, Flame, Star, Coffee, ArrowLeft, Check } from './Icons';
import { useAuth } from '../context/AuthContext';
import { toPersianDigits } from '../utils/format';
import './CustomerClub.css';

export default function CustomerClub() {
  const { user } = useAuth();
  const points = user?.points || 0;
  const streak = user?.streak || 0;

  return (
    <section id="club" className="customer-club-section">
      <div className="club-ambient-glow"></div>

      <div className="container">
        <div className="club-content">
          <div className="club-text">
            <div className="club-badge-glow">
              <Star size={15} />
              <span>باشگاه وفاداری و همراهان روستری</span>
            </div>

            <h2 className="club-title">
              طعم وفاداری، عمیق‌تر از <span className="highlight-gold">یک فنجان قهوه</span>
            </h2>

            <p className="club-description">
              در باشگاه مشتریان کیپ کافی، هر خرید و حتی هر روز سر زدن به سایت، شما را به هدایای اختصاصی، ارسال رایگان و تخفیف‌های دائمی تا ۱۵٪ نزدیک‌تر می‌کند.
            </p>

            <div className="club-benefits-modern">
              <div className="club-benefit-row">
                <div className="benefit-icon-box">
                  <Award size={22} />
                </div>
                <div>
                  <h4>کسب امتیاز با هر سفارش</h4>
                  <p>به ازای هر ۱۰ هزار تومان خرید، ۱ امتیاز نقدی در حساب شما ذخیره می‌شود.</p>
                </div>
              </div>

              <div className="club-benefit-row">
                <div className="benefit-icon-box">
                  <Flame size={22} />
                </div>
                <div>
                  <h4>امتیاز روزانه و بونوس ۷ روزه</h4>
                  <p>هر روز با ورود به سایت امتیاز بگیرید؛ ۷ روز استریک متوالی امتیاز مضاعف دارد.</p>
                </div>
              </div>

              <div className="club-benefit-row">
                <div className="benefit-icon-box">
                  <Crown size={22} />
                </div>
                <div>
                  <h4>سطوح سه‌گانه و تخفیف تا ۱۵٪</h4>
                  <p>ارتقای خودکار به سطوح نقره‌ای، طلایی و VIP همراه با ارسال رایگان در تهران.</p>
                </div>
              </div>
            </div>

            <div className="club-cta-actions">
              <Link to="/club" className="btn btn-primary btn-lg club-primary-btn">
                <span>ورود به باشگاه مشتریان</span>
                <ArrowLeft size={18} />
              </Link>
              {!user && (
                <Link to="/register" className="btn btn-outline btn-lg club-secondary-btn">
                  عضویت رایگان در ۱ دقیقه
                </Link>
              )}
            </div>
          </div>

          {/* Authentic Roastery Digital Membership Card */}
          <div className="club-card-stage">
            <div className="roastery-club-card">
              <div className="card-ambient-glow" />

              {/* Card Header: Brand & Tier Badge */}
              <div className="roastery-card-header">
                <div className="roastery-card-brand">
                  <div className="brand-symbol">
                    <Coffee size={20} />
                  </div>
                  <div className="brand-titles">
                    <strong className="brand-name-fa">کیپ کافی</strong>
                    <span className="brand-sub-fa">باشگاه وفاداری روستری</span>
                  </div>
                </div>
                <div className="roastery-card-tier-pill">
                  <span className="tier-dot" />
                  <span>
                    {user
                      ? points >= 1500
                        ? 'سطح ویژه (VIP)'
                        : points >= 500
                        ? 'سطح طلایی'
                        : 'سطح نقره‌ای'
                      : 'عضویت کارگاه'}
                  </span>
                </div>
              </div>

              {/* Card Body: Points Showcase & Value */}
              <div className="roastery-card-body">
                <div className="points-showcase">
                  <span className="points-label">موجودی امتیاز وفاداری</span>
                  <div className="points-numeric-row">
                    <span className="points-digit">{toPersianDigits(user ? points : '۱۲۰')}</span>
                    <span className="points-unit">امتیاز</span>
                  </div>
                </div>
                <div className="points-value-pill">
                  <span>معادل</span>
                  <strong>{formatToman((user ? points : 120) * 1000)}</strong>
                  <span>تخفیف نقدی</span>
                </div>
              </div>

              {/* Progress to Next Tier */}
              <div className="roastery-card-progress-box">
                <div className="progress-labels">
                  <span>پیشرفت تا سطح بعدی</span>
                  <span>
                    {toPersianDigits(Math.min(user ? points : 120, 500))} / {toPersianDigits(500)} امتیاز
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.min(((user ? points : 120) / 500) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Card Footer: User & Status */}
              <div className="roastery-card-footer">
                <div className="member-meta-item">
                  <span className="meta-label">نام مشترک</span>
                  <strong className="meta-value">{user?.displayName || 'همراه ویژه کیپ کافی'}</strong>
                </div>
                <div className="member-meta-item text-left">
                  <span className="meta-label">وضعیت حساب</span>
                  <span className="status-badge-active">
                    <Flame size={13} />
                    <span>{toPersianDigits(user ? streak : '۷')} روز حضور</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
