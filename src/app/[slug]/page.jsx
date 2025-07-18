// app/[slug]/page.jsx

// ❗️ This line ensures the route is treated as dynamic
export const dynamic = 'force-dynamic';
import { getMetadata } from '@/lib/getMetadata';

// ✅ params is a plain object — do NOT await it
export async function generateMetadata({ params }) {
  const slug = params?.slug || 'home';
  return await getMetadata(slug);
}

async function getPageBySlug(slug) {
  const res = await fetch(
    `https://backend.petereichhorst.com/wp-json/wp/v2/pages?slug=${slug}&acf_format=standard`,
    { next: { revalidate: 60 } } // ISR
  );
  const data = await res.json();
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

export default async function Page({ params }) {
  const slug = params?.slug || 'home';
  const page = await getPageBySlug(slug);

  if (!page) {
    return <div className="p-8 text-center">Page not found</div>;
  }

  const blocks = Array.isArray(page.acf?.builder?.value_formatted)
    ? page.acf.builder.value_formatted.filter(
        (block) => block.acf_fc_layout !== 'hero'
      )
    : [];

  return (
    <>
      {blocks.map((block, i) => {
        switch (block.acf_fc_layout) {
          default:
            return null;
        }
      })}
    </>
  );
}
