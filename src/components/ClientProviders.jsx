'use client';

import { useEffect, useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import MusicPlayer from '@/components/MusicPlayer';
import Header from '@/components/Header';

export default function ClientProviders({ children }) {
  const [theme, setTheme] = useState('default');

  // (optional) restore last theme
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'alt' || saved === 'default') setTheme(saved);
  }, []);

  // reflect theme -> <html data-theme="alt"> or remove for default
  useEffect(() => {
    if (theme === 'alt') {
      document.documentElement.setAttribute('data-theme', 'alt');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <>
      <ThemeToggle currentTheme={theme} onChange={setTheme} />
      <Header theme={theme} />
      <MusicPlayer />
      {children}
    </>
  );
}
