import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Send, Phone, Check, Coffee, Truck, WhatsApp, Telegram, ArrowLeft } from '../components/Icons';
import SEO from '../components/SEO';
import { useCart } from '../context/CartContext';
import { api } from '../api';
import { formatToman, toPersianDigits } from '../utils/format';
import { site, links } from '../data/site';
import './CartPage.css';

function buildOrderText(items, subtotal, customer = {}) {
  const lines = items.map(
    (i) => `• ${i.name}${i.grindLabel ? ` [آسیاب: ${i.grindLabel}]` : ''} × ${toPersianDigits(i.qty)} — ${formatToman(i.lineTotal)}`
  );

  const customerDetails = [];
  if (customer.name?.trim()) customerDetails.push(`👤 نام سفارش‌دهنده: ${customer.name.trim()}`);
  if (customer.phone?.trim()) customerDetails.push(`📞 شماره تماس: ${customer.phone.trim()}`);
  if (customer.address?.trim()) customerDetails.push(`📍 آدرس تحویل: ${customer.address.trim()}`);

  return [
    'سلام و درود، سفارش جدید از وب‌سایت کیپ کافی:',
    '',
    ...(customerDetails.length > 0 ? [...customerDetails, '------------------------------'] : []),
    'اقلام سفارش:',
    ...lines,
    '',
    `مبلغ کل فاکتور: ${formatToman(subtotal)}`,
    '',
    'لطفاً جهت تأیید و هماهنگی ارسال راهنمایی بفرمایید.'
  ].join('\n');
}

export default function CartPage() {
  const { detailedItems, subtotal, count, updateQty, removeItem, clear } = useCart();
  
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const orderText = buildOrderText(detailedItems, subtotal, customer);

  const handleCheckoutClick = (method) => {
    try {
      api.post('/orders/checkout', {
        customerName: customer.name || 'مشتری وب‌سایت',
        customerPhone: customer.phone || '09000000000',
        customerAddress: customer.address || '',
        paymentMethod: method,
        items: detailedItems.map((i) => ({
          slug: i.slug,
          name: i.name,
          grind: i.grindLabel || null,
          qty: i.qty,
          price: i.price,
        }))
      }).catch(() => {});
    } catch {}
  };

  const breadcrumbs = [
    { name: 'خانه', url: '/' },
    { name: 'سبد خرید', url: '/cart' }
  ];

  return (
    <div className="page">
      <SEO 
        title="سبد خرید" 
        path="/cart" 
        description="سبد خرید دانه قهوه و تجهیزات برشته‌کاری کیپ کافی با امکان ارسال سریع به سراسر ایران."
        breadcrumbs={breadcrumbs}
      />

      <div className="page-hero">
        <div className="container">
          <h1>سبد خرید شما</h1>
          <p>{count > 0 ? `${toPersianDigits(count)} ردیف کالا آماده ارسال مستقیم از کارگاه` : 'سبد خرید شما در حال حاضر خالی است'}</p>
        </div>
      </div>

      <div className="container cart-wrap">
        {detailedItems.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon"><Coffee size={52} strokeWidth={1.5} /></div>
            <p>هنوز محصولی به سبد خرید خود اضافه نکرده‌اید.</p>
            <Link to="/shop" className="btn btn-primary btn-lg">مشاهده کاتالوگ قهوه‌ها</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {detailedItems.map((item) => (
                <div key={item.cartKey} className="cart-row">
                  <Link to={`/product/${item.slug}`} className="cart-thumb">
                    <img src={item.image} alt={item.name} />
                  </Link>
                  <div className="cart-row-main">
                    <Link to={`/product/${item.slug}`} className="cart-name">{item.name}</Link>
                    {item.grindLabel && (
                      <span className="cart-grind-tag">آسیاب: {item.grindLabel}</span>
                    )}
                    <span className="cart-unit">{formatToman(item.price)}</span>
                  </div>
                  <div className="qty-stepper" role="group" aria-label="تعداد">
                    <button onClick={() => updateQty(item.cartKey, item.qty - 1)} aria-label="کاهش">−</button>
                    <span>{toPersianDigits(item.qty)}</span>
                    <button onClick={() => updateQty(item.cartKey, item.qty + 1)} aria-label="افزایش">+</button>
                  </div>
                  <span className="cart-line-total">{formatToman(item.lineTotal)}</span>
                  <button className="cart-remove" onClick={() => removeItem(item.cartKey)} aria-label={`حذف ${item.name}`}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button className="cart-clear" onClick={clear}>خالی کردن کامل سبد</button>
            </div>

            <aside className="cart-summary">
              <h2>خلاصه پیش‌فاکتور</h2>
              <div className="summary-row">
                <span>تعداد کل بسته‌ها</span>
                <span>{toPersianDigits(count)} عدد</span>
              </div>
              <div className="summary-row summary-total">
                <span>مبلغ کل سفارش</span>
                <span className="total-gold-price">{formatToman(subtotal)}</span>
              </div>

              <div className="cart-shipping-banner">
                <span className="shipping-icon"><Truck size={20} /></span>
                <span>ارسال رایگان در تمامی مناطق تهران برای سفارش‌های بالای ۲۰ کیلوگرم</span>
              </div>

              {/* Fast Checkout Customer Inputs */}
              <div className="cart-customer-box">
                <h4 className="customer-box-title">مشخصات تحویل‌گیرنده (اختیاری):</h4>
                <div className="customer-inputs-grid">
                  <input
                    type="text"
                    placeholder="نام و نام خانوادگی"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="customer-field"
                  />
                  <input
                    type="tel"
                    placeholder="شماره تماس (جهت هماهنگی پیک)"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="customer-field"
                    dir="ltr"
                  />
                  <textarea
                    placeholder="آدرس دقیق محل تحویل در تهران یا شهرستان"
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="customer-field customer-textarea"
                    rows={2}
                  />
                </div>
              </div>

              <div className="cart-actions-group">
                <a
                  href={links.whatsapp(orderText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleCheckoutClick('whatsapp')}
                  className="btn btn-primary btn-lg cart-checkout btn-whatsapp"
                >
                  <WhatsApp size={20} /> ارسال پیش‌فاکتور به واتساپ سفارشات
                </a>
                <a
                  href={links.telegramShare(orderText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleCheckoutClick('telegram')}
                  className="btn btn-outline btn-lg cart-checkout btn-telegram"
                >
                  <Telegram size={20} /> ارسال پیش‌فاکتور در تلگرام
                </a>
              </div>

              <div className="cart-assistance-note">
                <span>سفارش شما بلافاصله در کارگاه با دانه‌های تازه برشت آماده و با پیک اختصاصی ارسال می‌شود.</span>
              </div>

              <Link to="/shop" className="cart-continue" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <ArrowLeft size={16} /> ادامه خرید و افزودن محصول دیگر
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
