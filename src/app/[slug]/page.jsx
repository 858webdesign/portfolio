// src/app/[slug]/page.jsx

// import { getPageBySlug } from '../../lib/wp';


async function resolveSlug(params) {
  const paramsObj = await Promise.resolve(params);
  const raw = paramsObj?.slug;
  return Array.isArray(raw) ? raw[0] : (raw ?? 'home');
}

async function getPageBySlug(slug) {
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

export async function generateMetadata(ctx) {
  const slug = await resolveSlug(ctx.params);
  const page = await getPageBySlug(slug);

  const rawTitle =
    page?.yoast?.title ||
    page?.title?.rendered ||
    (slug === 'home' ? 'Home' : slug);

  const suffix = ' | Peter Eichhorst';
  const title =
    rawTitle && rawTitle.includes('Peter Eichhorst')
      ? rawTitle
      : (rawTitle ? rawTitle + suffix : 'Peter Eichhorst');

  const description =
    page?.yoast?.meta_desc ||
    page?.excerpt?.rendered?.replace(/<[^>]+>/g, '') ||
    '';

  return {
    title,
    description,
  };
}

export default async function Page(ctx) {
  const slug = await resolveSlug(ctx.params);        // ⬅️ await it
  const page = await getPageBySlug(slug);

  if (!page) {
    return <div className="p-8 text-center">Page not found</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <article
        dangerouslySetInnerHTML={{ __html: page.content?.rendered || '' }}
      />
    </main>
  );
}
