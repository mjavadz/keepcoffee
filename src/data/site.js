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
  twitter: 'keepcoffee',
  email: 'info@keepcoffee.ir',
  address: 'تهران، کارگاه تخصصی برشته‌کاری کیپ کافی',
  hours: 'هر روز ۹ صبح تا ۹ شب',
  shippingPolicy: 'ارسال رایگان در تهران برای سفارش‌های بالای ۲۰ کیلوگرم',

  // --- Official Workshop Crypto Wallets ---
  wallets: {
    btc: 'bc1q5gs297eqhgjet7eqkm5cdx7lzpjsvnz8ny5us9',
    evm: '0xdB25e672d7873d178f6465E242BAdF44e990A787',
    trx: 'TJSpjmoz4F84kB4e3tvxJt3LFhhwVtiHQN',
    sol: '3hY5AZkErdBrWRjYypr9TUaH7Vo3SvVuft8Zm7hJjJQn',
    gram: 'UQAzVbTDzh2sCc6854FjKI-c9x-jz_sjLlJa_SmF1SC1sIMS',
  }
};

// Helpers that build contact links from the site info
export const links = {
  tel: (href) => `tel:${href || site.phoneHref}`,
  telRahimi: () => `tel:${site.phoneHrefRahimi}`,
  telRabiee: () => `tel:${site.phoneHrefRabiee}`,
  email: () => `mailto:${site.email}`,
  instagram: () => `https://instagram.com/${site.instagram}`,
  telegram: () => `https://t.me/${site.telegram}`,
  twitter: () => `https://x.com/${site.twitter}`,
  whatsapp: (text, number = site.whatsapp) =>
    `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`,
  telegramShare: (text) =>
    `https://t.me/${site.telegram}${text ? `?text=${encodeURIComponent(text)}` : ''}`,
};
