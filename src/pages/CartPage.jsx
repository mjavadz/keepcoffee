import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Send } from '../components/Icons';
import SEO from '../components/SEO';
import { useCart } from '../context/CartContext';
import { formatToman, toPersianDigits } from '../utils/format';
import { links } from '../data/site';
import './CartPage.css';

function buildOrderText(items, subtotal) {
  const lines = items.map(
    (i) => `• ${i.name} × ${toPersianDigits(i.qty)} — ${formatToman(i.lineTotal)}`
  );
  return [
    'سلام، می‌خواهم این سفارش را ثبت کنم:',
    '',
    ...lines,
    '',
    `جمع کل: ${formatToman(subtotal)}`,
  ].join('\n');
}

export default function CartPage() {
  const { detailedItems, subtotal, count, updateQty, removeItem, clear } = useCart();

  const orderText = buildOrderText(detailedItems, subtotal);

  return (
    <div className="page">
      <SEO title="سبد خرید" path="/cart" description="سبد خرید شما در کیپ کافی." />

      <div className="page-hero">
        <div className="container">
          <h1>سبد خرید</h1>
          <p>{count > 0 ? `${toPersianDigits(count)} کالا در سبد شما` : 'سبد خرید شما خالی است'}</p>
        </div>
      </div>

      <div className="container cart-wrap">
        {detailedItems.length === 0 ? (
          <div className="cart-empty">
            <p>هنوز محصولی به سبد اضافه نکرده‌اید.</p>
            <Link to="/shop" className="btn btn-primary btn-lg">رفتن به فروشگاه</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {detailedItems.map((item) => (
                <div key={item.slug} className="cart-row">
                  <Link to={`/product/${item.slug}`} className="cart-thumb">
                    <img src={item.image} alt={item.name} />
                  </Link>
                  <div className="cart-row-main">
                    <Link to={`/product/${item.slug}`} className="cart-name">{item.name}</Link>
                    <span className="cart-unit">{formatToman(item.price)}</span>
                  </div>
                  <div className="qty-stepper" role="group" aria-label="تعداد">
                    <button onClick={() => updateQty(item.slug, item.qty - 1)} aria-label="کاهش">−</button>
                    <span>{toPersianDigits(item.qty)}</span>
                    <button onClick={() => updateQty(item.slug, item.qty + 1)} aria-label="افزایش">+</button>
                  </div>
                  <span className="cart-line-total">{formatToman(item.lineTotal)}</span>
                  <button className="cart-remove" onClick={() => removeItem(item.slug)} aria-label={`حذف ${item.name}`}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button className="cart-clear" onClick={clear}>خالی کردن سبد</button>
            </div>

            <aside className="cart-summary">
              <h2>خلاصه سفارش</h2>
              <div className="summary-row">
                <span>تعداد اقلام</span>
                <span>{toPersianDigits(count)}</span>
              </div>
              <div className="summary-row summary-total">
                <span>جمع کل</span>
                <span>{formatToman(subtotal)}</span>
              </div>
              <p className="summary-note">
                پرداخت آنلاین فعال نیست؛ سفارش خود را از طریق واتساپ یا تلگرام نهایی کنید و هماهنگی پرداخت و ارسال انجام می‌شود.
              </p>
              <a href={links.whatsapp(orderText)} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg cart-checkout">
                <Send size={18} /> ثبت سفارش در واتساپ
              </a>
              <a href={links.telegramShare(orderText)} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg cart-checkout">
                <Send size={18} /> ثبت سفارش در تلگرام
              </a>
              <Link to="/shop" className="cart-continue">← ادامه خرید</Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
