import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from './Icons';
import './CoffeeFinder.css';

const roasts = [
  {
    id: 'light',
    label: 'برشت روشن',
    sub: 'Light Roast',
    name: 'اتیوپی یرگاچف',
    origin: 'سینگل اوریجین',
    desc: 'برای کسانی که طعم‌های روشن، میوه‌ای و سرزنده را دوست دارند؛ مثل یک صبح بهاری در فنجان.',
    notes: ['شکوفه یاس', 'مرکبات', 'عسل'],
    body: 2, acidity: 5, bitterness: 1,
    image: '/images/photo-1514432324607-500.webp',
    bean: '#C2814B',
    productSlug: 'ethiopia-yirgacheffe',
  },
  {
    id: 'medium',
    label: 'برشت متوسط',
    sub: 'Medium Roast',
    name: 'برزیل سانتوس',
    origin: 'سینگل اوریجین',
    desc: 'تعادلی دلنشین میان شیرینی و بدنه؛ انتخابی بی‌خطر و دوست‌داشتنی برای هر روز.',
    notes: ['کارامل', 'بادام', 'شکلات شیری'],
    body: 3, acidity: 3, bitterness: 2,
    image: '/images/photo-1541167760496-500.webp',
    bean: '#A05E2E',
    productSlug: 'brazil-santos',
  },
  {
    id: 'medium-dark',
    label: 'متوسط رو به تیره',
    sub: 'Medium-Dark',
    name: 'ترکیب عربیکا کلاسیک',
    origin: 'بلند تخصصی',
    desc: 'عمیق، گرم و شکلاتی؛ برای لحظاتی که به یک فنجان پر و دلگرم‌کننده نیاز داری.',
    notes: ['شکلات تلخ', 'فندق', 'کاکائو'],
    body: 4, acidity: 2, bitterness: 3,
    image: '/images/photo-1498804103079-500.webp',
    bean: '#6E3D20',
    productSlug: 'classic-arabica-blend',
  },
  {
    id: 'dark',
    label: 'برشت تیره',
    sub: 'Dark Roast',
    name: 'اسپرسو ترکیب ویژه',
    origin: 'بلند روبوستا',
    desc: 'قوی، دودی و بی‌پروا؛ مخصوص عاشقان اسپرسوی غلیظ و یک بیدارباش واقعی.',
    notes: ['شکلات تلخ', 'دود', 'ادویه'],
    body: 5, acidity: 1, bitterness: 5,
    image: '/images/photo-1559525839-500.webp',
    bean: '#3C2117',
    productSlug: 'espresso-signature-blend',
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
    <section className="coffee-finder-section">
      <div className="container">
        <div className="finder-header">
          <span className="finder-eyebrow">راهنمای ذائقه</span>
          <h2>قهوه‌ی هم‌ذائقه‌ات را کشف کن</h2>
          <p>درجه‌ی برشته‌کاری دلخواهت را انتخاب کن تا پیشنهاد ما را زنده ببینی.</p>
        </div>

        <div className="finder-interactive">
          <div className="roast-selector" role="tablist" aria-label="درجه برشته‌کاری">
            {roasts.map((r, i) => (
              <button
                key={r.id}
                role="tab"
                aria-selected={i === active}
                className={`roast-option ${i === active ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
                style={{ '--bean': r.bean }}
              >
                <span className="roast-swatch" aria-hidden="true" />
                <span className="roast-labels">
                  <span className="roast-label">{r.label}</span>
                  <span className="roast-sub">{r.sub}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="roast-preview" key={roast.id}>
            <div className="preview-media">
              <img src={roast.image} alt={roast.name} loading="lazy" />
              <span className="preview-tag" style={{ '--bean': roast.bean }}>{roast.label}</span>
            </div>

            <div className="preview-body">
              <span className="preview-origin">{roast.origin}</span>
              <h3>{roast.name}</h3>
              <p>{roast.desc}</p>

              <div className="preview-notes">
                {roast.notes.map((n) => (
                  <span key={n} className="note-chip">{n}</span>
                ))}
              </div>

              <div className="preview-meters">
                {attributes.map((a) => (
                  <div className="meter" key={a.key}>
                    <span className="meter-label">{a.label}</span>
                    <span className="meter-track">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span key={n} className={`meter-dot ${n <= roast[a.key] ? 'on' : ''}`} />
                      ))}
                    </span>
                  </div>
                ))}
              </div>

              <Link to={`/product/${roast.productSlug}`} className="btn btn-primary preview-cta">
                مشاهده‌ی این قهوه
                <ArrowLeft size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
