// app/layout.jsx
'use client';

import './globals.css';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import ThemeWrapper from '@/components/ThemeWrapper';
import ThemeToggle from '@/components/ThemeToggle';
import CustomCursor from '@/components/CustomCursor';

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      theme === 'retro' ? 'retro' : 'default'
    );
  }, [theme]);
  return (
    <html lang="en" className="cursor-none"> {/* ⛔️ Hide native cursor globally */}
<body className={`transition-colors duration-300 cursor-none bg-[var(--color-bg)] text-[var(--color-text)] ${theme}`}>
            <ThemeWrapper>
            <CustomCursor /> {/* 🔄 Active for all routes */}
          <Header />
          <div className="max-w-[1440px] mx-auto px-4 pt-6 cursor-none ">
            <div className="flex justify-end mb-4">
           <ThemeToggle />
          </div>
            <main>{children}</main>
          </div>
        
        </ThemeWrapper>
      </body>
    </html>
  );
}
