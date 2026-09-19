import React, { useState } from 'react';
import { Phone, MessageCircle, X, WhatsApp, Telegram } from './Icons';
import { site, links } from '../data/site';
import './FloatingContact.css';

export default function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className={`floating-contact-wrapper ${open ? 'is-open' : ''}`}>
      {open && (
        <div className="floating-contact-popover">
          <div className="floating-contact-header">
            <div className="contact-status-dot" aria-hidden="true" />
            <div className="header-info">
              <strong>پشتیبانی و مشاوره کارگاه</strong>
              <p>پاسخگویی ۹ صبح تا ۹ شب</p>
            </div>
            <button
              className="floating-close-btn"
              onClick={() => setOpen(false)}
              aria-label="بستن پنجره ارتباط"
            >
              <X size={16} />
            </button>
          </div>

          <div className="floating-contact-links">
            <a
              href={links.whatsapp('سلام، از وب‌سایت کیپ کافی پیام می‌دهم و نیاز به راهنمایی در مورد خرید قهوه دارم.')}
              target="_blank"
              rel="noopener noreferrer"
              className="floating-link-item whatsapp"
            >
              <div className="fli-icon"><WhatsApp size={20} /></div>
              <div className="fli-text">
                <span className="fli-title">چت در واتساپ کارگاه</span>
                <span className="fli-sub">پاسخگویی سریع و سفارش آنلاین</span>
              </div>
            </a>

            <a
              href={links.telRahimi()}
              className="floating-link-item phone"
            >
              <div className="fli-icon"><Phone size={18} /></div>
              <div className="fli-text">
                <span className="fli-title">تماس با مدیریت کارگاه</span>
                <span className="fli-sub">{site.phoneRahimi} (رحیمی)</span>
              </div>
            </a>

            <a
              href={links.telegram()}
              target="_blank"
              rel="noopener noreferrer"
              className="floating-link-item telegram"
            >
              <div className="fli-icon"><Telegram size={20} /></div>
              <div className="fli-text">
                <span className="fli-title">کانال تلگرام کارگاه</span>
                <span className="fli-sub">@keepcoffeeRoastery</span>
              </div>
            </a>
          </div>
        </div>
      )}

      <button
        className="floating-contact-trigger"
        onClick={() => setOpen(!open)}
        aria-label="ارتباط و مشاوره با کارگاه کیپ کافی"
        title="مشاوره و خرید سریع"
      >
        <span className="floating-pulse-ring" />
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        <span className="floating-trigger-label">مشاوره و خرید</span>
      </button>
    </div>
  );
}
