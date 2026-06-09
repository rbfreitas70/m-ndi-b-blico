import { useState } from 'react';
import { SFX } from '@/lib/audioEngine';
import ConfettiEffect from '@/components/ConfettiEffect';

const GRID_OPTS = [
  { size: 3, label: '3×3 Fácil', xp: 30, dr: 15 },
  { size: 4, label: '4×4 Médio', xp: 50, dr: 25 },
  { size: 5, label: '5×5 Difícil', xp: 70, dr: 35 },
];

// A set of solid colors that look like puzzle pieces
const PIECE_COLORS = [
  '#FF8A65','#FFD54F','#81C784','#4FC3F7','#CE93D8','#F48FB1',
  '#80DEEA','#FFAB91','#A5D6A7','#90CAF9','#B39DDB','#FFCC02',
  '#FF7043','#FFA726','#66BB6A','#29B6F6','#AB47BC','#EC407A',
  '#26C6DA','#FFCA28','#26A69A','#42A5F5','#7E57C2','#EF5350',
  '#8D6E63','#78909C','#D4E157','#26C6DA','#FF7043','#BDBDBD',
  '#FFEE58','#AED581','#4DB6AC','#64B5F6','#9575CD','#E57373',
];

function makeGrid(size) {
  const pieces = Array.from({ length: size * size }, (_, i) => i);
  const shuffled = [...pieces].sort(() => Math.random() - 0.5);
  return shuffled;
}

function isSolved(grid) {
  return grid.every((v, i) => v === i);
}

export default function PuzzleGame({ onBack, onComplete }) {
  const [cfg, setCfg] = useState(null);
  const [grid, setGrid] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [won, setWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const startGame = (opt) => {
    SFX.click();
    setCfg(opt);
    setGrid(makeGrid(opt.size));
    setWon(false);
  };

  const handleDragStart = (i) => { SFX.click(); setDragging(i); };

  const handleDrop = (target) => {
    if (dragging === null || dragging === target) { setDragging(null); return; }
    SFX.flip();
    const next = [...grid];
    [next[dragging], next[target]] = [next[target], next[dragging]];
    setGrid(next);
    setDragging(null);
    if (isSolved(next)) {
      setTimeout(() => { setWon(true); setShowConfetti(true); SFX.victory(); }, 200);
    }
  };

  if (!cfg) {
    return (
      <div className="h-full flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #E65100 0%, #BF360C 100%)' }}>
        <div className="px-4 pt-10 pb-4 flex items-center gap-3">
          <button onClick={() => { SFX.click(); onBack(); }}
            className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">←</button>
          <h2 className="font-display text-2xl text-white">🧩 Quebra-Cabeça</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
          <p className="font-body text-white/70 text-center">Escolha a dificuldade:</p>
          {GRID_OPTS.map(opt => (
            <button key={opt.size} onClick={() => startGame(opt)}
              className="w-full max-w-xs py-4 rounded-2xl font-display text-white text-xl transition-all hover:scale-[1.03] active:scale-[0.97]"
              style={{ background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.4)', boxShadow: '0 6px 0 rgba(0,0,0,0.2)' }}>
              🧩 {opt.label} · +{opt.xp} XP
            </button>
          ))}
        </div>
      </div>
    );
  }

  const pxSize = Math.min(56, Math.floor(280 / cfg.size));

  return (
    <div className="h-full flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #E65100 0%, #BF360C 100%)' }}>
      <ConfettiEffect active={showConfetti} onDone={() => setShowConfetti(false)} />

      <div className="px-4 pt-10 pb-4 flex items-center gap-3">
        <button onClick={() => { SFX.click(); setCfg(null); setWon(false); }}
          className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">←</button>
        <h2 className="font-display text-xl text-white">🧩 {cfg.label}</h2>
        <div className="ml-auto bg-white/20 px-3 py-1 rounded-full">
          <span className="font-body text-white text-xs">
            {grid.filter((v, i) => v === i).length}/{cfg.size * cfg.size} ✓
          </span>
        </div>
      </div>

      {!won ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4">
          <p className="font-body text-white/60 text-xs text-center">Arraste as peças para ordenar as cores!</p>

          {/* Reference */}
          <div className="grid gap-0.5 p-1 rounded-xl bg-white/10"
            style={{ gridTemplateColumns: `repeat(${cfg.size}, ${Math.floor(pxSize * 0.45)}px)` }}>
            {Array.from({ length: cfg.size * cfg.size }, (_, i) => (
              <div key={i} className="rounded" style={{ width: Math.floor(pxSize * 0.45), height: Math.floor(pxSize * 0.45), background: PIECE_COLORS[i % PIECE_COLORS.length], opacity: 0.5 }} />
            ))}
          </div>

          {/* Puzzle grid */}
          <div className="grid gap-1 p-2 rounded-2xl bg-black/20"
            style={{ gridTemplateColumns: `repeat(${cfg.size}, ${pxSize}px)` }}>
            {grid.map((val, i) => (
              <div key={i} draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={e => e.preventDefault()}
                onDrop={() => handleDrop(i)}
                onClick={() => { if (dragging !== null && dragging !== i) handleDrop(i); else handleDragStart(i); }}
                className="rounded-lg cursor-grab active:cursor-grabbing select-none flex items-center justify-center"
                style={{
                  width: pxSize,
                  height: pxSize,
                  background: PIECE_COLORS[val % PIECE_COLORS.length],
                  border: val === i ? '2px solid rgba(255,255,255,0.8)' : dragging === i ? '3px solid #FFD54F' : '2px solid rgba(0,0,0,0.2)',
                  boxShadow: dragging === i ? '0 0 12px #FFD54F88' : '0 2px 4px rgba(0,0,0,0.25)',
                  opacity: dragging === i ? 0.6 : 1,
                  transform: dragging === i ? 'scale(0.9)' : 'scale(1)',
                  transition: 'transform 0.1s',
                  fontSize: pxSize * 0.3,
                }}>
                {val === 0 ? '✝️' : val === cfg.size * cfg.size - 1 ? '⭐' : ''}
              </div>
            ))}
          </div>

          <button onClick={() => { setGrid(makeGrid(cfg.size)); SFX.click(); }}
            className="bg-white/20 text-white font-body text-sm px-4 py-2 rounded-full border border-white/30">
            🔀 Embaralhar
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-5">
          <div className="text-7xl">🧩</div>
          <h2 className="font-display text-3xl text-white">Resolvido!</h2>
          <div className="flex gap-4">
            <div className="bg-white/15 rounded-2xl px-6 py-3 border border-white/20">
              <p className="font-display text-2xl text-yellow-300">+{cfg.xp}</p>
              <p className="font-body text-white/50 text-xs">XP</p>
            </div>
            <div className="bg-white/15 rounded-2xl px-6 py-3 border border-white/20">
              <p className="font-display text-2xl text-orange-300">+{cfg.dr} 🪙</p>
              <p className="font-body text-white/50 text-xs">Dracmas</p>
            </div>
          </div>
          <button onClick={() => onComplete(cfg.xp, cfg.dr)}
            className="w-full max-w-xs py-4 rounded-2xl font-display text-xl text-white"
            style={{ background: 'linear-gradient(135deg, #FFD54F, #FF8A65)', boxShadow: '0 6px 0 rgba(0,0,0,0.25)' }}>
            🎉 Resgatar!
          </button>
          <button onClick={() => startGame(cfg)} className="font-body text-white/40 text-sm underline">Jogar de novo</button>
        </div>
      )}
    </div>
  );
}