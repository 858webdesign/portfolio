'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateCursor = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      setPosition({ x, y });

      const el = document.elementFromPoint(x, y);
      const isHoverable = el?.closest('a, button, input, textarea, [role="button"], [data-hoverable]');

      setIsHovering(!!isHoverable);
    };

    window.addEventListener('mousemove', updateCursor);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[9999] pointer-events-none transition-transform duration-75"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <img
        src={isHovering ? '/images/cursor-hand.png' : '/images/baseball.png'}
        alt="Cursor"
        className="w-6 h-6"
        draggable="false"
      />
    </div>
  );
}
