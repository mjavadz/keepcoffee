import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import BlogCard from '../components/BlogCard';
import { getPost, posts } from '../data/posts';
import './PostPage.css';

function Block({ block }) {
  switch (block.type) {
    case 'h2': return <h2>{block.text}</h2>;
    case 'quote': return <blockquote>{block.text}</blockquote>;
    case 'list':
      return <ul>{block.items.map((it, i) => <li key={i}>{it}</li>)}</ul>;
    default: return <p>{block.text}</p>;
  }
}

export default function PostPage() {
  const { slug } = useParams();
  const post = getPost(slug);

  if (!post) {
    return (
      <div className="page container post-missing">
        <SEO title="مقاله یافت نشد" path={`/blog/${slug}`} />
        <h1>مقاله مورد نظر پیدا نشد</h1>
        <Link to="/blog" className="btn btn-primary">بازگشت به مجله</Link>
      </div>
    );
  }

  const more = posts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="page">
      <SEO title={post.title} path={`/blog/${post.slug}`} description={post.excerpt} />

      <article className="post">
        <div className="post-hero" style={{ backgroundImage: `url('${post.image}')` }}>
          <div className="post-hero-overlay" />
          <div className="container post-hero-content">
            <nav className="breadcrumb breadcrumb-start">
              <Link to="/">خانه</Link><span>/</span><Link to="/blog">مجله</Link>
            </nav>
            <h1>{post.title}</h1>
            <span className="post-meta">{post.date} · {post.readingTime} مطالعه</span>
          </div>
        </div>

        <div className="container post-body">
          {post.body.map((block, i) => <Block key={i} block={block} />)}

          <Link to="/blog" className="btn btn-outline post-back">→ بازگشت به همه مقالات</Link>
        </div>
      </article>

      <div className="container section-pad">
        <div className="section-header">
          <h2 className="section-title">مقالات دیگر</h2>
          <Link to="/blog" className="view-all">مشاهده همه ←</Link>
        </div>
        <div className="blog-grid">
          {more.map((p) => <BlogCard key={p.id} post={p} />)}
        </div>
      </div>
    </div>
  );
}
