// ============================================================
// RELATIVE DATE — Platform agnostic
// ============================================================

export function relativeDate(iso: string): string {
  const diff = Date.now() - +new Date(iso);
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return 'Hier';
  if (days < 7) return `Il y a ${days} jours`;
  if (days < 30) return `Il y a ${Math.floor(days / 7)} sem.`;
  return `Il y a ${Math.floor(days / 30)} mois`;
}
