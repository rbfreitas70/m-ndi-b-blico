import { useState, useCallback } from 'react';
import { SFX } from '@/lib/audioEngine';
import ConfettiEffect from '@/components/ConfettiEffect';

// 3x3 puzzle of the Red Sea crossing — each tile has a fixed SVG fragment
const TOTAL = 9;

// The full scene description per piece index (row-major, 0=top-left, 8=bottom-right)
const PIECE_LABELS = [
  'Céu estrelado',   'Nuvem de Deus',   'Céu estrelado',
  'Parede d\'água',  'Povo cruzando',   'Parede d\'água',
  'Areia do mar',    'Moisés com cajado','Areia do mar',
];

// SVG for each of the 9 tiles (280×200 total, tiles are ~93×66)
function TileSVG({ index, dim }) {
  const col = index % 3;
  const row = Math.floor(index / 3);
  const W = 93, H = 66;

  // Colors
  const skyTop = '#0D1B6E', skyBot = '#1565C0';
  const waterL = '#0288D1', waterR = '#01579B';
  const sand = '#D7B07A';
  const waterMid = '#29B6F6';

  const bg = row === 0 ? skyTop : row === 1 ? waterMid : sand;

  return (
    <svg
      viewBox={`${col * W} ${row * H} ${W} ${H}`}
      width={dim} height={dim}
      style={{ display: 'block', borderRadius: 6, overflow: 'hidden' }}
    >
      {/* Sky */}
      <rect x="0" y="0" width="280" height="66" fill={skyTop} />
      {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
        <circle key={i} cx={8 + i * 26} cy={8 + (i % 3) * 10} r="1.8" fill="#FFD54F" opacity={0.85} />
      ))}
      <text x="100" y="48" fontSize="22">☁️</text>
      <text x="165" y="42" fontSize="18">☁️</text>

      {/* Water walls */}
      <rect x="0" y="66" width="50" height="68" fill={waterL} rx="0" />
      <rect x="230" y="66" width="50" height="68" fill={waterR} rx="0" />
      {/* water ripple lines left */}
      {[0,1,2,3].map(i => <line key={i} x1="5" y1={72+i*12} x2="45" y2={72+i*12} stroke="#81D4FA" strokeWidth="2" opacity={0.5} />)}
      {/* water ripple lines right */}
      {[0,1,2,3].map(i => <line key={i} x1="235" y1={72+i*12} x2="275" y2={72+i*12} stroke="#81D4FA" strokeWidth="2" opacity={0.5} />)}

      {/* People crossing */}
      {[0,1,2,3,4].map(i => (
        <text key={i} x={55 + i * 36} y={122} fontSize="18">👤</text>
      ))}
      {/* Moses */}
      <text x="107" y="108" fontSize="14">✨</text>

      {/* Sand floor */}
      <rect x="0" y="132" width="280" height="68" fill={sand} />
      <text x="80" y="172" fontSize="20">🏃</text>
      <text x="125" y="168" fontSize="22">👴</text>
      <text x="170" y="172" fontSize="20">🏃</text>
      {/* Moses staff */}
      <line x1="148" y1="148" x2="148" y2="195" stroke="#795548" strokeWidth="3" />
    </svg>
  );
}

function shuffle(n) {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const DIFFICULTY = [
  { size: 3, label: '3×3 Fácil',  xp: 60,  dr: 30 },
  { size: 4, label: '4×4 Médio',  xp: 90,  dr: 45 },
];

export default function ExodusPuzzle({ onBack, onComplete }) {
  const [cfg, setCfg] = useState(null);
  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState(null);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const start = (opt) => {
    SFX.click();
    setCfg(opt);
    setGrid(shuffle(opt.size * opt.size));
    setMoves(0);
    setWon(false);
    setSelected(null);
  };

  const isSolved = (g) => g.every((v, i) => v === i);

  const handleTap = useCallback((idx) => {
    if (won) return;
    if (selected === null) {
      SFX.flip();
      setSelected(idx);
    } else {
      if (selected === idx) { setSelected(null); return; }
      SFX.flip();
      setGrid(prev => {
        const next = [...prev];
        [next[selected], next[idx]] = [next[idx], next[selected]];
        if (isSolved(next)) {
          setTimeout(() => { setWon(true); setShowConfetti(true); SFX.victory(); }, 200);
        }
        return next;
      });
      setMoves(m => m + 1);
      setSelected(null);
    }
  }, [selected, won]);

  // Tile size based on difficulty
  const tileDim = cfg ? (cfg.size === 3 ? 88 : 64) : 88;
  const gap = 4;

  // ── Difficulty picker ───────────────────────────────────────────────────────
  if (!cfg) return (
    <div className="h-full flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0D1B6E 0%, #0288D1 100%)' }}>
      <div className="px-4 pt-10 pb-4 flex items-center gap-3">
        <button onClick={() => { SFX.click(); onBack(); }}
          className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white text-lg">←</button>
        <div>
          <h2 className="font-display text-2xl text-white">🌊 Travessia do Mar</h2>
          <p className="font-body text-white/60 text-xs">Monte a cena do milagre!</p>
        </div>
      </div>

      {/* Preview of full scene */}
      <div className="flex justify-center px-4 mb-4">
        <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30" style={{ width: 264 }}>
          <TileSVG index={0} dim={264} />
        </div>
      </div>

      <div className="px-6 space-y-3">
        <p className="font-body text-white/60 text-center text-sm">Escolha a dificuldade:</p>
        {DIFFICULTY.map(opt => (
          <button key={opt.size} onClick={() => start(opt)}
            className="w-full py-4 rounded-2xl font-display text-white text-xl transition-all hover:scale-[1.02] active:scale-[0.97]"
            style={{ background: 'rgba(255,255,255,0.18)', border: '3px solid rgba(255,255,255,0.35)', boxShadow: '0 6px 0 rgba(0,0,0,0.25)' }}>
            🧩 {opt.label} · +{opt.xp} XP
          </button>
        ))}
        <div className="mt-3 bg-white/10 rounded-2xl p-3 border border-white/20 text-center">
          <p className="font-body text-white/60 text-xs">
            📖 "Moisés estendeu a mão e as águas se abriram." — Êxodo 14:21
          </p>
        </div>
      </div>
    </div>
  );

  // ── Puzzle grid ─────────────────────────────────────────────────────────────
  const n = cfg.size;
  const boardPx = n * tileDim + (n - 1) * gap;

  return (
    <div className="h-full flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0D1B6E 0%, #0288D1 100%)' }}>
      <ConfettiEffect active={showConfetti} onDone={() => setShowConfetti(false)} />

      {/* Header */}
      <div className="px-4 pt-10 pb-3 flex items-center gap-3">
        <button onClick={() => { SFX.click(); setCfg(null); setWon(false); }}
          className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white text-lg">←</button>
        <div className="flex-1">
          <h2 className="font-display text-xl text-white">🌊 {cfg.label}</h2>
        </div>
        <div className="bg-white/20 px-3 py-1 rounded-full">
          <span className="font-body text-white text-sm">{moves} trocas</span>
        </div>
      </div>

      {!won ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4">
          <p className="font-body text-white/60 text-xs text-center">
            Toque em duas peças para trocá-las de lugar!
          </p>

          {/* Puzzle */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${n}, ${tileDim}px)`,
              gap: gap,
              padding: 6,
              borderRadius: 16,
              background: 'rgba(0,0,0,0.3)',
              border: '2px solid rgba(255,255,255,0.2)',
            }}
          >
            {grid.map((pieceIdx, slotIdx) => {
              const isCorrect = pieceIdx === slotIdx;
              const isSel = selected === slotIdx;
              return (
                <button
                  key={slotIdx}
                  onClick={() => handleTap(slotIdx)}
                  style={{
                    width: tileDim,
                    height: tileDim,
                    borderRadius: 8,
                    overflow: 'hidden',
                    border: isSel
                      ? '3px solid #FFD54F'
                      : isCorrect
                        ? '2px solid #66BB6A'
                        : '2px solid rgba(255,255,255,0.15)',
                    boxShadow: isSel ? '0 0 12px #FFD54F99' : isCorrect ? '0 0 6px #66BB6A66' : 'none',
                    transform: isSel ? 'scale(0.93)' : 'scale(1)',
                    transition: 'transform 0.12s, border 0.12s',
                    cursor: 'pointer',
                    padding: 0,
                    background: 'transparent',
                  }}
                >
                  <TileSVG index={pieceIdx} dim={tileDim} />
                </button>
              );
            })}
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2">
            <span className="font-body text-white/50 text-xs">
              {grid.filter((v, i) => v === i).length}/{n * n} corretas
            </span>
            <div className="w-32 h-2 bg-white/15 rounded-full overflow-hidden">
              <div className="h-full bg-green-400 rounded-full transition-all"
                style={{ width: `${(grid.filter((v, i) => v === i).length / (n * n)) * 100}%` }} />
            </div>
          </div>

          <button onClick={() => { setGrid(shuffle(n * n)); setMoves(0); setSelected(null); SFX.click(); }}
            className="bg-white/15 text-white font-body text-sm px-5 py-2 rounded-full border border-white/25">
            🔀 Embaralhar
          </button>
        </div>
      ) : (
        // Win screen
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-5">
          <div className="text-7xl">🌊</div>
          <h2 className="font-display text-3xl text-white">Milagre montado!</h2>
          <p className="font-body text-white/70 text-sm">
            Você completou em <strong className="text-white">{moves}</strong> trocas!
          </p>
          <div className="bg-white/10 rounded-2xl p-3 border border-white/20 max-w-xs">
            <p className="font-body text-white/70 text-xs italic">
              📖 "Moisés estendeu a mão sobre o mar e as águas se abriram." — Êxodo 14:21
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/15 rounded-2xl px-6 py-3 text-center border border-white/20">
              <p className="font-display text-2xl text-yellow-300">+{cfg.xp}</p>
              <p className="font-body text-white/50 text-xs">XP</p>
            </div>
            <div className="bg-white/15 rounded-2xl px-6 py-3 text-center border border-white/20">
              <p className="font-display text-2xl text-orange-300">+{cfg.dr} 🪙</p>
              <p className="font-body text-white/50 text-xs">Dracmas</p>
            </div>
          </div>
          <button onClick={() => onComplete(cfg.xp, cfg.dr)}
            className="w-full max-w-xs py-4 rounded-2xl font-display text-xl text-white"
            style={{ background: 'linear-gradient(135deg, #FFD54F, #FF8A65)', boxShadow: '0 6px 0 rgba(0,0,0,0.25)' }}>
            🎉 Resgatar!
          </button>
          <button onClick={() => start(cfg)} className="font-body text-white/40 text-sm underline">
            Jogar de novo
          </button>
        </div>
      )}
    </div>
  );
}