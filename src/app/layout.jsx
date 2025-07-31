'use client';

import './globals.css';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import ThemeWrapper from '@/components/ThemeWrapper';
import CustomCursor from '@/components/CustomCursor';
import Footer from '@/components/Footer';
import MusicPlayer from '@/components/MusicPlayer';

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState('default');
  const [page, setPage] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      theme === 'retro' ? 'retro' : 'default'
    );
  }, [theme]);

  useEffect(() => {
    async function fetchPage() {
      const res = await fetch('https://backend.petereichhorst.com/wp-json/wp/v2/pages?slug=about'); // update this slug dynamically if needed
      const data = await res.json();
      setPage(data?.[0] || null);
    }

    fetchPage();
  }, []);




  return (
    <html lang="en" className="cursor-none">
      <body className={`transition-colors duration-300 cursor-none bg-[var(--color-bg)] text-[var(--color-text)] ${theme}`}>
        <ThemeWrapper>
          <MusicPlayer />
          <CustomCursor />
          <Header />
          <div className="max-w-[1440px] mx-auto px-4 pt-6 cursor-none ">
            <main>{children}</main>
            {page && <Footer page={page} />} {/* ✅ Now ACF works */}
          </div>
        </ThemeWrapper>
      </body>
    </html>
  );
}
