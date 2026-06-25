import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Scrolls to top on every route change (pathname). Keeps hash navigation intact.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return; // let in-page anchors work
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [pathname, hash]);

  return null;
}
