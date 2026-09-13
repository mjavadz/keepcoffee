import React, { Suspense, lazy } from 'react';
import { Truck, Package, BadgePercent, Headset, Phone, Send, Coffee } from '../components/Icons';
import SEO from '../components/SEO';
import { site, links } from '../data/site';
import { formatToman } from '../utils/format';
import './WholesalePage.css';

const WholesaleBanner = lazy(() => import('../components/WholesaleBanner'));

const benefits = [
  { icon: BadgePercent, title: 'قیمت مستقیم کارگاهی', desc: 'حذف واسطه‌ها و ارائه قیمت‌های دست اول کارگاه رستری برای کافه‌ها و شرکت‌های پخش.' },
  { icon: Package, title: 'ثبات پروفایل برشت', desc: 'پایش مستمر دمایی با رستر صنعتی کرون (KORON) جهت تضمین یکنواختی کامل در تمام سفارش‌ها.' },
  { icon: Truck, title: 'ارسال رایگان در تهران', desc: 'تحویل سریع و رایگان در تمام مناطق تهران برای خریدهای بالای ۲۰ کیلوگرم.' },
  { icon: Headset, title: 'مشاوره و کالیبراسیون', desc: 'مشاوره اختصاصی با مستر روستر جهت تنظیم آسیاب و بهینه‌سازی عصاره‌گیری منوی کافه.' },
];

const officialBlends = [
  { name: 'میکس ۱۰۰ روبوستا کلاسیک', ratio: '۱۰۰٪ روبوستا', price: 2200000, notes: 'کافئین فوق‌العاده، کرمای غلیظ فندقی، بادی سنگین' },
  { name: 'میکس ۱۰۰ روبوستا پرمیوم', ratio: '۱۰۰٪ روبوستا پرمیوم', price: 2380000, notes: 'دانه‌های سورت‌شده دست‌چین، بدون تلخی زننده، کرمای ماندگار' },
  { name: 'میکس ۸۰/۲۰ روبوستا', ratio: '۸۰٪ روبوستا / ۲۰٪ عربیکا', price: 2490000, notes: 'تعادل هوشمند کافئین و عطر دلنشین، فرمول پرطرفدار کافه‌ای' },
  { name: 'میکس ۷۰/۳۰ روبوستا کلاسیک', ratio: '۷۰٪ روبوستا / ۳۰٪ عربیکا', price: 2630000, notes: 'ترکیب اصیل و همه‌پسند اسپرسو بار با فوم پایدار' },
  { name: 'میکس ۷۰/۳۰ روبوستا پرمیوم', ratio: '۷۰٪ روبوستا / ۳۰٪ عربیکا', price: 2740000, notes: 'طعم‌یادهای شکلات تلخ و بادام بوداده با اسیدیته بسیار ملایم' },
  { name: 'میکس ۵۰/۵۰ پرمیوم', ratio: '۵۰٪ عربیکا / ۵۰٪ روبوستا', price: 3200000, notes: 'توازن طلایی پیچیدگی عطر و تن‌واری سنگین، پرچمدار کارگاه' },
];

export default function WholesalePage() {
  return (
    <div className="page wholesale-page">
      <SEO 
        title="فروش عمده و همکاری با کافه‌ها" 
        path="/wholesale" 
        description="تأمین دانه قهوه تازه برشت برای کافه‌ها، رستوران‌ها و دفاتر پخش در تهران و سراسر کشور. قیمت‌های رقابتی، ارسال رایگان بالای ۲۰ کیلو و برشت صنعتی KORON." 
      />

      <div className="page-hero">
        <div className="container">
          <span className="wholesale-hero-tag">لاین هورکا و تأمین کافه‌ها</span>
          <h1>همکاری عمده با روستری کیپ کافی</h1>
          <p>تأمین پایدار، ثبات در طعم و کیفیت تضمین‌شده برای کسب‌وکار شما.</p>
        </div>
      </div>

      <div className="container section-pad">
        {/* Blends Grid */}
        <div className="wholesale-catalog-section">
          <div className="section-header" style={{ textAlign: 'center', justifyContent: 'center' }}>
            <div>
              <span className="section-sub-badge">نرخ‌نامه مصوب کارگاه</span>
              <h2 className="section-title">۶ ترکیب رسمی کیپ کافی جهت تأمین و سفارش</h2>
              <p className="section-desc">قیمت‌ها بر حسب تومان برای هر کیلوگرم دانه قهوه | ارسال رایگان در تهران بالای ۲۰ کیلو</p>
            </div>
          </div>

          <div className="wholesale-blends-grid">
            {officialBlends.map((b, idx) => (
              <div key={idx} className="wholesale-blend-card">
                <div className="blend-card-header">
                  <Coffee size={22} className="blend-header-icon" />
                  <h3>{b.name}</h3>
                </div>
                <span className="blend-ratio-pill">{b.ratio}</span>
                <p className="blend-desc-text">{b.notes}</p>
                <div className="blend-price-footer">
                  <span className="price-label">قیمت هر کیلو:</span>
                  <strong className="price-number">{formatToman(b.price)}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="wholesale-benefits">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="wholesale-benefit">
                <span className="wb-icon"><Icon size={26} /></span>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="wholesale-cta">
          <span className="wholesale-cta-badge">مشاوره و ارسال بسته نمونه (Sample Pack)</span>
          <h2>آماده‌ی شروع همکاری هستید؟</h2>
          <p>برای دریافت مشاوره، هماهنگی ارسال نمونه تست قهوه و ثبت سفارش با مسئول فروش و تأمین در تماس باشید:</p>
          <div className="wholesale-cta-actions">
            <a href={`tel:${site.phoneHref}`} className="btn btn-primary btn-lg">
              <Phone size={18} /> تماس با آقای ربیعی: {site.phone}
            </a>
            <a href={links.whatsapp('سلام، برای استعلام همکاری عمده و دریافت بسته نمونه با شما تماس گرفتم.')} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
              <Send size={18} /> پیام در واتساپ
            </a>
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <WholesaleBanner />
      </Suspense>
    </div>
  );
}
