// ViteGameLoader.jsx
'use client';

import { useEffect, useRef } from 'react';

export default function ViteGameLoader({
  jsSrc = 'https://backend.petereichhorst.com/wp-content/plugins/headless-frontend/react/games/dist-embed/embed-games.js',
  cssHref = 'https://backend.petereichhorst.com/wp-content/plugins/headless-frontend/react/games/dist-embed/embed-games.css',
  className = 'my-8',
}) {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || el.dataset.mounted === 'true') return;

    // inject CSS once
    if (cssHref && !document.querySelector(`link[data-vite-game-css="${cssHref}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssHref;
      link.setAttribute('data-vite-game-css', cssHref);
      document.head.appendChild(link);
    }

    // load script once (memoize a promise on window)
    if (!window.__viteGameScriptPromise) {
      window.__viteGameScriptPromise = new Promise((resolve, reject) => {
        if (window.ViteGame?.mount) return resolve();
        const existing = document.querySelector(`script[data-vite-game-js="${jsSrc}"]`);
        if (existing) {
          existing.addEventListener('load', () => resolve());
          existing.addEventListener('error', () => reject(new Error('ViteGame script error')));
        } else {
          const s = document.createElement('script');
          s.src = jsSrc;
          s.async = true;
          s.setAttribute('data-vite-game-js', jsSrc);
          s.onload = () => resolve();
          s.onerror = () => reject(new Error('ViteGame script error'));
          document.body.appendChild(s);
        }
      });
    }

    window.__viteGameScriptPromise
      .then(() => {
        const api = window.ViteGame;
        if (api?.mount) {
          api.mount(el); // pass element
          el.dataset.mounted = 'true';
        } else {
          console.warn('ViteGame.mount not found');
        }
      })
      .catch(console.error);
  }, [jsSrc, cssHref]);

  return <div ref={rootRef} className={className} />;
}
