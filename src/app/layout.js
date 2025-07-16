// app/layout.js
import './globals.css';
import ThemeWrapper from '@/components/ThemeWrapper';
import DarkModeToggle from '@/components/DarkModeToggle';
import Header from '@/components/Header'; // 👈 your new shared Header component

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="transition-colors duration-300">
        <ThemeWrapper>
          <DarkModeToggle />
          <Header /> {/* 👈 Moved header to its own component */}

          <main className="max-w-[1440px] mx-auto px-4 pt-14">
            {children}
          </main>
        </ThemeWrapper>
      </body>
    </html>
  );
}
