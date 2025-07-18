'use client';

import { useEffect, useState } from 'react';

export default function AdminEditOverlay({ editUrl }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Simplest check — adjust to match your auth logic (cookie/localStorage/token)
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'administrator') setIsAdmin(true);
  }, []);

  if (!isAdmin) return null;

  return (
    <a
      href={editUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 text-xs font-semibold rounded shadow-lg z-10 hover:bg-yellow-500"
    >
      ✏️ Edit
    </a>
  );
}
