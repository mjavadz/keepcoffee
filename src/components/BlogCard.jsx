import React from 'react';
import { Link } from 'react-router-dom';
import './BlogCard.css';

export default function BlogCard({ post }) {
  return (
    <article className="blog-card">
      <Link to={`/blog/${post.slug}`} className="blog-image-wrapper">
        <img src={post.image} alt={post.title} loading="lazy" />
      </Link>
      <div className="blog-info">
        <span className="blog-date">{post.date} · {post.readingTime} مطالعه</span>
        <h3 className="blog-title">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="blog-excerpt">{post.excerpt}</p>
        <Link to={`/blog/${post.slug}`} className="blog-read-more">ادامه مطلب ←</Link>
      </div>
    </article>
  );
}
