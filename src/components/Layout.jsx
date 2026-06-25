import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

const PageLoader = () => (
  <div style={{ padding: '160px 0', textAlign: 'center', color: 'var(--color-accent)' }}>
    در حال بارگذاری...
  </div>
);

export default function Layout() {
  return (
    <>
      <a href="#main-content" className="skip-link">رفتن به محتوای اصلی</a>
      <ScrollToTop />
      <Header />
      <main id="main-content">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
