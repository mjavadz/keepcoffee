import React, { Suspense, lazy } from 'react';
import SEO from '../components/SEO';
import HeroSection from '../components/HeroSection';
import Categories from '../components/Categories';
import CoffeeFinder from '../components/CoffeeFinder';
import ProductList from '../components/ProductList';

const Features = lazy(() => import('../components/Features'));
const OurStory = lazy(() => import('../components/OurStory'));
const WholesaleBanner = lazy(() => import('../components/WholesaleBanner'));
const CustomerClub = lazy(() => import('../components/CustomerClub'));
const BlogSnippet = lazy(() => import('../components/BlogSnippet'));
const Newsletter = lazy(() => import('../components/Newsletter'));

const SectionLoader = () => (
  <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--color-accent)' }}>
    در حال بارگذاری...
  </div>
);

export default function HomePage() {
  return (
    <>
      <SEO
        path="/"
        description="کیپ کافی، روستری تخصصی قهوه. خرید آنلاین دانه قهوه اسپشیالتی و لوازم دم‌آوری حرفه‌ای با کیفیت بی‌نظیر و پشتیبانی کامل."
      />
      <HeroSection />
      <Categories />
      <CoffeeFinder />
      <ProductList limit={4} />

      <Suspense fallback={<SectionLoader />}>
        <Features />
        <OurStory />
        <WholesaleBanner />
        <CustomerClub />
        <BlogSnippet limit={3} />
        <Newsletter />
      </Suspense>
    </>
  );
}
