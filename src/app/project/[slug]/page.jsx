// app/project/[slug]/page.jsx

export const dynamic = 'force-dynamic';

import GameSectionClient from '@/components/GameSectionClient';
import { getMetadata } from '@/lib/getMetadata';
import {
  WORD_SEARCH_KEYS,
  getPageBySlug,
  hasWordSearchFlag,
} from '@/lib/wp';

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

  return (
    <div className="cursor-none">
      <h1
        className="text-4xl font-bold mb-6"
        dangerouslySetInnerHTML={{ __html: page.title?.rendered || 'Untitled' }}
      />

      {showWordSearch && (
        <section className="mt-6">
          <GameSectionClient label="Wordsearch Game" />
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
