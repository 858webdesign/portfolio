'use client';

import { useEffect, useRef, useState } from 'react';

/*
const commonWordPool = [
  'APPLE', 'BANANA', 'ORANGE', 'CHAIR', 'TABLE', 'WINDOW', 'MOUNTAIN', 'RIVER',
  'OCEAN', 'TREE', 'HOUSE', 'CANDLE', 'PENCIL', 'PAPER', 'LADDER', 'BUTTON',
  'CLOCK', 'MIRROR', 'WATER', 'SNOW', 'RAIN', 'STORM', 'CLOUD', 'BRIDGE', 'CARPET'
];
*/

const commonWordPool = [
  'APPLE'
];

const directions = [
  [0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1], [-1, 1]
];

const getRandomWords = (pool, count) =>
  [...pool].sort(() => 0.5 - Math.random()).slice(0, count);

function generateGridWithWords(words, size = 10) {
  const grid = Array.from({ length: size }, () => Array(size).fill(null));

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
      if (!grid[r][c]) {
        grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }

  return grid;
}

export default function WordSearchCanvas() {
  const canvasRef = useRef(null);
  const [words, setWords] = useState([]);
  const [grid, setGrid] = useState([]);
  const [selectedPath, setSelectedPath] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [user, setUser] = useState({ name: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const cellSize = 32;
  const draggingRef = useRef(false);

  useEffect(() => {
    const storedName = localStorage.getItem('ws_name');
    const storedEmail = localStorage.getItem('ws_email');
    if (storedName && storedEmail) {
      setUser({ name: storedName, email: storedEmail });
      setSubmitted(true);
      initGame();
    }
  }, []);

  useEffect(() => {
    drawGrid(grid, selectedPath, foundWords.flatMap(w => w.path));
    if (words.length > 0 && foundWords.length === words.length) {
      setGameComplete(true);
    }
  }, [grid, selectedPath, foundWords]);

  const initGame = () => {
    const newWords = getRandomWords(commonWordPool, 5);
    const newGrid = generateGridWithWords(newWords);
    setWords(newWords);
    setGrid(newGrid);
    setFoundWords([]);
    setSelectedPath([]);
    setGameComplete(false);
  };

  const drawGrid = (grid, selection = [], found = []) => {
    const canvas = canvasRef.current;
    if (!canvas || grid.length === 0) return;
    const ctx = canvas.getContext('2d');

    const theme = getComputedStyle(document.documentElement);
    const textColor = theme.getPropertyValue('--color-text').trim() || '#000';
    const accentColor = theme.getPropertyValue('--color-accent').trim() || '#e35205';
    const foundColor = '#90ee90';
    const bgColor = '#fff';

    const size = grid.length;
    const canvasSize = size * cellSize;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${cellSize * 0.6}px sans-serif`;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const x = c * cellSize;
        const y = r * cellSize;

        const isFound = found.some(p => p.row === r && p.col === c);
        const isSelected = selection.some(p => p.row === r && p.col === c);

        ctx.fillStyle = isFound ? foundColor : isSelected ? accentColor : bgColor;
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.strokeStyle = '#ccc';
        ctx.strokeRect(x, y, cellSize, cellSize);

        ctx.fillStyle = textColor;
        ctx.fillText(grid[r][c], x + cellSize / 2, y + cellSize / 2);
      }
    }
  };

  const getCellFromEvent = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);
    return { row, col };
  };

  const isStraightLineFromStart = (start, current) => {
    const dr = current.row - start.row;
    const dc = current.col - start.col;
    const length = Math.max(Math.abs(dr), Math.abs(dc));
    if (length === 0) return false;
    const stepR = dr / length;
    const stepC = dc / length;
    const path = [];

    for (let i = 0; i <= length; i++) {
      const r = start.row + stepR * i;
      const c = start.col + stepC * i;
      if (!Number.isInteger(r) || !Number.isInteger(c)) return null;
      if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) return null;
      path.push({ row: r, col: c });
    }

    return path;
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    const start = getCellFromEvent(e);
    draggingRef.current = true;
    setSelectedPath([start]);
  };

  const handleDragMove = (e) => {
    if (!draggingRef.current || !selectedPath.length) return;
    e.preventDefault();
    const start = selectedPath[0];
    const current = getCellFromEvent(e);
    const path = isStraightLineFromStart(start, current);
    if (path) {
      setSelectedPath(path);
    }
  };

  const handleDragEnd = () => {
    draggingRef.current = false;
    const path = selectedPath;
    if (!path.length) return;
    const letters = path.map(({ row, col }) => grid[row][col]).join('');
    const reversed = letters.split('').reverse().join('');
    const match = words.find(w => w === letters || w === reversed);
    if (match && !foundWords.find(f => f.word === match)) {
      setFoundWords(prev => [...prev, { word: match, path }]);
    }
    setSelectedPath([]);
  };

  const highlightWord = (word) => {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        for (let [dr, dc] of directions) {
          const path = [];
          for (let i = 0; i < word.length; i++) {
            const r = row + dr * i;
            const c = col + dc * i;
            if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) break;
            if (grid[r][c] !== word[i]) break;
            path.push({ row: r, col: c });
          }
          if (path.length === word.length) {
            setSelectedPath(path);
            setTimeout(() => setSelectedPath([]), 1000);
            return;
          }
        }
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user.name || !user.email) return;
    localStorage.setItem('ws_name', user.name);
    localStorage.setItem('ws_email', user.email);
    setSubmitted(true);
    initGame();
  };

  const resetGame = () => {
    initGame();
  };

  if (!submitted) {
    return (
      <div className="max-w-sm mx-auto mt-10 p-4 border rounded bg-white shadow">
        <h2 className="text-lg font-bold mb-2">Enter to Play</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Your name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="email"
            placeholder="Your email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <button type="submit" className="bg-blue-500 text-white py-2 rounded">
            Start Game
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center p-4 w-full">
      {/* Floating success message */}
    {gameComplete && (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 text-center px-4">
    {/* 🎆 Fireworks floating around (behind message) */}
    <span className="absolute top-10 left-10 text-4xl animate-firework text-yellow-400">🎆</span>
    <span className="absolute top-10 right-10 text-4xl animate-firework text-red-400 delay-150">🎇</span>
    <span className="absolute bottom-10 left-20 text-4xl animate-firework text-purple-400 delay-300">🎆</span>
    <span className="absolute bottom-10 right-20 text-4xl animate-firework text-green-400 delay-500">🎇</span>

    {/* Message box */}
    <div className="bg-green-500 text-white px-6 py-4 rounded shadow-xl animate-dance">
      <h2 className="text-xl font-bold text-white leading-relaxed mb-4 animate-pulse">
        🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉 🎉
        <br />
        Go, go<br />
        Go, go, go, go<br />
        Go, {user.name}, it's your birthday<br />
        We gon' party like it's your birthday<br />
        We gon' sip Bacardí like it's your birthday<br />
        And you know we don't care if it's not your birthday!!
        <br />
        🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉
      </h2>

      <button
        onClick={resetGame}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Play Again
      </button>
    </div>
  </div>
)}



      {/* Puzzle and word list */}
      <div
        className={`transition-opacity duration-700 ease-in-out ${
          gameComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <canvas
          ref={canvasRef}
          className="touch-none border border-gray-300"
          onMouseDown={handleDragStart}
          onMouseMove={(e) => e.buttons === 1 && handleDragMove(e)}
          onMouseUp={handleDragEnd}
          onMouseLeave={(e) => e.buttons === 1 && handleDragEnd(e)}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        />

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {words.map((word) => {
            const isFound = foundWords.some(w => w.word === word);
            return (
              <button
                key={word}
                onClick={() => highlightWord(word)}
                className={`px-2 py-1 rounded text-sm border
                ${isFound ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'}`}
              >
                {word}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
