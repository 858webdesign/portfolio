'use client';

import { useState } from 'react';
// import './WordSearch.css';

const words = ['NEXTJS', 'REACT', 'HEADLESS', 'THEME', 'CURSOR'];

const grid = [
  ['N', 'E', 'X', 'T', 'J', 'S', 'A', 'B'],
  ['C', 'U', 'R', 'S', 'O', 'R', 'E', 'X'],
  ['H', 'E', 'A', 'D', 'L', 'E', 'S', 'S'],
  ['Z', 'A', 'T', 'H', 'E', 'M', 'E', 'Q'],
  ['Y', 'K', 'L', 'A', 'B', 'R', 'A', 'C'],
  ['F', 'B', 'R', 'E', 'A', 'C', 'T', 'Y'],
  ['L', 'Q', 'P', 'O', 'I', 'U', 'W', 'S'],
  ['T', 'H', 'G', 'E', 'M', 'O', 'S', 'D'],
];

export default function WordSearchPuzzle() {
  const [foundWords, setFoundWords] = useState([]);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const startSelection = (row, col) => {
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
  };

  const updateSelection = (row, col) => {
    if (!isSelecting) return;
    // Only add if it's not already selected
    if (!selectedCells.some((c) => c.row === row && c.col === col)) {
      setSelectedCells([...selectedCells, { row, col }]);
    }
  };

  const endSelection = () => {
    setIsSelecting(false);
    checkSelectedWord();
  };

  const checkSelectedWord = () => {
    const selectedWord = selectedCells.map(({ row, col }) => grid[row][col]).join('');
    const reversed = selectedWord.split('').reverse().join('');

    const matched = words.find(
      (word) => word === selectedWord || word === reversed
    );

    if (matched && !foundWords.includes(matched)) {
      setFoundWords([...foundWords, matched]);
      setHighlightedCells([...highlightedCells, ...selectedCells]);
    }

    setSelectedCells([]);
  };

  const isSelected = (row, col) =>
    selectedCells.some((cell) => cell.row === row && cell.col === col);

  const isHighlighted = (row, col) =>
    highlightedCells.some((cell) => cell.row === row && cell.col === col);

  return (
    <div className="word-search-container p-4 text-center select-none">
      <h2 className="text-xl font-bold mb-2">Word Search</h2>

      <div
        className="inline-grid grid-cols-8 gap-1 mb-4"
        onMouseLeave={() => setIsSelecting(false)}
      >
        {grid.map((row, rowIndex) =>
          row.map((letter, colIndex) => {
            const selected = isSelected(rowIndex, colIndex);
            const highlighted = isHighlighted(rowIndex, colIndex);
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-8 h-8 flex items-center justify-center border cursor-pointer text-sm
                  ${
                    highlighted
                      ? 'bg-green-500 text-white'
                      : selected
                      ? 'bg-yellow-300 text-black'
                      : 'bg-[var(--color-bg)] text-[var(--color-text)]'
                  }
                `}
                onMouseDown={() => startSelection(rowIndex, colIndex)}
                onMouseEnter={() => updateSelection(rowIndex, colIndex)}
                onMouseUp={endSelection}
              >
                {letter}
              </div>
            );
          })
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-3 text-sm mt-4">
        {words.map((word) => (
          <span
            key={word}
            className={`px-2 py-1 border rounded ${
              foundWords.includes(word)
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-black'
            }`}
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
