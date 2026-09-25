import React from 'react';
import { Check } from '../Icons';
import { toPersianDigits } from '../../utils/format';
import './Stepper.css';

/**
 * کامپوننت مراحل وایب‌فارسی (VibeFarsi Stepper)
 * راست‌چین بومی با ارقام فارسی و انیمیشن انتقال
 */
export default function Stepper({
  steps = [],
  current = 0,
  onStepClick,
  className = ''
}) {
  return (
    <ol className={`vibe-stepper ${className}`} aria-label="مراحل فرایند">
      {steps.map((step, idx) => {
        const isDone = idx < current;
        const isActive = idx === current;
        const isClickable = !!onStepClick && idx <= current;

        return (
          <li 
            key={idx} 
            className={`vibe-step-item ${isDone ? 'done' : ''} ${isActive ? 'active' : ''} ${isClickable ? 'clickable' : ''}`}
            onClick={() => isClickable && onStepClick(idx)}
            aria-current={isActive ? 'step' : undefined}
          >
            <div className="vibe-step-indicator">
              <span className="vibe-step-circle">
                {isDone ? <Check size={14} strokeWidth={2.5} /> : toPersianDigits(idx + 1)}
              </span>
              {idx < steps.length - 1 && <span className="vibe-step-line" />}
            </div>

            <div className="vibe-step-content">
              <span className="vibe-step-label">{step.label}</span>
              {step.description && (
                <span className="vibe-step-desc">{step.description}</span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
