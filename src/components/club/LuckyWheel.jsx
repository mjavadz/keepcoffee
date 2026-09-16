import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Gift, Copy, Check, Clock, Send } from '../Icons';
import { toPersianDigits } from '../../utils/format';
import { links } from '../../data/site';
import './LuckyWheel.css';

// 8 Segments on the Lucky Wheel
const WHEEL_PRIZES = [
  { id: 1, label: '۲۰ امتیاز', type: 'points', value: 20, color: '#DE9E48', desc: '۲۰ امتیاز نقدی به حسابت اضافه شد' },
  { id: 2, label: '۱۰٪ تخفیف', type: 'coupon', value: '10%', codePrefix: 'LUCKY10', desc: 'کد تخفیف ۱۰ درصدی برای سفارش بعدی' },
  { id: 3, label: '۵۰ امتیاز', type: 'points', value: 50, color: '#F5CE93', desc: '۵۰ امتیاز طلایی به حسابت اضافه شد' },
  { id: 4, label: 'ارسال رایگان', type: 'coupon', value: 'FREESHIP', codePrefix: 'FREE-DELIVERY', desc: 'ارسال رایگان برای سفارش بعدی شما' },
  { id: 5, label: '۵ امتیاز', type: 'points', value: 5, color: '#C88D4E', desc: '۵ امتیاز وفاداری به حسابت اضافه شد' },
  { id: 6, label: '۵۰ ت تخفیف', type: 'coupon', value: '50K', codePrefix: 'SAVE50', desc: 'کد تخفیف ۵۰ هزار تومانی برای خرید دانه' },
  { id: 7, label: '۱۰ امتیاز', type: 'points', value: 10, color: '#DE9E48', desc: '۱۰ امتیاز به کیف امتیازات اضافه شد' },
  { id: 8, label: '۲× امتیاز خرید', type: 'perk', value: 'DOUBLE', codePrefix: '2X-POINTS', desc: 'دو برابر شدن امتیاز وفاداری در خرید بعدی' },
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

    // Calculate rotation: 360 / 8 = 45 deg per segment
    // Add 5-8 full spins (1800-2880 deg) + offset to land on prize
    const segmentDegree = 360 / WHEEL_PRIZES.length;
    const targetDegree = 360 - (prizeIndex * segmentDegree) - (segmentDegree / 2);
    const fullSpins = 360 * 6;
    const finalRotation = rotation + fullSpins + targetDegree - (rotation % 360);

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
    }, 4000);
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
        {/* Wheel Graphic */}
        <div className="wheel-interactive-wrap">
          <div className="wheel-pointer-pin" />
          
          <div
            className="wheel-disc"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 4s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none'
            }}
          >
            {WHEEL_PRIZES.map((p, idx) => {
              const angle = idx * (360 / WHEEL_PRIZES.length);
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={p.id}
                  className={`wheel-segment ${isEven ? 'even' : 'odd'}`}
                  style={{
                    transform: `rotate(${angle}deg)`
                  }}
                >
                  <span className="segment-label">{p.label}</span>
                </div>
              );
            })}
            <div className="wheel-center-hub">
              <span className="hub-text">Keep</span>
            </div>
          </div>

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
                <strong>تبریک! شما برنده شدید:</strong>
                <p>{lastWonPrize.desc}</p>
              </div>
            </div>
          )}

          <div className="coupons-wallet-card">
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
    </div>
  );
}
