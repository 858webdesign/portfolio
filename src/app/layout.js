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
          <main className="max-w-[1440px] mx-auto  duration-300 pl-10 pr-10 lg:pl-5 lg:pr-5 xl:pl-3  xl:pr-3  pt-14">                         
            {children}
          </main>
        </ThemeWrapper>
      </body>
    </html>
  );
}
