const API_ORIGIN = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export function resolveImage(src) {
  if (!src) return '';
  if (typeof src !== 'string') return '';
  const trimmed = src.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:')) return trimmed;
  return `${API_ORIGIN}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
}