// app/project/[slug]/page.jsx

export const dynamic = 'force-dynamic';

import { getMetadata } from '@/lib/getMetadata';

import { resolveSlug, getPageBySlug } from '@/lib/wp';


export async function generateMetadata({ params }) {
  const slug = params?.slug || 'home'; // ✅ No await needed
  return await getMetadata(slug, 'project');
}


export default async function Page({ params }) {
  const slug = params?.slug || 'home'; // ✅ No await
  const page = await getPageBySlug(slug);

  if (!page) {
    return <div className="p-8 text-center">Project not found</div>;
  }

  const blocks = Array.isArray(page.acf?.builder?.value_formatted)
    ? page.acf.builder.value_formatted.filter(block => block.acf_fc_layout !== 'hero')
    : [];

  return (
    <div className="cursor-none">
      {/* ✅ Page Title */}
      <h1 className="text-4xl font-bold mb-6">
        {page.title?.rendered || 'Untitled'}
      </h1>

      {blocks.map((block, i) => {
        switch (block.acf_fc_layout) {
          default:
            return null;
        }
      })}
    </div>
  );
}
