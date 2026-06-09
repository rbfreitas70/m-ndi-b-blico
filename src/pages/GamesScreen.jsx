import { useState } from 'react';
import { SFX } from '@/lib/audioEngine';
import MemoryGame from '@/components/games/MemoryGame';
import PuzzleGame from '@/components/games/PuzzleGame';
import ArkGame from '@/components/games/ArkGame';
import RunnerGame from '@/components/games/RunnerGame';
import WordSearchGame from '@/components/games/WordSearchGame';
import ExodusPuzzle from '@/components/games/ExodusPuzzle';
import ConfettiEffect from '@/components/ConfettiEffect';

const GAMES_LIST = [
  { id: 'memory',     name: 'Memória Bíblica',  emoji: '🃏', color: '#9C27B0', desc: 'Encontre os pares sagrados!',       xp: 60,  dr: 25 },
  { id: 'puzzle',     name: 'Quebra-Cabeça',     emoji: '🧩', color: '#FF8A65', desc: 'Monte figuras bíblicas!',           xp: 70,  dr: 30 },
  { id: 'ark',        name: 'Grande Arca de Noé', emoji: '⛵', color: '#2196F3', desc: 'Salve os animais do dilúvio!',     xp: 45,  dr: 20 },
  { id: 'runner',     name: 'Corrida Bíblica',   emoji: '🏃', color: '#FF5722', desc: 'Corra e colete pergaminhos!',       xp: 80,  dr: 40 },
  { id: 'wordsearch', name: 'Caça-Palavras',      emoji: '🔍', color: '#4CAF50', desc: 'Encontre palavras da Bíblia!',     xp: 50,  dr: 22 },
  { id: 'exodus',     name: 'Travessia do Mar',   emoji: '🌊', color: '#0097A7', desc: 'Monte a cena do Mar Vermelho!',    xp: 90,  dr: 45 },
];

export default function GamesScreen({ gameState, onReward }) {
  const [activeGame, setActiveGame] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleComplete = (gameId, xp, dracmas) => {
    SFX.victory();
    setShowConfetti(true);
    onReward(xp, dracmas, gameId);
    setActiveGame(null);
  };

  if (activeGame === 'memory')
    return <MemoryGame onBack={() => setActiveGame(null)} onComplete={(xp, dr) => handleComplete('memory', xp, dr)} />;
  if (activeGame === 'puzzle')
    return <PuzzleGame onBack={() => setActiveGame(null)} onComplete={(xp, dr) => handleComplete('puzzle', xp, dr)} />;
  if (activeGame === 'ark')
    return <ArkGame onBack={() => setActiveGame(null)} onComplete={(xp, dr) => handleComplete('ark', xp, dr)} />;
  if (activeGame === 'runner')
    return <RunnerGame onBack={() => setActiveGame(null)} onComplete={(xp, dr) => handleComplete('runner', xp, dr)} highScore={gameState?.runnerHighScore || 0} onHighScore={s => onReward(0, 0, null, { runnerHighScore: s })} />;
  if (activeGame === 'wordsearch')
    return <WordSearchGame onBack={() => setActiveGame(null)} onComplete={(xp, dr) => handleComplete('wordsearch', xp, dr)} />;
  if (activeGame === 'exodus')
    return <ExodusPuzzle onBack={() => setActiveGame(null)} onComplete={(xp, dr) => handleComplete('exodus', xp, dr)} />;

  return (
    <div className="h-full overflow-y-auto"
      style={{ background: 'linear-gradient(180deg, #1B5E20 0%, #2E7D32 40%, #1565C0 100%)' }}>
      <ConfettiEffect active={showConfetti} onDone={() => setShowConfetti(false)} />

      {/* Header */}
      <div className="px-4 pt-10 pb-5">
        <h1 className="font-display text-3xl text-white drop-shadow">🎮 Minijogos</h1>
        <p className="font-body text-white/70 text-sm mt-1">Jogue e ganhe Dracmas!</p>
        <div className="flex gap-2 mt-2">
          <div className="bg-white/15 px-3 py-1 rounded-full">
            <span className="font-body text-white text-xs">{gameState?.gamesPlayed?.length || 0} jogos completados</span>
          </div>
        </div>
      </div>

      {/* Games list */}
      <div className="px-4 pb-32 space-y-3">
        {GAMES_LIST.map((game, i) => {
          const played = gameState?.gamesPlayed?.includes(game.id);
          return (
            <button key={game.id} onClick={() => { SFX.click(); setActiveGame(game.id); }}
              className="w-full text-left"
              style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="rounded-3xl p-4 border-3 flex items-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  borderWidth: '3px',
                  background: `linear-gradient(135deg, ${game.color}33, ${game.color}15)`,
                  borderColor: `${game.color}66`,
                  backdropFilter: 'blur(8px)',
                  boxShadow: `0 4px 16px ${game.color}22`,
                }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-md"
                  style={{ background: `${game.color}44`, border: `3px solid ${game.color}66` }}>
                  {game.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-display text-white text-lg">{game.name}</h3>
                    {played && <span className="text-yellow-400 text-sm">⭐</span>}
                  </div>
                  <p className="font-body text-white/60 text-xs mb-1.5">{game.desc}</p>
                  <div className="flex gap-2">
                    <span className="bg-yellow-400/20 text-yellow-300 text-xs font-body px-2 py-0.5 rounded-full">+{game.xp} XP</span>
                    <span className="bg-orange-400/20 text-orange-300 text-xs font-body px-2 py-0.5 rounded-full">+{game.dr} 🪙</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0"
                  style={{ background: `${game.color}55`, border: `2px solid ${game.color}88` }}>
                  ▶
                </div>
              </div>
            </button>
          );
        })}

        <div className="mt-4 bg-white/10 rounded-2xl p-4 border border-white/15 text-center">
          <p className="font-body text-white/60 text-sm">
            💡 Cada jogo te dá <strong className="text-yellow-300">Dracmas</strong> para comprar avatares e molduras no perfil!
          </p>
        </div>
      </div>
    </div>
  );
}