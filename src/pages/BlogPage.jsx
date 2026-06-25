import React, { Suspense, lazy } from 'react';
import SEO from '../components/SEO';
import BlogCard from '../components/BlogCard';
import { posts } from '../data/posts';

const BrewingGuide = lazy(() => import('../components/BrewingGuide'));

export default function BlogPage() {
  return (
    <div className="page">
      <SEO title="مجله قهوه" path="/blog" description="مقالات آموزشی درباره قهوه، روش‌های دم‌آوری، درجه برشت و راهنمای خرید تجهیزات." />

      <div className="page-hero">
        <div className="container">
          <h1>مجله قهوه</h1>
          <p>هر آنچه برای یک فنجان بهتر باید بدانید؛ از مزرعه تا فنجان.</p>
        </div>
      </div>

      <div className="container section-pad">
        <div className="blog-grid">
          {posts.map((post) => <BlogCard key={post.id} post={post} />)}
        </div>
      </div>

      <Suspense fallback={null}>
        <BrewingGuide />
      </Suspense>
    </div>
  );
}
