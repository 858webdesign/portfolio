// app/[slug]/page.jsx

export async function getPageBySlug(slug) {
  const res = await fetch(`https://backend.petereichhorst.com/wp-json/wp/v2/pages?slug=${slug}&acf_format=standard`, {
    next: { revalidate: 60 },
  });

  const data = await res.json();
  return data.length > 0 ? data[0] : null;
}

export default async function Page({ params }) {
  const slug = params.slug;
  const page = await getPageBySlug(slug);

  if (!page) {
    return <div className="p-8 text-center">Page not found</div>;
  }

  // ✅ Filter out the 'hero' block (since it's now rendered globally in layout.js)
  const rawBuilder = page.acf?.builder;
  const blocks = Array.isArray(rawBuilder?.value_formatted)
    ? rawBuilder.value_formatted.filter(block => block.acf_fc_layout !== 'hero')
    : [];

  return (
    <>
      {blocks.map((block, i) => {
        switch (block.acf_fc_layout) {
          // 🎯 Add more block types here like 'text', 'gallery', etc.
          default:
            return null;
        }
      })}
    </>
  );
}
