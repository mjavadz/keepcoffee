import React, { useState } from 'react';
import { api } from '../api';
import { toPersianDigits } from '../utils/format';
import { Flame, Check } from './Icons';
import './CheckInCard.css';

export default function CheckInCard({ streak = 0, checkedInToday = false, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [justCheckedIn, setJustCheckedIn] = useState(false);

  const isDone = checkedInToday || justCheckedIn;
  const filledDays = streak > 0 ? ((streak - 1) % 7) + 1 : 0;

  const handleCheckIn = async () => {
    setLoading(true);
    setMsg('');
    try {
      const res = await api.post('/checkin');
      setJustCheckedIn(true);
      const awarded = toPersianDigits(res.pointsAwarded || 0);
      const bonus = toPersianDigits(res.bonus || 0);
      setMsg(
        res.bonus > 0
          ? `🎉 ${awarded} امتیاز گرفتید! (${bonus} امتیاز جایزه استریک ۷ روزه)`
          : `✓ ${awarded} امتیاز امروز ثبت شد.`
      );
      if (onUpdated) onUpdated();
    } catch (err) {
      if (err.code === 'already_checked_in') {
        setJustCheckedIn(true);
        setMsg('امروز قبلاً امتیاز روزانه را گرفته‌اید.');
      } else {
        setMsg(err.message || 'خطا در ثبت امتیاز.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkin-card">
      <div className="checkin-head">
        <div className="checkin-streak">
          <Flame size={22} className="checkin-flame" />
          <span className="checkin-streak-num">{toPersianDigits(streak)}</span>
          <span className="checkin-streak-label">روز پیاپی</span>
        </div>
        <button
          className={`btn ${isDone ? 'btn-outline' : 'btn-primary'} checkin-btn`}
          onClick={handleCheckIn}
          disabled={loading || isDone}
        >
          {isDone ? (
            <>
              <Check size={18} /> ثبت شد
            </>
          ) : loading ? (
            'در حال ثبت…'
          ) : (
            'ثبت امتیاز امروز'
          )}
        </button>
      </div>

      <div className="checkin-week" aria-hidden="true">
        {Array.from({ length: 7 }, (_, i) => (
          <span
            key={i}
            className={`checkin-day ${i < filledDays ? 'is-filled' : ''} ${i === 6 ? 'is-bonus' : ''}`}
            title={i === 6 ? 'جایزه روز هفتم' : ''}
          >
            {i === 6 ? <Flame size={14} /> : toPersianDigits(i + 1)}
          </span>
        ))}
      </div>

      <p className="checkin-msg">
        {msg || 'هر روز وارد شوید و امتیاز بگیرید؛ ۷ روز پیاپی = امتیاز جایزه!'}
      </p>
    </div>
  );
}
