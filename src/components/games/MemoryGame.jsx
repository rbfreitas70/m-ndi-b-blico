import { useState, useCallback } from 'react';
import { SFX } from '@/lib/audioEngine';
import ConfettiEffect from '@/components/ConfettiEffect';

const PAIRS = [
  { id: 'cross',  emoji: '✝️',  label: 'Cruz'      },
  { id: 'dove',   emoji: '🕊️', label: 'Pomba'     },
  { id: 'star',   emoji: '⭐',  label: 'Estrela'   },
  { id: 'fish',   emoji: '🐟',  label: 'Peixe'     },
  { id: 'book',   emoji: '📖',  label: 'Bíblia'    },
  { id: 'crown',  emoji: '👑',  label: 'Coroa'     },
  { id: 'lamb',   emoji: '🐑',  label: 'Cordeiro'  },
  { id: 'scroll', emoji: '📜',  label: 'Pergaminho'},
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function makeBoard() {
  return shuffle([...PAIRS, ...PAIRS]).map((c, i) => ({ ...c, uid: i, flipped: false, matched: false }));
}

export default function MemoryGame({ onBack, onComplete }) {
  const [cards, setCards] = useState(makeBoard);
  const [flipped, setFlipped] = useState([]);
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleCard = useCallback((uid) => {
    if (locked || won) return;
    const card = cards.find(c => c.uid === uid);
    if (!card || card.flipped || card.matched) return;
    if (flipped.length === 1 && flipped[0] === uid) return;

    SFX.flip();
    const newCards = cards.map(c => c.uid === uid ? { ...c, flipped: true } : c);
    setCards(newCards);
    const newFlipped = [...flipped, uid];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setLocked(true);
      setMoves(m => m + 1);
      const [a, b] = newFlipped.map(id => newCards.find(c => c.uid === id));
      if (a.id === b.id) {
        SFX.match();
        const matched = newCards.map(c => newFlipped.includes(c.uid) ? { ...c, matched: true } : c);
        setCards(matched);
        setFlipped([]);
        setLocked(false);
        if (matched.every(c => c.matched)) {
          setTimeout(() => { setWon(true); setShowConfetti(true); SFX.victory(); }, 300);
        }
      } else {
        SFX.error();
        setTimeout(() => {
          setCards(prev => prev.map(c => newFlipped.includes(c.uid) ? { ...c, flipped: false } : c));
          setFlipped([]);
          setLocked(false);
        }, 900);
      }
    }
  }, [cards, flipped, locked, won]);

  const restart = () => {
    SFX.click();
    setCards(makeBoard());
    setFlipped([]);
    setLocked(false);
    setMoves(0);
    setWon(false);
    setShowConfetti(false);
  };

  const xp = Math.max(30, 80 - moves * 2);
  const dr = Math.max(12, 40 - moves);

  return (
    <div className="h-full flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #4a148c 0%, #1a237e 100%)' }}>
      <ConfettiEffect active={showConfetti} onDone={() => setShowConfetti(false)} />

      {/* Header */}
      <div className="px-4 pt-10 pb-3 flex items-center gap-3">
        <button onClick={() => { SFX.click(); onBack(); }}
          className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white font-body">←</button>
        <div className="flex-1">
          <h2 className="font-display text-xl text-white">🃏 Memória Bíblica</h2>
        </div>
        <div className="bg-white/15 px-3 py-1.5 rounded-full">
          <span className="font-body text-white text-sm">{moves} jogadas</span>
        </div>
      </div>

      {!won ? (
        <div className="flex-1 flex items-center justify-center px-3">
          <div className="grid grid-cols-4 gap-2 w-full max-w-sm">
            {cards.map(card => (
              <button key={card.uid} onClick={() => handleCard(card.uid)}
                className="aspect-square select-none"
                style={{ perspective: '600px' }}>
                <div className="w-full h-full relative transition-all duration-300"
                  style={{ transformStyle: 'preserve-3d', transform: card.flipped || card.matched ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                  {/* Front */}
                  <div className="absolute inset-0 rounded-2xl flex items-center justify-center"
                    style={{ backfaceVisibility: 'hidden', background: 'linear-gradient(135deg, #7B1FA2, #1565C0)', border: '3px solid rgba(255,255,255,0.3)' }}>
                    <span className="text-2xl">✨</span>
                  </div>
                  {/* Back */}
                  <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-0.5"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background: card.matched ? 'linear-gradient(135deg, #2E7D32, #388E3C)' : 'linear-gradient(135deg, #E3F2FD, #BBDEFB)',
                      border: card.matched ? '3px solid #66BB6A' : '3px solid #90CAF9',
                    }}>
                    <span className="text-2xl">{card.emoji}</span>
                    <span className="text-[8px] font-body text-gray-600">{card.label}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-5">
          <div className="text-7xl">🏆</div>
          <h2 className="font-display text-3xl text-white">Você ganhou!</h2>
          <p className="font-body text-white/70">Completou em <strong className="text-white">{moves}</strong> jogadas!</p>
          <div className="flex gap-4">
            <div className="bg-white/15 rounded-2xl px-6 py-3 text-center border border-white/20">
              <p className="font-display text-2xl text-yellow-300">+{xp}</p>
              <p className="font-body text-white/50 text-xs">XP</p>
            </div>
            <div className="bg-white/15 rounded-2xl px-6 py-3 text-center border border-white/20">
              <p className="font-display text-2xl text-orange-300">+{dr} 🪙</p>
              <p className="font-body text-white/50 text-xs">Dracmas</p>
            </div>
          </div>
          <button onClick={() => onComplete(xp, dr)}
            className="w-full max-w-xs py-4 rounded-2xl font-display text-xl text-white"
            style={{ background: 'linear-gradient(135deg, #FFD54F, #FF8A65)', boxShadow: '0 6px 0 rgba(0,0,0,0.25)' }}>
            🎉 Resgatar Prêmio!
          </button>
          <button onClick={restart} className="font-body text-white/40 text-sm underline">Jogar de novo</button>
        </div>
      )}
    </div>
  );
}