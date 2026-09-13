import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import CheckInCard from '../components/CheckInCard';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { toPersianDigits, formatToman } from '../utils/format';
import { 
  Award, Crown, Gem, Gift, Percent, Coffee, 
  Check, Flame, Star, Truck, ArrowLeft, Clock 
} from '../components/Icons';
import './ClubPage.css';

const tiers = [
  {
    id: 'silver',
    name: 'سطح نقره‌ای (Silver)',
    tag: 'شروع عضویت',
    icon: Award,
    minSpend: 'از زمان اولین ثبت‌نام',
    discount: 'دسترسی تخفیف‌های فصلی',
    color: '#A8B2C1',
    perks: [
      'کسب ۱ امتیاز به ازای هر ۱۰٬۰۰۰ تومان خرید',
      'امتیاز روزانه حضور در سایت (Check-in)',
      'بونوس استریک ۷ روزه متوالی',
      'دسترسی زودتر به تخفیف‌های پایان هر فصل',
      'خبرنامه تخصصی عطر و طعم و رست روز'
    ],
  },
  {
    id: 'gold',
    name: 'سطح طلایی (Gold Roaster)',
    tag: 'محبوب‌ترین سطح',
    icon: Crown,
    minSpend: 'خرید بالای ۵ میلیون تومان',
    discount: '۵٪ تخفیف دائمی تمام سفارش‌ها',
    featured: true,
    color: '#DE9E48',
    perks: [
      '۵٪ تخفیف دائمی روی تمام ترکیب‌های قهوه',
      'ارسال رایگان در تمام مناطق تهران',
      'کسب ۱.۵ برابر امتیاز به ازای هر خرید',
      'تست رایگان پیش از عرضه میکس‌های جدید',
      'سورپرایز ویژه قهوه در روز تولد',
      'پشتیبانی و اولویت در بسته‌بندی همان روز'
    ],
  },
  {
    id: 'vip',
    name: 'سطح ویژه (VIP Roastery)',
    tag: 'مخصوص حرفه‌ای‌ها و کافه‌دارها',
    icon: Gem,
    minSpend: 'خرید بالای ۱۵ میلیون تومان',
    discount: '۱۵٪ تخفیف دائمی روی کلیه محصولات',
    color: '#E0B589',
    perks: [
      '۱۵٪ تخفیف بدون سقف روی تمام سفارش‌ها',
      'ارسال فوق‌سریع و رایگان سراسر کشور',
      'کسب ۲ برابر امتیاز وفاداری در هر خرید',
      'مشاوره اختصاصی تنظیم و کالیبراسیون آسیاب با مستر روستر',
      'پکیج هدیه قهوه سالانه از گران‌ترین لات‌های تخصصی',
      'لاین ارتباطی مستقیم و اولویت سفارشی‌سازی درجه رست'
    ],
  },
];

const faqs = [
  {
    q: 'امتیازها چطور محاسبه و ذخیره می‌شوند؟',
    a: 'به ازای هر ۱۰٬۰۰۰ تومان خرید دانه قهوه از وب‌سایت، ۱ امتیاز در حساب کاربری شما ذخیره می‌شود. همچنین با هر بار ورود روزانه به سایت و کلیک روی دکمه ثبت حضور، امتیاز روزانه و بونوس ۷ روزه دریافت می‌کنید.',
  },
  {
    q: 'ارزش هر امتیاز در خرید چقدر است؟',
    a: 'هر امتیاز معادل ۱٬۰۰۰ تومان تخفیف مستقیم نقدی در سبد خرید است. یعنی با جمع‌آوری ۱۰۰ امتیاز می‌توانید ۱۰۰٬۰۰۰ تومان کسر قیمت روی سفارش بعدی خود اعمال کنید یا آن را برای دریافت بسته‌های قهوه رایگان استفاده نمایید.',
  },
  {
    q: 'چگونه به سطوح طلایی یا VIP ارتقا پیدا کنم؟',
    a: 'سیستم به صورت خودکار مجموع خریدهای ثبت‌شده با ایمیل شما را محاسبه می‌کند. به محض رسیدن مجموع فاکتورها به ۵ یا ۱۵ میلیون تومان، حساب شما به سطوح بالاتر ارتقا می‌یابد و تخفیف‌ها روی تمام خریدهای آینده اعمال می‌گردند.',
  },
  {
    q: 'آیا امتیازها تاریخ انقضا دارند؟',
    a: 'خیر! امتیازهای شما در کیپ کافی تا زمانی که حساب کاربری‌تان فعال باشد دارای اعتبار هستند و هیچ‌وقت منقضی نخواهند شد.',
  },
];

export default function ClubPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [calcPoints, setCalcPoints] = useState(120);
  const [openFaq, setOpenFaq] = useState(0);

  const refreshProfile = useCallback(async () => {
    if (user) {
      try {
        const data = await api.get('/profile');
        setProfile(data);
      } catch (err) {
        console.error(err);
      }
    }
  }, [user]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const points = profile?.user?.points ?? user?.points ?? 0;
  const streak = profile?.user?.streak ?? user?.streak ?? 0;
  const discountToman = calcPoints * 1000;

  return (
    <div className="page club-page">
      <SEO 
        title="باشگاه مشتریان و همراهان" 
        path="/club" 
        description="باشگاه وفاداری روستری کیپ کافی؛ امتیاز روزانه، کارت دیجیتال عضویت، تخفیف پلکانی تا ۱۵٪ و ارسال رایگان." 
      />

      {/* Hero with Roastery VIP Ambience */}
      <section className="club-hero">
        <div className="container club-hero-container">
          <div className="club-hero-text">
            <div className="club-badge-glow">
              <Star size={16} className="spin-star" />
              <span>باشگاه وفاداری و همراهان روستری</span>
            </div>
            
            <h1 className="club-hero-title">
              طعم وفاداری، عمیق‌تر از <span className="highlight-gold">یک فنجان قهوه</span>
            </h1>
            
            <p className="club-hero-desc">
              در باشگاه کیپ کافی، همراهی شما بی‌پاسخ نمی‌ماند. با هر روز سر زدن به سایت و هر بار سفارش قهوه تازه برشت، امتیاز دریافت کنید و از تخفیف‌های ویژه، ارسال رایگان و هدایای اختصاصی لذت ببرید.
            </p>

            <div className="club-hero-stats">
              <div className="stat-pill">
                <span className="stat-num">{toPersianDigits('2400')}+</span>
                <span className="stat-lbl">عضو فعال روستری</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-pill">
                <span className="stat-num">{toPersianDigits('15')}٪</span>
                <span className="stat-lbl">تخفیف دائمی VIP</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-pill">
                <span className="stat-num">۱۰۰٪</span>
                <span className="stat-lbl">عضویت رایگان</span>
              </div>
            </div>

            {!user ? (
              <div className="club-hero-actions">
                <Link to="/register" className="btn btn-primary btn-lg pulse-btn">
                  عضویت رایگان در ۱ دقیقه
                  <ArrowLeft size={18} />
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  ورود به حساب کاربری
                </Link>
              </div>
            ) : (
              <div className="club-hero-actions">
                <Link to="/profile" className="btn btn-primary btn-lg">
                  مشاهده پروفایل و سوابق
                  <ArrowLeft size={18} />
                </Link>
                <Link to="/shop" className="btn btn-outline btn-lg">
                  خرید با امتیاز
                </Link>
              </div>
            )}
          </div>

          {/* Interactive VIP Digital Card */}
          <div className="club-hero-card-wrap">
            <div className="vip-digital-card">
              <div className="card-texture"></div>
              <div className="card-top">
                <div className="card-brand">
                  <Coffee size={24} className="card-brand-icon" />
                  <span className="card-brand-name">KEEP COFFEE</span>
                </div>
                <div className="card-chip-container">
                  <div className="card-chip-gold"></div>
                  <span className="card-tier-badge">
                    {user ? (points >= 1500 ? 'VIP Member' : points >= 500 ? 'Gold Roaster' : 'Silver Member') : 'Club Member'}
                  </span>
                </div>
              </div>

              <div className="card-middle">
                <div className="card-points-display">
                  <span className="card-points-title">موجودی امتیاز:</span>
                  <span className="card-points-amount">
                    {toPersianDigits(user ? points : '0')} <small>PTS</small>
                  </span>
                </div>
                <div className="card-streak-pill">
                  <Flame size={18} />
                  <span>{toPersianDigits(user ? streak : '0')} روز استریک</span>
                </div>
              </div>

              <div className="card-bottom">
                <div className="card-holder">
                  <span className="card-holder-label">دارنده کارت</span>
                  <span className="card-holder-name">
                    {user?.displayName || 'مهمان ویژه کارگاه'}
                  </span>
                </div>
                <div className="card-expiry">
                  <span className="card-holder-label">وضعیت</span>
                  <span className="card-status-val">{user ? 'فعال ✓' : 'در انتظار عضویت'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Live Dashboard if Logged in */}
      {user && (
        <section className="container club-live-section">
          <div className="club-live-grid">
            <div className="live-welcome-box">
              <div className="welcome-avatar">
                <Crown size={32} />
              </div>
              <div className="welcome-text">
                <h2>خوش آمدید، {user.displayName}!</h2>
                <p>شما در حال حاضر با <strong>{toPersianDigits(points)}</strong> امتیاز می‌توانید تا <strong>{formatToman(points * 1000)} تومان</strong> روی سفارش بعدی خود تخفیف بگیرید.</p>
              </div>
            </div>
            <div className="live-checkin-wrapper">
              <CheckInCard 
                streak={streak} 
                checkedInToday={profile?.checkedInToday} 
                onUpdated={refreshProfile} 
              />
            </div>
          </div>
        </section>
      )}

      {/* How it works - 3 Steps */}
      <section className="container club-steps-section">
        <div className="section-header-center">
          <span className="section-sub-badge">روند ساده و شفاف</span>
          <h2 className="section-title">چگونه از باشگاه امتیاز بگیریم؟</h2>
          <p className="section-subtitle">تنها در سه گام ساده قهوه‌های باکیفیت‌تر را با هزینه کمتر بنوشید</p>
        </div>

        <div className="club-steps-grid">
          <div className="step-card">
            <div className="step-num">۰۱</div>
            <div className="step-icon-wrap">
              <Gift size={28} />
            </div>
            <h3>عضویت و ورود روزانه</h3>
            <p>
              بدون نیاز به پرداخت هزینه ثبت‌نام کنید و با هر روز سر زدن به وب‌سایت دکمه ثبت امتیاز را بزنید. استریک ۷ روزه امتیاز دوبل دارد!
            </p>
          </div>

          <div className="step-card featured-step">
            <div className="step-num">۰۲</div>
            <div className="step-icon-wrap">
              <Coffee size={28} />
            </div>
            <h3>سفارش ترکیب‌های محبوب</h3>
            <p>
              با هر کیلوگرم خرید از ۶ ترکیب رسمی روستری، امتیاز به حساب شما اضافه می‌شود. خریدهای بالاتر شتاب کسب امتیاز را بیشتر می‌کنند.
            </p>
          </div>

          <div className="step-card">
            <div className="step-num">۰۳</div>
            <div className="step-icon-wrap">
              <Percent size={28} />
            </div>
            <h3>تبدیل به تخفیف و ارسال رایگان</h3>
            <p>
              امتیازهای انباشته شده را در سبد خرید یا پرداخت بعدی به تخفیف نقدی تبدیل کنید و از ارسال رایگان کیپ کافی بهره‌مند شوید.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Points Calculator */}
      <section className="container club-calc-section">
        <div className="calc-card">
          <div className="calc-info">
            <span className="calc-badge">محاسبه‌گر هوشمند امتیاز</span>
            <h2>ارزش امتیازهای شما چقدر است؟</h2>
            <p>
              میزان امتیاز مورد نظرتان را انتخاب کنید تا ببینید چه مقدار تخفیف مستقیم نقدی یا چه هدایایی دریافت خواهید کرد:
            </p>

            <div className="calc-slider-wrap">
              <div className="calc-slider-header">
                <span>تعداد امتیاز:</span>
                <span className="calc-slider-val">{toPersianDigits(calcPoints)} امتیاز</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="500" 
                step="10"
                value={calcPoints}
                onChange={(e) => setCalcPoints(Number(e.target.value))}
                className="calc-range"
              />
              <div className="calc-slider-marks">
                <span>۱۰</span>
                <span>۱۰۰</span>
                <span>۲۵۰</span>
                <span>۵۰۰</span>
              </div>
            </div>
          </div>

          <div className="calc-result-box">
            <div className="calc-result-content">
              <span className="calc-res-label">تخفیف نقدی معادل در خرید:</span>
              <div className="calc-res-val">
                {toPersianDigits(discountToman.toLocaleString('en-US'))}
                <span className="calc-curr">تومان</span>
              </div>
              <div className="calc-perks-list">
                <div className="calc-perk">
                  <Check size={16} />
                  <span>معادل {toPersianDigits(Math.floor(discountToman / 25000))} شات اسپرسوی اختصاصی</span>
                </div>
                <div className="calc-perk">
                  <Check size={16} />
                  <span>قابل کسر مستقیم روی فاکتور خرید دانه‌ها</span>
                </div>
                {calcPoints >= 200 && (
                  <div className="calc-perk gold-perk">
                    <Star size={16} />
                    <span>شامل ارسال رایگان درب منزل در تهران</span>
                  </div>
                )}
              </div>
              <Link to="/shop" className="btn btn-primary btn-block">
                استفاده در فروشگاه قهوه
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Luxury Membership Tiers */}
      <section className="container club-tiers-section">
        <div className="section-header-center">
          <span className="section-sub-badge">پاداش وفاداری پلکانی</span>
          <h2 className="section-title">سطوح عضویت در کارگاه</h2>
          <p className="section-subtitle">با ارتقای سطح، امکانات و مزایای ویژه روستری به صورت خودکار برای شما باز می‌شوند</p>
        </div>

        <div className="tiers-grid-luxury">
          {tiers.map((t) => {
            const Icon = t.icon;
            return (
              <div 
                key={t.id} 
                className={`tier-card-luxury ${t.featured ? 'is-featured-luxury' : ''}`}
                style={{ '--tier-accent': t.color }}
              >
                {t.featured && (
                  <div className="tier-flag-luxury">
                    <Crown size={14} />
                    <span>محبوب‌ترین سطح</span>
                  </div>
                )}

                <div className="tier-header-luxury">
                  <div className="tier-icon-luxury">
                    <Icon size={32} />
                  </div>
                  <h3>{t.name}</h3>
                  <span className="tier-tag-pill">{t.tag}</span>
                </div>

                <div className="tier-discount-banner">
                  <span className="tier-discount-val">{t.discount}</span>
                  <span className="tier-spend-hint">{t.minSpend}</span>
                </div>

                <ul className="tier-perks-luxury">
                  {t.perks.map((p, idx) => (
                    <li key={idx}>
                      <span className="perk-check-icon"><Check size={14} /></span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <div className="tier-card-action">
                  {!user ? (
                    <Link to="/register" className={`btn ${t.featured ? 'btn-primary' : 'btn-outline'} btn-block`}>
                      شروع عضویت با این سطح
                    </Link>
                  ) : (
                    <Link to="/shop" className={`btn ${t.featured ? 'btn-primary' : 'btn-outline'} btn-block`}>
                      افزایش سقف با خرید قهوه
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section with Interactive Accordion */}
      <section className="container club-faq-section">
        <div className="section-header-center">
          <span className="section-sub-badge">پاسخ به سوالات شما</span>
          <h2 className="section-title">پرسش‌های پرتکرار باشگاه مشتریان</h2>
        </div>

        <div className="faq-accordion">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                className={`faq-item ${isOpen ? 'is-open' : ''}`}
                onClick={() => setOpenFaq(isOpen ? null : idx)}
              >
                <div className="faq-question">
                  <h3>{faq.q}</h3>
                  <span className="faq-toggle-icon">{isOpen ? '−' : '+'}</span>
                </div>
                {isOpen && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Roastery Callout */}
      <section className="container club-bottom-cta">
        <div className="club-bottom-box">
          <h2>آماده چشیدن طعم یک قهوه تازه و پرامتیاز هستید؟</h2>
          <p>
            همین امروز به خانواده کیپ کافی بپیوندید و اولین امتیاز خوش‌آمدگویی خود را دریافت کنید.
          </p>
          <div className="club-bottom-actions">
            {!user ? (
              <Link to="/register" className="btn btn-primary btn-lg">
                عضویت در باشگاه مشتریان
              </Link>
            ) : (
              <Link to="/shop" className="btn btn-primary btn-lg">
                مشاهده محصولات و سفارش قهوه
              </Link>
            )}
            <a href="tel:09335333499" className="btn btn-outline btn-lg">
              تماس با کارگاه روستری
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
