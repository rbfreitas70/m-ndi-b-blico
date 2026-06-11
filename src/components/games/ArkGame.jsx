import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SFX } from '@/lib/audioEngine';
import ConfettiEffect from '@/components/ConfettiEffect';

const SPECIES = [
  { id: 'lion',     emoji: '🦁', name: 'Leão'     },
  { id: 'elephant', emoji: '🐘', name: 'Elefante' },
  { id: 'giraffe',  emoji: '🦒', name: 'Girafa'   },
  { id: 'dove',     emoji: '🕊️', name: 'Pomba'   },
  { id: 'rabbit',   emoji: '🐇', name: 'Coelho'   },
  { id: 'bear',     emoji: '🐻', name: 'Urso'     },
  { id: 'horse',    emoji: '🐴', name: 'Cavalo'   },
  { id: 'sheep',    emoji: '🐑', name: 'Ovelha'   },
];

const TOTAL_TIME = 90; // segundos até a chuva forte

function buildField() {
  const animals = SPECIES.flatMap(s => [
    { ...s, uid: s.id + '-a' },
    { ...s, uid: s.id + '-b' },
  ]);
  return animals.sort(() => Math.random() - 0.5);
}

export default function ArkGame({ onBack, onComplete }) {
  const [phase, setPhase] = useState('intro'); // intro | play | won
  const [field, setField] = useState([]);
  const [saved, setSaved] = useState([]); // species ids salvos
  const [selected, setSelected] = useState(null); // uid selecionado
  const [wrong, setWrong] = useState(null); // uid errado p/ shake
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [boarding, setBoarding] = useState(null); // emoji animando p/ arca
  const [showConfetti, setShowConfetti] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (phase !== 'play') return;
    timerRef.current = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const start = () => {
    SFX.click();
    setField(buildField());
    setSaved([]); setSelected(null); setTimeLeft(TOTAL_TIME);
    setPhase('play');
  };

  const tap = (animal) => {
    if (boarding) return;
    SFX.click();
    if (!selected) { setSelected(animal.uid); return; }
    if (selected === animal.uid) { setSelected(null); return; }

    const first = field.find(a => a.uid === selected);
    if (first.id === animal.id) {
      // Par encontrado!
      SFX.match();
      setBoarding(animal.emoji);
      setSelected(null);
      setTimeout(() => {
        setBoarding(null);
        SFX.coin();
        const nextSaved = [...saved, animal.id];
        setSaved(nextSaved);
        setField(f => f.filter(a => a.id !== animal.id));
        if (nextSaved.length === SPECIES.length) {
          clearInterval(timerRef.current);
          setTimeout(() => { setPhase('won'); setShowConfetti(true); SFX.victory(); }, 400);
        }
      }, 600);
    } else {
      SFX.error();
      setWrong(animal.uid);
      setSelected(null);
      setTimeout(() => setWrong(null), 450);
    }
  };

  const waterLevel = 1 - timeLeft / TOTAL_TIME; // 0 → 1
  const bonus = timeLeft > 30 ? 10 : 0;

  // ── Tela inicial ──
  if (phase === 'intro') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6"
        style={{ background: 'linear-gradient(180deg, #0277BD, #01579B)' }}>
        <div className="text-7xl mb-4">⛵</div>
        <h2 className="font-display text-3xl text-white mb-3">Grande Arca de Noé</h2>
        <p className="font-body text-white/80 mb-2 leading-relaxed">
          A chuva está chegando! 🌧️<br />
          Encontre os <b>pares de animais</b> — dois de cada espécie — e leve-os para a arca antes do dilúvio!
        </p>
        <p className="font-body text-white/50 text-sm mb-8">Toque em dois animais iguais para formar o par.</p>
        <button onClick={start}
          className="px-10 py-4 rounded-2xl font-display text-xl text-blue-900 bg-yellow-400"
          style={{ boxShadow: '0 6px 0 rgba(0,0,0,0.25)' }}>
          🚀 Começar!
        </button>
        <button onClick={() => { SFX.click(); onBack(); }} className="mt-4 font-body text-white/50 text-sm">← Voltar</button>
      </div>
    );
  }

  // ── Vitória ──
  if (phase === 'won') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6"
        style={{ background: 'linear-gradient(180deg, #0277BD, #01579B)' }}>
        <ConfettiEffect active={showConfetti} onDone={() => setShowConfetti(false)} />
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="text-7xl mb-3">🌈</motion.div>
        <h2 className="font-display text-3xl text-white mb-2">Todos a bordo!</h2>
        <p className="font-body text-white/80 mb-1">Você salvou os {SPECIES.length} pares de animais!</p>
        {bonus > 0 && <p className="font-body text-yellow-300 text-sm mb-4">⚡ Bônus de rapidez: +{bonus} XP!</p>}
        <div className="flex gap-4 my-4">
          <div className="bg-white/15 rounded-2xl px-6 py-3 border border-white/20">
            <p className="font-display text-2xl text-yellow-300">+{45 + bonus}</p>
            <p className="font-body text-white/50 text-xs">XP</p>
          </div>
          <div className="bg-white/15 rounded-2xl px-6 py-3 border border-white/20">
            <p className="font-display text-2xl text-orange-300">+20 🪙</p>
            <p className="font-body text-white/50 text-xs">Dracmas</p>
          </div>
        </div>
        <button onClick={() => onComplete(45 + bonus, 20)}
          className="w-full max-w-xs py-4 rounded-2xl font-display text-xl text-white"
          style={{ background: 'linear-gradient(135deg, #FFD54F, #FF8A65)', boxShadow: '0 6px 0 rgba(0,0,0,0.25)' }}>
          🎉 Resgatar Prêmio!
        </button>
      </div>
    );
  }

  // ── Jogo ──
  return (
    <div className="h-full flex flex-col overflow-hidden relative"
      style={{ background: `linear-gradient(180deg, ${waterLevel > 0.6 ? '#37474F' : '#4FC3F7'} 0%, #0277BD 70%, #01579B 100%)`, transition: 'background 2s' }}>

      {/* Chuva */}
      {waterLevel > 0.3 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: Math.min(1, (waterLevel - 0.3) * 2) }}>
          {[...Array(14)].map((_, i) => (
            <div key={i} className="absolute w-0.5 bg-white/40 rounded-full animate-pulse"
              style={{ left: `${(i * 7.3) % 100}%`, top: `${(i * 13) % 60}%`, height: 14 + (i % 3) * 6, transform: 'rotate(15deg)' }} />
          ))}
        </div>
      )}

      {/* Header */}
      <div className="px-4 pt-10 pb-2 flex items-center gap-3 relative z-10">
        <button onClick={() => { SFX.click(); onBack(); }}
          className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">←</button>
        <div className="flex-1">
          <h2 className="font-display text-lg text-white">⛵ Grande Arca de Noé</h2>
          <p className="font-body text-white/60 text-xs">{saved.length}/{SPECIES.length} pares salvos</p>
        </div>
        <div className="px-3 py-1.5 rounded-xl font-display text-sm"
          style={{ background: timeLeft <= 20 ? 'rgba(239,83,80,0.4)' : 'rgba(255,255,255,0.15)', color: timeLeft <= 20 ? '#FFCDD2' : 'white' }}>
          🌧️ {timeLeft}s
        </div>
      </div>

      {/* Arca */}
      <div className="px-4 relative z-10">
        <div className="bg-white/10 rounded-3xl px-3 pt-2 pb-1 border border-white/20 relative max-w-[840px] mx-auto">
          <ArkSVG fill={saved.length / SPECIES.length} savedEmojis={saved.map(id => SPECIES.find(s => s.id === id).emoji)} />
          <AnimatePresence>
            {boarding && (
              <motion.span key="boarding" className="absolute text-3xl"
                initial={{ bottom: -20, left: '50%', opacity: 1, scale: 1.3 }}
                animate={{ bottom: 45, left: '48%', opacity: 0, scale: 0.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}>
                {boarding}{boarding}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <p className="font-body text-white/70 text-xs text-center mt-2 relative z-10">
        {selected ? 'Agora ache o par dele! 🔍' : 'Toque em dois animais iguais 👇'}
      </p>

      {/* Campo de animais */}
      <div className="flex-1 overflow-y-auto px-4 py-3 relative z-10">
        <div className="grid grid-cols-4 gap-2.5">
          <AnimatePresence>
            {field.map(animal => {
              const isSel = selected === animal.uid;
              const isWrong = wrong === animal.uid;
              return (
                <motion.button key={animal.uid} onClick={() => tap(animal)}
                  layout
                  initial={{ scale: 0 }} animate={{ scale: 1, x: isWrong ? [0, -6, 6, -4, 4, 0] : 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ x: { duration: 0.4 } }}
                  className="aspect-square flex flex-col items-center justify-center gap-0.5 rounded-2xl border-2 active:scale-95"
                  style={{
                    background: isSel ? 'rgba(255,213,79,0.35)' : isWrong ? 'rgba(239,83,80,0.35)' : 'rgba(255,255,255,0.15)',
                    borderColor: isSel ? '#FFD54F' : isWrong ? '#EF5350' : 'rgba(255,255,255,0.25)',
                    boxShadow: isSel ? '0 0 14px rgba(255,213,79,0.5)' : 'none',
                  }}>
                  <span className="text-3xl">{animal.emoji}</span>
                  <span className="font-body text-[9px] text-white/60">{animal.name}</span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Água subindo */}
      <div className="relative z-0 flex-shrink-0 transition-all duration-1000 pointer-events-none"
        style={{ height: `${4 + waterLevel * 10}%`, background: 'linear-gradient(180deg, rgba(41,182,246,0.7), #01579B)', borderRadius: '50% 50% 0 0 / 20px 20px 0 0' }} />
    </div>
  );
}

function ArkSVG({ fill, savedEmojis }) {
  return (
    <svg viewBox="0 0 240 95" className="w-full">
      <defs>
        <linearGradient id="arkWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#29B6F6" /><stop offset="100%" stopColor="#0277BD" />
        </linearGradient>
        <linearGradient id="hull" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A1887F" /><stop offset="100%" stopColor="#6D4C41" />
        </linearGradient>
      </defs>
      <path d="M0,70 Q30,63 60,70 Q90,77 120,70 Q150,63 180,70 Q210,77 240,70 L240,95 L0,95 Z" fill="url(#arkWater)" />
      <path d="M15,45 L225,45 L205,75 L35,75 Z" fill="url(#hull)" />
      <rect x="45" y="25" width="150" height="22" rx="5" fill="#A1887F" />
      <path d="M55,25 L185,25 L170,10 L70,10 Z" fill="#8D6E63" />
      <rect x="105" y="29" width="30" height="18" rx="3" fill="#5D4037" />
      <rect x="62" y="30" width="16" height="10" rx="2" fill="#4FC3F7" />
      <rect x="162" y="30" width="16" height="10" rx="2" fill="#4FC3F7" />
      {fill > 0 && <rect x="40" y="48" width={160 * fill} height="24" rx="5" fill="#66BB6A" opacity={0.4} />}
      {savedEmojis.map((e, i) => (
        <text key={i} x={50 + i * 18} y={42} fontSize="13">{e}</text>
      ))}
      <text x="115" y="9" fontSize="9">🕊️</text>
    </svg>
  );
}