// src/components/DarkModeToggle.jsx
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
if (!mounted) {
  return (
    <div className="w-[160px] h-[36px] inline-block" />
  );
}


  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="px-4 py-2 border rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
    >
      {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}
