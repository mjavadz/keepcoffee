import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { categories } from '../data/categories';
import './ShopPage.css';

const sortOptions = [
  { key: 'default', label: 'پیش‌فرض' },
  { key: 'price-asc', label: 'ارزان‌ترین' },
  { key: 'price-desc', label: 'گران‌ترین' },
  { key: 'name', label: 'حروف الفبا' },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const [sort, setSort] = useState('default');
  const [query, setQuery] = useState('');

  const setCategory = (key) => {
    const next = new URLSearchParams(searchParams);
    if (key === 'all') next.delete('category');
    else next.set('category', key);
    setSearchParams(next);
  };

  const visible = useMemo(() => {
    let list = products.filter((p) => activeCategory === 'all' || p.category === activeCategory);
    if (query.trim()) {
      const q = query.trim();
      list = list.filter(
        (p) => p.name.includes(q) || (p.notes || []).some((n) => n.includes(q))
      );
    }
    switch (sort) {
      case 'price-asc': list = [...list].sort((a, b) => a.price - b.price); break;
      case 'price-desc': list = [...list].sort((a, b) => b.price - a.price); break;
      case 'name': list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'fa')); break;
      default: break;
    }
    return list;
  }, [activeCategory, query, sort]);

  return (
    <div className="page">
      <SEO title="فروشگاه" path="/shop" description="خرید آنلاین دانه قهوه تخصصی، تجهیزات دم‌آوری و لوازم جانبی از کیپ کافی." />

      <div className="page-hero">
        <div className="container">
          <h1>فروشگاه کیپ کافی</h1>
          <p>از میان دانه‌های تخصصی، تجهیزات و لوازم جانبی، انتخاب کنید.</p>
        </div>
      </div>

      <div className="container shop-layout">
        <div className="shop-toolbar">
          <div className="category-tabs">
            <button
              className={`cat-tab ${activeCategory === 'all' ? 'is-active' : ''}`}
              onClick={() => setCategory('all')}
            >
              همه
            </button>
            {categories.map((c) => (
              <button
                key={c.key}
                className={`cat-tab ${activeCategory === c.key ? 'is-active' : ''}`}
                onClick={() => setCategory(c.key)}
              >
                {c.title}
              </button>
            ))}
          </div>

          <div className="shop-controls">
            <input
              type="search"
              className="shop-search"
              placeholder="جستجوی محصول..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="جستجوی محصول"
            />
            <select
              className="shop-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="مرتب‌سازی"
            >
              {sortOptions.map((o) => (
                <option key={o.key} value={o.key}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="shop-count">{visible.length} محصول</p>

        {visible.length > 0 ? (
          <div className="products-grid">
            {visible.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="shop-empty">محصولی با این مشخصات پیدا نشد.</div>
        )}
      </div>
    </div>
  );
}
