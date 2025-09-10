export const dynamic = 'force-dynamic';

import Link from 'next/link';
import GameSection from '@/components/GameSection'; // ← client component (no dynamic)

async function getMetadata(slug) {
  return { title: `Project: ${slug}`, description: `Details for project ${slug}.` };
}

async function getPageBySlug(slug) {
  const res = await fetch(
    `https://backend.petereichhorst.com/wp-json/wp/v2/pages?slug=${slug}&acf_format=standard`,
    { next: { revalidate: 60 } }
  );
  const data = await res.json();
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

export async function generateMetadata(props) {
  const { slug } = await props.params;            // await params (Next 15)
  return getMetadata(slug ?? 'home');
}

export default async function Page(props) {
  const { slug } = await props.params;            // await params (Next 15)
  const safeSlug = slug ?? 'home';

  const page = await getPageBySlug(safeSlug);
  if (!page) return <div className="p-8 text-center">Page not found</div>;

  // Coerce ACF boolean ("1"/"0")
  const showGame = !!Number(page?.acf?.show_vite_game);

  return (
    <>
      <div className="min-h-screen relative">
        <h1 className="text-3xl font-bold mb-6">{page.title.rendered}</h1>
        <Link href="/contact" className="text-blue-600 underline">Contact</Link>
        <div className="prose max-w-none text-black dark:text-white">
          <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
        </div>
      </div>

      {showGame && <GameSection />}   {/* Client boundary */}
    </>
  );
}
