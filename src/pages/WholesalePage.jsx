import React, { Suspense, lazy } from 'react';
import { Truck, Package, BadgePercent, Headset, Phone, Send, Coffee, HelpCircle } from '../components/Icons';
import SEO from '../components/SEO';
import RoasteryCalculator from '../components/RoasteryCalculator';
import { site, links } from '../data/site';
import { formatToman } from '../utils/format';
import { products } from '../data/products';
import './WholesalePage.css';

const WholesaleBanner = lazy(() => import('../components/WholesaleBanner'));

const benefits = [
  { icon: BadgePercent, title: 'قیمت مستقیم و دست‌اول کارگاه', desc: 'حذف کامل دلال‌ها و واسطه‌ها؛ خرید مستقیم با نرخ مصوب کارگاه برشته‌کاری.' },
  { icon: Package, title: 'ثبات پروفایل برشت (Roast Curve)', desc: 'پایش و ثبت دیجیتال پروفایل دمایی برشت در هر بچ برای تضمین طعم یکدست در تمام طول سال.' },
  { icon: Truck, title: 'ارسال رایگان در سراسر تهران', desc: 'تحویل منظم هفتگی با پیک اختصاصی در تمامی مناطق تهران برای سفارش‌های بالای ۲۰ کیلوگرم.' },
  { icon: Headset, title: 'کالیبراسیون و مشاوره باریستا', desc: 'پشتیبانی فنی رایگان توسط مستر روستر کارگاه جهت تنظیم آسیاب و عصاره‌گیری استاندارد منوی کافه.' },
];

export default function WholesalePage() {
  const beanProducts = products.filter(p => p.category === 'beans');

  const breadcrumbs = [
    { name: 'خانه', url: '/' },
    { name: 'همکاری عمده و تأمین کافه‌ها', url: '/wholesale' }
  ];

  const wholesaleFAQ = [
    {
      question: "آیا قبل از ثبت سفارش عمده امکان دریافت نمونه تست (Sample Pack) وجود دارد؟",
      answer: "بله، برای کافه‌ها و شرکت‌های همکار بسته نمونه تست از ترکیب‌های منتخب کارگاه ارسال می‌شود تا پیش از عقد قرارداد، کیفیت عصاره‌گیری و عطر قهوه روی دستگاه‌های اسپرسوی خودتان ارزیابی شود."
    },
    {
      question: "حداقل میزان سفارش برای بهره‌مندی از نرخ عمده و ارسال رایگان چقدر است؟",
      answer: "حداقل سفارش برای قیمت همکاری ۱۰ کیلوگرم است و برای سفارش‌های بالای ۲۰ کیلوگرم، ارسال در سراسر تهران کاملاً رایگان انجام می‌پذیرد."
    },
    {
      question: "بسته‌بندی دانه‌ها در سفارش‌های عمده به چه صورت است؟",
      answer: "دانه‌های قهوه در پاکت‌های ضخیم آلومینیومی چندلایه، زیپ‌کیپ‌دار و مجهز به سوپاپ یک‌طرفه تخلیه گاز (One-Way Degassing Valve) بسته‌بندی می‌شوند تا طراوت و گازهای برشت تازه تا ماه‌ها حفظ شود."
    },
    {
      question: "آیا کالیبراسیون و تنظیم دستگاه آسیاب کافه توسط کارگاه انجام می‌شود؟",
      answer: "بله، تیم فنی و روستر کیپ کافی در صورت نیاز، تنظیمات درجه آسیاب، زمان عصاره‌گیری و نسبت آب به قهوه (Brew Ratio) را با منوی کافه شما هماهنگ می‌نمایند."
    }
  ];

  return (
    <div className="page wholesale-page">
      <SEO 
        title="فروش عمده قهوه و تأمین تخصصی کافه‌ها" 
        path="/wholesale" 
        description="تأمین دانه قهوه تازه برشت برای کافه‌ها، رستوران‌ها، هتل‌ها و دفاتر پخش در تهران و سراسر کشور. قیمت دست‌اول کارگاه، ارسال رایگان بالای ۲۰ کیلو و برشته‌کاری تخصصی."
        breadcrumbs={breadcrumbs}
        faq={wholesaleFAQ}
      />

      <div className="page-hero">
        <div className="container">
          <span className="wholesale-hero-tag">لاین هورکا و زنجیره تأمین کافه‌ها</span>
          <h1>همکاری عمده با کارگاه برشته‌کاری کیپ کافی</h1>
          <p>تأمین پایدار، ثبات دقیق در پروفایل طعمی و قیمت‌های مستقیم کارگاهی برای کسب‌وکار شما.</p>
        </div>
      </div>

      <div className="container section-pad">
        {/* Interactive B2B Supply & Cost Calculator */}
        <RoasteryCalculator />

        {/* Blends Grid */}
        <div className="wholesale-catalog-section">
          <div className="section-header" style={{ textAlign: 'center', justifyContent: 'center' }}>
            <div>
              <span className="section-sub-badge">نرخ‌نامه رسمی کارگاه</span>
              <h2 className="section-title">ترکیب‌های تخصصی کیپ کافی جهت تأمین و سفارش</h2>
              <p className="section-desc">قیمت‌ها بر حسب تومان برای هر کیلوگرم دانه قهوه | ارسال رایگان در تهران بالای ۲۰ کیلوگرم</p>
            </div>
          </div>

          <div className="wholesale-blends-grid">
            {beanProducts.map((b) => (
              <div key={b.id} className="wholesale-blend-card">
                <div className="blend-card-header">
                  <Coffee size={22} className="blend-header-icon" />
                  <h3>{b.name}</h3>
                </div>
                <span className="blend-ratio-pill">{b.origin}</span>
                <p className="blend-desc-text">{b.description}</p>
                <div className="blend-price-footer">
                  <span className="price-label">قیمت هر کیلوگرم:</span>
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

        {/* FAQ Section */}
        <div className="wholesale-faq-section">
          <div className="section-header" style={{ textAlign: 'center', justifyContent: 'center', marginBottom: '28px' }}>
            <div>
              <span className="section-sub-badge">راهنمای همکاری</span>
              <h2 className="section-title">پرسش‌های متداول همکاران و کافه‌داران</h2>
            </div>
          </div>

          <div className="wholesale-faq-grid">
            {wholesaleFAQ.map((item, idx) => (
              <div key={idx} className="w-faq-item">
                <div className="w-faq-q">
                  <HelpCircle size={18} className="w-faq-icon" />
                  <h4>{item.question}</h4>
                </div>
                <p className="w-faq-a">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="wholesale-cta">
          <span className="wholesale-cta-badge">مشاوره حضوری و ارسال بسته تست</span>
          <h2>آماده‌ی ارتقای کیفیت قهوه کافه‌تان هستید؟</h2>
          <p>برای دریافت مشاوره، هماهنگی ارسال نمونه تست قهوه (Sample Pack) و استعلام قراردادهای تأمین با واحد مدیریت و فروش کارگاه در تماس باشید:</p>
          <div className="wholesale-cta-actions">
            <a href={links.telRahimi()} className="btn btn-primary btn-lg">
              <Phone size={18} /> تماس با آقای رحیمی: {site.phoneRahimi}
            </a>
            <a href={links.telRabiee()} className="btn btn-outline btn-lg">
              <Phone size={18} /> تماس با آقای ربیعی: {site.phoneRabiee}
            </a>
            <a href={links.whatsapp('سلام، برای استعلام همکاری عمده و دریافت بسته نمونه با شما تماس گرفتم.')} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
              <Send size={18} /> پیام مستقیم واتساپ
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
