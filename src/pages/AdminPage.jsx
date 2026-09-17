import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { products, grindOptions } from '../data/products';
import { formatToman, formatNumber, toPersianDigits } from '../utils/format';
import SEO from '../components/SEO';
import Loader from '../components/Loader';
import './AdminPage.css';

const STATUS_LABELS = {
  pending: { label: 'در انتظار بررسی', class: 'status-pending' },
  confirmed: { label: 'تأیید شده', class: 'status-confirmed' },
  processing: { label: 'در حال آماده‌سازی', class: 'status-processing' },
  shipped: { label: 'ارسال شده', class: 'status-shipped' },
  completed: { label: 'تکمیل شده', class: 'status-completed' },
  cancelled: { label: 'لغو شده', class: 'status-cancelled' },
};

const PAYMENT_LABELS = {
  paid: { label: 'پرداخت شده', class: 'status-paid' },
  unpaid: { label: 'در انتظار پرداخت', class: 'status-unpaid' },
  refunded: { label: 'مرجوعی', class: 'status-refunded' },
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
  const { user } = useAuth();
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

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/stats');
      setStats(res.stats);
    } catch (err) {
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
      showToast(err.message || 'خطا در دریافت تراکنش‌ها', 'error');
    } finally {
      setLoading(false);
    }
  }, [txPage, txReasonFilter]);

  // Tab change trigger
  useEffect(() => {
    if (activeTab === 'dashboard') fetchStats();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'transactions') fetchTransactions();
  }, [activeTab, fetchStats, fetchOrders, fetchUsers, fetchTransactions]);

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
      // Reset form
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

  // Helper to add item to manual order
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

  return (
    <div className="admin-page">
      <SEO title="پنل مدیریت کارگاه کیپ کافی" description="سیستم مدیریت سفارشات، اعضا و باشگاه مشتریان کیپ کافی" />

      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: toast.type === 'error' ? '#ef4444' : '#10b981',
          color: '#fff',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 2000,
          fontWeight: 600,
          fontSize: '0.9rem'
        }}>
          {toast.msg}
        </div>
      )}

      <div className="container">
        {/* Admin Header */}
        <header className="admin-header">
          <div className="admin-title-wrap">
            <h1 className="admin-title">پنل مدیریت کیپ کافی</h1>
            <span className="admin-badge">مدیریت کل</span>
          </div>

          <div className="admin-user-info">
            <span>مدیر فعال: <strong>{user?.displayName || user?.email}</strong></span>
            <button
              onClick={() => {
                if (activeTab === 'dashboard') fetchStats();
                if (activeTab === 'orders') fetchOrders();
                if (activeTab === 'users') fetchUsers();
                if (activeTab === 'transactions') fetchTransactions();
              }}
              className="admin-refresh-btn"
              title="تازه‌سازی اطلاعات"
            >
              🔄 به‌روزرسانی
            </button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="admin-tabs" aria-label="بخش‌های پنل مدیریت">
          <button
            className={`admin-tab ${activeTab === 'dashboard' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 داشبورد و آمار
          </button>
          <button
            className={`admin-tab ${activeTab === 'orders' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 سفارشات
            {stats?.pendingOrders > 0 && (
              <span className="tab-badge badge-alert">{toPersianDigits(stats.pendingOrders)}</span>
            )}
          </button>
          <button
            className={`admin-tab ${activeTab === 'users' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 کاربران و اعضا
            {stats?.totalUsers > 0 && (
              <span className="tab-badge">{toPersianDigits(stats.totalUsers)}</span>
            )}
          </button>
          <button
            className={`admin-tab ${activeTab === 'transactions' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            📜 تراکنش‌ها و امتیازات
          </button>
          <button
            className={`admin-tab ${activeTab === 'new_order' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('new_order')}
          >
            ➕ ثبت سفارش دستی
          </button>
        </nav>

        {/* Tab 1: Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            {loading && !stats ? (
              <Loader minHeight="40vh" />
            ) : (
              <>
                <div className="admin-stats-grid">
                  <div className="stat-card">
                    <div className="stat-card-title">
                      <span>کل سفارشات</span>
                      <span>📦</span>
                    </div>
                    <div className="stat-card-val">{toPersianDigits(stats?.totalOrders || 0)}</div>
                    <div className="stat-card-sub">
                      {stats?.pendingOrders > 0
                        ? `${toPersianDigits(stats.pendingOrders)} سفارش در انتظار تأیید`
                        : 'همه سفارش‌ها رسیدگی شده'}
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-card-title">
                      <span>مجموع فروش</span>
                      <span>💰</span>
                    </div>
                    <div className="stat-card-val">{formatToman(stats?.totalRevenue || 0)}</div>
                    <div className="stat-card-sub">سفارشات قطعی کارگاه</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-card-title">
                      <span>کاربران و اعضا</span>
                      <span>👥</span>
                    </div>
                    <div className="stat-card-val">{toPersianDigits(stats?.totalUsers || 0)}</div>
                    <div className="stat-card-sub">{toPersianDigits(stats?.totalCheckins || 0)} ثبت حضور روزانه</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-card-title">
                      <span>امتیازات در گردش</span>
                      <span>⭐</span>
                    </div>
                    <div className="stat-card-val">{formatNumber(stats?.totalPoints || 0)}</div>
                    <div className="stat-card-sub">موجودی باشگاه مشتریان</div>
                  </div>
                </div>

                {/* Quick Tables: Recent Orders & Recent Users */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                  <div className="admin-table-wrap">
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>آخرین سفارشات</h3>
                      <button className="admin-btn-sm" onClick={() => setActiveTab('orders')}>مشاهده همه</button>
                    </div>
                    <table className="admin-table">
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
                                <span className={`status-pill ${STATUS_LABELS[ord.status]?.class || ''}`}>
                                  {STATUS_LABELS[ord.status]?.label || ord.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan="4" style={{ textAlign: 'center', padding: '1.5rem' }}>سفارشی ثبت نشده است.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="admin-table-wrap">
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>کاربران جدید</h3>
                      <button className="admin-btn-sm" onClick={() => setActiveTab('users')}>مشاهده همه</button>
                    </div>
                    <table className="admin-table">
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
                                <span className={`status-pill ${u.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                                  {u.role === 'admin' ? 'مدیر' : 'کاربر'}
                                </span>
                              </td>
                              <td>{toPersianDigits(u.points_balance)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan="4" style={{ textAlign: 'center', padding: '1.5rem' }}>کاربری یافت نشد.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 2: Orders */}
        {activeTab === 'orders' && (
          <div>
            <div className="admin-toolbar">
              <div className="admin-search-wrap">
                <input
                  type="text"
                  placeholder="جستجو با شماره سفارش، نام خریدار یا تلفن…"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
                  className="admin-search-input"
                />
                <button className="admin-btn-sm admin-btn-accent" onClick={fetchOrders}>جستجو</button>
              </div>

              <div className="admin-filters">
                <label className="admin-form-label" style={{ whiteSpace: 'nowrap' }}>وضعیت:</label>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => { setOrderStatusFilter(e.target.value); setOrdersPage(1); }}
                  className="admin-select"
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
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>شماره سفارش</th>
                        <th>مشتری</th>
                        <th>تماس</th>
                        <th>اقلام</th>
                        <th>مبلغ نهایی</th>
                        <th>پرداخت</th>
                        <th>وضعیت سفارش</th>
                        <th>عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length ? (
                        orders.map(ord => (
                          <tr key={ord.id}>
                            <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{ord.order_number}</td>
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
                              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                                {ord.items?.length
                                  ? ord.items.map(it => `${it.product_name} (${toPersianDigits(it.quantity)})`).join('، ')
                                  : '—'}
                              </span>
                            </td>
                            <td style={{ fontWeight: 700 }}>{formatToman(ord.final_amount)}</td>
                            <td>
                              <span className={`status-pill ${PAYMENT_LABELS[ord.payment_status]?.class || ''}`}>
                                {PAYMENT_LABELS[ord.payment_status]?.label || ord.payment_status}
                              </span>
                            </td>
                            <td>
                              <span className={`status-pill ${STATUS_LABELS[ord.status]?.class || ''}`}>
                                {STATUS_LABELS[ord.status]?.label || ord.status}
                              </span>
                            </td>
                            <td>
                              <div className="admin-actions-cell">
                                <button className="admin-btn-sm" onClick={() => setSelectedOrder(ord)}>
                                  جزئیات و ویرایش
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                            سفارشی با این مشخصات یافت نشد.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {ordersTotal > 15 && (
                  <div className="admin-pagination">
                    <button
                      className="admin-page-btn"
                      disabled={ordersPage <= 1}
                      onClick={() => setOrdersPage(p => Math.max(1, p - 1))}
                    >
                      قبلی
                    </button>
                    <span>صفحه {toPersianDigits(ordersPage)} از {toPersianDigits(Math.ceil(ordersTotal / 15))}</span>
                    <button
                      className="admin-page-btn"
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

        {/* Tab 3: Users */}
        {activeTab === 'users' && (
          <div>
            <div className="admin-toolbar">
              <div className="admin-search-wrap">
                <input
                  type="text"
                  placeholder="جستجو با نام، ایمیل یا شماره تماس…"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                  className="admin-search-input"
                />
                <button className="admin-btn-sm admin-btn-accent" onClick={fetchUsers}>جستجو</button>
              </div>
            </div>

            {loading ? (
              <Loader minHeight="30vh" />
            ) : (
              <>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>شناسه</th>
                        <th>نام کاربر</th>
                        <th>ایمیل</th>
                        <th>شماره تماس</th>
                        <th>نقش</th>
                        <th>وضعیت</th>
                        <th>امتیازات</th>
                        <th>زنجیره</th>
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
                              <span className={`status-pill ${u.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                                {u.role === 'admin' ? 'مدیر کل' : 'کاربر'}
                              </span>
                            </td>
                            <td>
                              <span className={u.status === 'active' ? 'status-active' : 'status-banned'}>
                                {u.status === 'active' ? '● فعال' : '■ مسدود'}
                              </span>
                            </td>
                            <td><strong>{toPersianDigits(u.points_balance)}</strong></td>
                            <td>{toPersianDigits(u.current_streak)} روز</td>
                            <td>
                              <div className="admin-actions-cell">
                                <button
                                  className="admin-btn-sm"
                                  onClick={() => { setSelectedUserForPoints(u); setPointsDelta(''); setPointsReason(''); }}
                                  title="افزایش یا کسر امتیاز"
                                >
                                  ⭐ امتیاز
                                </button>
                                {u.id !== user?.id && (
                                  <>
                                    <button
                                      className="admin-btn-sm"
                                      onClick={() => handleToggleUserRole(u)}
                                      title="تغییر سطح دسترسی"
                                    >
                                      {u.role === 'admin' ? 'تبدیل به کاربر' : 'ارتقا به مدیر'}
                                    </button>
                                    <button
                                      className={`admin-btn-sm ${u.status === 'active' ? 'admin-btn-danger' : ''}`}
                                      onClick={() => handleToggleUserStatus(u)}
                                    >
                                      {u.status === 'active' ? 'مسدودسازی' : 'فعال‌سازی'}
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>
                            کاربری با این مشخصات یافت نشد.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {usersTotal > 15 && (
                  <div className="admin-pagination">
                    <button
                      className="admin-page-btn"
                      disabled={usersPage <= 1}
                      onClick={() => setUsersPage(p => Math.max(1, p - 1))}
                    >
                      قبلی
                    </button>
                    <span>صفحه {toPersianDigits(usersPage)} از {toPersianDigits(Math.ceil(usersTotal / 15))}</span>
                    <button
                      className="admin-page-btn"
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

        {/* Tab 4: Transactions */}
        {activeTab === 'transactions' && (
          <div>
            <div className="admin-toolbar">
              <div className="admin-filters">
                <label className="admin-form-label">نوع تراکنش:</label>
                <select
                  value={txReasonFilter}
                  onChange={(e) => { setTxReasonFilter(e.target.value); setTxPage(1); }}
                  className="admin-select"
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
              <div className="admin-table-wrap">
                <table className="admin-table">
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
                          <td><strong>{tx.display_name}</strong> <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>({tx.email})</span></td>
                          <td>{REASON_LABELS[tx.reason] || tx.reason}</td>
                          <td style={{ fontWeight: 700, color: tx.delta > 0 ? '#16a34a' : '#dc2626' }}>
                            {tx.delta > 0 ? `+${toPersianDigits(tx.delta)}` : toPersianDigits(tx.delta)}
                          </td>
                          <td>{toPersianDigits(tx.balance_after)}</td>
                          <td dir="ltr" style={{ textAlign: 'right' }}>{tx.created_at}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
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

        {/* Tab 5: Manual Order Creation */}
        {activeTab === 'new_order' && (
          <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--color-surface)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>
              ثبت دستی سفارش جدید (تلفنی / حضوری / کافه)
            </h2>
            <form onSubmit={handleCreateOrderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">نام و نام خانوادگی خریدار *</label>
                  <input
                    type="text"
                    required
                    value={newOrder.customerName}
                    onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                    className="admin-form-input"
                    placeholder="مثال: محمد امینی"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">شماره تماس مشتری *</label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={newOrder.customerPhone}
                    onChange={(e) => setNewOrder({ ...newOrder, customerPhone: e.target.value })}
                    className="admin-form-input"
                    placeholder="0912..."
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">آدرس تحویل</label>
                <textarea
                  rows={2}
                  value={newOrder.customerAddress}
                  onChange={(e) => setNewOrder({ ...newOrder, customerAddress: e.target.value })}
                  className="admin-form-textarea"
                  placeholder="تهران، خیابان..."
                />
              </div>

              {/* Order Items */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', padding: '1rem', background: 'var(--color-bg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label className="admin-form-label" style={{ fontWeight: 700 }}>اقلام سفارش</label>
                  <button type="button" onClick={addItemToNewOrder} className="admin-btn-sm admin-btn-accent">
                    + افزودن محصول
                  </button>
                </div>

                {newOrder.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <select
                      value={item.productSlug}
                      onChange={(e) => updateNewOrderItem(idx, 'productSlug', e.target.value)}
                      className="admin-form-select"
                    >
                      {products.map(p => (
                        <option key={p.slug} value={p.slug}>{p.name} ({formatToman(p.price)})</option>
                      ))}
                    </select>

                    <select
                      value={item.grind}
                      onChange={(e) => updateNewOrderItem(idx, 'grind', e.target.value)}
                      className="admin-form-select"
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
                      className="admin-form-input"
                      title="تعداد / کیلو"
                    />

                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateNewOrderItem(idx, 'unitPrice', parseInt(e.target.value, 10) || 0)}
                      className="admin-form-input"
                      title="قیمت واحد (تومان)"
                    />

                    {newOrder.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItemFromNewOrder(idx)}
                        className="admin-btn-sm admin-btn-danger"
                        title="حذف سطر"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                <div style={{ textAlign: 'left', marginTop: '0.5rem', fontWeight: 800, color: 'var(--color-accent)' }}>
                  جمع فاکتور: {formatToman(newOrderTotalPrice)}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">وضعیت پرداخت</label>
                  <select
                    value={newOrder.paymentStatus}
                    onChange={(e) => setNewOrder({ ...newOrder, paymentStatus: e.target.value })}
                    className="admin-form-select"
                  >
                    <option value="paid">پرداخت شده (کارت به کارت/نقدی)</option>
                    <option value="unpaid">در انتظار پرداخت</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">روش سفارش</label>
                  <select
                    value={newOrder.paymentMethod}
                    onChange={(e) => setNewOrder({ ...newOrder, paymentMethod: e.target.value })}
                    className="admin-form-select"
                  >
                    <option value="phone">سفارش تلفنی کارگاه</option>
                    <option value="whatsapp">واتساپ</option>
                    <option value="telegram">تلگرام</option>
                    <option value="in_person">حضوری کارگاه</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">یادداشت مدیر</label>
                <textarea
                  rows={2}
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                  className="admin-form-textarea"
                  placeholder="توضیحات رست یا بسته بندی اختصاصی..."
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                {actionLoading ? 'در حال ثبت…' : 'ثبت قطعی سفارش'}
              </button>
            </form>
          </div>
        )}

        {/* Modal: Order Details & Status Update */}
        {selectedOrder && (
          <div className="admin-modal-backdrop" onClick={() => setSelectedOrder(null)}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h3 className="admin-modal-title">جزئیات سفارش {selectedOrder.order_number}</h3>
                <button className="admin-modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
              </div>
              <div className="admin-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>نام خریدار:</span>
                    <div><strong>{selectedOrder.customer_name}</strong></div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>شماره تماس:</span>
                    <div dir="ltr" style={{ textAlign: 'right' }}><strong>{selectedOrder.customer_phone}</strong></div>
                  </div>
                </div>

                {selectedOrder.customer_address && (
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>آدرس تحویل:</span>
                    <div style={{ background: 'var(--color-bg)', padding: '0.75rem', borderRadius: '8px', marginTop: '0.25rem' }}>
                      {selectedOrder.customer_address}
                    </div>
                  </div>
                )}

                {/* Items */}
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>اقلام سفارش:</span>
                  <div style={{ marginTop: '0.4rem', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
                    <table className="admin-table">
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

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(200, 141, 78, 0.08)', borderRadius: '8px', fontWeight: 800 }}>
                  <span>مبلغ قابل پرداخت فاکتور:</span>
                  <span style={{ color: 'var(--color-accent)' }}>{formatToman(selectedOrder.final_amount)}</span>
                </div>

                {/* Status changers */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">وضعیت سفارش:</label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value, null)}
                      className="admin-form-select"
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

                  <div className="admin-form-group">
                    <label className="admin-form-label">وضعیت پرداخت:</label>
                    <select
                      value={selectedOrder.payment_status}
                      onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, null, e.target.value)}
                      className="admin-form-select"
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
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>یادداشت:</span>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.88rem' }}>{selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              <div className="admin-modal-footer">
                <button className="admin-btn-sm" onClick={() => setSelectedOrder(null)}>بستن</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Adjust User Points */}
        {selectedUserForPoints && (
          <div className="admin-modal-backdrop" onClick={() => setSelectedUserForPoints(null)}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h3 className="admin-modal-title">تنظیم امتیاز کاربر</h3>
                <button className="admin-modal-close" onClick={() => setSelectedUserForPoints(null)}>✕</button>
              </div>
              <form onSubmit={handleAdjustPointsSubmit}>
                <div className="admin-modal-body">
                  <p>
                    کاربر: <strong>{selectedUserForPoints.display_name}</strong> ({selectedUserForPoints.email})
                    <br />
                    موجودی فعلی: <strong>{toPersianDigits(selectedUserForPoints.points_balance)} امتیاز</strong>
                  </p>

                  <div className="admin-form-group">
                    <label className="admin-form-label">مقدار تغییر امتیاز (مثبت برای افزایش، منفی برای کسر):</label>
                    <input
                      type="number"
                      required
                      placeholder="مثال: 50 یا -20"
                      value={pointsDelta}
                      onChange={(e) => setPointsDelta(e.target.value)}
                      className="admin-form-input"
                      dir="ltr"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">دلیل تغییر امتیاز:</label>
                    <input
                      type="text"
                      placeholder="مثال: پاداش خرید عمده / اصلاح خطا"
                      value={pointsReason}
                      onChange={(e) => setPointsReason(e.target.value)}
                      className="admin-form-input"
                    />
                  </div>
                </div>

                <div className="admin-modal-footer">
                  <button type="button" className="admin-btn-sm" onClick={() => setSelectedUserForPoints(null)}>انصراف</button>
                  <button type="submit" disabled={actionLoading} className="admin-btn-sm admin-btn-accent">
                    {actionLoading ? 'در حال ثبت…' : 'اعمال تغییر امتیاز'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
