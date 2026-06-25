# کیپ کافی · Keep Coffee

فروشگاه آنلاین قهوه تخصصی — یک وب‌اپ چندصفحه‌ای فارسی/راست‌به‌چپ با تم روشن و تاریک.
A multi-page Persian/RTL specialty-coffee shop, built with React 19 + Vite.

🌐 Live: [keepc.ir](https://keepc.ir)

## ویژگی‌ها · Features

- صفحات: خانه، فروشگاه، جزئیات محصول، وبلاگ، نوشته، درباره ما، تماس، باشگاه مشتریان، عمده‌فروشی، سبد خرید، ۴۰۴
- تم روشن/تاریک/سیستمی
- سبد خرید با `localStorage` (بدون درگاه پرداخت — تسویه از طریق واتس‌اپ/تلگرام)
- کدِ صفحه‌ها به‌صورت route-level code-splitting بارگذاری می‌شود
- تصاویر WebP میزبانی‌شده روی خود سایت
- آیکون‌های SVG محلی (بدون وابستگی `lucide-react`)
- متا تگ‌های SEO و داده‌ساختاریافته‌ی JSON-LD

## پشته‌ی فنی · Tech stack

React 19 · Vite 8 · react-router-dom 7 · react-helmet-async

## اجرا به‌صورت محلی · Local development

```bash
npm install
npm run dev      # سرور توسعه روی http://localhost:5173
npm run lint     # بررسی ESLint
```

## ساخت نسخه‌ی تولید · Production build

```bash
npm run build    # خروجی در پوشه‌ی dist/
npm run preview  # پیش‌نمایش محلیِ خروجی build
```

## استقرار روی cPanel · Deploy (static, cPanel)

سایت کاملاً استاتیک است و بک‌اند ندارد.

1. `npm run build`
2. **محتوای داخل پوشه‌ی `dist/`** را (شاملِ `.htaccess`) zip کنید — نه خودِ پوشه را.
3. فایل zip را در `public_html` آپلود و extract کنید.

فایل `public/.htaccess` مسیر‌دهی SPA را انجام می‌دهد تا لینک‌های مستقیم (deep links) کار کنند.

## ساختار داده · Content data

محتوای کاتالوگ و وبلاگ در `src/data/` قرار دارد (`products.js`, `posts.js`, `categories.js`) و
اطلاعات تماس به‌صورت متمرکز در `src/data/site.js` است — این مقادیر را با اطلاعات واقعی جایگزین کنید.
