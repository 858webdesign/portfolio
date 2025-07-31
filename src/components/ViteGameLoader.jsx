'use client';

import { useEffect } from 'react';

export default function ViteGameLoader() {
  useEffect(() => {
    const el = document.getElementById('vite-game-root');

    const tryMount = (retries = 10) => {
      if (typeof window.__vite_game_mount__ === 'function') {
        console.log('✅ mount fn ready – mounting now');
        window.__vite_game_mount__();
        if (el) el.dataset.mounted = 'true';
      } else if (retries > 0) {
        console.warn('⚠️ mount fn not ready, retrying...');
        setTimeout(() => tryMount(retries - 1), 200);
      } else {
        alert('❌ mount fn never became ready');
      }
    };

    const existingScript = document.getElementById('vite-game-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = '/vite-games/index.js'; // ✅ make sure this exists in `/public/vite-games/`
      script.id = 'vite-game-script';
      script.defer = true;
      script.onload = () => {
        console.log('📦 script loaded');
        tryMount();
      };
      document.body.appendChild(script);
    } else {
      tryMount(); // Already loaded? Try immediately
    }
  }, []);

  return <div id="vite-game-root" className="my-8" />;
}
