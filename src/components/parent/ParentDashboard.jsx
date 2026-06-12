import { SFX } from '@/lib/audioEngine';
import { MEDALS } from '@/lib/achievements';
import { STORIES } from '@/data/stories';
import { getTitle } from '@/lib/gameState';

function getStudiedBooks() {
  try {
    return Object.keys(JSON.parse(localStorage.getItem('mundi_study_plans') || '{}'));
  } catch { return []; }
}

function formatTime(seconds) {
  if (!seconds) return '0 min';
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}min` : `${m} min`;
}

export default function ParentDashboard({ gameState, onClose }) {
  const studiedBooks = getStudiedBooks();
  const earnedMedals = MEDALS.filter(m => gameState.unlockedMedals?.includes(m.id));

  return (
    <div className="flex flex-col overflow-hidden"
      style={{ height: '100dvh', background: 'linear-gradient(180deg, #263238, #37474F)' }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-10 pb-4 border-b border-white/10">
        <button onClick={() => { SFX.click(); onClose(); }}
          className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">←</button>
        <div>
          <h1 className="font-display text-xl text-white">👨‍👩‍👧 Painel dos Pais</h1>
          <p className="font-body text-white/50 text-xs">Acompanhe o progresso de {gameState.name || 'sua criança'}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-10">

        {/* Resumo geral */}
        <div className="bg-white/8 rounded-2xl p-4 border border-white/10" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/30 flex items-center justify-center text-2xl">{gameState.avatarEmoji || '👦'}</div>
            <div>
              <p className="font-display text-white">{gameState.name || 'Aventureiro'}</p>
              <p className="font-body text-white/50 text-xs">Nível {gameState.level} · {getTitle(gameState.level)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: '⭐', label: 'XP total', val: gameState.totalXP },
              { icon: '⏱️', label: 'Tempo em jogos', val: formatTime(gameState.gameTimeSeconds) },
              { icon: '📖', label: 'Histórias completas', val: `${gameState.completedStories?.length || 0}/${STORIES.length}` },
              { icon: '🔥', label: 'Dias seguidos', val: gameState.dailyStreak || 1 },
            ].map(s => (
              <div key={s.label} className="bg-white/8 rounded-xl p-3 border border-white/10" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <p className="text-lg">{s.icon}</p>
                <p className="font-display text-white text-lg leading-none">{s.val}</p>
                <p className="font-body text-white/45 text-[10px] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Livros estudados */}
        <div className="rounded-2xl p-4 border border-white/10" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <h3 className="font-display text-white text-sm mb-1">📚 Livros da Bíblia estudados ({studiedBooks.length})</h3>
          {studiedBooks.length === 0 ? (
            <p className="font-body text-white/45 text-xs">Nenhum plano de estudo iniciado ainda.</p>
          ) : (
            <div className="flex flex-wrap gap-2 mt-2">
              {studiedBooks.map(book => (
                <span key={book} className="font-body text-xs text-green-200 bg-green-500/20 border border-green-400/30 px-3 py-1 rounded-full">
                  📕 {book}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Medalhas conquistadas */}
        <div className="rounded-2xl p-4 border border-white/10" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <h3 className="font-display text-white text-sm mb-1">🏅 Medalhas conquistadas ({earnedMedals.length}/{MEDALS.length})</h3>
          {earnedMedals.length === 0 ? (
            <p className="font-body text-white/45 text-xs">Nenhuma medalha conquistada ainda.</p>
          ) : (
            <div className="space-y-1.5 mt-2">
              {earnedMedals.map(m => (
                <div key={m.id} className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/8">
                  <span className="text-xl">{m.emoji}</span>
                  <div>
                    <p className="font-body text-white text-xs">{m.name}</p>
                    <p className="font-body text-white/40 text-[10px]">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="font-body text-white/35 text-[11px] text-center">
          O tempo em jogos é contado a partir de agora, sempre que a criança jogar um minijogo.
        </p>
      </div>
    </div>
  );
}