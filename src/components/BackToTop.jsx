import React, { useEffect, useState } from 'react';
import { ArrowUp } from './Icons';
import './BackToTop.css';

// Floating "back to top" button that appears after the user scrolls down.
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = () =>
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });

  return (
    <button
      className={`back-to-top ${visible ? 'is-visible' : ''}`}
      onClick={toTop}
      aria-label="بازگشت به بالا"
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUp size={22} />
    </button>
  );
}
