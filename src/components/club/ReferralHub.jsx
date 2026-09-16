import React, { useState, useMemo } from 'react';
import { Copy, Check, Send, Gift, Award, Sparkles } from '../Icons';
import { toPersianDigits, formatToman } from '../../utils/format';
import { links } from '../../data/site';
import './ReferralHub.css';

export default function ReferralHub({ user }) {
  const [copied, setCopied] = useState(false);

  // Generate deterministic unique code based on user
  const referralCode = useMemo(() => {
    if (!user) return 'KC-CLUB-GUEST';
    const seed = (user.id || 101) * 31;
    const cleanName = (user.displayName || 'VIP').replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'VIP';
    return `KC-${cleanName.slice(0, 4)}-${seed.toString(16).toUpperCase().slice(0, 4)}`;
  }, [user]);

  const referralUrl = `https://keepcoffee.ir/?ref=${referralCode}`;

  const shareText = `سلام دوست من! ☕
یه کد هدیه ۵۰,۰۰۰ تومانی برای خرید دانه قهوه تازه برشت از کارگاه برشته‌کاری تخصصی کیپ کافی برات گرفتم.

کد تخفیف اختصاصی تو: ${referralCode}
لینک خرید مستقیم: ${referralUrl}

قهوه‌شون فوق‌العاده باکیفیت و تازه برشت هفتگیه، پیشنهاد می‌کنم حتماً تست کنی!`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="referral-hub-card">
      <div className="referral-banner-head">
        <div className="ref-badge">
          <Gift size={16} />
          <span>برنامه معرفی دوستان (Invite & Earn)</span>
        </div>
        <h3>دوستانت را به یک فنجان قهوه عالی دعوت کن و هدیه بگیر!</h3>
        <p>
          با معرفی کیپ کافی به دوستان و همکاران، یک بازی برد-برد آغاز کنید: به آن‌ها تخفیف هدیه دهید و برای خودتان امتیاز نقدی نامحدود بسازید.
        </p>
      </div>

      <div className="referral-grid">
        {/* Step 1 & 2 Value Cards */}
        <div className="ref-perks-box">
          <div className="ref-perk-item friend">
            <div className="perk-icon-wrap">🎁</div>
            <div>
              <strong>۵۰,۰۰۰ تومان هدیه به دوستت</strong>
              <p>دوست شما در اولین خرید خود از فروشگاه ۵۰ هزار تومان تخفیف مستقیم دریافت می‌کند.</p>
            </div>
          </div>

          <div className="ref-perk-item you">
            <div className="perk-icon-wrap">👑</div>
            <div>
              <strong>۱۰۰ امتیاز وفاداری برای شما</strong>
              <p>به محض ثبت اولین خرید دوستتان، ۱۰۰ امتیاز نقدی (معادل ۱۰۰ هزار تومان تخفیف) به حسابتان واریز می‌شود.</p>
            </div>
          </div>
        </div>

        {/* Code Box & Actions */}
        <div className="ref-action-box">
          <span className="ref-box-label">کد معرف اختصاصی شما:</span>
          
          <div className="ref-code-display">
            <span className="ref-code-text">{referralCode}</span>
            <button
              className={`btn ref-copy-btn ${copied ? 'is-copied' : ''}`}
              onClick={handleCopy}
              title="کپی کردن کد معرف"
            >
              {copied ? (
                <>
                  <Check size={16} />
                  <span>کپی شد!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>کپی کد</span>
                </>
              )}
            </button>
          </div>

          <div className="ref-share-buttons">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-block ref-btn-wa"
            >
              <Send size={18} />
              <span>ارسال دعوت‌نامه در واتساپ</span>
            </a>

            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-block ref-btn-tg"
            >
              <Send size={18} />
              <span>اشتراک‌گذاری در تلگرام</span>
            </a>
          </div>

          <div className="ref-stats-footer">
            <div className="ref-stat">
              <span>تعداد دعوت‌ها:</span>
              <strong>{toPersianDigits(0)} نفر</strong>
            </div>
            <div className="ref-stat">
              <span>امتیاز دریافتی:</span>
              <strong>{toPersianDigits(0)} امتیاز</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
