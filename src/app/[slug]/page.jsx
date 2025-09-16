import GameSectionClient from '@/components/GameSectionClient';
import {
  getPageBySlug,
  hasWordSearchFlag,
  resolveSlug,
} from '@/lib/wp';

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
      : rawTitle
      ? rawTitle + suffix
      : 'Peter Eichhorst';

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
  const slug = await resolveSlug(ctx.params);
  const page = await getPageBySlug(slug);

  if (!page) {
    return <div className="p-8 text-center">Page not found</div>;
  }

  const showWordSearch = hasWordSearchFlag(page);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1
        className="text-4xl font-bold mb-6"
        dangerouslySetInnerHTML={{ __html: page.title?.rendered || 'Untitled' }}
      />
      <article
        dangerouslySetInnerHTML={{ __html: page.content?.rendered || '' }}
      />
      {showWordSearch && (
        <section className="mt-6">
          <GameSectionClient label="Wordsearch Game" />
        </section>
      )}
    </main>
  );
}
