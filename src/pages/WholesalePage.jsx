import React, { Suspense, lazy } from 'react';
import { Truck, Package, BadgePercent, Headset } from '../components/Icons';
import SEO from '../components/SEO';
import { links } from '../data/site';
import './WholesalePage.css';

const WholesaleBanner = lazy(() => import('../components/WholesaleBanner'));

const benefits = [
  { icon: BadgePercent, title: 'قیمت ویژه همکاری', desc: 'تعرفه‌های پلکانی و رقابتی برای کافه‌ها و فروشگاه‌ها.' },
  { icon: Package, title: 'برشت سفارشی', desc: 'پروفایل برشت اختصاصی متناسب با منوی شما.' },
  { icon: Truck, title: 'ارسال منظم', desc: 'تأمین پایدار و ارسال دوره‌ای بدون دغدغه.' },
  { icon: Headset, title: 'پشتیبانی تخصصی', desc: 'مشاوره کالیبراسیون و آموزش باریستا برای تیم شما.' },
];

export default function WholesalePage() {
  return (
    <div className="page">
      <SEO title="فروش عمده و همکاری" path="/wholesale" description="همکاری عمده با کیپ کافی برای کافه‌ها، رستوران‌ها و فروشگاه‌ها؛ قیمت ویژه و برشت سفارشی." />

      <div className="page-hero">
        <div className="container">
          <h1>همکاری عمده با کیپ کافی</h1>
          <p>قهوه‌ی باکیفیت و تأمین پایدار برای کسب‌وکار شما.</p>
        </div>
      </div>

      <div className="container section-pad">
        <div className="wholesale-benefits">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="wholesale-benefit">
                <span className="wb-icon"><Icon size={26} /></span>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="wholesale-cta">
          <h2>آماده‌ی شروع همکاری هستید؟</h2>
          <p>برای دریافت لیست قیمت عمده و مشاوره، همین حالا با ما در تماس باشید.</p>
          <a href={links.whatsapp('سلام، برای همکاری عمده و دریافت لیست قیمت تماس گرفتم.')} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
            درخواست لیست قیمت
          </a>
        </div>
      </div>

      <Suspense fallback={null}>
        <WholesaleBanner />
      </Suspense>
    </div>
  );
}
