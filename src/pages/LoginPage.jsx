import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/profile';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'ورود ناموفق بود. لطفاً اطلاعات خود را بررسی کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <SEO title="ورود به حساب" path="/login" description="ورود به حساب کاربری باشگاه مشتریان کیپ کافی" />
      <div className="container auth-wrap">
        <div className="auth-card">
          <h1>ورود به حساب</h1>
          <p className="auth-sub">
            برای دیدن امتیازها، سوابق سفارش و دریافت امتیاز روزانه وارد شوید.
          </p>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="login-email">ایمیل</label>
              <input
                id="login-email"
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
              <label htmlFor="login-pass">رمز عبور</label>
              <input
                id="login-pass"
                type="password"
                autoComplete="current-password"
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit"
              disabled={loading}
            >
              {loading ? 'در حال ورود…' : 'ورود'}
            </button>
          </form>

          <p className="auth-alt">
            حساب ندارید؟ <Link to="/register">ثبت‌نام کنید</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
