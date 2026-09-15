// Keep Coffee Roastery - Official Site Information
export const site = {
  name: 'کیپ کافی',
  nameEn: 'Keep Coffee Roastery',
  url: 'https://keepcoffee.ir',

  // --- Official Contacts ---
  phoneRahimi: '۰۹۱۲۰۱۴۲۲۱۰',
  contactPersonRahimi: 'رحیمی',
  phoneHrefRahimi: '09120142210',

  phoneRabiee: '۰۹۳۳۵۳۳۳۴۹۹',
  contactPersonRabiee: 'ربیعی',
  phoneHrefRabiee: '09335333499',

  // Primary default
  phone: '۰۹۱۲۰۱۴۲۲۱۰',
  contactPerson: 'رحیمی',
  phoneHref: '09120142210',

  whatsapp: '989120142210',
  instagram: 'keepcoffeeroastery',
  telegram: 'keepcoffeeRoastery',
  email: 'info@keepcoffee.ir',
  address: 'تهران، کارگاه تخصصی برشته‌کاری کیپ کافی',
  hours: 'هر روز ۹ صبح تا ۹ شب',
  shippingPolicy: 'ارسال رایگان در تهران برای سفارش‌های بالای ۲۰ کیلوگرم'
};

// Helpers that build contact links from the site info
export const links = {
  tel: (href) => `tel:${href || site.phoneHref}`,
  telRahimi: () => `tel:${site.phoneHrefRahimi}`,
  telRabiee: () => `tel:${site.phoneHrefRabiee}`,
  email: () => `mailto:${site.email}`,
  instagram: () => `https://instagram.com/${site.instagram}`,
  telegram: () => `https://t.me/${site.telegram}`,
  whatsapp: (text, number = site.whatsapp) =>
    `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`,
  telegramShare: (text) =>
    `https://t.me/${site.telegram}${text ? `?text=${encodeURIComponent(text)}` : ''}`,
};
