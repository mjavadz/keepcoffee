// Product categories. `key` matches product.category in products.js.

export const categories = [
  {
    key: 'beans',
    title: 'دانه‌های قهوه',
    desc: 'از بهترین مزارع جهان تا فنجان شما',
    image: '/images/photo-1559525839-500.webp',
  },
  {
    key: 'equipment',
    title: 'تجهیزات دم‌آوری',
    desc: 'لوازم حرفه‌ای برای یک استخراج بی‌نقص',
    image: '/images/photo-1544787219-500.webp',
  },
  {
    key: 'accessories',
    title: 'لوازم جانبی',
    desc: 'ترازو، کتری و هر چیزی که نیاز دارید',
    image: '/images/photo-1620189507195-500.webp',
  },
];

export const categoryLabel = (key) =>
  categories.find((c) => c.key === key)?.title || 'محصولات';
