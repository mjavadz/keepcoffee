import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from './Icons';
import './CoffeeFinder.css';

const roasts = [
  {
    id: 'balanced',
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
    name: 'میکس ۷۰/۳۰ روبوستا پرمیوم',
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
    <section className="coffee-finder-section">
      <div className="container">
        <div className="finder-header">
          <span className="finder-eyebrow">راهنمای ذائقه</span>
          <h2>قهوه مناسب سلیقه‌ی شما</h2>
          <p>درجه‌ی برشته‌کاری دلخواهت را انتخاب کن تا ویژگی‌ها و مشخصات آن را زنده ببینی.</p>
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
