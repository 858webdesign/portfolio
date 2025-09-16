export async function resolveSlug(params) {
  const paramsObj = await Promise.resolve(params);
  const raw = paramsObj?.slug;
  return Array.isArray(raw) ? raw[0] : (raw ?? 'home');
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
