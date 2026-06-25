import React from 'react';
import './Loader.css';

// Coffee-themed loading indicator: a steaming cup. Used for lazy route/section
// fallbacks. `size` controls the cup; `label` overrides the caption.
export default function Loader({ label = 'در حال دم‌آوری…', minHeight = '50vh' }) {
  return (
    <div className="loader" style={{ minHeight }} role="status" aria-live="polite">
      <div className="loader-cup" aria-hidden="true">
        <span className="steam steam-1" />
        <span className="steam steam-2" />
        <span className="steam steam-3" />
        <svg viewBox="0 0 64 48" width="64" height="48" fill="none">
          <path
            d="M6 14h40v14a14 14 0 0 1-14 14H20A14 14 0 0 1 6 28z"
            stroke="var(--color-accent)" strokeWidth="3"
            strokeLinejoin="round" fill="var(--color-surface)"
          />
          <path
            d="M46 18h6a6 6 0 0 1 0 12h-6"
            stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="loader-label">{label}</span>
    </div>
  );
}
