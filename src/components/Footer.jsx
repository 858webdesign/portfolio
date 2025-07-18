'use client';
import { useEffect, useState } from 'react';
import WordSearchPuzzle from '@/components/WordSearchPuzzle';

export default function Footer() {
  const [widgets, setWidgets] = useState([]);

  useEffect(() => {
    async function fetchFooter() {
      try {
        const res = await fetch('https://backend.petereichhorst.com/wp-json/theme/v1/footer-widgets');
        const data = await res.json();

        if (data?.html) {
          // Split the HTML string into widget chunks based on divs
          const blocks = data.html.match(/<div class="footer-widget">[\s\S]*?<\/div>/g) || [];
          setWidgets(blocks);
        }
      } catch (err) {
        console.error('Failed to fetch footer widgets', err);
      }
    }

    fetchFooter();
  }, []);

  const colMap = {
    1: 'sm:grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-4',
    5: 'sm:grid-cols-5',
    6: 'sm:grid-cols-6',
  };

  const gridClass = `grid grid-cols-1 ${colMap[widgets.length] || 'sm:grid-cols-1'} gap-6`;

  return (
    <footer className="bg-[var(--color-bg)] text-[var(--color-text)] p-8">
      <div className={gridClass}>
        {widgets.map((block, idx) => (
          <div key={idx} dangerouslySetInnerHTML={{ __html: block }} />
        ))}
      </div>

 <div>
      <h1 className="text-2xl mb-4">Try This Puzzle</h1>
      <WordSearchPuzzle />
    </div>

    </footer>
  );
}
