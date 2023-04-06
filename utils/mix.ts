export function formatPrice(value: string | number, precision = 2) {
  const price = typeof value === 'string' ? parseInt(value) : value;

  return (price / 100).toFixed(precision);
}

export function isUnset(value: any) {
  return typeof value === 'undefined' || value === null;
}