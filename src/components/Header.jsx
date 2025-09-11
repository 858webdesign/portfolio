'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function Header({ theme }) {
  const pathname = usePathname();
  const [navLinks, setNavLinks] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          'https://backend.petereichhorst.com/wp-json/wp/v2/pages?per_page=100&_fields=slug,title,status'
        );
        const data = await res.json();
        const links = data
          .filter(p => p.slug !== 'home' && p.status === 'publish')
          .map(p => ({ href: `/${p.slug}`, label: p.title.rendered }));
        setNavLinks(links);
      } catch (e) {
        console.error('Failed to load page links:', e);
      }
    })();
  }, []);

  const logoSrc =
    theme === 'alt'
      ? 'https://backend.petereichhorst.com/wp-content/uploads/2025/09/858-logo-vintage.png'
      : 'https://backend.petereichhorst.com/wp-content/uploads/2025/09/858-logo-modern.png';

  return (
    <header className="bg-gray-100s shadow-md p-4">
      <nav className="max-w-[1440px] mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg font-bold flex items-center">
          <img width="150" src={logoSrc} alt="Site Logo" />
        </Link>

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
