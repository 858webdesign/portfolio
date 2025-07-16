'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function Header() {
  const pathname = usePathname();
  const [navLinks, setNavLinks] = useState([]);

  useEffect(() => {
    async function fetchPages() {
      try {
        const res = await fetch('https://backend.petereichhorst.com/wp-json/wp/v2/pages?per_page=100');
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
    <header className="bg-gray-100 shadow-md p-4">
      <nav className="max-w-[1440px] mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg font-bold">Peter Eichhorst</Link>
        <div className="space-x-4">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "hover:underline",
                pathname === href && "text-blue-600 font-semibold underline"
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
