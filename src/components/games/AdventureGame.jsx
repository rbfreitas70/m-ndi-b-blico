import { useState } from 'react';
import { SFX } from '@/lib/audioEngine';
import ConfettiEffect from '@/components/ConfettiEffect';

const STEPS = [
  {
    scene: '🏜️', text: 'Você está guiando o povo pelo deserto rumo à Terra Prometida. O sol está forte e todos têm sede. O que fazer?',
    opts: [
      { t: '🙏 Orar e seguir a nuvem de Deus', ok: true, fb: 'A nuvem guiou vocês até um oásis com água fresca!' },
      { t: '🏃 Correr sem direção', ok: false, fb: 'Vocês se cansaram e se perderam! Volte ao caminho de Deus.' },
    ],
  },
  {
    scene: '🌊', text: 'Um rio largo bloqueia o caminho! O povo está com medo de atravessar.',
    opts: [
      { t: '😨 Desistir e voltar', ok: false, fb: 'Não desista! Deus sempre abre um caminho.' },
      { t: '✨ Confiar em Deus e avançar', ok: true, fb: 'As águas se abriram, como no Mar Vermelho!' },
    ],
  },
  {
    scene: '🍞', text: 'A comida acabou e todos estão com fome no meio do deserto.',
    opts: [
      { t: '🙌 Pedir a Deus com fé', ok: true, fb: 'Deus enviou maná do céu! Pão fresquinho toda manhã!' },
      { t: '😡 Reclamar e brigar', ok: false, fb: 'Reclamar não enche barriga! Confie em Deus.' },
    ],
  },
  {
    scene: '⛰️', text: 'Uma montanha gigante está à frente. Há um túnel escuro e uma trilha iluminada.',
    opts: [
      { t: '🕳️ Entrar no túnel escuro sozinho', ok: false, fb: 'Muito perigoso! Melhor andar na luz.' },
      { t: '💡 Seguir a trilha iluminada', ok: true, fb: 'A Palavra de Deus é lâmpada para os nossos pés!' },
    ],
  },
  {
    scene: '🏞️', text: 'Você avista a Terra Prometida! Mas gigantes guardam a entrada. Os espias estão com medo.',
    opts: [
      { t: '💪 Ser corajoso como Josué e Calebe', ok: true, fb: 'Com Deus, nenhum gigante é grande demais! Vocês entraram!' },
      { t: '😱 Fugir de volta ao deserto', ok: false, fb: 'Coragem! Deus prometeu essa terra a vocês.' },
    ],
  },
];

export default function AdventureGame({ onBack, onComplete }) {
  const [step, setStep] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [feedback, setFeedback] = useState(null); // {ok, fb}
  const [phase, setPhase] = useState('play'); // play | won | lost
  const [showConfetti, setShowConfetti] = useState(false);

  const current = STEPS[step];

  const choose = (opt) => {
    if (feedback) return;
    SFX.click();
    if (opt.ok) SFX.match(); else SFX.error();
    setFeedback(opt);
    setTimeout(() => {
      setFeedback(null);
      if (opt.ok) {
        if (step === STEPS.length - 1) {
          setPhase('won'); setShowConfetti(true); SFX.victory();
        } else setStep(s => s + 1);
      } else {
        const nh = hearts - 1;
        setHearts(nh);
        if (nh <= 0) setPhase('lost');
      }
    }, 2200);
  };

  const restart = () => { SFX.click(); setStep(0); setHearts(3); setPhase('play'); setFeedback(null); };

  if (phase === 'won') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6"
        style={{ background: 'linear-gradient(160deg, #2E7D32, #1B5E20)' }}>
        <ConfettiEffect active={showConfetti} onDone={() => setShowConfetti(false)} />
        <div className="text-7xl mb-3">🏞️</div>
        <h2 className="font-display text-3xl text-white mb-2">Terra Prometida!</h2>
        <p className="font-body text-white/80 mb-6">Você guiou o povo com fé e coragem!</p>
        <button onClick={() => onComplete(95, 45)}
          className="px-8 py-3 rounded-2xl font-display text-lg text-green-900 bg-yellow-400 shadow-lg">
          Receber +95 XP e +45 🪙
        </button>
      </div>
    );
  }

  if (phase === 'lost') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6"
        style={{ background: 'linear-gradient(160deg, #5D4037, #3E2723)' }}>
        <div className="text-7xl mb-3">😢</div>
        <h2 className="font-display text-2xl text-white mb-2">A jornada falhou...</h2>
        <p className="font-body text-white/70 mb-6">Mas todo herói pode tentar de novo!</p>
        <div className="flex gap-3">
          <button onClick={restart} className="px-6 py-3 rounded-2xl font-display text-amber-900 bg-yellow-400">🔄 Tentar de novo</button>
          <button onClick={onBack} className="px-6 py-3 rounded-2xl font-display text-white bg-white/20">← Sair</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FFB74D 0%, #FF8A65 60%, #D7B07A 100%)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-black/10">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/50 flex items-center justify-center">←</button>
        <div className="flex-1">
          <p className="font-display text-orange-950 text-sm">🏜️ Jornada no Deserto</p>
          <div className="flex gap-0.5 mt-0.5">
            {STEPS.map((_, i) => (
              <div key={i} className="h-1.5 flex-1 rounded-full" style={{ background: i <= step ? '#2E7D32' : 'rgba(0,0,0,0.15)' }} />
            ))}
          </div>
        </div>
        <span className="text-sm">{'❤️'.repeat(hearts)}{'🖤'.repeat(3 - hearts)}</span>
      </div>

      {/* Cena */}
      <div className="flex-1 flex flex-col justify-center px-5 gap-4">
        <div className="text-7xl text-center">{current.scene}</div>
        <div className="bg-white/80 rounded-2xl p-4 border-2 border-white/60">
          <p className="font-body text-gray-800 text-base leading-relaxed text-center">
            {feedback ? feedback.fb : current.text}
          </p>
        </div>
        {!feedback && (
          <div className="space-y-3">
            {current.opts.map((opt, i) => (
              <button key={i} onClick={() => choose(opt)}
                className="w-full py-3.5 px-4 rounded-2xl font-body text-white text-base bg-orange-900/80 border-2 border-white/30 shadow-md active:scale-95 transition-transform">
                {opt.t}
              </button>
            ))}
          </div>
        )}
        {feedback && (
          <div className="text-center text-4xl">{feedback.ok ? '✅' : '❌'}</div>
        )}
      </div>
    </div>
  );
}