import React, { useState, useMemo } from 'react';
import { Coffee, Calculator, Check, Send, Phone, Truck, Sparkles } from './Icons';
import { products } from '../data/products';
import { formatToman, toPersianDigits } from '../utils/format';
import { site, links } from '../data/site';
import './RoasteryCalculator.css';

export default function RoasteryCalculator() {
  const beanProducts = useMemo(() => products.filter(p => p.category === 'beans'), []);
  
  // State
  const [dailyShots, setDailyShots] = useState(80); // 80 cups per day default
  const [selectedBlendId, setSelectedBlendId] = useState(beanProducts[2]?.id || 3); // 80/20 default

  const selectedBlend = useMemo(() => {
    return beanProducts.find(p => p.id === selectedBlendId) || beanProducts[0];
  }, [beanProducts, selectedBlendId]);

  // Calculations
  // Standard double shot uses ~18 grams of coffee
  const monthlyKg = useMemo(() => {
    const totalGramsMonthly = dailyShots * 18 * 30;
    return Math.max(5, Math.round(totalGramsMonthly / 1000));
  }, [dailyShots]);

  // Volume discount tier
  const discountPercent = useMemo(() => {
    if (monthlyKg >= 50) return 15;
    if (monthlyKg >= 20) return 10;
    if (monthlyKg >= 10) return 5;
    return 0;
  }, [monthlyKg]);

  const basePricePerKg = selectedBlend.price || 2400000;
  const discountedPricePerKg = Math.round(basePricePerKg * (1 - discountPercent / 100));
  const totalMonthlyCost = discountedPricePerKg * monthlyKg;
  const costPerCup = Math.round((discountedPricePerKg / 1000) * 18);
  const monthlySavings = (basePricePerKg - discountedPricePerKg) * monthlyKg;
  const isFreeDelivery = monthlyKg >= 20;

  const whatsappMessage = `سلام، من از بخش ماشین‌حساب تأمین کافه در سایت کیپ کافی پیام می‌دهم.
مصرف تخمینی ما ماهانه حدود ${monthlyKg} کیلوگرم دانه (${selectedBlend.name}) است.
جهت دریافت بسته تست (Sample Pack) و هماهنگی قیمت همکاری عمده راهنمایی بفرمایید.`;

  return (
    <div className="roastery-calc-card">
      <div className="calc-header">
        <div className="calc-header-icon">
          <Calculator size={28} />
        </div>
        <div>
          <span className="calc-badge">ابزار ویژه مدیران کافه و باریستاها</span>
          <h3 className="calc-title">ماشین‌حساب هوشمند تأمین دانه و محاسبه بهای تمام‌شده</h3>
          <p className="calc-subtitle">
            برآورد دقیق مصرف ماهانه، هزینه هر شات اسپرسو و درصد تخفیف پلکانی کارگاه کیپ کافی
          </p>
        </div>
      </div>

      <div className="calc-body-grid">
        {/* Controls Column */}
        <div className="calc-controls">
          <div className="calc-control-group">
            <div className="control-label-row">
              <label htmlFor="daily-shots-slider">تعداد فنجان اسپرسو در روز:</label>
              <strong className="control-value-badge">{toPersianDigits(dailyShots)} شات روزانه</strong>
            </div>
            <input
              id="daily-shots-slider"
              type="range"
              min="20"
              max="300"
              step="10"
              value={dailyShots}
              onChange={(e) => setDailyShots(Number(e.target.value))}
              className="calc-range-slider"
            />
            <div className="slider-ticks">
              <span>۲۰ (کافه کوچک / اداری)</span>
              <span>۱۰۰ (متوسط)</span>
              <span>۳۰۰ (اسپرسوبار شلوغ)</span>
            </div>
          </div>

          <div className="calc-control-group">
            <label className="control-label">انتخاب ترکیب پیشنهادی کارگاه:</label>
            <div className="blend-selection-chips">
              {beanProducts.map((blend) => (
                <button
                  key={blend.id}
                  type="button"
                  className={`blend-select-chip ${selectedBlendId === blend.id ? 'is-active' : ''}`}
                  onClick={() => setSelectedBlendId(blend.id)}
                >
                  <span className="chip-name">{blend.name}</span>
                  <span className="chip-roast">{blend.roast}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="calc-quick-features">
            <div className="qf-item">
              <Check size={16} className="qf-check" />
              <span>پروفایل حرارتی اختصاصی پایدار در تمام پارت‌های ارسالی</span>
            </div>
            <div className="qf-item">
              <Check size={16} className="qf-check" />
              <span>بسته‌بندی متالایز زیپ‌کیپ و سوپاپ‌دار ویژه کافه‌ها</span>
            </div>
            <div className="qf-item">
              <Check size={16} className="qf-check" />
              <span>مشاوره و کالیبراسیون دوره‌ای آسیاب توسط روستر</span>
            </div>
          </div>
        </div>

        {/* Output Results Column */}
        <div className="calc-results-box">
          <div className="results-header">
            <h4>خلاصه برآورد تأمین ماهانه</h4>
            <span className="results-volume-pill">
              تخمین: <strong>{toPersianDigits(monthlyKg)} کیلوگرم</strong> در ماه
            </span>
          </div>

          <div className="results-stats-grid">
            <div className="stat-card">
              <span className="stat-label">هزینه تمام‌شده هر فنجان:</span>
              <div className="stat-number-row">
                <strong className="stat-val accent">{formatToman(costPerCup)}</strong>
                <span className="stat-sub">تومان (دوز ۱۸ گرم)</span>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-label">تخفیف پلکانی همکاری:</span>
              <div className="stat-number-row">
                <strong className="stat-val gold">
                  {discountPercent > 0 ? `${toPersianDigits(discountPercent)}٪ تخفیف` : 'پایه کارگاهی'}
                </strong>
                {monthlySavings > 0 && (
                  <span className="stat-sub save">سود شما: {formatToman(monthlySavings)}</span>
                )}
              </div>
            </div>

            <div className="stat-card full-span">
              <span className="stat-label">نرخ همکاری هر کیلوگرم ({selectedBlend.name}):</span>
              <div className="stat-number-row">
                <strong className="stat-val">{formatToman(discountedPricePerKg)}</strong>
                {discountPercent > 0 && (
                  <span className="old-price-del">{formatToman(basePricePerKg)}</span>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Note */}
          <div className={`delivery-status-note ${isFreeDelivery ? 'is-free' : ''}`}>
            <Truck size={18} />
            <span>
              {isFreeDelivery
                ? 'شامل ارسال رایگان و فوری با پیک اختصاصی در تمامی مناطق تهران'
                : 'با افزایش حجم به بالای ۲۰ کیلوگرم در ماه، ارسال در تهران کاملاً رایگان خواهد بود.'}
            </span>
          </div>

          {/* CTA Actions */}
          <div className="calc-action-buttons">
            <a
              href={links.whatsapp(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-block calc-cta-btn"
            >
              <Send size={18} />
              <span>
                دریافت بسته تست <span className="calc-sample-tag">(Sample Pack)</span> و عقد قرارداد <span className="calc-wa-tag">در واتساپ</span>
              </span>
            </a>
            <div className="calc-phones-row">
              <a href={links.telRahimi()} className="calc-phone-link">
                <Phone size={14} /> مدیریت ({site.contactPersonRahimi}): {site.phoneRahimi}
              </a>
              <a href={links.telRabiee()} className="calc-phone-link">
                <Phone size={14} /> سفارشات ({site.contactPersonRabiee}): {site.phoneRabiee}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
