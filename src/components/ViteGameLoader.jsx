'use client';

import { useEffect } from 'react';

export default function ViteGameLoader() {
  useEffect(() => {
    const mountWhenReady = () => {
      const el = document.getElementById('vite-game-root');
      if (!el || el.dataset.mounted) return;

      const tryMount = () => {
        if (window.__vite_game_mount__) {
          window.__vite_game_mount__();
          el.dataset.mounted = 'true';
        } else {
          setTimeout(tryMount, 50); // Retry until it's defined
        }
      };

      tryMount();
    };

    const existingScript = document.getElementById('vite-game-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src =
        'https://backend.petereichhorst.com/wp-content/plugins/headless-frontend/react/games/dist/assets/index.js';
      script.id = 'vite-game-script';
      script.defer = true;
      script.onload = mountWhenReady;
      document.body.appendChild(script);
    } else {
      mountWhenReady();
    }
  }, []);

  return <div id="vite-game-root" className="my-8" />;
}
