import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHAPTERS, STORIES, isStoryUnlocked } from '@/data/stories';
import StoryModal from '@/components/map/StoryModal';

export default function MapScreen({ gameState, onStartStory }) {
  const [selectedStory, setSelectedStory] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const scrollRef = useRef(null);

  const totalXP = gameState?.totalXP ?? 0;

  const isChapterUnlocked = (chapter) => totalXP >= chapter.unlockXP;

  const getChapterProgress = (chapter) => {
    const stories = STORIES.filter(s => s.chapterId === chapter.id);
    const completed = stories.filter(s => gameState?.completedStories?.includes(s.id));
    return { total: stories.length, done: completed.length };
  };

  const handleStoryPress = (story) => {
    if (!isStoryUnlocked(story, totalXP)) return;
    setSelectedStory(story);
  };

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto overscroll-contain"
      style={{ background: 'linear-gradient(180deg, #1a237e 0%, #283593 8%, #0277BD 25%, #0288D1 50%, #4CAF50 75%, #388E3C 100%)' }}
    >
      {/* Stars background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              top: `${Math.random() * 30}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 px-4 pb-32 pt-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="font-display text-3xl text-white drop-shadow-lg">🗺️ Mapa de Aventuras</h1>
          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full">
              <span className="font-body text-white text-sm">⭐ {totalXP} XP</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full">
              <span className="font-body text-white text-sm">
                📖 {gameState?.completedStories?.length ?? 0}/{STORIES.length}
              </span>
            </div>
          </div>
        </div>

        {/* Testaments and chapters — rendered bottom to top visually (reversed list) */}
        <div className="space-y-8">
          {[
            { id: 'new', title: '✝️ Novo Testamento', chapters: CHAPTERS.filter(c => c.testament === 'new') },
            { id: 'old', title: '📜 Velho Testamento', chapters: CHAPTERS.filter(c => c.testament === 'old') },
          ].map(group => (
          <div key={group.id} className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/25" />
            <h2 className="font-display text-white/90 text-lg drop-shadow">{group.title}</h2>
            <div className="flex-1 h-px bg-white/25" />
          </div>
          {[...group.chapters].reverse().map((chapter) => {
            const unlocked = isChapterUnlocked(chapter);
            const stories = STORIES.filter(s => s.chapterId === chapter.id);
            const { total, done } = getChapterProgress(chapter);
            const isExpanded = expandedChapter === chapter.id;
            const progress = total > 0 ? done / total : 0;

            return (
              <div key={chapter.id}>
                {/* Chapter Header */}
                <button
                  onClick={() => {
                    if (unlocked) setExpandedChapter(isExpanded ? null : chapter.id);
                  }}
                  className="w-full"
                >
                  <div
                    className={`rounded-3xl p-4 border-4 transition-all ${
                      unlocked
                        ? 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                        : 'opacity-60 cursor-not-allowed'
                    }`}
                    style={{
                      background: unlocked
                        ? `linear-gradient(135deg, ${chapter.color}DD, ${chapter.color}99)`
                        : 'rgba(0,0,0,0.4)',
                      borderColor: unlocked ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-md"
                        style={{
                          background: unlocked ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)',
                        }}
                      >
                        {unlocked ? chapter.emoji : '🔒'}
                      </div>
                      <div className="flex-1 text-left">
                        <h2 className="font-display text-lg text-white leading-tight">{chapter.name}</h2>
                        {unlocked ? (
                          <div className="mt-1">
                            <div className="flex justify-between mb-1">
                              <span className="font-body text-white/70 text-xs">{done}/{total} histórias</span>
                              {done === total && total > 0 && <span className="text-xs">🏆</span>}
                            </div>
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${progress * 100}%`,
                                  background: 'rgba(255,255,255,0.8)',
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <p className="font-body text-white/60 text-xs mt-0.5">
                            Desbloqueie com {chapter.unlockXP} XP
                          </p>
                        )}
                      </div>
                      {unlocked && (
                        <div className="text-white/70 text-xl transition-transform duration-300"
                          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          ▾
                        </div>
                      )}
                    </div>
                  </div>
                </button>

                {/* Stories inside chapter */}
                <AnimatePresence>
                  {isExpanded && unlocked && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 pl-4 space-y-3 relative">
                        {/* Vertical path line */}
                        <div
                          className="absolute left-[1.6rem] top-3 bottom-3 w-1 rounded-full"
                          style={{ background: `${chapter.color}55`, zIndex: 0 }}
                        />

                        {stories.map((story, si) => {
                          const storyUnlocked = isStoryUnlocked(story, totalXP);
                          const completed = gameState?.completedStories?.includes(story.id);
                          const isNext = !completed && storyUnlocked &&
                            stories.slice(0, si).every(s =>
                              !isStoryUnlocked(s, totalXP) || gameState?.completedStories?.includes(s.id)
                            );

                          return (
                            <div key={story.id} className="flex items-center gap-3 relative z-10">
                              {/* Node on the path */}
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 border-3 shadow-md transition-all ${
                                  completed
                                    ? 'scale-110'
                                    : isNext
                                      ? 'animate-pulse'
                                      : ''
                                }`}
                                style={{
                                  borderWidth: '3px',
                                  background: completed
                                    ? '#4CAF50'
                                    : storyUnlocked
                                      ? chapter.color
                                      : 'rgba(0,0,0,0.4)',
                                  borderColor: completed
                                    ? '#FFD54F'
                                    : storyUnlocked
                                      ? 'rgba(255,255,255,0.5)'
                                      : 'rgba(255,255,255,0.15)',
                                }}
                              >
                                {completed ? '✓' : storyUnlocked ? story.emoji : '🔒'}
                              </div>

                              {/* Story card */}
                              <button
                                onClick={() => handleStoryPress(story)}
                                disabled={!storyUnlocked}
                                className={`flex-1 rounded-2xl p-3 border-2 text-left transition-all ${
                                  storyUnlocked
                                    ? 'hover:scale-[1.02] active:scale-[0.97]'
                                    : 'opacity-50 cursor-not-allowed'
                                }`}
                                style={{
                                  background: completed
                                    ? 'rgba(76,175,80,0.3)'
                                    : storyUnlocked
                                      ? 'rgba(255,255,255,0.15)'
                                      : 'rgba(0,0,0,0.25)',
                                  backdropFilter: 'blur(6px)',
                                  borderColor: completed
                                    ? '#FFD54F55'
                                    : isNext
                                      ? 'rgba(255,255,255,0.5)'
                                      : 'rgba(255,255,255,0.1)',
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-display text-sm text-white leading-tight">{story.title}</span>
                                  {completed && <span className="text-yellow-300 text-sm ml-2">⭐</span>}
                                  {isNext && !completed && (
                                    <span className="text-xs bg-yellow-400 text-gray-800 px-2 py-0.5 rounded-full font-body ml-2 flex-shrink-0">
                                      NOVO!
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="font-body text-white/60 text-xs">+{story.xpReward} XP</span>
                                  <span className="font-body text-white/60 text-xs">·</span>
                                  <span className="font-body text-white/60 text-xs">🪙 {story.dracmasReward}</span>
                                  {!storyUnlocked && (
                                    <span className="font-body text-white/40 text-xs ml-auto">🔒 {story.unlockXP} XP</span>
                                  )}
                                </div>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          </div>
          ))}
        </div>

        {/* Bottom encouragement */}
        <div className="mt-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <p className="font-display text-white/80 text-sm">
              {totalXP < 200
                ? '🌟 Complete histórias para desbloquear novos capítulos!'
                : totalXP < 500
                  ? '🔥 Você está indo muito bem! Continue!'
                  : totalXP < 900
                    ? '⚡ Quase lá! O Reino de Israel te aguarda!'
                    : totalXP < 1100
                      ? '👑 Uau! Você chegou ao nível dos Reis!'
                      : totalXP < 2300
                        ? '✝️ Bem-vindo ao Novo Testamento! Conheça Jesus!'
                        : '🌅 Incrível! Você chegou à Páscoa e à Igreja!'}
            </p>
          </div>
        </div>
      </div>

      {/* Story Modal */}
      <AnimatePresence>
        {selectedStory && (
          <StoryModal
            story={selectedStory}
            completed={gameState?.completedStories?.includes(selectedStory.id)}
            onClose={() => setSelectedStory(null)}
            onStart={() => {
              setSelectedStory(null);
              onStartStory(selectedStory);
            }}
          />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}