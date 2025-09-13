'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <section
      className="relative h-[90vh] w-full flex items-center justify-center text-center overflow-hidden"
      style={{
        backgroundImage:
          "url('https://858webdesign.com/wp-content/uploads/2022/03/hero-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-3xl px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
          Crafting Digital Experiences <br />
          <span className="text-[var(--color-accent)]">That Inspire</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-white/90">
          We design and build websites, apps, and digital products that stand
          out and deliver results.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/projects"
            className="rounded-2xl bg-[var(--color-accent)] px-6 py-3 text-white font-semibold shadow hover:shadow-lg active:scale-95 transition"
          >
            View Our Work
          </Link>
          <Link
            href="/contact"
            className="rounded-2xl border border-white/70 px-6 py-3 text-white font-semibold hover:bg-white hover:text-black transition"
          >
            Get in Touch
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
