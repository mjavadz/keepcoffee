import React from 'react';
import { toPersianDigits } from '../../utils/format';
import './NumberField.css';

/**
 * کامپوننت انتخاب و تغییر عدد وایب‌فارسی (VibeFarsi NumberField)
 * مناسب برای تغییر تعداد بسته قهوه در سبد خرید با ارقام فارسی
 */
export default function NumberField({
  value = 1,
  onChange,
  min = 1,
  max = 99,
  step = 1,
  disabled = false,
  className = '',
  ariaLabel = 'تعداد بسته'
}) {
  const handleIncrease = () => {
    if (disabled || value >= max) return;
    onChange(value + step);
  };

  const handleDecrease = () => {
    if (disabled || value <= min) return;
    onChange(value - step);
  };

  return (
    <div 
      className={`vibe-number-field ${className}`} 
      role="group" 
      aria-label={ariaLabel}
    >
      <button
        type="button"
        aria-label="افزایش تعداد"
        disabled={disabled || value >= max}
        onClick={handleIncrease}
        className="vibe-num-btn"
      >
        +
      </button>

      <span className="vibe-num-value" aria-live="polite">
        {toPersianDigits(value)}
      </span>

      <button
        type="button"
        aria-label="کاهش تعداد"
        disabled={disabled || value <= min}
        onClick={handleDecrease}
        className="vibe-num-btn"
      >
        −
      </button>
    </div>
  );
}
