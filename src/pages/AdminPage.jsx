import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { api, setCsrfToken } from '../api';
import { products, grindOptions } from '../data/products';
import { formatToman, formatNumber, toPersianDigits } from '../utils/format';
import SEO from '../components/SEO';
import Loader from '../components/Loader';
import './AdminPage.css';

const STATUS_LABELS = {
  pending: { label: 'در انتظار بررسی', class: 'badge-pending' },
  confirmed: { label: 'تأیید شده', class: 'badge-confirmed' },
  processing: { label: 'در حال آماده‌سازی', class: 'badge-processing' },
  shipped: { label: 'ارسال شده', class: 'badge-shipped' },
  completed: { label: 'تکمیل شده', class: 'badge-completed' },
  cancelled: { label: 'لغو شده', class: 'badge-cancelled' },
};

const PAYMENT_LABELS = {
  paid: { label: 'پرداخت شده', class: 'badge-paid' },
  unpaid: { label: 'در انتظار پرداخت', class: 'badge-unpaid' },
  refunded: { label: 'مرجوعی', class: 'badge-refunded' },
};

const REASON_LABELS = {
  checkin: 'چک‌این روزانه',
  checkin_streak_bonus: 'پاداش زنجیره حضور',
  purchase: 'خرید از فروشگاه',
  redemption: 'استفاده از کد تخفیف/امتیاز',
  admin_adjust: 'تنظیم دستی توسط مدیر',
  reversal: 'اصلاح تراکنش',
};

export default function AdminPage() {
  // Auth state
  const [isAdminAuthed, setIsAdminAuthed] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active view
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Data states
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [ordersPage, setOrdersPage] = useState(1);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');

  const [usersList, setUsersList] = useState([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [userSearch, setUserSearch] = useState('');

  const [transactions, setTransactions] = useState([]);
  const [txTotal, setTxTotal] = useState(0);
  const [txPage, setTxPage] = useState(1);
  const [txReasonFilter, setTxReasonFilter] = useState('all');

  // Modals
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedUserForPoints, setSelectedUserForPoints] = useState(null);
  const [pointsDelta, setPointsDelta] = useState('');
  const [pointsReason, setPointsReason] = useState('');

  // Password Change State
  const [pwdChange, setPwdChange] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Manual Order Form State
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    notes: '',
    paymentMethod: 'whatsapp',
    paymentStatus: 'paid',
    items: [{ productSlug: products[0]?.slug || '', grind: 'دانه کامل (بدون آسیاب)', quantity: 1, unitPrice: products[0]?.price || 0 }]
  });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Check initial admin auth
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api.get('/admin/auth/check');
        if (active && res.authenticated) {
          setIsAdminAuthed(true);
        }
      } catch {
        if (active) setIsAdminAuthed(false);
      } finally {
        if (active) setAuthChecking(false);
      }
    })();
    return () => { active = false; };
  }, []);

  // Handle Admin Login Submit
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!adminPassword) return;
    try {
      setLoginLoading(true);
      setLoginError('');
      const res = await api.post('/admin/auth/login', { password: adminPassword });
      if (res.csrfToken) {
        setCsrfToken(res.csrfToken);
      }
      setIsAdminAuthed(true);
      setAdminPassword('');
      showToast('با موفقیت وارد سامانه مدیریت شدید');
    } catch (err) {
      setLoginError(err.message || 'رمز عبور مدیریت نادرست است.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Admin Logout
  const handleAdminLogout = async () => {
    try {
      await api.post('/admin/auth/logout');
    } catch {
    } finally {
      setIsAdminAuthed(false);
      setStats(null);
      showToast('با موفقیت از سامانه مدیریت خارج شدید');
    }
  };

  // Handle Password Change Submit
  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    if (pwdChange.newPassword !== pwdChange.confirmPassword) {
      showToast('تکرار رمز عبور جدید مطابقت ندارد', 'error');
      return;
    }
    if (pwdChange.newPassword.length < 6) {
      showToast('رمز عبور جدید باید حداقل ۶ کاراکتر باشد', 'error');
      return;
    }
    try {
      setActionLoading(true);
      await api.post('/admin/auth/change-password', {
        currentPassword: pwdChange.currentPassword,
        newPassword: pwdChange.newPassword,
      });
      showToast('رمز عبور مدیریت با موفقیت تغییر کرد');
      setPwdChange({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setActiveTab('dashboard');
    } catch (err) {
      showToast(err.message || 'خطا در تغییر رمز عبور', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/stats');
      setStats(res.stats);
    } catch (err) {
      if (err.status === 401) setIsAdminAuthed(false);
      showToast(err.message || 'خطا در دریافت آمار', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: ordersPage,
        limit: 15,
        status: orderStatusFilter,
        q: orderSearch,
      });
      const res = await api.get(`/admin/orders?${params.toString()}`);
      setOrders(res.orders || []);
      setOrdersTotal(res.total || 0);
    } catch (err) {
      if (err.status === 401) setIsAdminAuthed(false);
      showToast(err.message || 'خطا در دریافت سفارشات', 'error');
    } finally {
      setLoading(false);
    }
  }, [ordersPage, orderStatusFilter, orderSearch]);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: usersPage,
        limit: 15,
        q: userSearch,
      });
      const res = await api.get(`/admin/users?${params.toString()}`);
      setUsersList(res.users || []);
      setUsersTotal(res.total || 0);
    } catch (err) {
      if (err.status === 401) setIsAdminAuthed(false);
      showToast(err.message || 'خطا در دریافت کاربران', 'error');
    } finally {
      setLoading(false);
    }
  }, [usersPage, userSearch]);

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: txPage,
        limit: 20,
        reason: txReasonFilter,
      });
      const res = await api.get(`/admin/transactions?${params.toString()}`);
      setTransactions(res.transactions || []);
      setTxTotal(res.total || 0);
    } catch (err) {
      if (err.status === 401) setIsAdminAuthed(false);
      showToast(err.message || 'خطا در دریافت تراکنش‌ها', 'error');
    } finally {
      setLoading(false);
    }
  }, [txPage, txReasonFilter]);

  // Tab change trigger
  useEffect(() => {
    if (!isAdminAuthed) return;
    if (activeTab === 'dashboard') fetchStats();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'transactions') fetchTransactions();
  }, [activeTab, isAdminAuthed, fetchStats, fetchOrders, fetchUsers, fetchTransactions]);

  // Update order status handler
  const handleUpdateOrderStatus = async (orderId, newStatus, newPaymentStatus) => {
    try {
      setActionLoading(true);
      await api.post('/admin/orders/status', {
        orderId,
        status: newStatus,
        paymentStatus: newPaymentStatus,
      });
      showToast('وضعیت سفارش با موفقیت به‌روزرسانی شد');
      if (selectedOrder) {
        setSelectedOrder(prev => ({
          ...prev,
          status: newStatus || prev.status,
          payment_status: newPaymentStatus || prev.payment_status,
        }));
      }
      fetchOrders();
      if (activeTab === 'dashboard') fetchStats();
    } catch (err) {
      showToast(err.message || 'خطا در به‌روزرسانی سفارش', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Update user role
  const handleToggleUserRole = async (targetUser) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`آیا از تغییر نقش کاربر ${targetUser.display_name} به "${newRole === 'admin' ? 'مدیر' : 'کاربر عادی'}" اطمینان دارید؟`)) {
      return;
    }
    try {
      setActionLoading(true);
      await api.post('/admin/users/role', { userId: targetUser.id, role: newRole });
      showToast(`نقش با موفقیت به ${newRole === 'admin' ? 'مدیر' : 'کاربر'} تغییر یافت`);
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'خطا در تغییر نقش', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Update user status (ban / unban)
  const handleToggleUserStatus = async (targetUser) => {
    const newStatus = targetUser.status === 'active' ? 'banned' : 'active';
    if (!window.confirm(`آیا از ${newStatus === 'banned' ? 'مسدودسازی' : 'فعال‌سازی'} حساب ${targetUser.display_name} اطمینان دارید؟`)) {
      return;
    }
    try {
      setActionLoading(true);
      await api.post('/admin/users/status', { userId: targetUser.id, status: newStatus });
      showToast(`وضعیت کاربر به ${newStatus === 'active' ? 'فعال' : 'مسدود'} تغییر کرد`);
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'خطا در تغییر وضعیت کاربر', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Adjust points submit
  const handleAdjustPointsSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserForPoints || !pointsDelta) return;
    try {
      setActionLoading(true);
      await api.post('/admin/users/points', {
        userId: selectedUserForPoints.id,
        delta: parseInt(pointsDelta, 10),
        reason: pointsReason || 'تنظیم دستی مدیریت'
      });
      showToast('امتیاز کاربر با موفقیت تغییر کرد');
      setSelectedUserForPoints(null);
      setPointsDelta('');
      setPointsReason('');
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'خطا در تغییر امتیاز', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Create manual order submit
  const handleCreateOrderSubmit = async (e) => {
    e.preventDefault();
    if (!newOrder.customerName || !newOrder.customerPhone) {
      showToast('نام و شماره تماس مشتری الزامی است', 'error');
      return;
    }
    try {
      setActionLoading(true);
      const res = await api.post('/admin/orders/create', {
        customerName: newOrder.customerName,
        customerPhone: newOrder.customerPhone,
        customerAddress: newOrder.customerAddress,
        notes: newOrder.notes,
        paymentMethod: newOrder.paymentMethod,
        paymentStatus: newOrder.paymentStatus,
        items: newOrder.items.map(it => ({
          productSlug: it.productSlug,
          productName: products.find(p => p.slug === it.productSlug)?.name || it.productSlug,
          grind: it.grind,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
        }))
      });
      showToast(`سفارش جدید با شماره ${res.orderNumber} با موفقیت ثبت شد`);
      setActiveTab('orders');
      setNewOrder({
        customerName: '',
        customerPhone: '',
        customerAddress: '',
        notes: '',
        paymentMethod: 'whatsapp',
        paymentStatus: 'paid',
        items: [{ productSlug: products[0]?.slug || '', grind: 'دانه کامل (بدون آسیاب)', quantity: 1, unitPrice: products[0]?.price || 0 }]
      });
    } catch (err) {
      showToast(err.message || 'خطا در ثبت سفارش جدید', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const addItemToNewOrder = () => {
    const firstProd = products[0];
    setNewOrder(prev => ({
      ...prev,
      items: [...prev.items, { productSlug: firstProd?.slug || '', grind: 'دانه کامل (بدون آسیاب)', quantity: 1, unitPrice: firstProd?.price || 0 }]
    }));
  };

  const removeItemFromNewOrder = (idx) => {
    if (newOrder.items.length <= 1) return;
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx)
    }));
  };

  const updateNewOrderItem = (idx, field, val) => {
    setNewOrder(prev => {
      const items = [...prev.items];
      if (field === 'productSlug') {
        const prod = products.find(p => p.slug === val);
        items[idx] = { ...items[idx], productSlug: val, unitPrice: prod?.price || 0 };
      } else {
        items[idx] = { ...items[idx], [field]: val };
      }
      return { ...prev, items };
    });
  };

  const newOrderTotalPrice = useMemo(() => {
    return newOrder.items.reduce((sum, it) => sum + (it.quantity * it.unitPrice), 0);
  }, [newOrder.items]);

  // Loading initial auth check
  if (authChecking) {
    return (
      <div className="admin-login-screen">
        <Loader minHeight="60vh" />
      </div>
    );
  }

  // =========================================================================
  // Screen 1: Admin Password Login Gate (When not authenticated)
  // =========================================================================
  if (!isAdminAuthed) {
    return (
      <div className="admin-login-screen">
        <SEO title="ورود به سامانه مدیریت | کیپ کافی" description="ورود به بخش مدیریت کارگاه برشته‌کاری کیپ کافی" />

        <div className="admin-login-card">
          <div className="admin-login-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4"/><path d="m4.93 4.93 2.83 2.83"/><path d="M2 12h4"/><path d="m4.93 19.07 2.83-2.83"/><path d="M12 22v-4"/><path d="m19.07 19.07-2.83-2.83"/><path d="M22 12h-4"/><path d="m19.07 4.93-2.83 2.83"/>
            </svg>
          </div>

          <h1 className="admin-login-title">سامانه مدیریت کیپ کافی</h1>
          <p className="admin-login-desc">لطفاً جهت دسترسی به بخش‌های مدیریتی و سفارشات، رمز عبور اختصاصی مدیر را وارد کنید.</p>

          {loginError && (
            <div style={{ background: '#3b1717', border: '1px solid #7f1d1d', color: '#fca5a5', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="admin-login-form">
            <div className="admin-input-group">
              <label className="admin-input-label">رمز عبور مدیر کارگاه:</label>
              <div className="admin-password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="رمز عبور مدیریت…"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="admin-input"
                  dir="ltr"
                  autoFocus
                />
                <button
                  type="button"
                  className="admin-pwd-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? '👁️' : '🔒'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loginLoading} className="admin-login-btn">
              {loginLoading ? 'در حال بررسی…' : 'ورود به پنل مدیریت'}
            </button>
          </form>

          <a href="/" className="admin-back-link">← بازگشت به وب‌سایت فروشگاه</a>
        </div>
      </div>
    );
  }

  // =========================================================================
  // Screen 2: Standalone Isolated Admin Workspace (Completely decoupled from site layout)
  // =========================================================================
  return (
    <div className="admin-standalone-root">
      <SEO title="سامانه مدیریت کارگاه | کیپ کافی" description="پنل مستقل مدیریت سفارشات و کاربران" />

      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          {toast.msg}
        </div>
      )}

      {/* Standalone Admin Top Navigation Bar */}
      <header className="admin-standalone-topbar">
        <div className="admin-topbar-brand">
          <div className="admin-brand-icon">☕</div>
          <div>
            <span className="admin-brand-text">Keep Coffee Roastery</span>
            <span className="admin-badge-tag">مدیریت کارگاه</span>
          </div>
        </div>

        <div className="admin-topbar-actions">
          <button
            onClick={() => {
              if (activeTab === 'dashboard') fetchStats();
              if (activeTab === 'orders') fetchOrders();
              if (activeTab === 'users') fetchUsers();
              if (activeTab === 'transactions') fetchTransactions();
              showToast('اطلاعات با موفقیت به‌روزرسانی شد');
            }}
            className="admin-action-link"
            title="تازه‌سازی اطلاعات"
          >
            🔄 به‌روزرسانی داده‌ها
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-action-link"
            title="مشاهده سایت در تب جدید"
          >
            🌐 مشاهده فروشگاه
          </a>
          <button
            onClick={() => setActiveTab('settings')}
            className={`admin-action-link ${activeTab === 'settings' ? 'active' : ''}`}
            title="تغییر رمز عبور مدیریت"
          >
            🔐 تغییر رمز
          </button>
          <button
            onClick={handleAdminLogout}
            className="admin-action-link admin-action-logout"
            title="خروج از حساب مدیریت"
          >
            🚪 خروج
          </button>
        </div>
      </header>

      {/* Standalone Admin Workspace */}
      <main className="admin-workspace">
        {/* Navigation Tabs */}
        <nav className="admin-nav-tabs" aria-label="بخش‌های پنل">
          <button
            className={`admin-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 داشبورد و آمار
          </button>
          <button
            className={`admin-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 سفارشات
            {stats?.pendingOrders > 0 && (
              <span className="admin-tab-pill pill-alert">{toPersianDigits(stats.pendingOrders)}</span>
            )}
          </button>
          <button
            className={`admin-nav-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 کاربران و اعضا
            {stats?.totalUsers > 0 && (
              <span className="admin-tab-pill">{toPersianDigits(stats.totalUsers)}</span>
            )}
          </button>
          <button
            className={`admin-nav-btn ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            📜 تراکنش‌ها و امتیازات
          </button>
          <button
            className={`admin-nav-btn ${activeTab === 'new_order' ? 'active' : ''}`}
            onClick={() => setActiveTab('new_order')}
          >
            ➕ ثبت سفارش دستی
          </button>
          <button
            className={`admin-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ تنظیمات و تغییر رمز
          </button>
        </nav>

        {/* ===================================================================
            Tab 1: Dashboard
            =================================================================== */}
        {activeTab === 'dashboard' && (
          <div>
            {loading && !stats ? (
              <Loader minHeight="40vh" />
            ) : (
              <>
                <div className="admin-metrics-grid">
                  <div className="admin-metric-card">
                    <div className="admin-metric-head">
                      <span>کل سفارشات ثبت شده</span>
                      <span>📦</span>
                    </div>
                    <div className="admin-metric-val">{toPersianDigits(stats?.totalOrders || 0)}</div>
                    <div className="admin-metric-sub">
                      {stats?.pendingOrders > 0
                        ? `${toPersianDigits(stats.pendingOrders)} سفارش جدید نیازمند اقدام`
                        : 'همه سفارش‌ها رسیدگی شده است'}
                    </div>
                  </div>

                  <div className="admin-metric-card">
                    <div className="admin-metric-head">
                      <span>مجموع فروش کارگاه</span>
                      <span>💰</span>
                    </div>
                    <div className="admin-metric-val">{formatToman(stats?.totalRevenue || 0)}</div>
                    <div className="admin-metric-sub">سفارشات قطعی و تسویه شده</div>
                  </div>

                  <div className="admin-metric-card">
                    <div className="admin-metric-head">
                      <span>اعضای ثبت‌نام شده</span>
                      <span>👥</span>
                    </div>
                    <div className="admin-metric-val">{toPersianDigits(stats?.totalUsers || 0)}</div>
                    <div className="admin-metric-sub">{toPersianDigits(stats?.totalCheckins || 0)} حضور در باشگاه</div>
                  </div>

                  <div className="admin-metric-card">
                    <div className="admin-metric-head">
                      <span>امتیازات فعال باشگاه</span>
                      <span>⭐</span>
                    </div>
                    <div className="admin-metric-val">{formatNumber(stats?.totalPoints || 0)}</div>
                    <div className="admin-metric-sub">موجودی در دست اعضا</div>
                  </div>
                </div>

                {/* Quick Tables Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
                  <div className="admin-dark-table-card">
                    <div style={{ padding: '1rem', borderBottom: '1px solid #273b30', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>آخرین سفارشات کارگاه</h3>
                      <button className="admin-dark-btn" onClick={() => setActiveTab('orders')}>مشاهده همه</button>
                    </div>
                    <table className="admin-dark-table">
                      <thead>
                        <tr>
                          <th>شماره</th>
                          <th>مشتری</th>
                          <th>مبلغ</th>
                          <th>وضعیت</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats?.recentOrders?.length ? (
                          stats.recentOrders.map(ord => (
                            <tr key={ord.id}>
                              <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{ord.order_number}</td>
                              <td>{ord.customer_name}</td>
                              <td>{formatToman(ord.final_amount)}</td>
                              <td>
                                <span className={`admin-status-badge ${STATUS_LABELS[ord.status]?.class || ''}`}>
                                  {STATUS_LABELS[ord.status]?.label || ord.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan="4" style={{ textAlign: 'center', padding: '1.5rem', color: '#8da495' }}>سفارشی ثبت نشده است.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="admin-dark-table-card">
                    <div style={{ padding: '1rem', borderBottom: '1px solid #273b30', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>اعضای تازه ثبت‌نام شده</h3>
                      <button className="admin-dark-btn" onClick={() => setActiveTab('users')}>مشاهده همه</button>
                    </div>
                    <table className="admin-dark-table">
                      <thead>
                        <tr>
                          <th>نام</th>
                          <th>ایمیل</th>
                          <th>نقش</th>
                          <th>امتیاز</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats?.recentUsers?.length ? (
                          stats.recentUsers.map(u => (
                            <tr key={u.id}>
                              <td>{u.display_name}</td>
                              <td dir="ltr" style={{ textAlign: 'right' }}>{u.email}</td>
                              <td>
                                <span className={`admin-status-badge ${u.role === 'admin' ? 'badge-role-admin' : 'badge-role-user'}`}>
                                  {u.role === 'admin' ? 'مدیر کل' : 'کاربر'}
                                </span>
                              </td>
                              <td>{toPersianDigits(u.points_balance)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan="4" style={{ textAlign: 'center', padding: '1.5rem', color: '#8da495' }}>کاربری یافت نشد.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ===================================================================
            Tab 2: Orders Management
            =================================================================== */}
        {activeTab === 'orders' && (
          <div>
            <div className="admin-dark-toolbar">
              <div style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '260px' }}>
                <input
                  type="text"
                  placeholder="جستجو با شماره سفارش، نام خریدار یا تلفن…"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
                  className="admin-input"
                />
                <button className="admin-dark-btn admin-dark-btn-accent" onClick={fetchOrders}>جستجو</button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.85rem', color: '#8da495', whiteSpace: 'nowrap' }}>فیلتر وضعیت:</label>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => { setOrderStatusFilter(e.target.value); setOrdersPage(1); }}
                  className="admin-input"
                  style={{ width: 'auto' }}
                >
                  <option value="all">همه وضعیت‌ها</option>
                  <option value="pending">در انتظار بررسی</option>
                  <option value="confirmed">تأیید شده</option>
                  <option value="processing">در حال آماده‌سازی</option>
                  <option value="shipped">ارسال شده</option>
                  <option value="completed">تکمیل شده</option>
                  <option value="cancelled">لغو شده</option>
                </select>
              </div>
            </div>

            {loading ? (
              <Loader minHeight="30vh" />
            ) : (
              <>
                <div className="admin-dark-table-card">
                  <table className="admin-dark-table">
                    <thead>
                      <tr>
                        <th>شماره سفارش</th>
                        <th>مشتری</th>
                        <th>تلفن</th>
                        <th>اقلام و آسیاب</th>
                        <th>مبلغ نهایی</th>
                        <th>وضعیت پرداخت</th>
                        <th>وضعیت سفارش</th>
                        <th>عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length ? (
                        orders.map(ord => (
                          <tr key={ord.id}>
                            <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#c88d4e' }}>{ord.order_number}</td>
                            <td>{ord.customer_name}</td>
                            <td dir="ltr" style={{ textAlign: 'right' }}>
                              {ord.customer_phone}
                              {ord.customer_phone && (
                                <a
                                  href={`https://wa.me/${ord.customer_phone.replace(/^0/, '98')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ marginRight: '0.4rem', textDecoration: 'none' }}
                                  title="پیام در واتساپ"
                                >
                                  💬
                                </a>
                              )}
                            </td>
                            <td>
                              <span style={{ fontSize: '0.82rem', color: '#8da495' }}>
                                {ord.items?.length
                                  ? ord.items.map(it => `${it.product_name} (${toPersianDigits(it.quantity)})`).join('، ')
                                  : '—'}
                              </span>
                            </td>
                            <td style={{ fontWeight: 700 }}>{formatToman(ord.final_amount)}</td>
                            <td>
                              <span className={`admin-status-badge ${PAYMENT_LABELS[ord.payment_status]?.class || ''}`}>
                                {PAYMENT_LABELS[ord.payment_status]?.label || ord.payment_status}
                              </span>
                            </td>
                            <td>
                              <span className={`admin-status-badge ${STATUS_LABELS[ord.status]?.class || ''}`}>
                                {STATUS_LABELS[ord.status]?.label || ord.status}
                              </span>
                            </td>
                            <td>
                              <button className="admin-dark-btn" onClick={() => setSelectedOrder(ord)}>
                                مشاهده و تغییر وضعیت
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" style={{ textAlign: 'center', padding: '2.5rem', color: '#8da495' }}>
                            سفارشی با این مشخصات یافت نشد.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {ordersTotal > 15 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                    <button
                      className="admin-dark-btn"
                      disabled={ordersPage <= 1}
                      onClick={() => setOrdersPage(p => Math.max(1, p - 1))}
                    >
                      قبلی
                    </button>
                    <span>صفحه {toPersianDigits(ordersPage)} از {toPersianDigits(Math.ceil(ordersTotal / 15))}</span>
                    <button
                      className="admin-dark-btn"
                      disabled={ordersPage >= Math.ceil(ordersTotal / 15)}
                      onClick={() => setOrdersPage(p => p + 1)}
                    >
                      بعدی
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ===================================================================
            Tab 3: Users Management
            =================================================================== */}
        {activeTab === 'users' && (
          <div>
            <div className="admin-dark-toolbar">
              <div style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '260px' }}>
                <input
                  type="text"
                  placeholder="جستجو با نام، ایمیل یا شماره تماس کاربر…"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                  className="admin-input"
                />
                <button className="admin-dark-btn admin-dark-btn-accent" onClick={fetchUsers}>جستجو</button>
              </div>
            </div>

            {loading ? (
              <Loader minHeight="30vh" />
            ) : (
              <>
                <div className="admin-dark-table-card">
                  <table className="admin-dark-table">
                    <thead>
                      <tr>
                        <th>شناسه</th>
                        <th>نام کاربر</th>
                        <th>ایمیل</th>
                        <th>شماره تماس</th>
                        <th>نقش</th>
                        <th>وضعیت</th>
                        <th>امتیازات</th>
                        <th>رکورد حضور</th>
                        <th>عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.length ? (
                        usersList.map(u => (
                          <tr key={u.id}>
                            <td>{toPersianDigits(u.id)}</td>
                            <td><strong>{u.display_name}</strong></td>
                            <td dir="ltr" style={{ textAlign: 'right' }}>{u.email}</td>
                            <td dir="ltr" style={{ textAlign: 'right' }}>{u.phone || '—'}</td>
                            <td>
                              <span className={`admin-status-badge ${u.role === 'admin' ? 'badge-role-admin' : 'badge-role-user'}`}>
                                {u.role === 'admin' ? 'مدیر کل' : 'کاربر'}
                              </span>
                            </td>
                            <td>
                              <span style={{ color: u.status === 'active' ? '#4ade80' : '#f87171' }}>
                                {u.status === 'active' ? '● فعال' : '■ مسدود'}
                              </span>
                            </td>
                            <td><strong>{toPersianDigits(u.points_balance)}</strong></td>
                            <td>{toPersianDigits(u.current_streak)} روز</td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                <button
                                  className="admin-dark-btn"
                                  onClick={() => { setSelectedUserForPoints(u); setPointsDelta(''); setPointsReason(''); }}
                                  title="افزایش یا کسر امتیاز"
                                >
                                  ⭐ امتیاز
                                </button>
                                <button
                                  className="admin-dark-btn"
                                  onClick={() => handleToggleUserRole(u)}
                                  title="تغییر نقش"
                                >
                                  {u.role === 'admin' ? 'تبدیل به کاربر' : 'ارتقا به مدیر'}
                                </button>
                                <button
                                  className={`admin-dark-btn ${u.status === 'active' ? 'admin-dark-btn-danger' : ''}`}
                                  onClick={() => handleToggleUserStatus(u)}
                                >
                                  {u.status === 'active' ? 'مسدودسازی' : 'فعال‌سازی'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" style={{ textAlign: 'center', padding: '2.5rem', color: '#8da495' }}>
                            کاربری با این مشخصات یافت نشد.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {usersTotal > 15 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                    <button
                      className="admin-dark-btn"
                      disabled={usersPage <= 1}
                      onClick={() => setUsersPage(p => Math.max(1, p - 1))}
                    >
                      قبلی
                    </button>
                    <span>صفحه {toPersianDigits(usersPage)} از {toPersianDigits(Math.ceil(usersTotal / 15))}</span>
                    <button
                      className="admin-dark-btn"
                      disabled={usersPage >= Math.ceil(usersTotal / 15)}
                      onClick={() => setUsersPage(p => p + 1)}
                    >
                      بعدی
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ===================================================================
            Tab 4: Transactions Ledger Audit
            =================================================================== */}
        {activeTab === 'transactions' && (
          <div>
            <div className="admin-dark-toolbar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.85rem', color: '#8da495' }}>نوع تراکنش:</label>
                <select
                  value={txReasonFilter}
                  onChange={(e) => { setTxReasonFilter(e.target.value); setTxPage(1); }}
                  className="admin-input"
                  style={{ width: 'auto' }}
                >
                  <option value="all">همه تراکنش‌ها</option>
                  <option value="checkin">چک‌این روزانه</option>
                  <option value="checkin_streak_bonus">پاداش زنجیره</option>
                  <option value="purchase">خرید از فروشگاه</option>
                  <option value="redemption">استفاده از تخفیف/امتیاز</option>
                  <option value="admin_adjust">تنظیم دستی مدیر</option>
                </select>
              </div>
            </div>

            {loading ? (
              <Loader minHeight="30vh" />
            ) : (
              <div className="admin-dark-table-card">
                <table className="admin-dark-table">
                  <thead>
                    <tr>
                      <th>شناسه</th>
                      <th>کاربر</th>
                      <th>دلیل تراکنش</th>
                      <th>تغییر امتیاز</th>
                      <th>موجودی پس از تغییر</th>
                      <th>تاریخ و ساعت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length ? (
                      transactions.map(tx => (
                        <tr key={tx.id}>
                          <td>{toPersianDigits(tx.id)}</td>
                          <td><strong>{tx.display_name}</strong> <span style={{ fontSize: '0.8rem', color: '#8da495' }}>({tx.email})</span></td>
                          <td>{REASON_LABELS[tx.reason] || tx.reason}</td>
                          <td style={{ fontWeight: 700, color: tx.delta > 0 ? '#4ade80' : '#f87171' }}>
                            {tx.delta > 0 ? `+${toPersianDigits(tx.delta)}` : toPersianDigits(tx.delta)}
                          </td>
                          <td>{toPersianDigits(tx.balance_after)}</td>
                          <td dir="ltr" style={{ textAlign: 'right' }}>{tx.created_at}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: '#8da495' }}>
                          هیچ تراکنشی یافت نشد.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            Tab 5: Manual Order Creation
            =================================================================== */}
        {activeTab === 'new_order' && (
          <div style={{ maxWidth: '820px', margin: '0 auto', background: '#17241d', padding: '2rem', borderRadius: '18px', border: '1px solid #273b30', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.5rem', color: '#fff' }}>
              ثبت دستی سفارش جدید (سفارش تلفنی / حضوری کافه)
            </h2>
            <form onSubmit={handleCreateOrderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div className="admin-input-group">
                  <label className="admin-input-label">نام و نام خانوادگی خریدار *</label>
                  <input
                    type="text"
                    required
                    value={newOrder.customerName}
                    onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                    className="admin-input"
                    placeholder="مثال: محمد امینی"
                  />
                </div>
                <div className="admin-input-group">
                  <label className="admin-input-label">شماره تماس مشتری *</label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={newOrder.customerPhone}
                    onChange={(e) => setNewOrder({ ...newOrder, customerPhone: e.target.value })}
                    className="admin-input"
                    placeholder="0912..."
                  />
                </div>
              </div>

              <div className="admin-input-group">
                <label className="admin-input-label">آدرس تحویل</label>
                <textarea
                  rows={2}
                  value={newOrder.customerAddress}
                  onChange={(e) => setNewOrder({ ...newOrder, customerAddress: e.target.value })}
                  className="admin-input"
                  placeholder="تهران، خیابان..."
                />
              </div>

              {/* Items Section */}
              <div style={{ border: '1px solid #273b30', borderRadius: '12px', padding: '1.25rem', background: '#121c17' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <label className="admin-input-label" style={{ fontWeight: 700, color: '#fff' }}>اقلام سفارش</label>
                  <button type="button" onClick={addItemToNewOrder} className="admin-dark-btn admin-dark-btn-accent">
                    + افزودن محصول دیگر
                  </button>
                </div>

                {newOrder.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <select
                      value={item.productSlug}
                      onChange={(e) => updateNewOrderItem(idx, 'productSlug', e.target.value)}
                      className="admin-input"
                    >
                      {products.map(p => (
                        <option key={p.slug} value={p.slug}>{p.name} ({formatToman(p.price)})</option>
                      ))}
                    </select>

                    <select
                      value={item.grind}
                      onChange={(e) => updateNewOrderItem(idx, 'grind', e.target.value)}
                      className="admin-input"
                    >
                      {grindOptions.map(g => (
                        <option key={g.id} value={g.label}>{g.label}</option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateNewOrderItem(idx, 'quantity', parseInt(e.target.value, 10) || 1)}
                      className="admin-input"
                      title="تعداد / کیلو"
                    />

                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateNewOrderItem(idx, 'unitPrice', parseInt(e.target.value, 10) || 0)}
                      className="admin-input"
                      title="قیمت واحد (تومان)"
                    />

                    {newOrder.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItemFromNewOrder(idx)}
                        className="admin-dark-btn admin-dark-btn-danger"
                        title="حذف سطر"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                <div style={{ textAlign: 'left', marginTop: '0.75rem', fontWeight: 800, color: '#c88d4e', fontSize: '1.05rem' }}>
                  مجموع فاکتور: {formatToman(newOrderTotalPrice)}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="admin-input-group">
                  <label className="admin-input-label">وضعیت پرداخت</label>
                  <select
                    value={newOrder.paymentStatus}
                    onChange={(e) => setNewOrder({ ...newOrder, paymentStatus: e.target.value })}
                    className="admin-input"
                  >
                    <option value="paid">پرداخت شده (کارت به کارت / نقدی)</option>
                    <option value="unpaid">در انتظار پرداخت</option>
                  </select>
                </div>
                <div className="admin-input-group">
                  <label className="admin-input-label">روش ثبت سفارش</label>
                  <select
                    value={newOrder.paymentMethod}
                    onChange={(e) => setNewOrder({ ...newOrder, paymentMethod: e.target.value })}
                    className="admin-input"
                  >
                    <option value="phone">سفارش تلفنی کارگاه</option>
                    <option value="whatsapp">واتساپ</option>
                    <option value="telegram">تلگرام</option>
                    <option value="in_person">حضوری در کارگاه</option>
                  </select>
                </div>
              </div>

              <div className="admin-input-group">
                <label className="admin-input-label">یادداشت مدیر</label>
                <textarea
                  rows={2}
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                  className="admin-input"
                  placeholder="توضیحات مربوط به بسته بندی یا پروفایل رست..."
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="admin-login-btn"
              >
                {actionLoading ? 'در حال ثبت در دیتابیس…' : 'ثبت قطعی سفارش در دیتابیس'}
              </button>
            </form>
          </div>
        )}

        {/* ===================================================================
            Tab 6: Admin Settings & Password Change
            =================================================================== */}
        {activeTab === 'settings' && (
          <div style={{ maxWidth: '540px', margin: '0 auto', background: '#17241d', padding: '2.5rem 2rem', borderRadius: '18px', border: '1px solid #273b30', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.75rem', color: '#fff' }}>
              🔐 تنظیمات و تغییر رمز عبور مدیریت
            </h2>
            <p style={{ color: '#8da495', fontSize: '0.85rem', marginBottom: '2rem', lineHeight: 1.5 }}>
              رمز عبور جدید بلافاصله در دیتابیس ذخیره شده و از این پس برای ورود به این پنل الزامی خواهد بود.
            </p>

            <form onSubmit={handlePasswordChangeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="admin-input-group">
                <label className="admin-input-label">رمز عبور فعلی مدیریت *</label>
                <input
                  type="password"
                  required
                  placeholder="رمز عبور فعلی…"
                  value={pwdChange.currentPassword}
                  onChange={(e) => setPwdChange({ ...pwdChange, currentPassword: e.target.value })}
                  className="admin-input"
                  dir="ltr"
                />
              </div>

              <div className="admin-input-group">
                <label className="admin-input-label">رمز عبور جدید (حداقل ۶ کاراکتر) *</label>
                <input
                  type="password"
                  required
                  placeholder="رمز عبور جدید…"
                  value={pwdChange.newPassword}
                  onChange={(e) => setPwdChange({ ...pwdChange, newPassword: e.target.value })}
                  className="admin-input"
                  dir="ltr"
                />
              </div>

              <div className="admin-input-group">
                <label className="admin-input-label">تکرار رمز عبور جدید *</label>
                <input
                  type="password"
                  required
                  placeholder="تکرار رمز عبور جدید…"
                  value={pwdChange.confirmPassword}
                  onChange={(e) => setPwdChange({ ...pwdChange, confirmPassword: e.target.value })}
                  className="admin-input"
                  dir="ltr"
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="admin-login-btn"
              >
                {actionLoading ? 'در حال ذخیره‌سازی…' : 'ذخیره و به‌روزرسانی رمز عبور'}
              </button>
            </form>
          </div>
        )}

        {/* ===================================================================
            Modal: Order Details & Status Update
            =================================================================== */}
        {selectedOrder && (
          <div className="admin-dark-modal-backdrop" onClick={() => setSelectedOrder(null)}>
            <div className="admin-dark-modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-dark-modal-head">
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fff' }}>
                  جزئیات سفارش <span style={{ color: '#c88d4e' }}>{selectedOrder.order_number}</span>
                </h3>
                <button style={{ background: 'none', border: 'none', color: '#8da495', fontSize: '1.4rem', cursor: 'pointer' }} onClick={() => setSelectedOrder(null)}>✕</button>
              </div>

              <div className="admin-dark-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#8da495' }}>نام خریدار:</span>
                    <div><strong>{selectedOrder.customer_name}</strong></div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#8da495' }}>شماره تماس:</span>
                    <div dir="ltr" style={{ textAlign: 'right' }}><strong>{selectedOrder.customer_phone}</strong></div>
                  </div>
                </div>

                {selectedOrder.customer_address && (
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#8da495' }}>آدرس تحویل:</span>
                    <div style={{ background: '#111b16', padding: '0.75rem', borderRadius: '8px', marginTop: '0.25rem' }}>
                      {selectedOrder.customer_address}
                    </div>
                  </div>
                )}

                <div>
                  <span style={{ fontSize: '0.8rem', color: '#8da495' }}>اقلام سفارش:</span>
                  <div style={{ marginTop: '0.4rem', border: '1px solid #273b30', borderRadius: '8px', overflow: 'hidden' }}>
                    <table className="admin-dark-table">
                      <thead>
                        <tr>
                          <th>محصول</th>
                          <th>نوع آسیاب</th>
                          <th>تعداد</th>
                          <th>مبلغ کل</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items?.map((it, idx) => (
                          <tr key={idx}>
                            <td>{it.product_name}</td>
                            <td>{it.grind || 'دانه کامل'}</td>
                            <td>{toPersianDigits(it.quantity)}</td>
                            <td>{formatToman(it.total_price)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(200, 141, 78, 0.12)', borderRadius: '8px', fontWeight: 800 }}>
                  <span>مبلغ قابل پرداخت فاکتور:</span>
                  <span style={{ color: '#c88d4e' }}>{formatToman(selectedOrder.final_amount)}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="admin-input-group">
                    <label className="admin-input-label">وضعیت سفارش:</label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value, null)}
                      className="admin-input"
                      disabled={actionLoading}
                    >
                      <option value="pending">در انتظار بررسی</option>
                      <option value="confirmed">تأیید شده</option>
                      <option value="processing">در حال آماده‌سازی</option>
                      <option value="shipped">ارسال شده</option>
                      <option value="completed">تکمیل شده</option>
                      <option value="cancelled">لغو شده</option>
                    </select>
                  </div>

                  <div className="admin-input-group">
                    <label className="admin-input-label">وضعیت پرداخت:</label>
                    <select
                      value={selectedOrder.payment_status}
                      onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, null, e.target.value)}
                      className="admin-input"
                      disabled={actionLoading}
                    >
                      <option value="unpaid">در انتظار پرداخت</option>
                      <option value="paid">پرداخت شده</option>
                      <option value="refunded">مرجوعی</option>
                    </select>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#8da495' }}>یادداشت:</span>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.88rem' }}>{selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              <div className="admin-dark-modal-foot">
                <button className="admin-dark-btn" onClick={() => setSelectedOrder(null)}>بستن</button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            Modal: Adjust User Points
            =================================================================== */}
        {selectedUserForPoints && (
          <div className="admin-dark-modal-backdrop" onClick={() => setSelectedUserForPoints(null)}>
            <div className="admin-dark-modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-dark-modal-head">
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fff' }}>تنظیم امتیاز کاربر</h3>
                <button style={{ background: 'none', border: 'none', color: '#8da495', fontSize: '1.4rem', cursor: 'pointer' }} onClick={() => setSelectedUserForPoints(null)}>✕</button>
              </div>
              <form onSubmit={handleAdjustPointsSubmit}>
                <div className="admin-dark-modal-body">
                  <p style={{ lineHeight: 1.6, color: '#e5ede7' }}>
                    کاربر: <strong>{selectedUserForPoints.display_name}</strong> ({selectedUserForPoints.email})
                    <br />
                    موجودی فعلی: <strong>{toPersianDigits(selectedUserForPoints.points_balance)} امتیاز</strong>
                  </p>

                  <div className="admin-input-group">
                    <label className="admin-input-label">مقدار تغییر امتیاز (مثبت برای افزایش، منفی برای کسر):</label>
                    <input
                      type="number"
                      required
                      placeholder="مثال: 50 یا -20"
                      value={pointsDelta}
                      onChange={(e) => setPointsDelta(e.target.value)}
                      className="admin-input"
                      dir="ltr"
                    />
                  </div>

                  <div className="admin-input-group">
                    <label className="admin-input-label">دلیل تغییر امتیاز:</label>
                    <input
                      type="text"
                      placeholder="مثال: پاداش خرید عمده / هدیه افتتاحیه"
                      value={pointsReason}
                      onChange={(e) => setPointsReason(e.target.value)}
                      className="admin-input"
                    />
                  </div>
                </div>

                <div className="admin-dark-modal-foot">
                  <button type="button" className="admin-dark-btn" onClick={() => setSelectedUserForPoints(null)}>انصراف</button>
                  <button type="submit" disabled={actionLoading} className="admin-dark-btn admin-dark-btn-accent">
                    {actionLoading ? 'در حال ثبت…' : 'اعمال تغییر امتیاز'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
