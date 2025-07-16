// src/app/layout.js
import './globals.css';
import DarkModeScript from '@/components/DarkModeScript';
import DarkModeToggle from '@/components/DarkModeToggle';

export const metadata = {
  title: 'My Portfolio',
  description: 'Projects',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="bg-white text-black dark:bg-gray-900 dark:text-white">
        <DarkModeScript />
        <DarkModeToggle />
        {children}
      </body>
    </html>
  );
}
