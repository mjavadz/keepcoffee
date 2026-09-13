// Product catalog for Keep Coffee Roastery
// Beans have active prices in Toman (per Kilogram)
// Equipment and accessories have price: null (inquiry only)

export const products = [
  // ---------------- دانه‌های قهوه و میکس‌های کارگاه (beans) ----------------
  {
    id: 1,
    slug: 'mix-100-robusta-classic',
    name: 'میکس ۱۰۰ روبوستا کلاسیک',
    price: 2200000,
    unit: 'کیلوگرم',
    category: 'beans',
    image: '/images/photo-1509042239860-500.webp',
    gallery: ['/images/photo-1509042239860-500.webp', '/images/photo-1559525839-500.webp'],
    badge: 'پرفروش',
    roast: 'دارک',
    origin: '۱۰۰٪ دانه‌های مرغوب روبوستا',
    notes: ['شکلات تلخ', 'کارامل سوخته', 'فندق'],
    description:
      'ترکیب کلاسیک و ۱۰۰٪ روبوستا با کرمای بسیار غلیظ، تلخی گیرا و کافئین فوق‌العاده بالا؛ یک بیدارباش انرژی‌بخش برای آغاز پرقدرت روز و ایده‌آل برای دستگاه‌های اسپرسوساز خانگی و صنعتی.',
  },
  {
    id: 2,
    slug: 'mix-100-robusta-premium',
    name: 'میکس ۱۰۰ روبوستا پرمیوم',
    price: 2380000,
    unit: 'کیلوگرم',
    category: 'beans',
    image: '/images/photo-1559525839-500.webp',
    gallery: ['/images/photo-1559525839-500.webp', '/images/photo-1509042239860-500.webp'],
    badge: 'ویژه',
    roast: 'مدیوم-دارک',
    origin: '۱۰۰٪ روبوستا سورت‌شده و دست‌چین',
    notes: ['کاکائو', 'گردو', 'پایپ چوبی'],
    description:
      'دست‌چینی اختصاصی از درشت‌ترین و مرغوب‌ترین دانه‌های روبوستا با بادی سنگین، کرمای ماندگار و طعم‌یادهای کاکائویی بدون زنندگی طعم؛ مناسب عاشقان اسپرسوی پرقدرت اما بااصالت.',
  },
  {
    id: 3,
    slug: 'mix-80-20-robusta',
    name: 'میکس ۸۰/۲۰ روبوستا',
    price: 2490000,
    unit: 'کیلوگرم',
    category: 'beans',
    image: '/images/photo-1497935586351-500.webp',
    gallery: ['/images/photo-1497935586351-500.webp', '/images/photo-1541167760496-500.webp'],
    badge: 'محبوب',
    roast: 'مدیوم',
    origin: '۸۰٪ روبوستا / ۲۰٪ عربیکا',
    notes: ['شکلات شیری', 'کارامل', 'فندق'],
    description:
      'فرمول طلایی و پرطرفدار کافه‌ای؛ ترکیب ۸۰ درصد روبوستای پرکافئین با ۲۰ درصد عربیکای معطر جهت ایجاد عطر دلنشین، بادی متوازن و کرمای مخملیِ ایده‌آل برای نوشیدنی‌های بر پایه شیر و لاته.',
  },
  {
    id: 4,
    slug: 'mix-70-30-robusta-classic',
    name: 'میکس ۷۰/۳۰ روبوستا کلاسیک',
    price: 2630000,
    unit: 'کیلوگرم',
    category: 'beans',
    image: '/images/photo-1541167760496-500.webp',
    gallery: ['/images/photo-1541167760496-500.webp', '/images/photo-1514432324607-500.webp'],
    badge: 'اقتصادی',
    roast: 'مدیوم',
    origin: '۷۰٪ روبوستا / ۳۰٪ عربیکا',
    notes: ['شکلات تلخ', 'بادام بوداده', 'عسل تیره'],
    description:
      'یکی از کلاسیک‌ترین ترکیب‌های اسپرسوی ایتالیایی با نسبت ۷۰ به ۳۰؛ تلخی جذاب و کنترل‌شده همراه با ۳۰ درصد عربیکای باکیفیت برای یک فنجان اسپرسوی متعادل، همه‌پسند و روان.',
  },
  {
    id: 5,
    slug: 'mix-70-30-robusta-premium',
    name: 'میکس ۷۰/۳۰ روبوستا پرمیوم',
    price: 2740000,
    unit: 'کیلوگرم',
    category: 'beans',
    image: '/images/photo-1514432324607-500.webp',
    gallery: ['/images/photo-1514432324607-500.webp', '/images/photo-1498804103079-500.webp'],
    badge: 'ممتاز',
    roast: 'مدیوم',
    origin: '۷۰٪ روبوستا اعلا / ۳۰٪ عربیکا تخصصی',
    notes: ['میوه خشک', 'شکلات تلخ', 'فندق بوداده'],
    description:
      'ترکیبی ممتاز از دانه‌های روبوستای باکیفیت و عربیکای شسته‌شده؛ طعم‌یادهای پیچیده شکلاتی و آجیلی با پس‌مزه ماندگار و شیرین که تجربه‌ای حرفه‌ای از قهوه روزمره برای کافه‌ها می‌سازد.',
  },
  {
    id: 6,
    slug: 'mix-50-50-premium',
    name: 'میکس ۵۰/۵۰ پرمیوم',
    price: 3200000,
    unit: 'کیلوگرم',
    category: 'beans',
    image: '/images/photo-1498804103079-500.webp',
    gallery: ['/images/photo-1498804103079-500.webp', '/images/photo-1514432324607-500.webp'],
    badge: 'خاص',
    roast: 'مدیوم',
    origin: '۵۰٪ عربیکا تخصصی / ۵۰٪ روبوستا اعلا',
    notes: ['شکلات شیری', 'مرکبات ملایم', 'شهد گل'],
    description:
      'هارمونی بی‌نقص برای ذائقه‌های دقیق؛ نیمی عربیکای معطر با اسیدیته زنده و نیمی روبوستای پربدنه با فوم غنی و کافئین مناسب. فنجانی متعادل و عمیق هم برای اسپرسو و هم برای موکاپات.',
  },

  // ---------------- تجهیزات دم‌آوری (equipment) - استعلام قیمت ----------------
  {
    id: 7,
    slug: 'bialetti-moka-3cup',
    name: 'موکاپات بیالتی ۳ کاپ',
    price: null,
    category: 'equipment',
    image: '/images/photo-1544787219-500.webp',
    gallery: ['/images/photo-1544787219-500.webp'],
    badge: 'اصلی',
    origin: 'ساخت ایتالیا',
    notes: [],
    description:
      'موکاپات کلاسیک ایتالیایی برای تهیه‌ی قهوه‌ای غلیظ و پربدنه روی اجاق. ساخته‌شده از آلومینیوم مرغوب با ظرفیت ۳ فنجان؛ ساده، بادوام و همیشه دوست‌داشتنی.',
  },
  {
    id: 8,
    slug: 'v60-dripper',
    name: 'دریپر V60 سرامیکی',
    price: null,
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
    price: null,
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
    price: null,
    category: 'equipment',
    image: '/images/photo-1572442388796-500.webp',
    gallery: ['/images/photo-1572442388796-500.webp'],
    badge: 'پیشنهادی',
    origin: 'تیغه‌ی سرامیکی',
    notes: [],
    description:
      'آسیاب دستی با تیغه‌ی سرامیکی و درجه‌بندی دقیق؛ از پودر ریز اسپرسو تا درشتِ فرنچ‌پرس. بی‌صدا، قابل حمل و ایده‌آل برای تازه آسیاب کردن دانه‌ها.',
  },

  // ---------------- لوازم جانبی (accessories) - استعلام قیمت ----------------
  {
    id: 11,
    slug: 'digital-scale',
    name: 'ترازو دیجیتال قهوه',
    price: null,
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
    price: null,
    category: 'accessories',
    image: '/images/photo-1511920170033-800.webp',
    gallery: ['/images/photo-1511920170033-800.webp'],
    badge: 'استیل',
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
