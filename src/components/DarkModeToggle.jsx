// /src/components/DarkModeToggle.jsx
'use client';

export default function DarkModeToggle() {
  const toggleDarkMode = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    if (isDark) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="px-4 py-2 border rounded mt-4 dark:bg-gray-700 dark:text-white"
    >
      Toggle Dark Mode
    </button>
  );
}
