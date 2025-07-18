'use client';


import './globals.css';
import ThemeWrapper from '@/components/ThemeWrapper';
import DarkModeToggle from '@/components/DarkModeToggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx'; // optional, or use inline logic

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Projects' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="transition-colors duration-300">
        <ThemeWrapper>
          <DarkModeToggle />

          <header className="bg-gray-100 shadow-md p-4">
            <nav className="max-w-[1440px] mx-auto flex justify-between items-center">
              <Link href="/" className="text-lg font-bold">Portfolio</Link>
              <div className="space-x-4">
                {navLinks.map(({ href, label }) => {
                  const isActive = pathname === href || (href === '/' && pathname.startsWith('/project/'));
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={clsx(
                        'relative px-1 pb-1 transition-colors',
                        isActive ? 'text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-blue-600' : 'text-gray-700 hover:text-blue-500'
                      )}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </header>

          <main className="max-w-[1440px] mx-auto px-4 pt-14">
            {children}
          </main>
        </ThemeWrapper>
      </body>
    </html>
  );
}
