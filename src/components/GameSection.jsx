'use client';

import { useEffect } from 'react';

export default function GameSection({ showGame }) {
  useEffect(() => {
    if (!showGame) return;

    const mountGame = () => {
      const el = document.getElementById('vite-game-root');
      if (!el || el.dataset.mounted) return;

      const tryMount = () => {
        if (window.__vite_game_mount__) {
          window.__vite_game_mount__();
          el.dataset.mounted = 'true';
        } else {
          console.warn('⚠️ mount fn not ready, retrying...');
          setTimeout(tryMount, 50);
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
      script.onload = mountGame;
      document.body.appendChild(script);
    } else {
      mountGame();
    }
  }, [showGame]);

  if (!showGame) return null;

  return (
    <>
      <h1 className="text-2xl mb-4 text-center">Try This Puzzle:</h1>
      <div id="vite-game-root" className="my-8" />
    </>
  );
}
