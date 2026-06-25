// Product catalog. Prices are NUMBERS (toman) so the cart can do math;
// display formatting happens via utils/format.js → formatToman().
// To add/edit products, just edit this array.

export const products = [
  // ---------------- دانه‌های قهوه (beans) ----------------
  {
    id: 1,
    slug: 'espresso-signature-blend',
    name: 'قهوه اسپرسو ترکیب ویژه',
    price: 350000,
    category: 'beans',
    image: '/images/photo-1559525839-500.webp',
    gallery: ['/images/photo-1559525839-500.webp', '/images/photo-1498804103079-500.webp'],
    badge: 'پرفروش',
    roast: 'مدیوم',
    origin: 'ترکیب عربیکا و روبوستا',
    notes: ['شکلات تلخ', 'کارامل', 'فندق'],
    description:
      'ترکیب امضای کیپ کافی برای عاشقان اسپرسوی کلاسیک؛ شاتی پربدنه با کرمای غنی و طعم‌یادهای شکلات تلخ و فندق. ایده‌آل برای دستگاه‌های اسپرسوساز خانگی و حرفه‌ای.',
  },
  {
    id: 2,
    slug: 'colombia-single-origin',
    name: 'قهوه کلمبیا سینگل اوریجین',
    price: 420000,
    category: 'beans',
    image: '/images/photo-1514432324607-500.webp',
    gallery: ['/images/photo-1514432324607-500.webp', '/images/photo-1497935586351-800.webp'],
    roast: 'لایت',
    origin: 'کلمبیا - هویلا',
    notes: ['مرکبات', 'گل یاس', 'عسل'],
    description:
      'قهوه‌ای شفاف و سرزنده از ارتفاعات کلمبیا با اسیدیته‌ی دلنشین مرکباتی و پایانه‌ای شیرین. انتخابی عالی برای روش‌های دمی مثل V60 و کمکس.',
  },
  {
    id: 3,
    slug: 'brazil-santos',
    name: 'قهوه برزیل سانتوس',
    price: 380000,
    category: 'beans',
    image: '/images/photo-1541167760496-500.webp',
    gallery: ['/images/photo-1541167760496-500.webp'],
    roast: 'مدیوم',
    origin: 'برزیل - سانتوس',
    notes: ['بادام', 'شکلات شیری', 'کارامل'],
    description:
      'یک قهوه‌ی متعادل و دوست‌داشتنی برای هر روز؛ بدنه‌ی متوسط، شیرینی آجیلی و اسیدیته‌ی ملایم که آن را به انتخابی بی‌خطر برای همه‌ی ذائقه‌ها تبدیل می‌کند.',
  },
  {
    id: 4,
    slug: 'ethiopia-yirgacheffe',
    name: 'قهوه اتیوپی یرگاچف',
    price: 450000,
    category: 'beans',
    image: '/images/photo-1498804103079-500.webp',
    gallery: ['/images/photo-1498804103079-500.webp'],
    badge: 'ویژه',
    roast: 'لایت',
    origin: 'اتیوپی - یرگاچف',
    notes: ['شکوفه یاس', 'لیمو', 'چای سیاه'],
    description:
      'نگین قهوه‌های آفریقایی؛ عطری گل‌مانند، اسیدیته‌ی روشن و طعمی چای‌گونه. تجربه‌ای متفاوت برای کسانی که دنبال قهوه‌ای خاص و معطر هستند.',
  },
  {
    id: 5,
    slug: 'classic-arabica-blend',
    name: 'ترکیب عربیکا کلاسیک',
    price: 360000,
    category: 'beans',
    image: '/images/photo-1497935586351-500.webp',
    gallery: ['/images/photo-1497935586351-500.webp'],
    roast: 'مدیوم-دارک',
    origin: 'ترکیب چند خاستگاه',
    notes: ['شکلات تلخ', 'کاکائو', 'فندق'],
    description:
      'ترکیبی گرم و شکلاتی از بهترین عربیکاها؛ برای لحظاتی که به یک فنجان پر و دلگرم‌کننده نیاز دارید. هم برای اسپرسو و هم برای موکاپات عالی است.',
  },
  {
    id: 6,
    slug: 'dark-robusta',
    name: 'قهوه دارک روبوستا',
    price: 320000,
    category: 'beans',
    image: '/images/photo-1509042239860-500.webp',
    gallery: ['/images/photo-1509042239860-500.webp'],
    roast: 'دارک',
    origin: '۱۰۰٪ روبوستا',
    notes: ['دود', 'شکلات تلخ', 'ادویه'],
    description:
      'قوی، دودی و بی‌پروا؛ مخصوص عاشقان اسپرسوی غلیظ و کافئین بالا. کرمای فراوان و بدنه‌ی سنگین، یک بیدارباش واقعی برای صبح‌ها.',
  },

  // ---------------- تجهیزات دم‌آوری (equipment) ----------------
  {
    id: 7,
    slug: 'bialetti-moka-3cup',
    name: 'موکاپات بیالتی ۳ کاپ',
    price: 1200000,
    category: 'equipment',
    image: '/images/photo-1544787219-500.webp',
    gallery: ['/images/photo-1544787219-500.webp'],
    badge: 'جدید',
    origin: 'ساخت ایتالیا',
    notes: [],
    description:
      'موکاپات کلاسیک ایتالیایی برای تهیه‌ی قهوه‌ای غلیظ و پربدنه روی اجاق. ساخته‌شده از آلومینیوم مرغوب با ظرفیت ۳ فنجان؛ ساده، بادوام و همیشه دوست‌داشتنی.',
  },
  {
    id: 8,
    slug: 'v60-dripper',
    name: 'دریپر V60 سرامیکی',
    price: 280000,
    category: 'equipment',
    image: '/images/photo-1447933601403-500.webp',
    gallery: ['/images/photo-1447933601403-500.webp'],
    origin: 'سرامیک مرغوب',
    notes: [],
    description:
      'ابزار محبوب قهوه‌های دمی برای استخراجی شفاف و کنترل‌شده. شیارهای مارپیچ و حفره‌ی بزرگ، جریان آب را یکنواخت می‌کنند تا بهترین طعم دانه آزاد شود.',
  },
  {
    id: 9,
    slug: 'french-press',
    name: 'فرنچ پرس شیشه‌ای',
    price: 450000,
    category: 'equipment',
    image: '/images/photo-1559056199-500.webp',
    gallery: ['/images/photo-1559056199-500.webp'],
    origin: 'بوروسیلیکات',
    notes: [],
    description:
      'ساده‌ترین راه برای یک فنجان قهوه‌ی پربدنه؛ بدون نیاز به کاغذ فیلتر. بدنه‌ی شیشه‌ی مقاوم در برابر حرارت و پیستون فولادی ضدزنگ.',
  },
  {
    id: 10,
    slug: 'manual-grinder',
    name: 'آسیاب دستی قهوه',
    price: 950000,
    category: 'equipment',
    image: '/images/photo-1572442388796-500.webp',
    gallery: ['/images/photo-1572442388796-500.webp'],
    badge: 'پرفروش',
    origin: 'تیغه‌ی سرامیکی',
    notes: [],
    description:
      'آسیاب دستی با تیغه‌ی سرامیکی و درجه‌بندی دقیق؛ از پودر ریز اسپرسو تا درشتِ فرنچ‌پرس. بی‌صدا، قابل حمل و ایده‌آل برای تازه آسیاب کردن دانه‌ها.',
  },

  // ---------------- لوازم جانبی (accessories) ----------------
  {
    id: 11,
    slug: 'digital-scale',
    name: 'ترازو دیجیتال قهوه',
    price: 850000,
    category: 'accessories',
    image: '/images/photo-1620189507195-500.webp',
    gallery: ['/images/photo-1620189507195-500.webp'],
    origin: 'دقت ۰.۱ گرم',
    notes: [],
    description:
      'ترازوی دقیق با تایمر داخلی و دقت ۰.۱ گرم؛ ابزاری ضروری برای دم‌آوری حرفه‌ای و تکرارپذیر. صفحه‌ی نمایش روشن و بدنه‌ی مقاوم به آب.',
  },
  {
    id: 12,
    slug: 'gooseneck-kettle',
    name: 'کتری گردن‌غازی',
    price: 680000,
    category: 'accessories',
    image: '/images/photo-1511920170033-800.webp',
    gallery: ['/images/photo-1511920170033-800.webp'],
    badge: 'جدید',
    origin: 'استیل ضدزنگ',
    notes: [],
    description:
      'کتری گردن‌غازی برای کنترل کامل جریان آب هنگام دم‌آوری دستی. دهانه‌ی باریک، ریختن آب را دقیق و یکنواخت می‌کند؛ مناسب V60، کمکس و چمکس.',
  },
];

export function getProduct(slug) {
  return products.find((p) => p.slug === slug);
}

export function getRelated(slug, count = 4) {
  const current = getProduct(slug);
  if (!current) return products.slice(0, count);
  return products
    .filter((p) => p.category === current.category && p.slug !== slug)
    .slice(0, count);
}
