// Persian-digit + thousands-grouped currency formatting.

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(input) {
  if (input === null || input === undefined) return '';
  return String(input).replace(/[0-9]/g, (d) => FA_DIGITS[d]);
}

// 2200000 -> "۲,۲۰۰,۰۰۰ تومان" / null -> "استعلام قیمت"
export function formatToman(value) {
  if (value === null || value === undefined || value === 0) {
    return 'استعلام قیمت';
  }
  const grouped = Number(value).toLocaleString('en-US');
  return `${toPersianDigits(grouped)} تومان`;
}

// 2200000 -> "۲,۲۰۰,۰۰۰"
export function formatNumber(value) {
  if (value === null || value === undefined) return '';
  return toPersianDigits(Number(value).toLocaleString('en-US'));
}
