// Persian-digit + thousands-grouped currency formatting.

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(input) {
  return String(input).replace(/[0-9]/g, (d) => FA_DIGITS[d]);
}

// 350000 -> "۳۵۰,۰۰۰ تومان"
export function formatToman(value) {
  const grouped = Number(value).toLocaleString('en-US'); // 350,000
  return `${toPersianDigits(grouped)} تومان`;
}

// 350000 -> "۳۵۰,۰۰۰" (no unit)
export function formatNumber(value) {
  return toPersianDigits(Number(value).toLocaleString('en-US'));
}
