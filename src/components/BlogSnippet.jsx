import React from 'react';
import { Link } from 'react-router-dom';
import BlogCard from './BlogCard';
import { posts } from '../data/posts';
import './BlogSnippet.css';

export default function BlogSnippet({ limit = 3 }) {
  return (
    <section className="blog-snippet-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">مجله قهوه</h2>
          <Link to="/blog" className="view-all">مشاهده همه مقالات ←</Link>
        </div>

        <div className="blog-grid">
          {posts.slice(0, limit).map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
