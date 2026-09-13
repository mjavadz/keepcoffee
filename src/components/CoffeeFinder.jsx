import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from './Icons';
import './CoffeeFinder.css';

const roasts = [
  {
    id: 'light',
    label: 'برشت متوازن',
    sub: 'Balanced 50/50',
    name: 'میکس ۵۰/۵۰ پرمیوم',
    origin: '۵۰٪ عربیکا / ۵۰٪ روبوستا',
    desc: 'هارمونی بی‌نقص برای ذائقه‌های دقیق؛ نیمی عربیکای معطر با اسیدیته زنده و نیمی روبوستای پربدنه با فوم غنی.',
    notes: ['شکلات شیری', 'مرکبات ملایم', 'شهد گل'],
    body: 3, acidity: 4, bitterness: 2,
    image: '/images/photo-1498804103079-500.webp',
    bean: '#C2814B',
    productSlug: 'mix-50-50-premium',
  },
  {
    id: 'medium',
    label: 'برشت متوسط',
    sub: 'Medium 70/30',
    name: 'میکس ۷۰/۳۰ پرمیوم',
    origin: '۷۰٪ روبوستا اعلا / ۳۰٪ عربیکا تخصصی',
    desc: 'ترکیبی ممتاز از دانه‌های روبوستای باکیفیت و عربیکای شسته‌شده با عطر دلنشین و پس‌مزه ماندگار و شیرین.',
    notes: ['میوه خشک', 'شکلات تلخ', 'فندق'],
    body: 4, acidity: 2, bitterness: 3,
    image: '/images/photo-1514432324607-500.webp',
    bean: '#A05E2E',
    productSlug: 'mix-70-30-robusta-premium',
  },
  {
    id: 'medium-dark',
    label: 'متوسط رو به تیره',
    sub: 'Rich 80/20',
    name: 'میکس ۸۰/۲۰ روبوستا',
    origin: '۸۰٪ روبوستا / ۲۰٪ عربیکا',
    desc: 'فرمول طلایی و پرطرفدار کافه‌ای؛ ترکیب ۸۰ درصد روبوستای پرکافئین با ۲۰ درصد عربیکای معطر برای کرمای مخملی.',
    notes: ['شکلات شیری', 'کارامل', 'فندق'],
    body: 4, acidity: 1, bitterness: 4,
    image: '/images/photo-1497935586351-500.webp',
    bean: '#6E3D20',
    productSlug: 'mix-80-20-robusta',
  },
  {
    id: 'dark',
    label: 'برشت تیره و پرقدرت',
    sub: '100% Robusta',
    name: 'میکس ۱۰۰ روبوستا پرمیوم',
    origin: '۱۰۰٪ روبوستا سورت‌شده و دست‌چین',
    desc: 'قوی، غلیظ و بدون زنندگی طعم؛ با بادی سنگین، کرمای ماندگار و کافئین فوق‌العاده بالا برای یک بیدارباش واقعی.',
    notes: ['کاکائو', 'گردو', 'پایپ چوبی'],
    body: 5, acidity: 1, bitterness: 5,
    image: '/images/photo-1559525839-500.webp',
    bean: '#3C2117',
    productSlug: 'mix-100-robusta-premium',
  },
];

const attributes = [
  { key: 'body', label: 'بدنه' },
  { key: 'acidity', label: 'اسیدیته' },
  { key: 'bitterness', label: 'تلخی' },
];

export default function CoffeeFinder() {
  const [active, setActive] = useState(1);
  const roast = roasts[active];

  return (
    <section className="finder-section">
      <div className="container">
        <div className="finder-header">
          <span className="finder-kicker">راهنمای هوشمند انتخاب</span>
          <h2>قهوه مناسب سلیقه‌ی شما</h2>
          <p>
            طعم دلخواه‌تان را بر اساس میزان برشتگی (رست) و ویژگی‌های طعمی پیدا کنید.
          </p>
        </div>

        <div className="finder-card">
          <div className="finder-tabs" role="tablist">
            {roasts.map((r, i) => (
              <button
                key={r.id}
                role="tab"
                aria-selected={active === i}
                className={`finder-tab ${active === i ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="tab-bean" style={{ background: r.bean }} />
                <span className="tab-label">{r.label}</span>
                <span className="tab-sub">{r.sub}</span>
              </button>
            ))}
          </div>

          <div className="finder-body">
            <div className="finder-visual">
              <img
                src={roast.image}
                alt={roast.name}
                loading="lazy"
                width={500}
                height={500}
              />
              <span className="visual-badge">{roast.origin}</span>
            </div>

            <div className="finder-info">
              <div className="finder-title-row">
                <h3>{roast.name}</h3>
                <span className="finder-roast-pill">{roast.label}</span>
              </div>
              <p className="finder-desc">{roast.desc}</p>

              <div className="finder-bars">
                {attributes.map((attr) => (
                  <div key={attr.key} className="meter-row">
                    <span className="meter-label">{attr.label}</span>
                    <div className="meter-track">
                      <div
                        className="meter-fill"
                        style={{ width: `${(roast[attr.key] / 5) * 100}%` }}
                      />
                    </div>
                    <span className="meter-val">{roast[attr.key]}/۵</span>
                  </div>
                ))}
              </div>

              <div className="finder-notes">
                <span className="notes-label">طعم‌یادها:</span>
                <div className="notes-tags">
                  {roast.notes.map((n) => (
                    <span key={n} className="note-tag">
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                to={`/product/${roast.productSlug}`}
                className="btn btn-primary finder-cta"
              >
                مشاهده و خرید این قهوه
                <ArrowLeft size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
