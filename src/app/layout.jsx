// NO 'use client' here
import './globals.css';
// import Header from '@/components/Header';
import ThemeWrapper from '@/components/ThemeWrapper';
import Footer from '@/components/Footer';
import ClientProviders from '@/components/ClientProviders';
import Hero from '@/components/Hero';
export const metadata = {
  title: 'Site',
  description: '...',
};

export default async function RootLayout({ children }) {
  // Server-side fetch so SSR & client match
  const res = await fetch(
    'https://backend.petereichhorst.com/wp-json/wp/v2/pages?slug=about',
    { next: { revalidate: 60 } } // cache for a minute; tweak as needed
  );
  const data = await res.json();
  const page = data?.[0] || null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="transition-colors duration-300 bg-[var(--color-bg)] text-[var(--color-text)]">
        {/* If ThemeWrapper is a server component, keep it here. If it's client, move it into ClientProviders */}
        <ClientProviders>
          
          <ThemeWrapper>  
                   <Hero />    
            <div className="max-w-[1440px] mx-auto px-4 pt-6">
              <main>{children}</main>
              {page && <Footer page={page} />}
            </div>
          </ThemeWrapper>
        </ClientProviders>
      </body>
    </html>
  );
}
