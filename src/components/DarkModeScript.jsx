// /src/components/DarkModeScript.jsx
'use client';

import { useEffect } from 'react';

export default function DarkModeScript() {
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (
      theme === 'dark' ||
      (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return null;
}
