import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { api, setCsrfToken } from '../api';
import { Key, Shield, ArrowLeft, RefreshCw, CheckCircle, Mail } from '../components/Icons';
import OtpField from '../components/ui/OtpField';
import './AuthPage.css';

export default function LoginPage() {
  const { login, verify2FA, resend2FA } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/profile';

  // Mode: 'login' | '2fa' | 'forgot_request' | 'forgot_verify'
  const [mode, setMode] = useState('login');

  // Login inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // 2FA state
  const [twoFaCode, setTwoFaCode] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Password reset inputs
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 2FA Resend Countdown
  useEffect(() => {
    let interval = null;
    if (mode === '2fa' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mode, resendTimer]);

  // Handle Standard Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await login(email.trim(), password);
      if (res?.requires2FA) {
        setMaskedEmail(res.maskedEmail || email);
        setMode('2fa');
        setResendTimer(60);
        setCanResend(false);
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'ورود ناموفق بود. لطفاً اطلاعات خود را بررسی کنید.');
    } finally {
      setLoading(false);
    }
  };

  // Handle 2FA Verification
  const handle2FASubmit = async (e) => {
    e.preventDefault();
    if (!twoFaCode.trim()) return;
    setError('');
    setLoading(true);
    try {
      await verify2FA(twoFaCode.trim());
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'کد تایید دو مرحله‌ای نادرست است.');
    } finally {
      setLoading(false);
    }
  };

  // Handle 2FA Resend
  const handleResend2FA = async () => {
    if (!canResend) return;
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await resend2FA();
      setSuccessMsg('کد تایید جدید با موفقیت به ایمیل شما ارسال شد.');
      setResendTimer(60);
      setCanResend(false);
    } catch (err) {
      setError(err.message || 'خطا در ارسال مجدد کد.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password Request (Step 1)
  const handleForgotRequestSubmit = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email: resetEmail.trim() });
      if (res?.csrfToken) setCsrfToken(res.csrfToken);
      setSuccessMsg(res.message || 'کد تایید ۶ رقمی به ایمیل شما ارسال شد.');
      setMode('forgot_verify');
    } catch (err) {
      setError(err.message || 'خطا در ارسال کد بازیابی.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Reset Confirm (Step 2)
  const handleResetConfirmSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('تکرار رمز عبور جدید مطابقت ندارد.');
      return;
    }
    if (newPassword.length < 8) {
      setError('رمز عبور باید حداقل ۸ کاراکتر باشد.');
      return;
    }
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', {
        email: resetEmail.trim(),
        code: resetCode.trim(),
        newPassword
      });
      if (res?.csrfToken) setCsrfToken(res.csrfToken);
      setSuccessMsg(res.message || 'رمز عبور با موفقیت تغییر کرد. اکنون وارد شوید.');
      setEmail(resetEmail.trim());
      setPassword('');
      setResetCode('');
      setNewPassword('');
      setConfirmPassword('');
      setMode('login');
    } catch (err) {
      setError(err.message || 'خطا در ثبت رمز عبور جدید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <SEO
        title={
          mode === 'login'
            ? 'ورود به حساب | کیپ کافی'
            : mode === '2fa'
            ? 'تایید دو مرحله‌ای | کیپ کافی'
            : 'بازیابی رمز عبور | کیپ کافی'
        }
        path="/login"
        description="ورود به حساب کاربری باشگاه مشتریان کیپ کافی"
      />
      <div className="container auth-wrap">
        <div className="auth-card">
          {/* =========================================================
              SCREEN 1: Standard Login Form
             ========================================================= */}
          {mode === 'login' && (
            <>
              <h1>ورود به حساب</h1>
              <p className="auth-sub">
                برای دیدن امتیازها، سوابق سفارش و دریافت امتیاز روزانه وارد شوید.
              </p>

              {successMsg && (
                <div className="auth-success" role="status">
                  <CheckCircle size={16} /> <span>{successMsg}</span>
                </div>
              )}

              {error && (
                <div className="auth-error" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} noValidate>
                <div className="auth-field">
                  <label htmlFor="login-email">ایمیل حساب</label>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label htmlFor="login-pass">رمز عبور</label>
                    <button
                      type="button"
                      className="auth-link-btn"
                      onClick={() => {
                        setResetEmail(email);
                        setError('');
                        setSuccessMsg('');
                        setMode('forgot_request');
                      }}
                    >
                      فراموشی رمز عبور؟
                    </button>
                  </div>
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
                  {loading ? 'در حال بررسی…' : 'ورود به حساب کاربری'}
                </button>
              </form>

              <p className="auth-alt">
                حساب ندارید؟ <Link to="/register">ثبت‌نام در باشگاه مشتریان</Link>
              </p>
            </>
          )}

          {/* =========================================================
              SCREEN 2: Two-Factor Authentication (2FA) Code Verification
             ========================================================= */}
          {mode === '2fa' && (
            <>
              <div className="auth-badge-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                <Shield size={28} />
              </div>
              <h1 style={{ marginTop: '0.5rem' }}>تایید ورود دو مرحله‌ای</h1>
              <p className="auth-sub">
                به منظور افزایش امنیت، کد یکبار مصرف ۶ رقمی به نشانی ایمیل{' '}
                <strong dir="ltr" style={{ color: '#c88d4e' }}>{maskedEmail}</strong> ارسال شد.
              </p>

              {successMsg && (
                <div className="auth-success" role="status">
                  <CheckCircle size={16} /> <span>{successMsg}</span>
                </div>
              )}

              {error && (
                <div className="auth-error" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handle2FASubmit} noValidate>
                <div className="auth-field" style={{ textAlign: 'center' }}>
                  <label htmlFor="twofa-code" style={{ display: 'block', marginBottom: '0.25rem' }}>
                    کد تایید ۶ رقمی ایمیل
                  </label>
                  <OtpField
                    value={twoFaCode}
                    onChange={(val) => setTwoFaCode(val)}
                    onComplete={(val) => setTwoFaCode(val)}
                    disabled={loading}
                    error={!!error}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg auth-submit"
                  disabled={loading || twoFaCode.length < 6}
                >
                  {loading ? 'در حال بررسی کد…' : 'تایید کد و ورود'}
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
                  <button
                    type="button"
                    className="auth-link-btn"
                    disabled={!canResend || loading}
                    onClick={handleResend2FA}
                  >
                    {canResend ? 'ارسال مجدد کد' : `ارسال مجدد (${resendTimer} ثانیه)`}
                  </button>

                  <button
                    type="button"
                    className="auth-link-btn"
                    onClick={() => {
                      setMode('login');
                      setError('');
                      setSuccessMsg('');
                      setTwoFaCode('');
                    }}
                  >
                    بازگشت به ورود
                  </button>
                </div>
              </form>
            </>
          )}

          {/* =========================================================
              SCREEN 3: Forgot Password - Step 1 (Request Code)
             ========================================================= */}
          {mode === 'forgot_request' && (
            <>
              <div className="auth-badge-icon" style={{ background: 'rgba(200, 141, 78, 0.15)', color: '#c88d4e' }}>
                <Key size={26} />
              </div>
              <h1 style={{ marginTop: '0.5rem' }}>بازیابی کلمه عبور</h1>
              <p className="auth-sub">
                ایمیل ثبت‌نامی خود را وارد کنید تا کد تایید امنیتی برای شما ارسال گردد.
              </p>

              {error && (
                <div className="auth-error" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleForgotRequestSubmit} noValidate>
                <div className="auth-field">
                  <label htmlFor="reset-email">ایمیل حساب شما</label>
                  <input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    dir="ltr"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoFocus
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg auth-submit"
                  disabled={loading}
                >
                  {loading ? 'در حال ارسال…' : 'ارسال کد بازیابی به ایمیل'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                  <button
                    type="button"
                    className="auth-link-btn"
                    onClick={() => {
                      setMode('login');
                      setError('');
                      setSuccessMsg('');
                    }}
                  >
                    انصراف و بازگشت به صفحه ورود
                  </button>
                </div>
              </form>
            </>
          )}

          {/* =========================================================
              SCREEN 4: Forgot Password - Step 2 (Verify Code & Set New Password)
             ========================================================= */}
          {mode === 'forgot_verify' && (
            <>
              <div className="auth-badge-icon" style={{ background: 'rgba(200, 141, 78, 0.15)', color: '#c88d4e' }}>
                <Mail size={26} />
              </div>
              <h1 style={{ marginTop: '0.5rem' }}>تنظیم رمز عبور جدید</h1>
              <p className="auth-sub">
                کد تایید ۶ رقمی ارسال شده به ایمیل <strong dir="ltr" style={{ color: '#c88d4e' }}>{resetEmail}</strong> را به همراه رمز عبور جدید وارد کنید.
              </p>

              {successMsg && (
                <div className="auth-success" role="status">
                  <CheckCircle size={16} /> <span>{successMsg}</span>
                </div>
              )}

              {error && (
                <div className="auth-error" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleResetConfirmSubmit} noValidate>
                <div className="auth-field" style={{ textAlign: 'center' }}>
                  <label htmlFor="reset-code" style={{ display: 'block', marginBottom: '0.25rem' }}>
                    کد ۶ رقمی دریافتی از ایمیل
                  </label>
                  <OtpField
                    value={resetCode}
                    onChange={(val) => setResetCode(val)}
                    onComplete={(val) => setResetCode(val)}
                    disabled={loading}
                    error={!!error}
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="new-pass">رمز عبور جدید (حداقل ۸ کاراکتر)</label>
                  <input
                    id="new-pass"
                    type="password"
                    dir="ltr"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="confirm-pass">تکرار رمز عبور جدید</label>
                  <input
                    id="confirm-pass"
                    type="password"
                    dir="ltr"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg auth-submit"
                  disabled={loading || resetCode.length < 6}
                >
                  {loading ? 'در حال ثبت…' : 'ذخیره رمز عبور جدید'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                  <button
                    type="button"
                    className="auth-link-btn"
                    onClick={() => {
                      setMode('forgot_request');
                      setError('');
                      setSuccessMsg('');
                    }}
                  >
                    تغییر ایمیل / ارسال مجدد کد
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
