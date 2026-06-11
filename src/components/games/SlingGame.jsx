import { useState, useEffect, useRef } from 'react';
import { SFX } from '@/lib/audioEngine';
import ConfettiEffect from '@/components/ConfettiEffect';

const HITS_TO_WIN = 5;

export default function SlingGame({ onBack, onComplete }) {
  const [goliathX, setGoliathX] = useState(50);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [stone, setStone] = useState(null); // {x, y}
  const [won, setWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const dirRef = useRef(1);

  // Golias se move
  useEffect(() => {
    if (won) return;
    const speed = 1.2 + hits * 0.5;
    const iv = setInterval(() => {
      setGoliathX(x => {
        let nx = x + dirRef.current * speed;
        if (nx > 85) { nx = 85; dirRef.current = -1; }
        if (nx < 15) { nx = 15; dirRef.current = 1; }
        return nx;
      });
    }, 40);
    return () => clearInterval(iv);
  }, [hits, won]);

  const throwStone = () => {
    if (stone || won) return;
    SFX.jump();
    setStone({ y: 100 });
    let y = 100;
    const targetX = goliathX; // não usado — checa na chegada
    const iv = setInterval(() => {
      y -= 6;
      setStone({ y });
      if (y <= 25) {
        clearInterval(iv);
        setStone(null);
        setGoliathX(gx => {
          if (Math.abs(gx - 50) < 14) {
            SFX.match();
            setHits(h => {
              const nh = h + 1;
              if (nh >= HITS_TO_WIN) {
                setWon(true);
                setShowConfetti(true);
                SFX.victory();
              }
              return nh;
            });
          } else {
            SFX.error();
            setMisses(m => m + 1);
          }
          return gx;
        });
      }
    }, 30);
  };

  if (won) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6"
        style={{ background: 'linear-gradient(160deg, #E65100, #BF360C)' }}>
        <ConfettiEffect active={showConfetti} onDone={() => setShowConfetti(false)} />
        <div className="text-7xl mb-3">🏆</div>
        <h2 className="font-display text-3xl text-white mb-2">Davi venceu!</h2>
        <p className="font-body text-white/80 mb-6">Você derrubou Golias com {hits + misses} pedras!</p>
        <button onClick={() => onComplete(85, 40)}
          className="px-8 py-3 rounded-2xl font-display text-lg text-orange-900 bg-yellow-400 shadow-lg">
          Receber +85 XP e +40 🪙
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FFE0B2 0%, #FFCC80 60%, #D7B07A 100%)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-black/10">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/50 flex items-center justify-center">←</button>
        <div className="flex-1">
          <p className="font-display text-orange-900 text-sm">🎯 Davi contra Golias</p>
          <p className="font-body text-orange-800/70 text-xs">Toque para atirar quando Golias estiver no centro!</p>
        </div>
        <span className="font-display text-orange-900 text-sm">{hits}/{HITS_TO_WIN} 💥</span>
      </div>

      {/* Arena */}
      <button onClick={throwStone} className="flex-1 relative w-full">
        {/* Centro alvo */}
        <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-dashed border-red-500/40" />
        {/* Golias */}
        <div className="absolute top-[10%] text-6xl transition-none" style={{ left: `${goliathX}%`, transform: 'translateX(-50%)' }}>
          👹
        </div>
        {/* Pedra */}
        {stone && (
          <div className="absolute left-1/2 -translate-x-1/2 text-2xl" style={{ top: `${stone.y}%` }}>🪨</div>
        )}
        {/* Davi */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-6xl">👦</div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-body text-orange-900/60 text-xs">
          Toque na tela para atirar a pedra!
        </div>
      </button>
    </div>
  );
}