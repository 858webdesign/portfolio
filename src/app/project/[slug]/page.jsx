// app/project/[slug]/page.jsx

export const dynamic = 'force-dynamic';

import GameSectionClient from '@/components/GameSectionClient';
import { getMetadata } from '@/lib/getMetadata';
import {
  WORD_SEARCH_KEYS,
  getPageBySlug,
  getWordSearchFlagValue,
  hasWordSearchFlag,
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

export async function generateMetadata({ params }) {
  const slug = params?.slug || 'home';
  return getMetadata(slug, 'project');
}

export default async function Page({ params }) {
  const slug = params?.slug || 'home';
  const page = await getPageBySlug(slug);

  if (!page) {
    return <div className="p-8 text-center">Project not found</div>;
  }

  const blocks = Array.isArray(page.acf?.builder?.value_formatted)
    ? page.acf.builder.value_formatted.filter(block => block.acf_fc_layout !== 'hero')
    : [];
  const projectKeys = ['project_wordsearch', ...WORD_SEARCH_KEYS];
  const showWordSearch = hasWordSearchFlag(page, projectKeys);
  const { key: wordSearchKey, value: wordSearchValue } = getWordSearchFlagValue(
    page.acf,
    projectKeys
  );
  const formattedValue = formatAcfValue(wordSearchValue);
  const componentDebugInfo = wordSearchKey
    ? `ACF ${wordSearchKey}: ${formattedValue}`
    : 'ACF wordsearch flag not found';

  console.log('Project wordsearch flag debug', {
    slug,
    showWordSearch,
    wordSearchKey,
    wordSearchValue,
  });

  return (
    <div className="cursor-none">
      <h1
        className="text-4xl font-bold mb-6"
        dangerouslySetInnerHTML={{ __html: page.title?.rendered || 'Untitled' }}
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

      {blocks.map((block, i) => {
        switch (block.acf_fc_layout) {
          default:
            return null;
        }
      })}
    </div>
  );
}
