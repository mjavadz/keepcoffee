import React, { useState } from 'react';
import { api } from '../api';
import { toPersianDigits } from '../utils/format';
import { Flame, Check, Gift, Sparkles } from './Icons';
import './CheckInCard.css';

export default function CheckInCard({ streak = 0, checkedInToday = false, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [justCheckedIn, setJustCheckedIn] = useState(false);

  const isDone = checkedInToday || justCheckedIn;
  
  // Calculate day in current 7-day cycle (1 to 7)
  // If streak is 0, filled is 0
  // If streak > 0, calculate position in current week cycle
  const currentCycleDay = streak > 0 ? ((streak - 1) % 7) + 1 : 0;
  const filledCount = isDone ? currentCycleDay : Math.max(0, currentCycleDay - 1);
  const daysUntilBonus = 7 - (isDone ? currentCycleDay : Math.max(0, currentCycleDay - 1));

  const handleCheckIn = async () => {
    setLoading(true);
    setMsg('');
    try {
      const res = await api.post('/checkin');
      setJustCheckedIn(true);
      const awarded = toPersianDigits(res.pointsAwarded || 10);
      const bonus = toPersianDigits(res.bonus || 0);
      setMsg(
        res.bonus > 0
          ? `🎉 تبریک! ${awarded} امتیاز + ${bonus} امتیاز پاداش استریک ۷ روزه به حسابتان افزوده شد.`
          : `✓ ${awarded} امتیاز حضور امروز با موفقیت ثبت گردید.`
      );
      if (onUpdated) onUpdated();
    } catch (err) {
      if (err.code === 'already_checked_in') {
        setJustCheckedIn(true);
        setMsg('امتیاز امروز پیش‌تر در سیستم ثبت شده است.');
      } else {
        setMsg(err.message || 'خطا در برقراری ارتباط با سرور.');
      }
    } finally {
      setLoading(false);
    }
  };

  const DAYS = [
    { label: 'روز ۱', reward: '۱۰' },
    { label: 'روز ۲', reward: '۱۰' },
    { label: 'روز ۳', reward: '۱۰' },
    { label: 'روز ۴', reward: '۱۰' },
    { label: 'روز ۵', reward: '۱۰' },
    { label: 'روز ۶', reward: '۱۰' },
    { label: 'روز ۷', reward: '۵۰', isBonus: true },
  ];

  // Active progress percentage for connector line
  const progressPercent = Math.min(100, Math.max(0, ((filledCount - 1) / 6) * 100));

  return (
    <div className="checkin-card-refined">
      {/* Top Header: Badge, Stats & Action Button */}
      <div className="checkin-top-bar">
        <div className="streak-main-info">
          <div className={`streak-fire-orb ${streak > 0 ? 'is-active' : ''}`}>
            <Flame size={22} className="fire-icon-svg" />
          </div>
          <div className="streak-title-meta">
            <div className="streak-score-line">
              <span className="streak-big-num">{toPersianDigits(streak)}</span>
              <span className="streak-unit-label">روز استریک مداوم</span>
            </div>
            <div className="streak-sub-pill">
              {streak === 0 ? (
                <span>🌱 از امروز آغاز کنید و امتیاز بسازید</span>
              ) : daysUntilBonus === 0 || daysUntilBonus === 7 ? (
                <span className="text-bonus-gold">🎁 موعد دریافت پاداش ۵۰ امتیازی هفتگی!</span>
              ) : (
                <span>⚡ {toPersianDigits(daysUntilBonus)} روز تا بونوس طلایی هفته</span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          className={`checkin-btn-modern ${isDone ? 'is-done' : ''}`}
          onClick={handleCheckIn}
          disabled={loading || isDone}
        >
          {isDone ? (
            <>
              <Check size={16} className="btn-status-icon" />
              <span>امروز دریافت شد</span>
            </>
          ) : loading ? (
            <span className="checkin-spinner-text">در حال ثبت...</span>
          ) : (
            <>
              <Sparkles size={16} className="btn-sparkle-icon" />
              <span>ثبت حضور امروز (+۱۰)</span>
            </>
          )}
        </button>
      </div>

      {/* 7-Day Stepper Tracker */}
      <div className="checkin-stepper-box">
        {/* Background Rail & Active Fill */}
        <div className="stepper-rail-bg">
          <div
            className="stepper-rail-fill"
            style={{ width: filledCount > 0 ? `${progressPercent}%` : '0%' }}
          />
        </div>

        {/* The 7 Day Checkpoint Nodes */}
        <div className="stepper-nodes-row">
          {DAYS.map((day, idx) => {
            const isCompleted = idx < filledCount;
            const isTodayWaiting = idx === filledCount && !isDone;
            const isBonus = !!day.isBonus;

            return (
              <div
                key={idx}
                className={`stepper-node-item ${isCompleted ? 'is-completed' : ''} ${isTodayWaiting ? 'is-waiting-today' : ''} ${isBonus ? 'is-bonus-milestone' : ''}`}
              >
                <span className="node-day-label">{day.label}</span>
                <div className="node-circle">
                  {isCompleted ? (
                    <Check size={13} strokeWidth={3} className="node-check-icon" />
                  ) : isBonus ? (
                    <Gift size={14} className="node-gift-icon" />
                  ) : (
                    <span className="node-num">{toPersianDigits(idx + 1)}</span>
                  )}
                </div>
                <span className={`node-pts-badge ${isBonus ? 'is-gold-badge' : ''}`}>
                  +{toPersianDigits(day.reward)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Hint or Dynamic Response Message */}
      <div className="checkin-bottom-bar">
        {msg ? (
          <div className="checkin-msg-bubble">
            <span className="msg-dot" />
            <span className="msg-text">{msg}</span>
          </div>
        ) : (
          <div className="checkin-hint-text">
            <span className="hint-star">✦</span>
            <span>
              هر روز حضور خود را ثبت کنید؛ با تکمیل چرخه ۷ روزه، علاوه بر امتیاز روزانه،{' '}
              <strong className="hint-gold">۵۰ امتیاز هدیه ویژه</strong> دریافت می‌کنید.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
