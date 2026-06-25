// ⚠️ TODO: Replace these PLACEHOLDER contact details with your real ones.
// Everything across the site reads from this single file — edit here only.

export const site = {
  name: 'کیپ کافی',
  nameEn: 'Keep Coffee',
  url: 'https://keepc.ir',

  // --- Contact (PLACEHOLDERS) ---
  phone: '۰۲۱-۱۲۳۴۵۶۷۸',          // TODO: real phone (shown to users)
  phoneHref: '+982112345678',       // TODO: real phone for tel: link (no spaces)
  whatsapp: '989000000000',         // TODO: real WhatsApp number, intl format, no +
  instagram: 'keepcoffee',          // TODO: real Instagram handle (no @)
  telegram: 'keepcoffee',           // TODO: real Telegram handle (no @)
  email: 'info@keepc.ir',           // TODO: real email
  address: 'تهران، خیابان نمونه، پلاک ۱۲۳',   // TODO: real address
  hours: 'هر روز ۹ صبح تا ۹ شب',              // TODO: real working hours
};

// Helpers that build contact links from the placeholders above
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
