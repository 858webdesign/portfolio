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
      <body className="transition-colors duration-300">
        <ThemeWrapper>
          <main className="min-h-screen  dark:text-white">
            <div className="p-4">
              <DarkModeToggle />
            </div>
            {children}
          </main>
        </ThemeWrapper>

       


      </body>
    </html>
  );
}
