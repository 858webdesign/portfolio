'use client';

import './globals.css';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import ThemeWrapper from '@/components/ThemeWrapper';
import CustomCursor from '@/components/CustomCursor';
import Footer from '@/components/Footer';
import MusicPlayer from '@/components/MusicPlayer'; // ✅ NEW

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      theme === 'retro' ? 'retro' : 'default'
    );
  }, [theme]);

  return (
    <html lang="en" className="cursor-none">
      <body className={`transition-colors duration-300 cursor-none bg-[var(--color-bg)] text-[var(--color-text)] ${theme}`}>
        <ThemeWrapper>
           <MusicPlayer /> {/* ✅ Add music button */}
          <CustomCursor />
          <Header />
          <div className="max-w-[1440px] mx-auto px-4 pt-6 cursor-none ">
            <main>{children}</main>
            <Footer />
          </div>

         
        </ThemeWrapper>
      </body>
    </html>
  );
}
