'use client';

import { useState, useEffect } from 'react';




const grid = [
  ['P', 'K', 'C', 'F', 'B', 'F', 'D', 'K', 'V', 'D', 'X', 'V', 'X', 'G', 'R'],
  ['A', 'D', 'R', 'F', 'E', 'N', 'Y', 'Q', 'R', 'P', 'H', 'F', 'W', 'D', 'O'],
  ['J', 'O', 'C', 'X', 'B', 'I', 'H', 'E', 'B', 'G', 'P', 'X', 'W', 'H', 'S'],
  ['O', 'S', 'U', 'H', 'A', 'O', 'A', 'Z', 'P', 'S', 'Y', 'Q', 'S', 'F', 'R'],
  ['H', 'Q', 'S', 'O', 'H', 'C', 'B', 'N', 'F', 'W', 'S', 'O', 'D', 'W', 'U'],
  ['X', 'M', 'U', 'E', 'T', 'E', 'L', 'U', 'H', 'J', 'I', 'N', 'E', 'V', 'C'],
  ['R', 'N', 'B', 'I', 'L', 'Y', 'Y', 'Q', 'E', 'M', 'E', 'H', 'T', 'I', 'Y'],
  ['P', 'W', 'V', 'E', 'A', 'D', 'L', 'N', 'V', 'E', 'D', 'T', 'C', 'M', 'E'],
  ['W', 'I', 'H', 'L', 'B', 'D', 'A', 'C', 'F', 'B', 'F', 'K', 'D', 'N', 'Z'],
  ['E', 'R', 'K', 'V', 'I', 'X', 'N', 'E', 'U', 'M', 'U', 'Z', 'T', 'Y', 'T'],
  ['U', 'F', 'M', 'L', 'C', 'E', 'S', 'W', 'H', 'W', 'T', 'V', 'I', 'Y', 'R'],
  ['I', 'N', 'H', 'C', 'X', 'H', 'D', 'P', 'H', 'W', 'C', 'V', 'T', 'G', 'J'],
  ['U', 'T', 'W', 'T', 'Q', 'E', 'M', 'H', 'F', 'H', 'Q', 'E', 'T', 'R', 'T'],
  ['B', 'X', 'J', 'L', 'N', 'C', 'G', 'F', 'U', 'W', 'S', 'R', 'E', 'A', 'L'],
  ['M', 'S', 'Z', 'U', 'E', 'K', 'S', 'Q', 'D', 'E', 'V', 'Q', 'R', 'J', 'S'],
];

export default function WordSearchPuzzle() {

const originalWords = ['NEXTJS', 'REACT', 'HEADLESS', 'THEME', 'CURSOR'];
const [words, setWords] = useState(() => shuffle([...originalWords]));

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}


  const [foundWords, setFoundWords] = useState([]);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [tempHighlight, setTempHighlight] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [recentlyFound, setRecentlyFound] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    if (foundWords.length === words.length) {
      setGameComplete(true);
      setTimeout(() => {
         setWords(shuffle([...originalWords])); // ✅ Re-randomize on reset
        setFoundWords([]);
        setHighlightedCells([]);
        setGameComplete(false);
      }, 2500);
    }
  }, [foundWords]);

  const startSelection = (row, col) => {
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
  };

  const updateSelection = (row, col) => {
    if (!isSelecting || selectedCells.length === 0) return;

    const start = selectedCells[0];
    const dr = row - start.row;
    const dc = col - start.col;
    const steps = Math.max(Math.abs(dr), Math.abs(dc));
    if (steps === 0) return;

    const dirR = dr / steps;
    const dirC = dc / steps;

    if (!Number.isInteger(dirR) || !Number.isInteger(dirC)) return;

    const newSelection = [];
    for (let i = 0; i <= steps; i++) {
      const r = start.row + dirR * i;
      const c = start.col + dirC * i;
      if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) return;
      newSelection.push({ row: r, col: c });
    }

    setSelectedCells(newSelection);
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
      setFoundWords((prev) => [...prev, matched]);
      setHighlightedCells((prev) => [...prev, ...selectedCells]);
      setRecentlyFound(matched);
      setTimeout(() => setRecentlyFound(null), 600);
    }

    setSelectedCells([]);
  };

  const isSelected = (row, col) =>
    selectedCells.some((cell) => cell.row === row && cell.col === col);

  const isHighlighted = (row, col) =>
    highlightedCells.some((cell) => cell.row === row && cell.col === col) ||
    tempHighlight.some((cell) => cell.row === row && cell.col === col);

  const handleWordClick = (word) => {
    const directions = [
      [0, 1], [1, 0], [1, 1], [-1, 0],
      [0, -1], [-1, -1], [1, -1], [-1, 1],
    ];

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        for (let dir of directions) {
          const cells = getWordCells(word, row, col, dir);
          if (cells && word === cells.map(({ row, col }) => grid[row][col]).join('')) {
            setTempHighlight(cells);
            setTimeout(() => setTempHighlight([]), 1500);
            return;
          }
        }
      }
    }
  };

  const getWordCells = (word, row, col, [dr, dc]) => {
    const cells = [];
    for (let i = 0; i < word.length; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) return null;
      cells.push({ row: r, col: c });
    }
    return cells;
  };

  return (
    <div className="mx-auto p-4 text-center select-none relative">
      <h2 className="text-xl font-bold mb-2">Word Search</h2>

      <div className="flex justify-center">
        <div
          className="grid aspect-square gap-[1px] bg-gray-300 w-[clamp(300px,80vmin,600px)]"
          style={{ gridTemplateColumns: `repeat(${grid[0].length}, 1fr)` }}
          onMouseLeave={() => setIsSelecting(false)}
          onMouseDown={(e) => e.preventDefault()}
        >
          {grid.map((row, rowIndex) =>
            row.map((letter, colIndex) => {
              const selected = isSelected(rowIndex, colIndex);
              const highlighted = isHighlighted(rowIndex, colIndex);
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`aspect-square w-full flex items-center justify-center border border-white cursor-pointer text-[12px] md:text-[14px]
                    ${
                      highlighted
                        ? 'bg-green-500 text-white'
                        : selected
                        ? 'bg-yellow-300 text-black'
                        : 'bg-[var(--color-bg)] text-[var(--color-text)]'
                    }
                  `}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    startSelection(rowIndex, colIndex);
                  }}
                  onMouseMove={() => {
                    if (isSelecting) updateSelection(rowIndex, colIndex);
                  }}
                  onMouseUp={endSelection}
                >
                  {letter}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 text-xs mt-4">
        {words.map((word) => (
          <button
            key={word}
            onClick={() => handleWordClick(word)}
            className={`px-2 py-1 border rounded transition-all duration-200
              ${foundWords.includes(word) ? 'bg-green-600 text-white' : 'bg-gray-200 text-black'}
              ${recentlyFound === word ? 'animate-ping ring ring-green-400' : ''}
            `}
          >
            {word}
          </button>
        ))}
      </div>

      {gameComplete && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 text-green-700 font-bold text-2xl animate-pulse pointer-events-none">
          🎉 All Words Found! Resetting...
        </div>
      )}
    </div>
  );
}
