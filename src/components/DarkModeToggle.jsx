// src/components/DarkModeToggle.jsx
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="fixed top-4 right-4 z-50 px-3 py-2 rounded border bg-gray-200 dark:bg-gray-800 text-black dark:text-white shadow-md"
    >
      {theme === 'dark' ? '☀️ Toggle Light Mode' : '🌙 Toggle Dark Mode'}
    </button>
  );
}
