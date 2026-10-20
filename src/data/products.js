// Product catalog for Keep Coffee Roastery
// Synchronized with live database

export const products = [
  // ---------------- دانه‌های قهوه و میکس‌های کارگاه (beans) ----------------
  {
    id: 1,
    slug: 'mix-100-robusta-classic',
    name: 'میکس ۱۰۰ روبوستا کلاسیک',
    price: 2800000,
    unit: 'کیلوگرم',
    category: 'beans',
    image: '/images/photo-1509042239860-500.webp',
    gallery: ['/images/photo-1509042239860-500.webp', '/images/photo-1559525839-500.webp'],
    badge: 'پرفروش',
    roast: 'دارک',
    roastLevel: 5,
    caffeine: 'بسیار بالا (Max)',
    sensory: {
      body: 5,
      aroma: 3,
      bitterness: 5,
      acidity: 1,
      crema: 5,
    },
    recommendedBrew: ['اسپرسوساز صنعتی', 'اسپرسوساز خانگی', 'موکاپات'],
    origin: '۱۰۰٪ دانه‌های مرغوب روبوستا خاستگاه‌های آسیای شرقی و آفریقا',
    notes: ['شکلات تلخ', 'کارامل سوخته', 'فندق بوداده'],
    description:
      'ترکیب کلاسیک و ۱۰۰٪ روبوستا با کرمای بسیار غلیظ و ماندگار، تلخی گیرا و کافئین فوق‌العاده بالا؛ یک بیدارباش انرژی‌بخش برای آغاز پرقدرت روز.',
  },
  {
    id: 2,
    slug: 'mix-100-robusta-premium',
    name: 'میکس ۱۰۰ روبوستا پرمیوم',
    price: 2900000,
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
      crema: 5,
    },
    recommendedBrew: ['اسپرسوساز صنعتی', 'موکاپات', 'اسپرسوساز خانگی'],
    origin: '۱۰۰٪ روبوستا سورت‌شده و دست‌چین اعلا',
    notes: ['پودر کاکائو', 'گردوی تازه', 'چوب صندل'],
    description:
      'دست‌چینی اختصاصی از درشت‌ترین و مرغوب‌ترین دانه‌های روبوستا با بادی مخملی و سنگین، کرمای متراکم و طعم‌یادهای کاکائویی بدون ذره‌ای زنندگی.',
  },
  {
    id: 3,
    slug: 'mix-80-20-robusta',
    name: 'میکس ۸۰/۲۰ روبوستا',
    price: 3000000,
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
      crema: 5,
    },
    recommendedBrew: ['اسپرسوساز صنعتی', 'اسپرسوساز خانگی', 'موکاپات'],
    origin: '۸۰٪ روبوستا دست‌چین / ۲۰٪ عربیکا معطر آمریکای لاتین',
    notes: ['شکلات شیری', 'کارامل کره‌ای', 'مغز فندق'],
    description:
      'فرمول طلایی و پرطرفدار کافه‌ای؛ ترکیب ۸۰ درصد روبوستای پرکافئین با ۲۰ درصد عربیکای معطر جهت ایجاد عطری دلنشین، بادی متوازن و کرمای مخملی.',
  },
  {
    id: 4,
    slug: 'mix-70-30-robusta-classic',
    name: 'میکس ۷۰/۳۰ روبوستا کلاسیک',
    price: 3150000,
    unit: 'کیلوگرم',
    category: 'beans',
    image: '/images/photo-1541167760496-500.webp',
    gallery: ['/images/photo-1541167760496-500.webp', '/images/photo-1497935586351-500.webp'],
    badge: 'اقتصادی و متعادل',
    roast: 'مدیوم',
    roastLevel: 3,
    caffeine: 'متعادل رو به بالا',
    sensory: {
      body: 4,
      aroma: 4,
      bitterness: 3,
      acidity: 2,
      crema: 4,
    },
    recommendedBrew: ['اسپرسوساز صنعتی', 'اسپرسوساز خانگی', 'موکاپات'],
    origin: '۷۰٪ روبوستا مرغوب / ۳۰٪ عربیکا باکیفیت',
    notes: ['شکلات تلخ', 'بادام بوداده', 'شهد عسل تیره'],
    description:
      'یکی از اصیل‌ترین و استانداردترین ترکیب‌های اسپرسوی ایتالیایی با نسبت ۷۰ به ۳۰؛ تلخی جذاب، کنترل‌شده و دلپذیر همراه با ۳۰ درصد عربیکا.',
  },
  {
    id: 5,
    slug: 'mix-70-30-robusta-premium',
    name: 'میکس ۷۰/۳۰ روبوستا پرمیوم',
    price: 3500000,
    unit: 'کیلوگرم',
    category: 'beans',
    image: '/images/photo-1514432324607-500.webp',
    gallery: ['/images/photo-1514432324607-500.webp', '/images/photo-1541167760496-500.webp'],
    badge: 'ممتاز کارگاه',
    roast: 'مدیوم',
    roastLevel: 3,
    caffeine: 'متعادل',
    sensory: {
      body: 4,
      aroma: 5,
      bitterness: 3,
      acidity: 2,
      crema: 4,
    },
    recommendedBrew: ['اسپرسوساز صنعتی', 'اسپرسوساز خانگی', 'فرانسه / فرنچ پرس'],
    origin: '۷۰٪ روبوستا سورت‌شده اعلا / ۳۰٪ عربیکا تخصصی شسته‌شده (Washed)',
    notes: ['میوه خشک شکری', 'شکلات تخته‌ای', 'فندق بوداده'],
    description:
      'ترکیبی ممتاز از مرغوب‌ترین دانه‌های روبوستای مزارع آفریقا و عربیکای کوهستانی شسته‌شده؛ لایه‌های طعمی پیچیده و شفاف با افترتیست طولانی و شیرین.',
  },
  {
    id: 6,
    slug: 'mix-50-50-premium',
    name: 'میکس ۵۰/۵۰ پرمیوم',
    price: 3600000,
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
      acidity: 3,
      crema: 4,
    },
    recommendedBrew: ['اسپرسوساز صنعتی', 'اسپرسوساز خانگی', 'کمکس / V60', 'موکاپات'],
    origin: '۵۰٪ عربیکا تخصصی خاستگاه‌های آمریکای مرکزی / ۵۰٪ روبوستا ممتاز',
    notes: ['شکلات شیری', 'مرکبات ملایم و زنده', 'شهد گل‌های وحشی'],
    description:
      'هارمونی بی‌نقص برای ذائقه‌های دقیق و حرفه‌ای؛ نیمی عربیکای معطر با اسیدیته زنده میوه‌ای و نیمی روبوستای شسته‌شده با بدنه مخملی.',
  },
  {
    id: 13,
    slug: 'prod-1792063802',
    name: 'میکس 90 روبوستا ویژه',
    price: 2950000,
    unit: 'کیلوگرم',
    category: 'beans',
    image: '/images/photo-1509042239860-500.webp',
    gallery: ['/images/photo-1509042239860-500.webp', '/images/photo-1559525839-500.webp'],
    badge: 'ویژه کارگاه',
    roast: 'مدیوم',
    roastLevel: 4,
    caffeine: 'بسیار بالا',
    sensory: {
      body: 5,
      aroma: 4,
      bitterness: 4,
      acidity: 1,
      crema: 5,
    },
    recommendedBrew: ['اسپرسوساز صنعتی', 'اسپرسوساز خانگی', 'موکاپات'],
    origin: '۹۰٪ روبوستا دست‌چین / ۱۰٪ عربیکا معطر',
    notes: ['شکلات تلخ', 'کارامل', 'فندق بوداده'],
    description:
      'میکس ۹۰ درصد روبوستا با ۱۰ درصد عربیکا جهت بیشینه کردن کرما و کافئین در عین حفظ بوی خوش و دلپذیر قهوه تازه برشت.',
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
