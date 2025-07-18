// app/layout.jsx
'use client';

import './globals.css';
import Header from '@/components/Header';
import ThemeWrapper from '@/components/ThemeWrapper';
import DarkModeToggle from '@/components/DarkModeToggle';
import CustomCursor from '@/components/CustomCursor';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="cursor-none"> {/* ⛔️ Hide native cursor globally */}
      <body className="transition-colors duration-300 cursor-none">
        <ThemeWrapper>
            <CustomCursor /> {/* 🔄 Active for all routes */}
          <Header />
          <div className="max-w-[1440px] mx-auto px-4 pt-6 cursor-none">
            <div className="flex justify-end mb-4">
              <DarkModeToggle />
            </div>
            <main>{children}</main>
          </div>
        
        </ThemeWrapper>
      </body>
    </html>
  );
}
