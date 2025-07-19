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
  'SKY', 'BREEZE', 'FOREST', 'JUNGLE', 'FIELD', 'VALLEY', 'CAVE',
  'FIRE', 'ASHES', 'SMOKE', 'WIND', 'WAVE', 'SHELL', 'BRANCH', 'ROOT', 'TRUNK',
  'BARK', 'PATH', 'ROAD', 'TRAIL', 'MAP', 'SIGN', 'ROCK', 'MUD', 'PEBBLE'
];

const getRandomWords = (pool, count) =>
  [...pool].sort(() => 0.5 - Math.random()).slice(0, count);

function generateGridWithWords(words, size = 15) {
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
}

export default function WordSearchPuzzle() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [words, setWords] = useState([]);
  const [grid, setGrid] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [tempHighlight, setTempHighlight] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [recentlyFound, setRecentlyFound] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);

  const initGame = () => {
    const newWords = getRandomWords(commonWordPool, 5);
    setWords(newWords);
    setGrid(generateGridWithWords(newWords));
    setFoundWords([]);
    setHighlightedCells([]);
    setSelectedCells([]);
    setGameComplete(false);
  };

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    const savedEmail = localStorage.getItem('userEmail');
    if (savedName && savedEmail) {
      setUserName(savedName);
      setUserEmail(savedEmail);
      setFormSubmitted(true);
    }
  }, []);

  useEffect(() => {
    if (formSubmitted) {
      initGame();
    }
  }, [formSubmitted]);

  useEffect(() => {
    if (words.length && foundWords.length === words.length) {
      setGameComplete(true);
    }
  }, [foundWords]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (userName.trim() && userEmail.trim()) {
      localStorage.setItem('userName', userName);
      localStorage.setItem('userEmail', userEmail);
      setFormSubmitted(true);
    }
  };

  const startSelection = (row, col) => {
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
  };

  const updateSelection = (row, col) => {
    if (!isSelecting || !selectedCells.length) return;
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

  const isSelected = (row, col) =>
    selectedCells.some(cell => cell.row === row && cell.col === col);

  const isHighlighted = (row, col) =>
    highlightedCells.some(cell => cell.row === row && cell.col === col) ||
    tempHighlight.some(cell => cell.row === row && cell.col === col);

  const handleWordClick = (word) => {
    const directions = [
      [0, 1], [1, 0], [1, 1], [-1, 0], [0, -1], [-1, -1], [1, -1], [-1, 1]
    ];
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        for (let [dr, dc] of directions) {
          const cells = [];
          for (let i = 0; i < word.length; i++) {
            const r = row + dr * i;
            const c = col + dc * i;
            if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) break;
            cells.push({ row: r, col: c });
          }
          if (
            cells.length === word.length &&
            word === cells.map(({ row, col }) => grid[row][col]).join('')
          ) {
            setTempHighlight(cells);
            setTimeout(() => setTempHighlight([]), 1500);
            return;
          }
        }
      }
    }
  };

  if (!formSubmitted) {
    return (
      <form className="max-w-sm mx-auto mt-10 p-4 border rounded text-left space-y-4" onSubmit={handleFormSubmit}>
        <h2 className="text-xl font-semibold">Start Game</h2>
        <div>
          <label className="block mb-1">Name</label>
          <input type="text" className="w-full border px-2 py-1 rounded"
            value={userName} onChange={(e) => setUserName(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input type="email" className="w-full border px-2 py-1 rounded"
            value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Play</button>
      </form>
    );
  }

  return (
    <div className="p-4 text-center select-none relative max-w-screen overflow-hidden">
      <h2 className="text-xl font-bold mb-2">Welcome {userName}!</h2>

      {grid.length > 0 && (
        <div className="flex justify-center">
          <div
            className="grid aspect-square gap-[1px] bg-gray-300 border border-gray-300"
            style={{
              width: '100vw',
              height: '100vw',
              maxWidth: 'min(90vmin, 600px)',
              maxHeight: 'min(90vmin, 600px)',
              gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`
            }}
          >
            {grid.map((row, rowIndex) =>
              row.map((letter, colIndex) => {
                const selected = isSelected(rowIndex, colIndex);
                const highlighted = isHighlighted(rowIndex, colIndex);
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    data-cell={`${rowIndex}-${colIndex}`}
                    className={`aspect-square w-full flex items-center justify-center border text-lg md:text-xl font-medium touch-none
                      ${highlighted ? 'bg-green-500 text-white' :
                        selected ? 'bg-yellow-300 text-black' :
                          'bg-white text-black'}`}
                    onMouseDown={() => startSelection(rowIndex, colIndex)}
                    onMouseMove={() => isSelecting && updateSelection(rowIndex, colIndex)}
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
                  >
                    {letter}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {words.length > 0 && (
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
      )}

      {gameComplete && (
        <div className="absolute inset-0 flex flex-col gap-6 items-center justify-center bg-white/90 text-green-700 font-bold text-xl text-center px-4">
          🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉
          <div>
            Go, go<br />
            Go, go, go, go<br />
            Go, {userName}, it's your birthday<br />
            We gon' party like it's your birthday<br />     
            We gon' sip Bacardí like it's your birthday<br />
            And you know we don't care if it's not your birthday !!      
          </div>
          🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉
          <button
            onClick={initGame}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            🔁 Restart Game
          </button>
        </div>
      )}
    </div>
  );
}
