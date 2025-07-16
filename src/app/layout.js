// app/layout.js
import './globals.css';
import ThemeWrapper from '@/components/ThemeWrapper';
import DarkModeToggle from '@/components/DarkModeToggle';

export const metadata = {
  title: 'My Portfolio',
  description: 'Projects',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="transition-colors duration-300 ">
        <ThemeWrapper> <DarkModeToggle />
          <main className="max-w-[1440px] mx-auto  duration-300">                         
            {children}
          </main>
        </ThemeWrapper>
      </body>
    </html>
  );
}
