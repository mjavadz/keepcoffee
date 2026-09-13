import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (displayName.trim().length < 2) {
      setError('نام باید حداقل ۲ کاراکتر باشد.');
      return;
    }
    if (password.length < 8) {
      setError('رمز عبور باید حداقل ۸ کاراکتر باشد.');
      return;
    }

    setLoading(true);
    try {
      await register(displayName.trim(), email.trim(), password);
      navigate('/profile', { replace: true });
    } catch (err) {
      setError(err.message || 'ثبت‌نام ناموفق بود.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <SEO title="عضویت در باشگاه مشتریان" path="/register" description="ساخت حساب کاربری و عضویت در باشگاه مشتریان کیپ کافی" />
      <div className="container auth-wrap">
        <div className="auth-card">
          <h1>ساخت حساب کاربری</h1>
          <p className="auth-sub">
            عضو باشگاه مشتریان شوید و با امتیاز روزانه و خرید، تخفیف بگیرید.
          </p>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="reg-name">نام و نام خانوادگی</label>
              <input
                id="reg-name"
                type="text"
                autoComplete="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="مثلاً: محمد زمانی"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="reg-email">ایمیل</label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="reg-pass">رمز عبور</label>
              <input
                id="reg-pass"
                type="password"
                autoComplete="new-password"
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="auth-hint">حداقل ۸ کاراکتر</span>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit"
              disabled={loading}
            >
              {loading ? 'در حال ثبت‌نام…' : 'ثبت‌نام و ورود'}
            </button>
          </form>

          <p className="auth-alt">
            قبلاً ثبت‌نام کرده‌اید؟ <Link to="/login">وارد شوید</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
