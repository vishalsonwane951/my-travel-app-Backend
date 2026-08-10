import crypto from 'crypto';

// Recursively sorts object keys so JSON.stringify is deterministic regardless
// of the order fields were set in (e.g. {a,b} vs {b,a} hash identically).
function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = canonicalize(value[key]);
        return acc;
      }, {});
  }
  return value;
}

export function buildCacheKey(params) {
  const canonical = canonicalize(params);
  return crypto.createHash('sha256').update(JSON.stringify(canonical)).digest('hex');
}

// Normalizes a free-text search term the same way regardless of casing/whitespace
// so "Pune", "pune ", and "PUNE" all hit the same autocomplete cache entry.
export function normalizeSearchTerm(term) {
  return String(term || '').trim().toLowerCase();
}
