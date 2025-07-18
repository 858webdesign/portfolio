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
    <button
      onClick={toggleTheme}
      className="px-4 py-2 bg-[var(--color-accent)] text-white rounded"
    >
      Switch Theme
    </button>
  );
}
