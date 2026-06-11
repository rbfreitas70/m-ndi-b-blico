import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SFX, startBgMusic, stopBgMusic } from '@/lib/audioEngine';

const AVATAR_OPTIONS = [
  { emoji: '👦', label: 'Menino' },
  { emoji: '👧', label: 'Menina' },
  { emoji: '🧒', label: 'Criança' },
  { emoji: '👼', label: 'Anjinho' },
  { emoji: '🦸', label: 'Herói' },
  { emoji: '🧙', label: 'Sábio' },
];

const NAME_SUGGESTIONS = [
  'Davi', 'Sara', 'João', 'Maria', 'Lucas', 'Ester',
  'Pedro', 'Ruth', 'Paulo', 'Raque', 'Tiago', 'Ana',
];

export default function WelcomeScreen({ onComplete }) {
  const [step, setStep] = useState('intro'); // intro | name | avatar | ready
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('👦');
  const [musicOn, setMusicOn] = useState(false);

  const handleNext = () => {
    SFX.click();
    if (step === 'intro') setStep('name');
    else if (step === 'name') {
      if (!name.trim()) return;
      setStep('avatar');
    } else if (step === 'avatar') setStep('ready');
    else if (step === 'ready') {
      onComplete({ name: name.trim(), avatarEmoji: avatar });
    }
  };

  const toggleMusic = () => {
    SFX.click();
    if (musicOn) {
      stopBgMusic();
      setMusicOn(false);
    } else {
      startBgMusic();
      setMusicOn(true);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden relative"
      style={{ height: '100dvh', background: 'linear-gradient(180deg, #1a237e 0%, #0277BD 40%, #4CAF50 100%)' }}>

      {/* Floating clouds */}
      {[...Array(4)].map((_, i) => (
        <div key={i} className="absolute pointer-events-none"
          style={{
            top: `${8 + i * 10}%`,
            left: '-20%',
            animation: `cloudFloat ${12 + i * 4}s linear infinite`,
            animationDelay: `${i * 3}s`,
            zIndex: 0,
          }}>
          <CloudSVG size={40 + i * 15} />
        </div>
      ))}

      {/* Stars */}
      {[...Array(20)].map((_, i) => (
        <div key={i} className="absolute rounded-full bg-white pointer-events-none"
          style={{
            width: 2 + Math.random() * 2,
            height: 2 + Math.random() * 2,
            top: `${Math.random() * 35}%`,
            left: `${Math.random() * 100}%`,
            opacity: 0.6,
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        />
      ))}

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-8 overflow-y-auto">

        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div key="intro"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
              className="flex flex-col items-center text-center gap-6 w-full"
            >
              {/* Logo */}
              <div className="relative">
                <div className="w-28 h-28 rounded-full flex items-center justify-center text-6xl shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #FFD54F, #FF8A65)',
                    border: '4px solid rgba(255,255,255,0.6)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.4)',
                  }}>
                  🌍
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{ background: '#FFD54F', border: '3px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                  ✝️
                </div>
              </div>

              <div>
                <h1 className="font-display text-4xl text-white drop-shadow-lg">Múndi Bíblico</h1>
                <p className="text-white/80 font-body text-base mt-1">Aventuras da Bíblia para você!</p>
              </div>

              <div className="flex gap-3 text-3xl">
                {['📖', '⭐', '🏆', '🎮', '🎵'].map((e, i) => (
                  <motion.span key={i} animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}>
                    {e}
                  </motion.span>
                ))}
              </div>

              <p className="text-white/70 font-body text-sm leading-relaxed max-w-xs">
                Explore histórias incríveis, ganhe medalhas e colete Dracmas enquanto aprende sobre a Bíblia! 🌟
              </p>

              <button onClick={handleNext}
                className="btn-welcome py-4 px-10 text-xl font-display text-white w-full max-w-xs">
                Começar Aventura! 🚀
              </button>

              {/* Music toggle */}
              <button onClick={toggleMusic}
                className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full font-body text-sm text-white/80">
                {musicOn ? '🔊 Música ligada' : '🔇 Ligar música'}
              </button>
            </motion.div>
          )}

          {step === 'name' && (
            <motion.div key="name"
              initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
              className="flex flex-col items-center gap-6 w-full max-w-xs"
            >
              <div className="text-6xl">📝</div>
              <h2 className="font-display text-2xl text-white text-center">Como você se chama?</h2>

              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleNext()}
                placeholder="Digite seu nome..."
                maxLength={20}
                className="w-full rounded-2xl px-4 py-3 font-body text-lg text-center bg-white/90 text-gray-800 outline-none border-4 border-white/50 focus:border-yellow-400 transition-colors"
              />

              <div className="flex flex-wrap justify-center gap-2">
                {NAME_SUGGESTIONS.map(n => (
                  <button key={n} onClick={() => { SFX.click(); setName(n); }}
                    className="bg-white/20 hover:bg-white/35 text-white font-body text-sm px-3 py-1.5 rounded-full transition-all border border-white/30">
                    {n}
                  </button>
                ))}
              </div>

              <button onClick={handleNext} disabled={!name.trim()}
                className="btn-welcome py-3 px-8 text-lg font-display text-white w-full"
                style={{ opacity: name.trim() ? 1 : 0.5 }}>
                Próximo →
              </button>
            </motion.div>
          )}

          {step === 'avatar' && (
            <motion.div key="avatar"
              initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
              className="flex flex-col items-center gap-6 w-full max-w-xs"
            >
              <div className="text-6xl">{avatar}</div>
              <h2 className="font-display text-2xl text-white text-center">Escolha seu avatar!</h2>

              <div className="grid grid-cols-3 gap-3 w-full">
                {AVATAR_OPTIONS.map(opt => (
                  <button key={opt.emoji} onClick={() => { SFX.click(); setAvatar(opt.emoji); }}
                    className="flex flex-col items-center gap-1 py-3 rounded-2xl border-4 transition-all"
                    style={{
                      background: avatar === opt.emoji ? 'rgba(255,213,79,0.4)' : 'rgba(255,255,255,0.15)',
                      borderColor: avatar === opt.emoji ? '#FFD54F' : 'rgba(255,255,255,0.25)',
                      transform: avatar === opt.emoji ? 'scale(1.08)' : 'scale(1)',
                    }}>
                    <span className="text-3xl">{opt.emoji}</span>
                    <span className="font-body text-xs text-white/80">{opt.label}</span>
                  </button>
                ))}
              </div>

              <button onClick={handleNext}
                className="btn-welcome py-3 px-8 text-lg font-display text-white w-full">
                Ótimo! ✨
              </button>
            </motion.div>
          )}

          {step === 'ready' && (
            <motion.div key="ready"
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6 w-full max-w-xs text-center"
            >
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.6, repeat: 2 }}
                className="text-8xl">
                {avatar}
              </motion.div>
              <h2 className="font-display text-3xl text-white">Olá, {name}! 👋</h2>
              <p className="font-body text-white/80 leading-relaxed">
                Sua aventura bíblica está começando! Você vai explorar histórias incríveis, jogar minijogos e ganhar recompensas!
              </p>
              <div className="flex gap-4 text-4xl">
                <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>⭐</motion.span>
                <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.33 }}>🏆</motion.span>
                <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.66 }}>🎮</motion.span>
              </div>
              <button onClick={handleNext}
                className="btn-welcome py-4 px-10 text-xl font-display text-white w-full">
                Vamos lá! 🚀
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .btn-welcome {
          border-radius: 1.25rem;
          background: linear-gradient(135deg, #FF8A65, #FF6F00);
          border: 4px solid rgba(255,255,255,0.5);
          box-shadow: 0 6px 0 rgba(0,0,0,0.25), 0 10px 20px rgba(0,0,0,0.2);
          transition: transform 0.1s, box-shadow 0.1s;
        }
        .btn-welcome:active {
          transform: translateY(3px);
          box-shadow: 0 3px 0 rgba(0,0,0,0.25);
        }
        @keyframes cloudFloat {
          from { transform: translateX(-20%); }
          to { transform: translateX(120vw); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}

function CloudSVG({ size = 60 }) {
  return (
    <svg width={size} height={size * 0.55} viewBox="0 0 100 55" fill="rgba(255,255,255,0.7)">
      <ellipse cx="50" cy="38" rx="45" ry="18"/>
      <ellipse cx="35" cy="30" rx="22" ry="18"/>
      <ellipse cx="62" cy="26" rx="20" ry="17"/>
    </svg>
  );
}