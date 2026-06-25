import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ShoppingCart, Menu, Coffee, Sun, Moon, Monitor, User, X } from './Icons';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../context/CartContext';
import { toPersianDigits } from '../utils/format';
import './Header.css';

const navItems = [
  { to: '/', label: 'خانه', end: true },
  { to: '/shop', label: 'فروشگاه' },
  { to: '/blog', label: 'وبلاگ' },
  { to: '/club', label: 'باشگاه مشتریان', highlight: true },
  { to: '/wholesale', label: 'عمده‌فروشی' },
  { to: '/about', label: 'درباره ما' },
  { to: '/contact', label: 'تماس' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, activeTheme, toggleTheme } = useTheme();
  const { count } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock scroll + close on Escape while drawer is open
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const renderThemeIcon = () => {
    if (theme === 'system') return <Monitor size={20} />;
    if (activeTheme === 'dark') return <Moon size={20} />;
    return <Sun size={20} />;
  };

  return (
    <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="container header-container">
        <Link to="/" className="header-logo">
          <Coffee size={28} className="logo-icon" />
          <span className="logo-text">Keep Coffee</span>
        </Link>

        <nav className="header-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${item.highlight ? 'nav-highlight' : ''} ${isActive ? 'is-active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <button className="icon-btn theme-toggle-btn" onClick={toggleTheme} aria-label="تغییر تم">
            {renderThemeIcon()}
          </button>
          <Link to="/contact" className="icon-btn user-btn" aria-label="حساب کاربری / تماس">
            <User size={20} />
          </Link>
          <Link to="/cart" className="icon-btn cart-btn" aria-label="سبد خرید">
            <ShoppingCart size={20} />
            {count > 0 && <span className="cart-badge">{toPersianDigits(count)}</span>}
          </Link>
          <button
            className="icon-btn menu-btn"
            aria-label="باز کردن منو"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`mobile-drawer-overlay ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <aside className={`mobile-drawer ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <div className="mobile-drawer-head">
          <span className="header-logo">
            <Coffee size={24} className="logo-icon" />
            <span className="logo-text">Keep Coffee</span>
          </span>
          <button className="icon-btn" aria-label="بستن منو" onClick={() => setMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="mobile-nav" onClick={() => setMenuOpen(false)}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'is-active' : '')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </header>
  );
}
