// ============================================================
// DETERMINISTIC PSEUDO-RANDOM UTILITY
// Shared by all seed generators
// ============================================================

export function seedRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
