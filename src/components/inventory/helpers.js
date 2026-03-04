export function getStockColorClass(stock) {
  if (stock >= 10) return '';
  if (stock >= 4 && stock <= 5) return 'text-yellow-500 font-bold';
  if (stock >= 0 && stock <= 3) return 'text-red-500 font-bold';
  return '';
}
