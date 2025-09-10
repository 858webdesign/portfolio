'use client';

import { useEffect, useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import MusicPlayer from '@/components/MusicPlayer';

export default function ClientProviders({ children }) {
  const [theme, setTheme] = useState('default');

  // Keep html attribute changes on the client only
  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      theme === 'retro' ? 'retro' : 'default'
    );
  }, [theme]);

  return (
    <>
      {/* Mount any client-only UI here */}
      <ThemeToggle onChange={setTheme} currentTheme={theme} />
      <MusicPlayer />
      {children}
    </>
  );
}
