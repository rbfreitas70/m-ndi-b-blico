import { useState } from 'react';
import { SFX } from '@/lib/audioEngine';
import ConfettiEffect from '@/components/ConfettiEffect';

const GOALS = { wood: 10, stone: 10, gold: 6 };
const TOTAL_ROUNDS = 10;

const RESOURCES = [
  { id: 'wood',  name: 'Madeira de Cedro', emoji: '🪵', color: '#8D6E63' },
  { id: 'stone', name: 'Pedras Lavradas',  emoji: '🪨', color: '#90A4AE' },
  { id: 'gold',  name: 'Ouro Puro',        emoji: '✨', color: '#FFD54F' },
];

const EVENTS = [
  { text: '🌧️ Chuva forte! Os trabalhadores descansaram.', bonus: 0 },
  { text: '🐪 Caravana amiga chegou! +1 recurso extra!', bonus: 1 },
  { text: '💪 Trabalhadores animados! +2 recursos extras!', bonus: 2 },
  { text: '☀️ Dia tranquilo de trabalho.', bonus: 0 },
  { text: '🎁 O rei Hirão enviou presentes! +1 extra!', bonus: 1 },
];

const rnd = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

export default function StrategyGame({ onBack, onComplete }) {
  const [round, setRound] = useState(1);
  const [res, setRes] = useState({ wood: 0, stone: 0, gold: 0 });
  const [event, setEvent] = useState(null);
  const [phase, setPhase] = useState('play'); // play | won | lost
  const [showConfetti, setShowConfetti] = useState(false);

  const done = Object.keys(GOALS).every(k => res[k] >= GOALS[k]);

  const collect = (resource) => {
    if (phase !== 'play' || event) return;
    SFX.click();
    const ev = EVENTS[rnd(0, EVENTS.length - 1)];
    const amount = rnd(2, 3) + ev.bonus;
    const nr = { ...res, [resource.id]: res[resource.id] + amount };
    setRes(nr);
    setEvent({ ...ev, gained: amount, emoji: resource.emoji });
    SFX.coin ? SFX.coin() : SFX.match();
    setTimeout(() => {
      setEvent(null);
      const finished = Object.keys(GOALS).every(k => nr[k] >= GOALS[k]);
      if (finished) {
        setPhase('won'); setShowConfetti(true); SFX.victory();
      } else if (round >= TOTAL_ROUNDS) {
        setPhase('lost');
      } else {
        setRound(r => r + 1);
      }
    }, 1600);
  };

  const restart = () => { SFX.click(); setRound(1); setRes({ wood: 0, stone: 0, gold: 0 }); setPhase('play'); setEvent(null); };

  const totalProgress = Object.keys(GOALS).reduce((acc, k) => acc + Math.min(res[k], GOALS[k]), 0)
    / Object.values(GOALS).reduce((a, b) => a + b, 0);

  if (phase === 'won') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6"
        style={{ background: 'linear-gradient(160deg, #F57F17, #E65100)' }}>
        <ConfettiEffect active={showConfetti} onDone={() => setShowConfetti(false)} />
        <div className="text-7xl mb-3">🏛️</div>
        <h2 className="font-display text-3xl text-white mb-2">Templo Construído!</h2>
        <p className="font-body text-white/80 mb-6">Você planejou como o sábio rei Salomão!</p>
        <button onClick={() => onComplete(100, 50)}
          className="px-8 py-3 rounded-2xl font-display text-lg text-orange-900 bg-yellow-300 shadow-lg">
          Receber +100 XP e +50 🪙
        </button>
      </div>
    );
  }

  if (phase === 'lost') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6"
        style={{ background: 'linear-gradient(160deg, #5D4037, #3E2723)' }}>
        <div className="text-7xl mb-3">🧱</div>
        <h2 className="font-display text-2xl text-white mb-2">Faltaram materiais...</h2>
        <p className="font-body text-white/70 mb-6">Planeje melhor quais recursos coletar!</p>
        <div className="flex gap-3">
          <button onClick={restart} className="px-6 py-3 rounded-2xl font-display text-amber-900 bg-yellow-400">🔄 Tentar de novo</button>
          <button onClick={onBack} className="px-6 py-3 rounded-2xl font-display text-white bg-white/20">← Sair</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FFF3E0 0%, #FFE0B2 60%, #FFCC80 100%)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-black/10">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/60 flex items-center justify-center">←</button>
        <div className="flex-1">
          <p className="font-display text-orange-950 text-sm">🏛️ Construtor do Templo</p>
          <p className="font-body text-orange-900/60 text-xs">Rodada {round} de {TOTAL_ROUNDS} — escolha bem!</p>
        </div>
      </div>

      {/* Templo em progresso */}
      <div className="px-5 pt-4">
        <div className="bg-white/60 rounded-2xl p-4 text-center border-2 border-white/70">
          <div className="text-6xl" style={{ filter: `grayscale(${1 - totalProgress})`, opacity: 0.4 + totalProgress * 0.6 }}>🏛️</div>
          <div className="h-2.5 bg-black/15 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${totalProgress * 100}%` }} />
          </div>
          <p className="font-body text-orange-900/70 text-xs mt-1">{Math.round(totalProgress * 100)}% construído</p>
        </div>
      </div>

      {/* Evento */}
      <div className="flex-1 flex items-center px-5">
        <div className="bg-white/70 rounded-2xl p-4 w-full text-center border-2 border-white/60 min-h-[72px] flex items-center justify-center">
          <p className="font-body text-gray-800 text-sm leading-relaxed">
            {event
              ? <>{event.text}<br /><strong>+{event.gained} {event.emoji} coletados!</strong></>
              : 'Escolha qual recurso seus trabalhadores vão coletar nesta rodada:'}
          </p>
        </div>
      </div>

      {/* Recursos */}
      <div className="px-5 pb-6 space-y-2.5">
        {RESOURCES.map(r => {
          const complete = res[r.id] >= GOALS[r.id];
          return (
            <button key={r.id} onClick={() => collect(r)} disabled={!!event || complete}
              className="w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all active:scale-[0.98]"
              style={{
                background: complete ? 'rgba(102,187,106,0.25)' : 'rgba(255,255,255,0.65)',
                borderColor: complete ? '#66BB6A' : r.color + '88',
                opacity: event && !complete ? 0.6 : 1,
              }}>
              <span className="text-3xl">{r.emoji}</span>
              <div className="flex-1 text-left">
                <p className="font-display text-gray-800 text-sm">{r.name}</p>
                <div className="h-2 bg-black/10 rounded-full overflow-hidden mt-1">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (res[r.id] / GOALS[r.id]) * 100)}%`, background: r.color }} />
                </div>
              </div>
              <span className="font-display text-gray-700 text-sm">{complete ? '✅' : `${res[r.id]}/${GOALS[r.id]}`}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}