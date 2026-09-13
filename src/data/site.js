// Keep Coffee Roastery - Official Site Information
export const site = {
  name: 'کیپ کافی',
  nameEn: 'Keep Coffee Roastery',
  url: 'https://keepcoffee.ir',

  // --- Official Contact Info ---
  phone: '۰۹۳۳۵۳۳۳۴۹۹',
  contactPerson: 'ربیعی',
  phoneHref: '+989335333499',
  whatsapp: '989335333499',
  instagram: 'keepcoffeeroastery',
  telegram: 'keepcoffeeRoastery',
  email: 'info@keepcoffee.ir',
  address: 'تهران، کارگاه تخصصی برشته‌کاری کیپ کافی',
  hours: 'هر روز ۹ صبح تا ۹ شب',
  shippingPolicy: 'ارسال شهری داخل تهران برای سفارش‌های بالای ۲۰ کیلوگرم رایگان می‌باشد.'
};

// Helpers that build contact links from the site info
export const links = {
  tel: () => `tel:${site.phoneHref}`,
  email: () => `mailto:${site.email}`,
  instagram: () => `https://instagram.com/${site.instagram}`,
  telegram: () => `https://t.me/${site.telegram}`,
  whatsapp: (text) =>
    `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`,
  telegramShare: (text) =>
    `https://t.me/${site.telegram}${text ? `?text=${encodeURIComponent(text)}` : ''}`,
};
