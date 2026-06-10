// ============================================================
// FORMAT PRICE — Platform agnostic (uses Intl, available in RN)
// ============================================================

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(price);
}
