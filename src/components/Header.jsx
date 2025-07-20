// src/components/Header.jsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import ThemeToggle from '@/components/ThemeToggle';

export default function Header() {
  const pathname = usePathname();
  const [navLinks, setNavLinks] = useState([]);

  useEffect(() => {
    async function fetchPages() {
      try {
        const res = await fetch('https://backend.petereichhorst.com/wp-json/wp/v2/pages?per_page=100&_fields=slug,title,status');
        const data = await res.json();

        const links = data
          .filter((page) => page.slug !== 'home' && page.status === 'publish')
          .map((page) => ({
            href: `/${page.slug}`,
            label: page.title.rendered,
          }));

        setNavLinks(links);
      } catch (err) {
        console.error('Failed to load page links:', err);
      }
    }

    fetchPages();
  }, []);

  return (
    <header className="bg-gray-100s shadow-md p-4">
      <nav className="max-w-[1440px] mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg font-bold">
          <h1 className="text-xl text-[var(--color-accent)]">Welcome</h1>

        </Link>
        <div className="flex justify-end">
              <ThemeToggle />
            </div>
        <div className="space-x-4">
          {navLinks.map(({ href, label }) => {
            const isActive =
              pathname === href || (href === '/' && pathname.startsWith('/project/'));

            return (
              <Link
  key={href}
  href={href}
  className={clsx(
    'relative px-1 pb-1 transition-colors',
    isActive
      ? 'text-[var(--color-accent)] font-semibold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[var(--color-accent)]'
      : 'text-[var(--color-text)] hover:text-[var(--color-accent)]'
  )}
>
  {label}
</Link>

            );
          })}
        </div>
      </nav>
    </header>
  );
}
