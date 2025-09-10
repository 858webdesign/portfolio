'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    document.documentElement.removeAttribute('data-theme'); // Default retro theme
  }, []);

  const toggleTheme = () => {
    if (theme === 'default') {
      document.documentElement.setAttribute('data-theme', 'alt');
      setTheme('alt');
    } else {
      document.documentElement.removeAttribute('data-theme');
      setTheme('default');
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col items-end gap-2">
    <button
      onClick={toggleTheme}
      className="px-4 py-2 bg-[var(--color-bg-dark)] text-[var(--color-accent)] rounded"
    >
      Switch Theme
    </button>
    </div>
  );
}
