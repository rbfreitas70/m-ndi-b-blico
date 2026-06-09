import { useState } from 'react';
import { SFX } from '@/lib/audioEngine';
import ConfettiEffect from '@/components/ConfettiEffect';

const ANIMALS = [
  { id: 'lion',    emoji: '🦁', name: 'Leão'     },
  { id: 'elephant',emoji: '🐘', name: 'Elefante' },
  { id: 'giraffe', emoji: '🦒', name: 'Girafa'   },
  { id: 'dove',    emoji: '🕊️', name: 'Pomba'   },
  { id: 'rabbit',  emoji: '🐇', name: 'Coelho'   },
  { id: 'bear',    emoji: '🐻', name: 'Urso'     },
  { id: 'snake',   emoji: '🐍', name: 'Cobra'    },
  { id: 'fish',    emoji: '🐟', name: 'Peixe'    },
  { id: 'horse',   emoji: '🐴', name: 'Cavalo'   },
  { id: 'sheep',   emoji: '🐑', name: 'Ovelha'   },
];

export default function ArkGame({ onBack, onComplete }) {
  const [inside, setInside] = useState([]);
  const [won, setWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const outside = ANIMALS.filter(a => !inside.find(i => i.id === a.id));

  const sendToArk = (animal) => {
    SFX.coin();
    const next = [...inside, animal];
    setInside(next);
    if (next.length === ANIMALS.length) {
      setTimeout(() => { setWon(true); setShowConfetti(true); SFX.victory(); }, 300);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0277BD 0%, #01579B 50%, #2E7D32 100%)' }}>
      <ConfettiEffect active={showConfetti} onDone={() => setShowConfetti(false)} />

      <div className="px-4 pt-10 pb-3 flex items-center gap-3">
        <button onClick={() => { SFX.click(); onBack(); }}
          className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">←</button>
        <div className="flex-1">
          <h2 className="font-display text-xl text-white">⛵ Grande Arca de Noé</h2>
          <p className="font-body text-white/60 text-xs">{inside.length}/{ANIMALS.length} animais salvos</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-4">
        {/* Progress bar */}
        <div className="h-3 bg-white/15 rounded-full overflow-hidden border border-white/20">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(inside.length / ANIMALS.length) * 100}%`, background: 'linear-gradient(90deg, #4CAF50, #8BC34A)' }} />
        </div>

        {/* Ark illustration */}
        <div className="bg-white/10 rounded-3xl p-4 border border-white/20">
          <ArkSVG count={inside.length} total={ANIMALS.length} />
          {inside.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2 justify-center">
              {inside.map(a => <span key={a.id} className="text-xl">{a.emoji}</span>)}
            </div>
          )}
          {inside.length === 0 && (
            <p className="text-center font-body text-white/40 text-xs mt-2">A arca está vazia...</p>
          )}
        </div>

        {!won ? (
          <>
            <p className="font-body text-white/70 text-sm text-center">
              Toque nos animais para salvá-los! 👇
            </p>
            <div className="grid grid-cols-5 gap-2">
              {outside.map(animal => (
                <button key={animal.id} onClick={() => sendToArk(animal)}
                  className="flex flex-col items-center gap-1 bg-white/15 rounded-2xl p-2.5 border-2 border-white/25 hover:scale-105 active:scale-95 transition-all">
                  <span className="text-3xl">{animal.emoji}</span>
                  <span className="font-body text-[9px] text-white/60 truncate w-full text-center">{animal.name}</span>
                </button>
              ))}
              {outside.length === 0 && !won && (
                <div className="col-span-5 text-center py-4">
                  <p className="font-body text-white/60 text-sm">Todos os animais estão a salvo! 🎉</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-5 py-4 text-center">
            <div className="text-6xl">⛵</div>
            <h2 className="font-display text-2xl text-white">A Arca está completa!</h2>
            <p className="font-body text-white/70">Você salvou todos os {ANIMALS.length} animais!</p>
            <div className="flex gap-4">
              <div className="bg-white/15 rounded-2xl px-6 py-3 border border-white/20">
                <p className="font-display text-2xl text-yellow-300">+45</p>
                <p className="font-body text-white/50 text-xs">XP</p>
              </div>
              <div className="bg-white/15 rounded-2xl px-6 py-3 border border-white/20">
                <p className="font-display text-2xl text-orange-300">+20 🪙</p>
                <p className="font-body text-white/50 text-xs">Dracmas</p>
              </div>
            </div>
            <button onClick={() => onComplete(45, 20)}
              className="w-full max-w-xs py-4 rounded-2xl font-display text-xl text-white"
              style={{ background: 'linear-gradient(135deg, #FFD54F, #FF8A65)', boxShadow: '0 6px 0 rgba(0,0,0,0.25)' }}>
              🎉 Resgatar Prêmio!
            </button>
          </div>
        )}

        <div className="bg-blue-900/30 rounded-2xl p-3 border border-white/10">
          <p className="font-body text-white/50 text-xs text-center">
            💡 Deus mandou Noé levar dois de cada espécie para preservar a vida na Terra!
          </p>
        </div>
      </div>
    </div>
  );
}

function ArkSVG({ count, total }) {
  const fill = count / total;
  return (
    <svg viewBox="0 0 240 90" className="w-full">
      <defs>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#29B6F6" />
          <stop offset="100%" stopColor="#0277BD" />
        </linearGradient>
      </defs>
      {/* Water */}
      <path d="M0,65 Q30,58 60,65 Q90,72 120,65 Q150,58 180,65 Q210,72 240,65 L240,90 L0,90 Z" fill="url(#water)" />
      {/* Hull */}
      <rect x="20" y="40" width="200" height="30" rx="8" fill="#8D6E63" />
      {/* Deck */}
      <rect x="30" y="22" width="180" height="22" rx="5" fill="#A1887F" />
      {/* Roof */}
      <rect x="65" y="8" width="110" height="18" rx="4" fill="#8D6E63" />
      {/* Window */}
      <rect x="98" y="11" width="44" height="12" rx="3" fill="#4FC3F7" />
      {/* Door */}
      <rect x="98" y="28" width="30" height="20" rx="3" fill="#5D4037" />
      {/* Fill indicator */}
      {fill > 0 && (
        <rect x="22" y="42" width={196 * fill} height="26" rx="6" fill="#66BB6A" opacity={0.55} />
      )}
      {/* Animals peeking */}
      {count >= 2 && <text x="42" y="65" fontSize="14">🐘</text>}
      {count >= 5 && <text x="170" y="64" fontSize="14">🦁</text>}
      {count >= 8 && <text x="110" y="60" fontSize="12">🕊️</text>}
    </svg>
  );
}