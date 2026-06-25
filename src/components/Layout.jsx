import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import BackToTop from './BackToTop';
import Loader from './Loader';

export default function Layout() {
  return (
    <>
      <a href="#main-content" className="skip-link">رفتن به محتوای اصلی</a>
      <ScrollToTop />
      <Header />
      <main id="main-content">
        <Suspense fallback={<Loader minHeight="70vh" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
