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
    roastLevel: 5,
    caffeine: 'بسیار بالا (Max)',
    sensory: {
      body: 5,       // تن‌واری / بادی سنگین
      aroma: 3,      // عطر
      bitterness: 5, // تلخی گیرا
      acidity: 1,    // ترشی / اسیدیته پایین
      crema: 5       // کرما و فوم طلایی
    },
    recommendedBrew: ['اسپرسوساز صنعتی', 'اسپرسوساز خانگی', 'موکاپات'],
    origin: '۱۰۰٪ دانه‌های مرغوب روبوستا خاستگاه‌های آسیای شرقی و آفریقا',
    notes: ['شکلات تلخ', 'کارامل سوخته', 'فندق بوداده'],
    description:
      'ترکیب کلاسیک و ۱۰۰٪ روبوستا با کرمای بسیار غلیظ و ماندگار، تلخی گیرا و کافئین فوق‌العاده بالا؛ یک بیدارباش انرژی‌بخش برای آغاز پرقدرت روز و ایده‌آل برای اسپرسوبار کافه‌ها و نوشیدنی‌های انرژی‌بخش روزانه.',
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
    roastLevel: 4,
    caffeine: 'بسیار بالا',
    sensory: {
      body: 5,
      aroma: 4,
      bitterness: 4,
      acidity: 1,
      crema: 5
    },
    recommendedBrew: ['اسپرسوساز صنعتی', 'موکاپات', 'اسپرسوساز خانگی'],
    origin: '۱۰۰٪ روبوستا سورت‌شده و دست‌چین اعلا',
    notes: ['پودر کاکائو', 'گردوی تازه', 'چوب صندل'],
    description:
      'دست‌چینی اختصاصی از درشت‌ترین و مرغوب‌ترین دانه‌های روبوستا با بادی مخملی و سنگین، کرمای متراکم و طعم‌یادهای کاکائویی بدون ذره‌ای زنندگی یا گسی طعم؛ مناسب عاشقان اسپرسوی پرقدرت اما بااصالت و شفاف.',
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
    badge: 'محبوب کافه‌ها',
    roast: 'مدیوم',
    roastLevel: 3,
    caffeine: 'بالا',
    sensory: {
      body: 4,
      aroma: 4,
      bitterness: 4,
      acidity: 2,
      crema: 4
    },
    recommendedBrew: ['اسپرسوساز صنعتی', 'لاته و کاپوچینو', 'اسپرسوساز خانگی', 'موکاپات'],
    origin: '۸۰٪ روبوستا دست‌چین / ۲۰٪ عربیکا معطر آمریکای لاتین',
    notes: ['شکلات شیری', 'کارامل کره‌ای', 'مغز فندق'],
    description:
      'فرمول طلایی و پرطرفدار کافه‌ای؛ ترکیب ۸۰ درصد روبوستای پرکافئین با ۲۰ درصد عربیکای معطر جهت ایجاد عطری دلنشین، بادی متوازن و کرمای مخملیِ ایده‌آل برای اسپرسو و انواع نوشیدنی‌های بر پایه شیر، لاته و کاپوچینو.',
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
    badge: 'اقتصادی و متعادل',
    roast: 'مدیوم',
    roastLevel: 3,
    caffeine: 'متعادل رو به بالا',
    sensory: {
      body: 4,
      aroma: 4,
      bitterness: 3,
      acidity: 2,
      crema: 4
    },
    recommendedBrew: ['اسپرسوساز صنعتی', 'اسپرسوساز خانگی', 'موکاپات', 'فرنچ پرس'],
    origin: '۷۰٪ روبوستا مرغوب / ۳۰٪ عربیکا باکیفیت',
    notes: ['شکلات تلخ', 'بادام بوداده', 'شهد عسل تیره'],
    description:
      'یکی از اصیل‌ترین و استانداردترین ترکیب‌های اسپرسوی ایتالیایی با نسبت ۷۰ به ۳۰؛ تلخی جذاب، کنترل‌شده و دلپذیر همراه با ۳۰ درصد عربیکا برای خلق فنجانی متعادل، همه‌پسند، معطر و روان برای مصرف روزانه کافه‌ها.',
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
    badge: 'ممتاز کارگاه',
    roast: 'مدیوم',
    roastLevel: 3,
    caffeine: 'متعادل',
    sensory: {
      body: 4,
      aroma: 5,
      bitterness: 3,
      acidity: 3,
      crema: 4
    },
    recommendedBrew: ['اسپرسوساز صنعتی و خانگی', 'موکاپات', 'ایروپرس'],
    origin: '۷۰٪ روبوستا سورت‌شده اعلا / ۳۰٪ عربیکا تخصصی شسته‌شده (Washed)',
    notes: ['میوه خشک شکری', 'شکلات تخته‌ای', 'فندق بوداده'],
    description:
      'ترکیبی ممتاز از مرغوب‌ترین دانه‌های روبوستای مزارع آفریقا و عربیکای کوهستانی شسته‌شده؛ لایه‌های طعمی پیچیده و شفاف با افترتیست طولانی و شیرین که استانداردی لوکس از قهوه تخصصی تجاری ارائه می‌دهد.',
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
    badge: 'شاهکار ترکیب',
    roast: 'مدیوم',
    roastLevel: 3,
    caffeine: 'ملایم و متعادل',
    sensory: {
      body: 3,
      aroma: 5,
      bitterness: 2,
      acidity: 4,
      crema: 4
    },
    recommendedBrew: ['اسپرسو تخصصی', 'V60 و کمکس', 'موکاپات', 'فرنچ پرس'],
    origin: '۵۰٪ عربیکا تخصصی خاستگاه‌های آمریکای مرکزی / ۵۰٪ روبوستا ممتاز',
    notes: ['شکلات شیری', 'مرکبات ملایم و زنده', 'شهد گل‌های وحشی'],
    description:
      'هارمونی بی‌نقص برای ذائقه‌های دقیق و حرفه‌ای؛ نیمی عربیکای معطر با اسیدیته زنده میوه‌ای و نیمی روبوستای شسته‌شده با بدنه مخملی و کافئین کنترل‌شده. فنجانی خوش‌طعم و اشرافی هم برای اسپرسو و هم برای ادوات دمی.',
  },

  // ---------------- تجهیزات دم‌آوری (equipment) - استعلام قیمت ----------------
  {
    id: 7,
    slug: 'bialetti-moka-3cup',
    name: 'موکاپات بیالتی ۳ کاپ اصل',
    price: null,
    category: 'equipment',
    image: '/images/photo-1544787219-500.webp',
    gallery: ['/images/photo-1544787219-500.webp'],
    badge: 'اصلی',
    origin: 'طراحی اصیل ایتالیا',
    notes: [],
    description:
      'موکاپات کلاسیک ایتالیایی برای تهیه‌ی قهوه‌ای غلیظ و پربدنه روی اجاق. ساخته‌شده از آلومینیوم مرغوب با ظرفیت ۳ فنجان؛ ساده، بادوام و همراه همیشگی میز صبحانه.',
  },
  {
    id: 8,
    slug: 'v60-dripper',
    name: 'دریپر سرامیکی V60 سایز ۰۲',
    price: null,
    category: 'equipment',
    image: '/images/photo-1447933601403-500.webp',
    gallery: ['/images/photo-1447933601403-500.webp'],
    badge: 'تخصصی',
    origin: 'سرامیک حرارت‌دیده مرغوب',
    notes: [],
    description:
      'ابزار محبوب دم‌آوری موج سوم قهوه برای استخراجی تمیز، شفاف و بدون رسوب. شیارهای مارپیچ درونی و دهانه مخروطی ۶۰ درجه، جریان آب را یکدست هدایت می‌کنند.',
  },
  {
    id: 9,
    slug: 'french-press',
    name: 'فرنچ پرس شیشه‌ای مقاومت بالا',
    price: null,
    category: 'equipment',
    image: '/images/photo-1559056199-500.webp',
    gallery: ['/images/photo-1559056199-500.webp'],
    origin: 'شیشه بوروسیلیکات و استیل ضدزنگ',
    notes: [],
    description:
      'ساده‌ترین و اصیل‌ترین راه برای تهیه یک لیوان قهوه‌ی پربدنه و فوم‌گیری شیر لاته خانگی بدون نیاز به فیلتر کاغذی. مجهز به توری استیل میکروفیلتر.',
  },
  {
    id: 10,
    slug: 'manual-grinder',
    name: 'آسیاب دستی قهوه با تیغه سرامیکی',
    price: null,
    category: 'equipment',
    image: '/images/photo-1572442388796-500.webp',
    gallery: ['/images/photo-1572442388796-500.webp'],
    badge: 'پیشنهادی',
    origin: 'بدنه استیل و تیغه مخروطی سرامیک',
    notes: [],
    description:
      'آسیاب دستی قابل تنظیم با تیغه‌ی سرامیکی دقیق؛ از درجه ریز اسپرسو تا درجه درشت فرنچ‌پرس و کلدبرو. نگهداری کامل عطر دانه با آسیاب تازه قبل از هر دم‌آوری.',
  },

  // ---------------- لوازم جانبی (accessories) - استعلام قیمت ----------------
  {
    id: 11,
    slug: 'digital-scale',
    name: 'ترازو دیجیتال باریستا با تایمر',
    price: null,
    category: 'accessories',
    image: '/images/photo-1620189507195-500.webp',
    gallery: ['/images/photo-1620189507195-500.webp'],
    badge: 'دقت ۰.۱ گرم',
    origin: 'سنسور پیشرفته با کالیبراسیون دقیق',
    notes: [],
    description:
      'ترازوی تخصصی باریستا با دقت صدم و دهم گرم و تایمر خودکار داخلی؛ ابزاری ضروری برای رعایت نسبت طلایی آب به قهوه (Brew Ratio) و عصاره‌گیری استاندارد.',
  },
  {
    id: 12,
    slug: 'gooseneck-kettle',
    name: 'کتری گردن‌غازی مدرج استیل',
    price: null,
    category: 'accessories',
    image: '/images/photo-1511920170033-800.webp',
    gallery: ['/images/photo-1511920170033-800.webp'],
    badge: 'استیل ۳۰۴',
    origin: 'استیل ضدزنگ مواد غذایی',
    notes: [],
    description:
      'کتری گردن‌غازی با لوله آبریز باریک منحنی برای کنترل کامل دبی و جهت جریان آب بر روی بستر قهوه در دم‌افزارهای پور-اور نظیر V60 و کمکس.',
  },
];

export const grindOptions = [
  { id: 'whole-bean', label: 'دانه کامل (بدون آسیاب)' },
  { id: 'espresso-commercial', label: 'آسیاب اسپرسوساز صنعتی / نیمه‌صنعتی' },
  { id: 'espresso-home', label: 'آسیاب اسپرسوساز خانگی' },
  { id: 'moka-pot', label: 'آسیاب موکاپات (روگازی)' },
  { id: 'french-press', label: 'آسیاب فرنچ پرس / قهوه فرانسه' },
  { id: 'drip-v60', label: 'آسیاب فیلتری / دمی (V60 و کمکس)' },
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
