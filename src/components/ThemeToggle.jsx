'use client';

export default function ThemeToggle({ currentTheme, onChange }) {
  const toggleTheme = () => onChange(currentTheme === 'default' ? 'alt' : 'default');

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col items-end gap-2">
      <button
        onClick={toggleTheme}
        className="px-4 py-2 bg-[var(--color-bg-dark)] text-[var(--color-accent)] rounded"
      >
        Switch Theme
      </button>
    </div>
  );
}
