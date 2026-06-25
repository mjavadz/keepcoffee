import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Features from '../components/Features';

const OurStory = lazy(() => import('../components/OurStory'));
const AcademyBlock = lazy(() => import('../components/AcademyBlock'));

export default function AboutPage() {
  return (
    <div className="page">
      <SEO title="درباره ما" path="/about" description="داستان کیپ کافی؛ روستری تخصصی قهوه از مزرعه تا فنجان، با تعهد به کیفیت و تازگی." />

      <div className="page-hero">
        <div className="container">
          <h1>درباره کیپ کافی</h1>
          <p>ما عاشق قهوه‌ایم و باور داریم هر فنجان، داستانی برای گفتن دارد.</p>
        </div>
      </div>

      <Suspense fallback={null}>
        <OurStory />
      </Suspense>

      <Features />

      <Suspense fallback={null}>
        <AcademyBlock />
      </Suspense>

      <div className="container section-pad" style={{ textAlign: 'center' }}>
        <Link to="/contact" className="btn btn-primary btn-lg">با ما در ارتباط باشید</Link>
      </div>
    </div>
  );
}
