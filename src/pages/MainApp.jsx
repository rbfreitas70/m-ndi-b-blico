import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeScreen from './WelcomeScreen';
import MapScreen from './MapScreen';
import StoryReader from './StoryReader';
import GamesScreen from './GamesScreen';
import StudyScreen from './StudyScreen';
import ProfileScreen from './ProfileScreen';
import BottomNav from '@/components/BottomNav';
import ConfettiEffect from '@/components/ConfettiEffect';
import { loadState, saveState, applyReward, getTitle, getLevel } from '@/lib/gameState';
import { SFX } from '@/lib/audioEngine';

export default function MainApp() {
  const [gameState, setGameState] = useState(() => loadState());
  const [activeTab, setActiveTab] = useState('map');
  const [currentStory, setCurrentStory] = useState(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => { saveState(gameState); }, [gameState]);

  // Onboarding: show welcome if name not set
  const needsOnboarding = !gameState.onboardingDone || !gameState.name;

  const handleOnboardingComplete = ({ name, avatarEmoji }) => {
    SFX.unlock();
    setGameState(prev => ({
      ...prev,
      name,
      avatarEmoji,
      onboardingDone: true,
    }));
  };

  const handleStartStory = (story) => {
    SFX.click();
    setCurrentStory(story);
  };

  const handleStoryComplete = (storyId, xp, dracmas) => {
    const prevLevel = gameState.level;
    const newState = applyReward(gameState, xp, dracmas, storyId);
    setGameState(newState);
    setCurrentStory(null);
    setShowConfetti(true);
    if (newState.level > prevLevel) {
      setTimeout(() => { setShowLevelUp(true); SFX.unlock(); }, 800);
    }
  };

  const handleGameReward = (xp, dracmas, gameId, extraFields = {}) => {
    setGameState(prev => {
      const prevLevel = prev.level;
      const base = applyReward(prev, xp, dracmas);
      const gamesPlayed = gameId && !prev.gamesPlayed.includes(gameId)
        ? [...prev.gamesPlayed, gameId]
        : prev.gamesPlayed;
      const next = { ...base, gamesPlayed, ...extraFields };
      if (next.level > prevLevel) {
        setTimeout(() => { setShowLevelUp(true); SFX.unlock(); }, 600);
      }
      return next;
    });
    if (xp > 0) setShowConfetti(true);
  };

  const handleUpdateState = (fields) => {
    setGameState(prev => ({ ...prev, ...fields }));
  };

  if (needsOnboarding) {
    return <WelcomeScreen onComplete={handleOnboardingComplete} />;
  }

  if (currentStory) {
    return (
      <StoryReader
        story={currentStory}
        onComplete={handleStoryComplete}
        onBack={() => setCurrentStory(null)}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-900">
      <ConfettiEffect active={showConfetti} onDone={() => setShowConfetti(false)} />

      {/* Level up toast */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 rounded-2xl shadow-2xl border-4 border-white/50 flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="font-display text-white text-lg">Nível {gameState.level}!</p>
                <p className="font-body text-white/80 text-xs">{getTitle(gameState.level)}</p>
              </div>
              <span className="text-2xl">⭐</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {showLevelUp && setTimeout(() => setShowLevelUp(false), 3000) && null}

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'map' && (
            <motion.div key="map" className="h-full"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <MapScreen gameState={gameState} onStartStory={handleStartStory} />
            </motion.div>
          )}
          {activeTab === 'games' && (
            <motion.div key="games" className="h-full"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <GamesScreen gameState={gameState} onReward={handleGameReward} />
            </motion.div>
          )}
          {activeTab === 'study' && (
            <motion.div key="study" className="h-full"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <StudyScreen />
            </motion.div>
          )}
          {activeTab === 'profile' && (
            <motion.div key="profile" className="h-full"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <ProfileScreen gameState={gameState} onUpdateState={handleUpdateState} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={(tab) => { SFX.click(); setActiveTab(tab); }} />
    </div>
  );
}