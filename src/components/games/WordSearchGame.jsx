import { useState, useCallback } from 'react';
import { SFX } from '@/lib/audioEngine';
import ConfettiEffect from '@/components/ConfettiEffect';

const CATEGORIES = {
  'Personagens': {
    color: '#FF8A65',
    words: ['NOAE', 'MOISES', 'DAVI', 'JOSE', 'SARA', 'PEDRO', 'PAULO', 'MARIA', 'ISAQUE', 'RUTH'],
  },
  'Milagres': {
    color: '#4FC3F7',
    words: ['MANA', 'CURA', 'AGUA', 'PAO', 'LUZ', 'VINHO', 'CEIA', 'FOGO', 'VENTO', 'MAR'],
  },
  'Lugares': {
    color: '#81C784',
    words: ['EDEN', 'EGYPT', 'SINAI', 'BETLEM', 'JERUS', 'NILO', 'CANA', 'BABEL', 'SIOM', 'ALFA'],
  },
  'Animais': {
    color: '#CE93D8',
    words: ['LEAO', 'POMBA', 'PEIXE', 'COBRA', 'CORDEIRO', 'ASNO', 'BODE', 'AGUIA', 'URSO', 'BOI'],
  },
};

const SIZE = 10;

function buildGrid(rawWords) {
  const words = rawWords.map(w => w.toUpperCase().replace(/[^A-Z]/g, '').substring(0, SIZE));
  const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(''));
  const placed = [];

  for (const word of words.slice(0, 6)) {
    if (word.length < 2) continue;
    for (let t = 0; t < 80; t++) {
      const horiz = Math.random() > 0.5;
      const maxR = horiz ? SIZE : SIZE - word.length;
      const maxC = horiz ? SIZE - word.length : SIZE;
      if (maxR <= 0 || maxC <= 0) continue;
      const r = Math.floor(Math.random() * maxR);
      const c = Math.floor(Math.random() * maxC);
      let ok = true;
      for (let i = 0; i < word.length; i++) {
        const gr = horiz ? r : r + i;
        const gc = horiz ? c + i : c;
        if (grid[gr][gc] && grid[gr][gc] !== word[i]) { ok = false; break; }
      }
      if (ok) {
        const cells = [];
        for (let i = 0; i < word.length; i++) {
          const gr = horiz ? r : r + i;
          const gc = horiz ? c + i : c;
          grid[gr][gc] = word[i];
          cells.push(`${gr},${gc}`);
        }
        placed.push({ word, cells });
        break;
      }
    }
  }

  const ALPHA = 'ABCDEFGHIJKLMNOPRSTUVZ';
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (!grid[r][c]) grid[r][c] = ALPHA[Math.floor(Math.random() * ALPHA.length)];

  return { grid, placed };
}

export default function WordSearchGame({ onBack, onComplete }) {
  const [catKey, setCatKey] = useState(null);
  const [data, setData] = useState(null);
  const [sel, setSel] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [foundCells, setFoundCells] = useState([]);
  const [won, setWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const start = (key) => {
    SFX.click();
    setCatKey(key);
    const d = buildGrid(CATEGORIES[key].words);
    setData(d);
    setSel([]);
    setFoundWords([]);
    setFoundCells([]);
    setWon(false);
  };

  const color = catKey ? CATEGORIES[catKey].color : '#4FC3F7';

  const toggleCell = useCallback((key) => {
    setSel(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  }, []);

  const checkSelection = useCallback(() => {
    if (!data || sel.length < 2) { setSel([]); return; }
    const selStr = sel.map(k => { const [r, c] = k.split(','); return data.grid[r][c]; }).join('');
    const selRev = selStr.split('').reverse().join('');
    const match = data.placed.find(p =>
      !foundWords.includes(p.word) &&
      (p.word === selStr || p.word === selRev ||
        (p.cells.length === sel.length && p.cells.every(c => sel.includes(c)) && sel.every(c => p.cells.includes(c))))
    );
    if (match) {
      SFX.match();
      const newFound = [...foundWords, match.word];
      const newCells = [...foundCells, ...match.cells];
      setFoundWords(newFound);
      setFoundCells(newCells);
      if (newFound.length === data.placed.length) {
        setTimeout(() => { setWon(true); setShowConfetti(true); SFX.victory(); }, 400);
      }
    } else {
      SFX.error();
    }
    setSel([]);
  }, [data, sel, foundWords, foundCells]);

  if (!catKey) {
    return (
      <div className="h-full flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #1B5E20 0%, #2E7D32 100%)' }}>
        <div className="px-4 pt-10 pb-4 flex items-center gap-3">
          <button onClick={() => { SFX.click(); onBack(); }}
            className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">←</button>
          <h2 className="font-display text-2xl text-white">🔍 Caça-Palavras</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6">
          <p className="font-body text-white/70">Escolha uma categoria:</p>
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <button key={key} onClick={() => start(key)}
              className="w-full max-w-xs py-4 rounded-2xl font-display text-white text-lg transition-all hover:scale-[1.02] active:scale-[0.97]"
              style={{ background: `${cat.color}44`, border: `3px solid ${cat.color}88`, boxShadow: '0 4px 0 rgba(0,0,0,0.2)' }}>
              🔍 {key}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1B5E20 0%, #0D47A1 100%)' }}>
      <ConfettiEffect active={showConfetti} onDone={() => setShowConfetti(false)} />

      <div className="px-4 pt-10 pb-3 flex items-center gap-3">
        <button onClick={() => { SFX.click(); setCatKey(null); }}
          className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">←</button>
        <div className="flex-1">
          <h2 className="font-display text-lg text-white">🔍 {catKey}</h2>
          <p className="font-body text-white/50 text-xs">{foundWords.length}/{data?.placed.length} palavras</p>
        </div>
      </div>

      {won ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 text-center">
          <div className="text-6xl">🔍</div>
          <h2 className="font-display text-3xl text-white">Todas encontradas!</h2>
          <div className="flex gap-4">
            <div className="bg-white/15 rounded-2xl px-6 py-3 border border-white/20">
              <p className="font-display text-2xl text-yellow-300">+50</p>
              <p className="font-body text-white/50 text-xs">XP</p>
            </div>
            <div className="bg-white/15 rounded-2xl px-6 py-3 border border-white/20">
              <p className="font-display text-2xl text-orange-300">+22 🪙</p>
              <p className="font-body text-white/50 text-xs">Dracmas</p>
            </div>
          </div>
          <button onClick={() => onComplete(50, 22)}
            className="w-full max-w-xs py-4 rounded-2xl font-display text-xl text-white"
            style={{ background: 'linear-gradient(135deg, #FFD54F, #FF8A65)', boxShadow: '0 6px 0 rgba(0,0,0,0.25)' }}>
            🎉 Resgatar!
          </button>
        </div>
      ) : data && (
        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-3">
          {/* Grid */}
          <div className="flex justify-center">
            <div className="grid gap-0.5 p-1.5 rounded-2xl bg-black/20"
              style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
              {data.grid.map((row, r) =>
                row.map((letter, c) => {
                  const key = `${r},${c}`;
                  const isFound = foundCells.includes(key);
                  const isSel = sel.includes(key);
                  return (
                    <button key={key} onClick={() => toggleCell(key)}
                      className="w-7 h-7 rounded-lg font-display text-xs flex items-center justify-center transition-all select-none"
                      style={{
                        background: isFound ? color + 'CC' : isSel ? '#FFD54F' : 'rgba(255,255,255,0.12)',
                        color: isFound || isSel ? (isSel ? '#333' : 'white') : 'rgba(255,255,255,0.8)',
                        border: isSel ? '2px solid #FF8A65' : '1px solid rgba(255,255,255,0.1)',
                        transform: isSel ? 'scale(1.15)' : 'scale(1)',
                      }}>
                      {letter}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Verify button */}
          {sel.length >= 2 && (
            <div className="flex justify-center px-4">
              <button onClick={checkSelection}
                className="py-3 px-8 rounded-2xl font-display text-white text-base transition-all hover:scale-[1.02] active:scale-[0.97]"
                style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)', boxShadow: '0 4px 0 rgba(0,0,0,0.2)' }}>
                ✅ Verificar ({sel.length} letras)
              </button>
            </div>
          )}

          {/* Words */}
          <div className="mx-2 bg-white/10 rounded-2xl p-3 border border-white/15">
            <p className="font-body text-white/50 text-xs mb-2 uppercase tracking-wide">Palavras:</p>
            <div className="flex flex-wrap gap-2">
              {data.placed.map(p => (
                <span key={p.word}
                  className={`font-body text-xs px-3 py-1 rounded-full border transition-all ${foundWords.includes(p.word) ? 'line-through opacity-50 border-green-400/40 text-green-300' : 'border-white/20 text-white/80'}`}>
                  {p.word}
                </span>
              ))}
            </div>
          </div>
          <p className="font-body text-white/40 text-xs text-center px-4">
            Toque nas letras e clique em "Verificar" para marcar uma palavra!
          </p>
        </div>
      )}
    </div>
  );
}