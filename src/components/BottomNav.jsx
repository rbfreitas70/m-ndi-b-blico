const TABS = [
  { id: 'map',     emoji: '🗺️',  label: 'Mapa'    },
  { id: 'games',   emoji: '🎮',  label: 'Jogos'    },
  { id: 'study',   emoji: '📖',  label: 'Estudos'  },
  { id: 'profile', emoji: '👤',  label: 'Perfil'   },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-around px-2 pt-2"
      style={{
        background: 'rgba(8,12,38,0.97)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: 'max(0.6rem, env(safe-area-inset-bottom))',
      }}>
      {TABS.map(tab => {
        const active = activeTab === tab.id;
        return (
          <button key={tab.id} onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all"
            style={{
              background: active ? 'rgba(79,195,247,0.15)' : 'transparent',
              minWidth: 64,
            }}>
            <span className="text-2xl transition-transform duration-200"
              style={{ transform: active ? 'scale(1.25)' : 'scale(1)' }}>
              {tab.emoji}
            </span>
            <span className="font-body text-[10px] transition-colors duration-200"
              style={{ color: active ? '#4FC3F7' : 'rgba(255,255,255,0.4)' }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}