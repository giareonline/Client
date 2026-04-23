export function formatCurrency(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === "") return "0đ";
  const num = typeof value === 'string' ? parseInt(value.replace(/[^0-9.-]+/g, ''), 10) : Number(value);
  if (isNaN(num)) return "0đ";
  return new Intl.NumberFormat('vi-VN').format(num) + 'đ';
}
