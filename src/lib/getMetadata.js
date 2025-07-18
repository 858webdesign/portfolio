// lib/getMetadata.js

const BASE_URL = 'https://petereichhorst.com';
const API_URL = 'https://backend.petereichhorst.com/wp-json/wp/v2';
const ROOT_URL = 'https://backend.petereichhorst.com/wp-json';

async function getSiteInfo() {
  try {
    const res = await fetch(ROOT_URL);
    const data = await res.json();
    return {
      name: data?.name || 'Site',
      slogan: data?.description || '',
    };
  } catch (err) {
    console.error('Site info fetch error:', err);
    return {
      name: 'Site',
      slogan: '',
    };
  }
}

export async function getMetadata(slug = 'home', type = 'page') {
  const isHome = slug === 'home';
  const site = await getSiteInfo();

  const endpoint =
    type === 'project'
      ? `${API_URL}/project?slug=${slug}&_embed`
      : `${API_URL}/pages?slug=${slug}`;

  try {
    const res = await fetch(endpoint);
    const data = await res.json();
    const item = data?.[0];

    const rawTitle = item?.title?.rendered || 'Untitled';
    const cleanExcerpt =
      item?.excerpt?.rendered?.replace(/<[^>]+>/g, '') ||
      item?.acf?.meta_description ||
      (type === 'project' ? `Project by ${site.name}` : `Page on ${site.name}`);

    const title = isHome
      ? `${site.name} | ${site.slogan}`
      : `${rawTitle} | ${site.name}`;

    const imageUrl =
      item?._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
      `${BASE_URL}/default-og.jpg`;

    const url = `${BASE_URL}/${type === 'project' ? `project/${slug}` : slug}`;

    return {
      title,
      description: cleanExcerpt,
      openGraph: {
        title,
        description: cleanExcerpt,
        url,
        siteName: site.name,
        type: 'website',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: rawTitle,
          },
        ],
      },
    };
  } catch (err) {
    console.error('Metadata fetch error:', err);
    return {
      title: `${site.name} | ${site.slogan}`,
      description: `A creative portfolio by ${site.name}`,
    };
  }
}
