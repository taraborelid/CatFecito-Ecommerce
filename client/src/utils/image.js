export const API_ORIGIN = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export function resolveImage(src) {
  if (!src) return '';
  const s = String(src).trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s) || s.startsWith('data:')) return s;
  return `${API_ORIGIN}${s.startsWith('/') ? '' : '/'}${s}`;
}