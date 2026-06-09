const TABS = [
  { id: 'map',     emoji: '🗺️',  label: 'Mapa'     },
  { id: 'stories', emoji: '📖',  label: 'Histórias' },
  { id: 'games',   emoji: '🎮',  label: 'Jogos'     },
  { id: 'profile', emoji: '👤',  label: 'Perfil'    },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <div
      className="flex-shrink-0 flex items-center justify-around px-2 py-2 border-t border-white/10"
      style={{
        background: 'rgba(10,15,40,0.95)',
        backdropFilter: 'blur(16px)',
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
      }}
    >
      {TABS.map(tab => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all"
            style={{
              background: active ? 'rgba(79,195,247,0.18)' : 'transparent',
              minWidth: 60,
            }}
          >
            <span
              className="text-2xl transition-transform duration-200"
              style={{ transform: active ? 'scale(1.2)' : 'scale(1)' }}
            >
              {tab.emoji}
            </span>
            <span
              className="text-[10px] font-body transition-colors"
              style={{ color: active ? '#4FC3F7' : 'rgba(255,255,255,0.45)' }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}