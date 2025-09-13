'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Menu, X } from 'lucide-react'; // icons

export default function Header({ theme }) {
  const pathname = usePathname();
  const [navLinks, setNavLinks] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

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
    <header className="bg-white shadow-md p-4 sticky top-0 z-50">
      <nav className="max-w-[1440px] mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="http://localhost:3000/" className="flex items-center">
          <img width="150" src={logoSrc} alt="Site Logo" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
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

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-[var(--color-text)]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div
        className={clsx(
          'md:hidden bg-white shadow-lg transition-all overflow-hidden',
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="flex flex-col px-6 py-4 space-y-3">
          {navLinks.map(({ href, label }) => {
            const isActive =
              pathname === href || (href === '/' && pathname.startsWith('/project/'));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)} // close menu after click
                className={clsx(
                  'block text-lg transition-colors',
                  isActive
                    ? 'text-[var(--color-accent)] font-semibold'
                    : 'text-[var(--color-text)] hover:text-[var(--color-accent)]'
                )}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
 
    </header>
  );
}
