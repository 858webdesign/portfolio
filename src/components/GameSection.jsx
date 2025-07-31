'use client';
import { useEffect } from 'react';

export default function GameSection() {
  useEffect(() => {
    const el = document.getElementById('vite-game-root');

    const mountGame = () => {
      if (window.__vite_game_mount__ && el && !el.dataset.mounted) {
        window.__vite_game_mount__();
        el.dataset.mounted = 'true';
      } else if (!window.__vite_game_mount__) {
        console.warn('⚠️ mount fn not ready, retrying...');
        setTimeout(mountGame, 200); // Retry after 200ms
      }
    };

    if (!document.getElementById('vite-game-script')) {
      const script = document.createElement('script');
      script.id = 'vite-game-script';
      script.src = 'https://backend.petereichhorst.com/wp-content/plugins/headless-frontend/react/games/dist/assets/index.js';
      script.defer = true;
      script.onload = mountGame;
      document.body.appendChild(script);
    } else {
      mountGame(); // If already exists, try mounting
    }
  }, []);

  return (
    <>
      <h1 className="text-2xl mb-4 text-center">Try This Puzzle:</h1>
      <div id="vite-game-root" className="my-8" />
    </>
  );
}
