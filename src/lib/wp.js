const TRUTHY_STRINGS = new Set(['1', 'true', 'yes', 'on', 'enable', 'enabled']);

export const WORD_SEARCH_KEYS = [
  'show_vite_game',
  'wordsearch_game',
  'wordsearch',
  'show_wordsearch',
  'show_wordsearch_game',
  'enable_wordsearch',
  'enable_wordsearch_game',
  'wordsearch_enabled',
];

function coerceToBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return false;
    return TRUTHY_STRINGS.has(normalized);
  }

  if (!value || typeof value !== 'object') return false;

  if ('value' in value) return coerceToBoolean(value.value);
  if ('raw' in value) return coerceToBoolean(value.raw);
  if ('rendered' in value) return coerceToBoolean(value.rendered);
  if ('value_formatted' in value)
    return coerceToBoolean(value.value_formatted);

  if (Array.isArray(value)) return value.length > 0;

  return false;
}

export async function resolveSlug(params) {
  const paramsObj = await Promise.resolve(params);
  const raw = paramsObj?.slug;
  return Array.isArray(raw) ? raw[0] : raw ?? 'home';
}

export async function getPageBySlug(slug) {
  try {
    const res = await fetch(
      `https://backend.petereichhorst.com/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&_embed`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) && data.length ? data[0] : null;
  } catch (err) {
    console.error('getPageBySlug error', err);
    return null;
  }
}

export function hasWordSearchFlag(page, customKeys = []) {
  const acf = page?.acf;
  if (!acf) return false;

  const keysToCheck = customKeys.length ? customKeys : WORD_SEARCH_KEYS;

  return keysToCheck.some((key) => coerceToBoolean(acf?.[key]));
}

export function getWordSearchFlagValue(acf, customKeys = []) {
  if (!acf) return { key: null, value: null };

  const keysToCheck = customKeys.length ? customKeys : WORD_SEARCH_KEYS;

  for (const key of keysToCheck) {
    const value = acf?.[key];
    if (value !== undefined && value !== null && value !== '') {
      return { key, value };
    }
  }

  return { key: null, value: null };
}
