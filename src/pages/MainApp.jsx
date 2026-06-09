import { useState, useEffect } from 'react';
import MapScreen from './MapScreen';
import BottomNav from '@/components/BottomNav';

// Simple localStorage-backed gameState for demo
function loadState() {
  try {
    const raw = localStorage.getItem('mundi_gamestate');
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    name: 'Explorador',
    level: 1,
    totalXP: 0,
    xp: 0,
    dracmas: 50,
    completedStories: [],
    unlockedMedals: [],
    dailyStreak: 1,
    gamesPlayed: [],
    avatarId: 'default',
    frameId: null,
    ownedItems: [],
    title: 'Aprendiz Bíblico',
    runnerHighScore: 0,
  };
}

function saveState(state) {
  try { localStorage.setItem('mundi_gamestate', JSON.stringify(state)); } catch {}
}

const XP_PER_LEVEL = 300;

export default function MainApp() {
  const [gameState, setGameState] = useState(loadState);
  const [activeTab, setActiveTab] = useState('map');

  useEffect(() => { saveState(gameState); }, [gameState]);

  const handleStartStory = (story) => {
    // Navigate to story reader (placeholder for now)
    alert(`Abrindo: ${story.title}\n\nA leitura de histórias está a caminho!`);
  };

  const addXP = (xp, dracmas = 0) => {
    setGameState(prev => {
      const newTotal = prev.totalXP + xp;
      const newXP = prev.xp + xp;
      const newLevel = Math.floor(newTotal / XP_PER_LEVEL) + 1;
      return {
        ...prev,
        totalXP: newTotal,
        xp: newXP,
        dracmas: prev.dracmas + dracmas,
        level: newLevel,
      };
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 overflow-hidden">
      <div className="flex-1 overflow-hidden">
        {activeTab === 'map' && (
          <MapScreen
            gameState={gameState}
            onStartStory={handleStartStory}
          />
        )}
        {activeTab !== 'map' && (
          <div className="h-full flex items-center justify-center">
            <p className="text-white/50 font-display text-lg">
              {activeTab === 'stories' ? '📖 Histórias em breve...' :
               activeTab === 'games' ? '🎮 Jogos em breve...' :
               activeTab === 'profile' ? '👤 Perfil em breve...' : ''}
            </p>
          </div>
        )}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}