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

          {/* Luxury VIP Roastery Digital Card */}
          <div className="club-card-stage">
            <div className="club-vip-card">
              <div className="card-ambient-light"></div>
              
              <div className="card-top-bar">
                <div className="card-brand-group">
                  <Coffee size={22} className="card-coffee-icon" />
                  <span className="card-brand-title">KEEP COFFEE</span>
                </div>
                <div className="card-chip-wrap">
                  <div className="card-chip-metal"></div>
                  <span className="card-tier-label">
                    {user ? (points >= 1500 ? 'VIP Member' : points >= 500 ? 'Gold Roaster' : 'Silver Member') : 'Club Member'}
                  </span>
                </div>
              </div>

              <div className="card-body-metrics">
                <div>
                  <span className="card-metric-label">موجودی امتیاز:</span>
                  <div className="card-metric-val">
                    {toPersianDigits(user ? points : '120')} <small>PTS</small>
                  </div>
                </div>
                <div className="card-streak-badge">
                  <Flame size={16} />
                  <span>{toPersianDigits(user ? streak : '7')} روز استریک</span>
                </div>
              </div>

              <div className="card-footer-bar">
                <div>
                  <span className="card-sub-label">دارنده کارت</span>
                  <strong className="card-owner-name">
                    {user?.displayName || 'همراه ویژه کارگاه'}
                  </strong>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <span className="card-sub-label">وضعیت</span>
                  <span className="card-active-pill">{user ? 'فعال ✓' : 'عضویت باز'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
