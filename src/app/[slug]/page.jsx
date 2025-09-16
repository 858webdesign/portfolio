import GameSectionClient from '@/components/GameSectionClient';
import {
  getPageBySlug,
  getWordSearchFlagValue,
  hasWordSearchFlag,
  resolveSlug,
} from '@/lib/wp';

function formatAcfValue(value) {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'string') return value || '(empty string)';
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (err) {
      return '[object]';
    }
  }
  return String(value);
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
  const { key: wordSearchKey, value: wordSearchValue } = getWordSearchFlagValue(page.acf);
  const formattedValue = formatAcfValue(wordSearchValue);
  const componentDebugInfo = wordSearchKey
    ? `ACF ${wordSearchKey}: ${formattedValue}`
    : 'ACF wordsearch flag not found';

  console.log('Wordsearch flag debug', {
    slug,
    showWordSearch,
    wordSearchKey,
    wordSearchValue,
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <h1
        className="text-4xl font-bold mb-6"
        dangerouslySetInnerHTML={{ __html: page.title?.rendered || 'Untitled' }}
      />
      <article
        dangerouslySetInnerHTML={{ __html: page.content?.rendered || '' }}
      />
      <p className="mt-8 text-sm text-center text-gray-500">
        {componentDebugInfo} | resolved: {String(showWordSearch)}
      </p>
      {showWordSearch && (
        <section className="mt-6">
          <GameSectionClient
            label="Wordsearch Game"
            debugInfo={componentDebugInfo}
          />
        </section>
      )}
    </main>
  );
}
