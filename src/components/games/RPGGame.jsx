import { useState } from 'react';
import { SFX } from '@/lib/audioEngine';
import ConfettiEffect from '@/components/ConfettiEffect';

const ENEMIES = [
  { name: 'Gigante do Medo', emoji: '🧌', img: 'https://media.base44.com/images/public/6a28519cde1732b1752938cb/5c8e3aa26_emoji-Golias.png', hp: 25 },
  { name: 'Leão da Cova', emoji: '🦁', hp: 30 },
  { name: 'Golias', emoji: '🧌', img: 'https://media.base44.com/images/public/6a28519cde1732b1752938cb/0cf18da7e_emoji-Golias.png', hp: 40 },
];

const ATTACKS = [
  { id: 'courage', name: 'Coragem', emoji: '⚔️', desc: 'Dano 4-7', min: 4, max: 7 },
  { id: 'faith', name: 'Pedra da Fé', emoji: '🪨', desc: 'Dano 2-12', min: 2, max: 12 },
  { id: 'pray', name: 'Oração', emoji: '🙏', desc: 'Cura 5-8', heal: true, min: 5, max: 8 },
];

const rnd = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

export default function RPGGame({ onBack, onComplete }) {
  const [stage, setStage] = useState(0);
  const [heroHP, setHeroHP] = useState(30);
  const [enemyHP, setEnemyHP] = useState(ENEMIES[0].hp);
  const [log, setLog] = useState('Um inimigo apareceu! Escolha sua ação.');
  const [turn, setTurn] = useState('hero'); // hero | enemy | done
  const [phase, setPhase] = useState('play'); // play | won | lost
  const [showConfetti, setShowConfetti] = useState(false);

  const enemy = ENEMIES[stage];

  const enemyTurn = (currentHeroHP) => {
    setTimeout(() => {
      const dmg = rnd(3, 6);
      const nh = Math.max(0, currentHeroHP - dmg);
      SFX.error();
      setHeroHP(nh);
      setLog(`${enemy.emoji} ${enemy.name} atacou! Você perdeu ${dmg} de vida.`);
      if (nh <= 0) setPhase('lost');
      else setTurn('hero');
    }, 1200);
  };

  const act = (atk) => {
    if (turn !== 'hero' || phase !== 'play') return;
    SFX.click();
    setTurn('enemy');
    if (atk.heal) {
      const heal = rnd(atk.min, atk.max);
      const nh = Math.min(30, heroHP + heal);
      setHeroHP(nh);
      SFX.match();
      setLog(`🙏 Você orou e recuperou ${heal} de vida!`);
      enemyTurn(nh);
    } else {
      const dmg = rnd(atk.min, atk.max);
      const ne = Math.max(0, enemyHP - dmg);
      setEnemyHP(ne);
      SFX.hit ? SFX.hit() : SFX.match();
      setLog(`${atk.emoji} ${atk.name} causou ${dmg} de dano!`);
      if (ne <= 0) {
        setTimeout(() => {
          if (stage === ENEMIES.length - 1) {
            setPhase('won'); setShowConfetti(true); SFX.victory();
          } else {
            const ns = stage + 1;
            setStage(ns);
            setEnemyHP(ENEMIES[ns].hp);
            setHeroHP(hp => Math.min(30, hp + 8));
            setLog(`Você venceu! Mas ${ENEMIES[ns].emoji} ${ENEMIES[ns].name} apareceu!`);
            setTurn('hero');
          }
        }, 1000);
      } else {
        enemyTurn(heroHP);
      }
    }
  };

  const restart = () => {
    SFX.click();
    setStage(0); setHeroHP(30); setEnemyHP(ENEMIES[0].hp);
    setLog('Um inimigo apareceu! Escolha sua ação.'); setTurn('hero'); setPhase('play');
  };

  const HPBar = ({ hp, max, color }) => (
    <div className="h-3 bg-black/30 rounded-full overflow-hidden w-full">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(hp / max) * 100}%`, background: color }} />
    </div>
  );

  if (phase === 'won') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6"
        style={{ background: 'linear-gradient(160deg, #4527A0, #311B92)' }}>
        <ConfettiEffect active={showConfetti} onDone={() => setShowConfetti(false)} />
        <div className="text-7xl mb-3">🛡️</div>
        <h2 className="font-display text-3xl text-white mb-2">Herói da Fé!</h2>
        <p className="font-body text-white/80 mb-6">Você venceu os 3 gigantes com fé e coragem!</p>
        <button onClick={() => onComplete(110, 50)}
          className="px-8 py-3 rounded-2xl font-display text-lg text-purple-900 bg-yellow-400 shadow-lg">
          Receber +110 XP e +50 🪙
        </button>
      </div>
    );
  }

  if (phase === 'lost') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6"
        style={{ background: 'linear-gradient(160deg, #37474F, #263238)' }}>
        <div className="text-7xl mb-3">💤</div>
        <h2 className="font-display text-2xl text-white mb-2">Você foi derrotado...</h2>
        <p className="font-body text-white/70 mb-6">Levante-se, herói! A fé nunca desiste!</p>
        <div className="flex gap-3">
          <button onClick={restart} className="px-6 py-3 rounded-2xl font-display text-purple-900 bg-yellow-400">🔄 Tentar de novo</button>
          <button onClick={onBack} className="px-6 py-3 rounded-2xl font-display text-white bg-white/20">← Sair</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #4527A0 0%, #311B92 60%, #1A237E 100%)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-black/20">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white">←</button>
        <div className="flex-1">
          <p className="font-display text-white text-sm">🛡️ Batalha da Fé</p>
          <p className="font-body text-white/50 text-xs">Batalha {stage + 1} de {ENEMIES.length}</p>
        </div>
      </div>

      {/* Inimigo */}
      <div className="px-5 pt-5">
        <div className="flex items-center gap-3 mb-1">
          {enemy.img
            ? <img src={enemy.img} alt={enemy.name} className="w-14 h-16 object-contain" />
            : <span className="text-5xl">{enemy.emoji}</span>}
          <div className="flex-1">
            <p className="font-display text-white text-sm">{enemy.name}</p>
            <HPBar hp={enemyHP} max={enemy.hp} color="#EF5350" />
            <p className="font-body text-white/50 text-[10px] mt-0.5">{enemyHP}/{enemy.hp} HP</p>
          </div>
        </div>
      </div>

      {/* Log */}
      <div className="flex-1 flex items-center justify-center px-5">
        <div className="bg-white/10 border border-white/20 rounded-2xl p-4 w-full text-center">
          <p className="font-body text-white text-base leading-relaxed">{log}</p>
          {turn === 'enemy' && <p className="font-body text-white/40 text-xs mt-2">⏳ Turno do inimigo...</p>}
        </div>
      </div>

      {/* Herói */}
      <div className="px-5 pb-2">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-5xl">🦸</span>
          <div className="flex-1">
            <p className="font-display text-white text-sm">Você</p>
            <HPBar hp={heroHP} max={30} color="#66BB6A" />
            <p className="font-body text-white/50 text-[10px] mt-0.5">{heroHP}/30 HP</p>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="grid grid-cols-3 gap-2 px-5 pb-6">
        {ATTACKS.map(atk => (
          <button key={atk.id} onClick={() => act(atk)} disabled={turn !== 'hero'}
            className="py-3 rounded-2xl text-center border-2 transition-all active:scale-95"
            style={{
              background: turn === 'hero' ? 'rgba(255,213,79,0.2)' : 'rgba(255,255,255,0.05)',
              borderColor: turn === 'hero' ? 'rgba(255,213,79,0.5)' : 'rgba(255,255,255,0.1)',
              opacity: turn === 'hero' ? 1 : 0.5,
            }}>
            <div className="text-2xl">{atk.emoji}</div>
            <p className="font-display text-white text-xs">{atk.name}</p>
            <p className="font-body text-white/50 text-[9px]">{atk.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}