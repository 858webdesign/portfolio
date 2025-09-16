"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Use env var so dev/prod can point to different URLs without code edits.
 * e.g. NEXT_PUBLIC_GAMES_SRC="https://backend.petereichhorst.com/wp-content/plugins/headless-frontend/react/games/dist-embed/embed-games.js"
 */
const DEFAULT_SRC =
  process.env.NEXT_PUBLIC_GAMES_SRC ??
  "https://backend.petereichhorst.com/wp-content/plugins/headless-frontend/react/games/dist-embed/embed-games.js";

const ID = "vite-game-script";
const ROOT_ID = "vite-game-root";

export default function GameSection({
  label = 'Wordsearch Game',
  debugInfo = '',
  scriptSrc = DEFAULT_SRC,
}) {
  const rootRef = useRef(null);
  const didInit = useRef(false); // guard StrictMode double-run
  const [status, setStatus] = useState("idle"); // idle|loading|ready|mounted|error
  const [err, setErr] = useState("");

  useEffect(() => {
    if (didInit.current) return; // prevent double-effect in dev
    didInit.current = true;

    const el = rootRef.current;

    if (!el) return;

    // Ensure the embed sees a stable id and clear out duplicates from WP content.
    const existingRoots = Array.from(
      document.querySelectorAll(`[id^="${ROOT_ID}"]`)
    );
    existingRoots.forEach((node) => {
      if (node === el) return;
      if (node.id === ROOT_ID || node.id.startsWith(`${ROOT_ID}-`)) {
        node.removeAttribute("id");
        node.textContent = '';
      }
    });

    const fallbackRoots = Array.from(
      document.querySelectorAll('.vite-game-root, [data-vite-game]')
    );
    fallbackRoots.forEach((node) => {
      if (node === el) return;
      node.removeAttribute('id');
      node.textContent = '';
    });
    el.id = ROOT_ID;

    const tryMountNow = () => {
      const m = window.ViteGame?.mount || window.__vite_game_mount__;
      if (typeof m === "function") {
        try {
          m.length > 0 ? m(el) : m();
          setStatus("mounted");
          return true;
        } catch (e) {
          setStatus("error");
          setErr(String(e?.message || e));
          return true; // stop further retries; it threw
        }
      }
      return false;
    };

    const waitForGlobal = (msTotal = 6000, step = 150) =>
      new Promise((resolve) => {
        let waited = 0;
        const tick = () => {
          if (tryMountNow()) return resolve(true);
          waited += step;
          if (waited >= msTotal) return resolve(false);
          setTimeout(tick, step);
        };
        tick();
      });

    const injectCss = () => {
      if (!scriptSrc) return;
      const cssHref = scriptSrc.replace(/(\.js)(\?.*)?$/, '.css$2');
      if (!cssHref) return;
      const marker = `link[data-vite-game-css="${cssHref}"]`;
      if (document.querySelector(marker)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssHref;
      link.setAttribute('data-vite-game-css', cssHref);
      document.head.appendChild(link);
    };

    const injectScript = () =>
      new Promise((resolve, reject) => {
        let s = document.getElementById(ID);
        if (s) return resolve(true);

        s = document.createElement("script");
        s.id = ID;
        s.src = scriptSrc;
        s.async = true;
        s.onload = () => resolve(true);
        s.onerror = () => reject(new Error("Failed to load embed script"));
        document.body.appendChild(s);
      });

    (async () => {
      try {
        console.debug('GameSection mounting Vite game', { scriptSrc });
        setStatus("loading");

        injectCss();

        // If global already present (e.g., loaded by shortcode on same page), mount immediately.
        if (tryMountNow()) return;

        // Inject (idempotent)
        await injectScript();
        setStatus("ready");

        // Poll for the global for up to 3s without throwing
        const ok = await waitForGlobal(3000, 100);
        if (!ok) {
          setStatus("error");
          setErr("window.ViteGame.mount not found within timeout");
        }
      } catch (e) {
        setStatus("error");
        setErr(String(e?.message || e));
      }
    })();
  }, []);

  return (
    <>        
      <div
        id={ROOT_ID}
        ref={rootRef}
        className=""
      />
      {status !== "mounted" && (
        <p className="text-sm text-center text-gray-500">
          {status === "loading" && "Loading game..."}
          {status === "ready" && "Preparing to mount..."}
          {status === "error" && <>Couldn't mount. {err}</>}
        </p>
      )}
    </>
  );
}
