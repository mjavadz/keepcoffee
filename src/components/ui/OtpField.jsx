import React, { useRef, useState, useEffect } from 'react';
import { toPersianDigits } from '../../utils/format';
import './OtpField.css';

/**
 * کامپوننت کد تأیید ۶ رقمی وایب‌فارسی (VibeFarsi OTP Field)
 * سفارشی‌شده برای تم و استایل روستری کیپ‌کافی
 */
export default function OtpField({
  length = 6,
  value = '',
  onChange,
  onComplete,
  disabled = false,
  autoFocus = true,
  className = '',
  error = false
}) {
  const [internalCode, setInternalCode] = useState(value);
  const code = value !== undefined ? value : internalCode;
  const inputsRef = useRef([]);

  useEffect(() => {
    if (autoFocus && inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [autoFocus]);

  const commit = (nextCode) => {
    // تبدیل ارقام فارسی و عربی به لاتین و فقط استخراج اعداد
    const clean = nextCode
      .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
      .replace(/[٠-٩]/g, (d) => d.charCodeAt(0) - 0x0660)
      .replace(/\D/g, '')
      .slice(0, length);

    if (onChange) onChange(clean);
    else setInternalCode(clean);

    if (clean.length === length && onComplete) {
      onComplete(clean);
    }

    // هدایت فوکوس به خانه بعدی یا آخرین خانه
    const nextIndex = Math.min(clean.length, length - 1);
    inputsRef.current[nextIndex]?.focus();
  };

  const handleChange = (e, index) => {
    const val = e.target.value;
    // در صورت چسباندن (Paste) چند رقم همزمان
    if (val.length > 1) {
      commit(code.slice(0, index) + val);
      return;
    }
    const updated = code.slice(0, index) + val + code.slice(index + 1);
    commit(updated);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        e.preventDefault();
        commit(code.slice(0, index - 1));
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft') {
      inputsRef.current[index + 1]?.focus();
    } else if (e.key === 'ArrowRight') {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div 
      className={`vibe-otp-container ${error ? 'has-error' : ''} ${className}`} 
      dir="ltr" 
      role="group" 
      aria-label="کد تأیید ۶ رقمی"
    >
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          disabled={disabled}
          value={code[i] ? toPersianDigits(code[i]) : ''}
          placeholder="—"
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onFocus={(e) => e.target.select()}
          className="vibe-otp-box"
          maxLength={6}
        />
      ))}
    </div>
  );
}
