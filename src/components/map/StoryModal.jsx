import { motion } from 'framer-motion';

export default function StoryModal({ story, completed, onClose, onStart }) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-8"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div
          className="rounded-3xl overflow-hidden border-4 border-white/30 shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${story.color}EE, ${story.color}99)`,
            backdropFilter: 'blur(12px)',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Top decorative band */}
          <div className="h-2" style={{ background: story.color }} />

          <div className="p-5">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 shadow-md"
                style={{ background: 'rgba(255,255,255,0.25)' }}
              >
                {story.emoji}
              </div>
              <div className="flex-1">
                <h2 className="font-display text-xl text-white leading-tight">{story.title}</h2>
                {completed && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-300 text-sm">⭐</span>
                    <span className="font-body text-white/80 text-xs">Já completada!</span>
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white/70 hover:bg-white/30 transition-colors flex-shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Description */}
            <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
              {story.description}
            </p>

            {/* Bible verse */}
            <div className="bg-white/15 rounded-2xl p-3 mb-4 border border-white/20">
              <p className="font-body text-white/80 text-xs italic leading-relaxed">
                📖 "{story.verse}"
              </p>
            </div>

            {/* Rewards */}
            <div className="flex gap-2 mb-5">
              <div className="flex-1 bg-white/15 rounded-xl p-2.5 text-center border border-white/20">
                <p className="font-display text-lg text-white">+{story.xpReward}</p>
                <p className="font-body text-white/60 text-xs">XP</p>
              </div>
              <div className="flex-1 bg-white/15 rounded-xl p-2.5 text-center border border-white/20">
                <p className="font-display text-lg text-white">+{story.dracmasReward}</p>
                <p className="font-body text-white/60 text-xs">🪙 Dracmas</p>
              </div>
              <div className="flex-1 bg-white/15 rounded-xl p-2.5 text-center border border-white/20">
                <p className="font-display text-lg text-white">{story.slides?.length ?? 4}</p>
                <p className="font-body text-white/60 text-xs">slides</p>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={onStart}
              className="w-full py-4 rounded-2xl font-display text-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              style={{
                background: 'rgba(255,255,255,0.9)',
                color: story.color,
              }}
            >
              {completed ? '🔁 Ler novamente' : '▶️ Começar história!'}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}