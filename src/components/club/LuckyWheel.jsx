import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Gift, Copy, Check, Clock } from '../Icons';
import { toPersianDigits } from '../../utils/format';
import './LuckyWheel.css';

// 8 Segments on the Lucky Wheel with carefully balanced aesthetic colors
const WHEEL_PRIZES = [
  { id: 1, label: '۲۰ امتیاز', tag: '★ نقدی', type: 'points', value: 20, desc: '۲۰ امتیاز نقدی به حساب باشگاه شما اضافه شد', bg: '#172B20', text: '#FFE7B8' },
  { id: 2, label: '۱۰٪ تخفیف', tag: 'کد هدیه', type: 'coupon', value: '10%', codePrefix: 'LUCKY10', desc: 'کد تخفیف ۱۰ درصدی برای خرید بعدی شما', bg: '#C88D4E', text: '#FFFFFF' },
  { id: 3, label: '۵۰ امتیاز', tag: '★ طلایی', type: 'points', value: 50, desc: '۵۰ امتیاز طلایی به کیف امتیازات اضافه شد', bg: '#101E17', text: '#F5CE93' },
  { id: 4, label: 'ارسال رایگان', tag: 'پیک رایگان', type: 'coupon', value: 'FREESHIP', codePrefix: 'FREE-DELIVERY', desc: 'کوپن ارسال رایگان برای سفارش بعدی شما', bg: '#DE9E48', text: '#15241B' },
  { id: 5, label: '۵ امتیاز', tag: '★ وفاداری', type: 'points', value: 5, desc: '۵ امتیاز وفاداری به حساب شما اضافه شد', bg: '#1E3628', text: '#FFE7B8' },
  { id: 6, label: '۵۰ هزار ت', tag: 'تخفیف', type: 'coupon', value: '50K', codePrefix: 'SAVE50', desc: 'کد تخفیف ۵۰ هزار تومانی برای خرید دانه قهوه', bg: '#B87A38', text: '#FFFFFF' },
  { id: 7, label: '۱۰ امتیاز', tag: '★ روزانه', type: 'points', value: 10, desc: '۱۰ امتیاز روزانه به حسابتان افزوده شد', bg: '#14251B', text: '#FFE7B8' },
  { id: 8, label: '۲× امتیاز', tag: 'دو برابر', type: 'perk', value: 'DOUBLE', codePrefix: '2X-POINTS', desc: 'دو برابر شدن امتیاز در سفارش بعدی شما', bg: '#D49244', text: '#15241B' },
];

export default function LuckyWheel({ user, onPointsWon, storageKey }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [lastWonPrize, setLastWonPrize] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Load saved state
  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = localStorage.getItem(`${storageKey}_wheel`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.coupons)) setCoupons(parsed.coupons);
        if (parsed.lastSpinTime) {
          const elapsed = (Date.now() - parsed.lastSpinTime) / 1000;
          const waitTime = 24 * 3600; // 24 hours
          if (elapsed < waitTime) {
            setCooldownSeconds(Math.ceil(waitTime - elapsed));
          }
        }
      }
    } catch (e) {}
  }, [storageKey]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // Format cooldown
  const formattedCooldown = useMemo(() => {
    const hours = Math.floor(cooldownSeconds / 3600);
    const minutes = Math.floor((cooldownSeconds % 3600) / 60);
    const secs = cooldownSeconds % 60;
    return `${toPersianDigits(hours)} ساعت و ${toPersianDigits(minutes)} دقیقه و ${toPersianDigits(secs)} ثانیه`;
  }, [cooldownSeconds]);

  const spinWheel = () => {
    if (spinning || cooldownSeconds > 0) return;

    setSpinning(true);
    setLastWonPrize(null);

    // Pick random prize index 0-7
    const prizeIndex = Math.floor(Math.random() * WHEEL_PRIZES.length);
    const prize = WHEEL_PRIZES[prizeIndex];

    // Mathematical precision:
    // Slices are rotated by i * 45 deg, slice i=0 is centered at top (12 o'clock / needle).
    // Target offset to bring slice `prizeIndex` to the needle at top:
    const targetOffset = (360 - (prizeIndex * 45)) % 360;
    const currentMod = rotation % 360;
    const diff = (targetOffset - currentMod + 360) % 360;
    const fullSpins = 360 * 6; // 6 full rotations
    const finalRotation = rotation + fullSpins + diff;

    setRotation(finalRotation);

    setTimeout(() => {
      setSpinning(false);
      setLastWonPrize(prize);

      // Save prize
      let newCoupons = [...coupons];
      if (prize.type === 'coupon' || prize.type === 'perk') {
        const uniqueCode = `${prize.codePrefix}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const newCoupon = {
          code: uniqueCode,
          title: prize.label,
          desc: prize.desc,
          date: new Date().toLocaleDateString('fa-IR'),
          expires: '۳۰ روز مهلت استفاده'
        };
        newCoupons = [newCoupon, ...newCoupons];
        setCoupons(newCoupons);
      } else if (prize.type === 'points' && onPointsWon) {
        onPointsWon(prize.value);
      }

      const nextCooldown = 24 * 3600;
      setCooldownSeconds(nextCooldown);

      if (storageKey) {
        localStorage.setItem(
          `${storageKey}_wheel`,
          JSON.stringify({
            lastSpinTime: Date.now(),
            coupons: newCoupons
          })
        );
      }
    }, 4500);
  };

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="lucky-wheel-container">
      <div className="wheel-banner-header">
        <div className="wheel-badge">
          <Sparkles size={16} />
          <span>گردونه شانس روزانه روستری</span>
        </div>
        <h3>شانس روزانه‌ات را امتحان کن و برنده شو!</h3>
        <p>
          هر ۲۴ ساعت یک‌بار فرصت دارید گردونه شانس را بچرخانید و امتیاز نقدی یا کدهای تخفیف شگفت‌انگیز ببرید.
        </p>
      </div>

      <div className="wheel-stage-grid">
        {/* Precision SVG Wheel Graphic */}
        <div className="wheel-interactive-wrap">
          {/* Top Pointer Needle */}
          <div className="wheel-pointer-container" aria-hidden="true">
            <svg viewBox="0 0 36 44" className="wheel-pointer-svg">
              <defs>
                <linearGradient id="needleGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFE7B8" />
                  <stop offset="40%" stopColor="#DE9E48" />
                  <stop offset="100%" stopColor="#A86B28" />
                </linearGradient>
                <filter id="needleShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.5" />
                </filter>
              </defs>
              <path
                d="M 18 42 L 3 10 Q 18 2 33 10 Z"
                fill="url(#needleGold)"
                stroke="#FFE7B8"
                strokeWidth="1.5"
                filter="url(#needleShadow)"
              />
              <circle cx="18" cy="12" r="4.5" fill="#18261E" stroke="#FFE7B8" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="wheel-disc-frame">
            <div
              className="wheel-disc-rotator"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? 'transform 4.5s cubic-bezier(0.12, 0.95, 0.22, 1)' : 'none'
              }}
            >
              <svg
                viewBox="0 0 320 320"
                className="wheel-svg"
                width="320"
                height="320"
              >
                <defs>
                  {/* Outer Rim Gradient */}
                  <linearGradient id="rimGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#DE9E48" />
                    <stop offset="35%" stopColor="#FFE7B8" />
                    <stop offset="70%" stopColor="#C88D4E" />
                    <stop offset="100%" stopColor="#8A531C" />
                  </linearGradient>
                  {/* Center Hub Gradient */}
                  <radialGradient id="hubGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#253A2C" />
                    <stop offset="70%" stopColor="#142017" />
                    <stop offset="100%" stopColor="#0B120D" />
                  </radialGradient>
                  {/* Stud Glow */}
                  <radialGradient id="studGlow" cx="40%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="40%" stopColor="#FFE7B8" />
                    <stop offset="100%" stopColor="#B37834" />
                  </radialGradient>
                </defs>

                {/* Outer Shadow Ring */}
                <circle cx="160" cy="160" r="158" fill="#0C140E" />
                <circle cx="160" cy="160" r="154" fill="url(#rimGoldGrad)" stroke="#683F16" strokeWidth="1" />
                <circle cx="160" cy="160" r="148" fill="#101A13" />

                {/* The 8 Precise Wedge Slices */}
                {WHEEL_PRIZES.map((p, idx) => {
                  const angle = idx * 45;
                  return (
                    <g key={p.id} transform={`rotate(${angle} 160 160)`}>
                      {/* 45-degree wedge centered at top (from -22.5 to +22.5 deg) */}
                      <path
                        d="M 160 160 L 102.60 21.42 A 150 150 0 0 1 217.40 21.42 Z"
                        fill={p.bg}
                        stroke="rgba(222, 158, 72, 0.4)"
                        strokeWidth="1.2"
                      />
                      {/* Label Text - Bold & High Contrast */}
                      <text
                        x="160"
                        y="58"
                        textAnchor="middle"
                        fill={p.text}
                        fontSize="13"
                        fontWeight="800"
                        fontFamily="Vazirmatn, system-ui, sans-serif"
                        letterSpacing="0.2"
                      >
                        {p.label}
                      </text>
                      {/* Subtitle / Tag */}
                      <text
                        x="160"
                        y="75"
                        textAnchor="middle"
                        fill={p.text}
                        opacity="0.85"
                        fontSize="9.5"
                        fontWeight="600"
                        fontFamily="Vazirmatn, system-ui, sans-serif"
                      >
                        {p.tag}
                      </text>
                    </g>
                  );
                })}

                {/* Outer Decorative Studs / Rivets (16 golden studs around perimeter) */}
                {Array.from({ length: 16 }).map((_, i) => {
                  const a = (i * 22.5) * (Math.PI / 180);
                  const sx = 160 + 151 * Math.sin(a);
                  const sy = 160 - 151 * Math.cos(a);
                  return (
                    <circle
                      key={i}
                      cx={sx}
                      cy={sy}
                      r="2.6"
                      fill="url(#studGlow)"
                      stroke="#4F2E0E"
                      strokeWidth="0.5"
                    />
                  );
                })}

                {/* Central Metallic Hub */}
                <circle cx="160" cy="160" r="38" fill="url(#rimGoldGrad)" stroke="#4A2B0C" strokeWidth="1.5" />
                <circle cx="160" cy="160" r="32" fill="url(#hubGrad)" stroke="rgba(255, 231, 184, 0.4)" strokeWidth="1" />
                <text
                  x="160"
                  y="157"
                  textAnchor="middle"
                  fill="#DE9E48"
                  fontSize="10"
                  fontWeight="900"
                  letterSpacing="1.5"
                  fontFamily="Cinzel, serif, sans-serif"
                >
                  KEEP
                </text>
                <text
                  x="160"
                  y="169"
                  textAnchor="middle"
                  fill="#F5CE93"
                  fontSize="7.5"
                  fontWeight="700"
                  letterSpacing="1"
                  fontFamily="sans-serif"
                >
                  COFFEE
                </text>
              </svg>
            </div>
          </div>

          {/* Spin Action Button / Countdown */}
          <div className="wheel-action-bar">
            {cooldownSeconds > 0 ? (
              <div className="cooldown-active-pill">
                <Clock size={16} />
                <span>فرصت بعدی: {formattedCooldown}</span>
              </div>
            ) : (
              <button
                className={`btn btn-primary btn-lg spin-btn ${spinning ? 'is-spinning' : ''}`}
                onClick={spinWheel}
                disabled={spinning}
              >
                <Sparkles size={18} />
                {spinning ? 'در حال چرخش…' : 'چرخش گردونه شانس'}
              </button>
            )}
          </div>
        </div>

        {/* Results & Coupons Wallet */}
        <div className="wheel-rewards-panel">
          {lastWonPrize && (
            <div className="won-prize-alert">
              <div className="won-prize-icon">🎉</div>
              <div>
                <strong>تبریک! جایزه شما:</strong>
                <p>{lastWonPrize.desc}</p>
              </div>
            </div>
          )}

          <div className="wallet-card-header">
            <Gift size={20} className="gold-icon" />
            <h4>کیف کوپن‌ها و جوایز من</h4>
            <span className="coupons-count">{toPersianDigits(coupons.length)} جایزه فعال</span>
          </div>

          {coupons.length === 0 ? (
            <div className="wallet-empty-state">
              <p>هنوز کوپنی از گردونه دریافت نکرده‌اید. همین حالا گردونه را بچرخانید!</p>
            </div>
          ) : (
            <div className="coupons-list">
              {coupons.map((c, i) => (
                <div key={i} className="coupon-ticket">
                  <div className="ticket-body">
                    <strong>{c.title}</strong>
                    <p>{c.desc}</p>
                    <span className="ticket-expire">{c.expires}</span>
                  </div>
                  <div className="ticket-action">
                    <button
                      className={`copy-code-btn ${copiedCode === c.code ? 'is-copied' : ''}`}
                      onClick={() => handleCopy(c.code)}
                      title="کپی کردن کد تخفیف"
                    >
                      {copiedCode === c.code ? (
                        <>
                          <Check size={14} />
                          <span>کپی شد</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <code>{c.code}</code>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
