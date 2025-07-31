// app/[slug]/page.jsx
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { getMetadata } from '@/lib/getMetadata';
// import ViteGameLoader from '@/components/ViteGameLoader';
// import { useEffect } from 'react';

import GameSection from '@/components/GameSection';

export async function generateMetadata({ params }) {
  const slug = params?.slug || 'home';
  return await getMetadata(slug);
}

async function getPageBySlug(slug) {
  const res = await fetch(
    `https://backend.petereichhorst.com/wp-json/wp/v2/pages?slug=${slug}&acf_format=standard`,
    { next: { revalidate: 60 } }
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
    ? page.acf.builder.value_formatted
    : [];


    
  return (
    <>
      <div className="min-h-screen cursor-none relative">
        <h1 className="text-3xl font-bold mb-6">{page.title.rendered}</h1>
        <Link href="/contact" className="text-blue-600 underline">Contact</Link>
        <div className="prose max-w-none text-black dark:text-white">
          <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
        </div>
      </div>
      <>
      {/* ✅ ACF conditional for puzzle */}
   
   


  {/* ✅ Puzzle section now client-rendered safely */}
    {page?.acf?.show_vite_game && <GameSection showGame={true} />}
</>


    </>
  );
}
