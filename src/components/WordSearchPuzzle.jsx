'use client';

import { useState, useEffect } from 'react';

const commonWordPool = [
  'APPLE', 'BANANA', 'ORANGE', 'CHAIR', 'TABLE', 'WINDOW', 'MOUNTAIN', 'RIVER',
  'OCEAN', 'TREE', 'HOUSE', 'CANDLE', 'PENCIL', 'PAPER', 'LADDER', 'BUTTON',
  'CLOCK', 'MIRROR', 'WATER', 'SNOW', 'RAIN', 'THUNDER', 'STORM', 'CLOUD',
  'BRIDGE', 'CARPET', 'DESK', 'WALL', 'FLOOR', 'BOTTLE', 'TOOTH', 'SHOE',
  'PLANE', 'TRAIN', 'CUP', 'PLATE', 'KNIFE', 'FORK', 'SPOON', 'GLASS',
  'MUSIC', 'GUITAR', 'PIANO', 'VIOLIN', 'DRUM', 'HORSE', 'ZEBRA', 'ELEPHANT',
  'TIGER', 'LION', 'BEAR', 'FOX', 'SNAKE', 'FISH', 'BIRD', 'DUCK', 'FROG',
  'GARDEN', 'FLOWER', 'ROSE', 'DAISY', 'GRASS', 'LEAF', 'STONE', 'SAND',
  'BEACH', 'ISLAND', 'SUNSET', 'SUNRISE', 'STAR', 'MOON', 'PLANET', 'SPACE',
  'CLOUD', 'SKY', 'BREEZE', 'FOREST', 'JUNGLE', 'FIELD', 'VALLEY', 'CAVE',
  'FIRE', 'ASHES', 'SMOKE', 'WIND', 'WAVE', 'SHELL', 'BRANCH', 'ROOT', 'TRUNK',
  'BARK', 'PATH', 'ROAD', 'TRAIL', 'MAP', 'SIGN', 'ROCK', 'MUD', 'PEBBLE'
];

function getRandomWords(pool, count) {
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function WordSearchPuzzle() {
  const [words, setWords] = useState([]);
  const [grid, setGrid] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [tempHighlight, setTempHighlight] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [recentlyFound, setRecentlyFound] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    const newWords = getRandomWords(commonWordPool, 5);
    setWords(newWords);
    setGrid(generateGridWithWords(newWords));
  }, []);

  useEffect(() => {
    if (foundWords.length === words.length && words.length > 0) {
      setGameComplete(true);
      setTimeout(() => {
        const newWords = getRandomWords(commonWordPool, 5);
        setWords(newWords);
        setGrid(generateGridWithWords(newWords));
        setFoundWords([]);
        setHighlightedCells([]);
        setGameComplete(false);
      }, 2500);
    }
  }, [foundWords]);

  const generateGridWithWords = (words, size = 15) => {
    const grid = Array.from({ length: size }, () => Array(size).fill(null));
    const directions = [
      [0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1], [-1, 1]
    ];

    const placeWord = (word) => {
      for (let attempt = 0; attempt < 100; attempt++) {
        const dir = directions[Math.floor(Math.random() * directions.length)];
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);

        let fits = true;
        for (let i = 0; i < word.length; i++) {
          const r = row + dir[0] * i;
          const c = col + dir[1] * i;
          if (
            r < 0 || r >= size ||
            c < 0 || c >= size ||
            (grid[r][c] !== null && grid[r][c] !== word[i])
          ) {
            fits = false;
            break;
          }
        }
        if (!fits) continue;

        for (let i = 0; i < word.length; i++) {
          const r = row + dir[0] * i;
          const c = col + dir[1] * i;
          grid[r][c] = word[i];
        }
        return true;
      }
      return false;
    };

    words.forEach(placeWord);

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] === null) {
          grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    return grid;
  };

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
    const matched = words.find(word => word === selectedWord || word === reversed);

    if (matched && !foundWords.includes(matched)) {
      setFoundWords(prev => [...prev, matched]);
      setHighlightedCells(prev => [...prev, ...selectedCells]);
      setRecentlyFound(matched);
      setTimeout(() => setRecentlyFound(null), 600);
    }
    setSelectedCells([]);
  };

  const isSelected = (row, col) => selectedCells.some(cell => cell.row === row && cell.col === col);
  const isHighlighted = (row, col) =>
    highlightedCells.some(cell => cell.row === row && cell.col === col) ||
    tempHighlight.some(cell => cell.row === row && cell.col === col);

  const handleWordClick = (word) => {
    const directions = [
      [0, 1], [1, 0], [1, 1], [-1, 0],
      [0, -1], [-1, -1], [1, -1], [-1, 1]
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
    <div className="mx-auto text-center select-none relative">
      <h2 className="text-xl font-bold mb-2">Word Search</h2>
      <div className="flex justify-center">
        <div className="w-full max-w-[600px] overflow-x-auto">
          <div
            className="grid aspect-square gap-[1px] bg-gray-300 w-full"
            style={{ gridTemplateColumns: `repeat(${grid[0]?.length || 15}, 1fr)` }}
            onTouchStart={(e) => e.preventDefault()}
          >
            {grid.map((row, rowIndex) =>
              row.map((letter, colIndex) => {
                const selected = isSelected(rowIndex, colIndex);
                const highlighted = isHighlighted(rowIndex, colIndex);
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`aspect-square w-full flex items-center justify-center border border-white cursor-pointer touch-none text-[20px] md:text-[26px]
                      ${highlighted ? 'bg-green-500 text-white' : selected ? 'bg-yellow-300 text-black' : 'bg-[var(--color-bg)] text-[var(--color-text)]'}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      startSelection(rowIndex, colIndex);
                    }}
                    onMouseMove={() => {
                      if (isSelecting) updateSelection(rowIndex, colIndex);
                    }}
                    onMouseUp={endSelection}
                    onTouchStart={() => startSelection(rowIndex, colIndex)}
                    onTouchMove={(e) => {
                      const touch = e.touches[0];
                      const target = document.elementFromPoint(touch.clientX, touch.clientY);
                      if (target?.dataset?.cell) {
                        const [r, c] = target.dataset.cell.split('-').map(Number);
                        updateSelection(r, c);
                      }
                    }}
                    onTouchEnd={endSelection}
                    data-cell={`${rowIndex}-${colIndex}`}
                  >
                    {letter}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 text-xs mt-4">
        {words.map((word) => (
          <button
            key={word}
            onClick={() => handleWordClick(word)}
            className={`px-2 py-1 border rounded transition-all duration-200
              ${foundWords.includes(word) ? 'bg-green-600 text-white' : 'bg-gray-200 text-black'}
              ${recentlyFound === word ? 'animate-ping ring ring-green-400' : ''}`}
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
