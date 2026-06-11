import { useState } from 'react';
import { motion } from 'framer-motion';
import { SFX } from '@/lib/audioEngine';

export default function StudyPlanView({ book, plan, loading, error, onRetry, onBack }) {
  const [openDay, setOpenDay] = useState(0);

  return (
    <div className="h-full overflow-y-auto"
      style={{ background: 'linear-gradient(180deg, #1A237E 0%, #283593 50%, #4527A0 100%)' }}>
      {/* Header */}
      <div className="px-4 pt-10 pb-4 flex items-center gap-3 sticky top-0 z-10"
        style={{ background: 'rgba(26,35,126,0.95)', backdropFilter: 'blur(10px)' }}>
        <button onClick={onBack}
          className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white text-lg flex-shrink-0">←</button>
        <div>
          <h2 className="font-display text-2xl text-white">📖 {book.name}</h2>
          <p className="font-body text-white/60 text-xs">Plano de estudos juvenil</p>
        </div>
      </div>

      <div className="px-4 pb-32 pt-2">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="text-5xl animate-bounce">📖</div>
            <div className="w-10 h-10 border-4 border-white/20 border-t-yellow-300 rounded-full animate-spin" />
            <p className="font-body text-white/70 text-sm text-center">Preparando seu plano de estudos...<br/>Isso leva alguns segundos!</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="text-5xl">😕</div>
            <p className="font-body text-white/70 text-sm px-6">{error}</p>
            <button onClick={onRetry}
              className="px-6 py-3 rounded-2xl font-display text-white"
              style={{ background: book.color, boxShadow: '0 4px 0 rgba(0,0,0,0.25)' }}>
              🔄 Tentar de novo
            </button>
          </div>
        )}

        {/* Plan */}
        {plan && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {/* Intro */}
            <div className="rounded-3xl p-4"
              style={{ background: `linear-gradient(135deg, ${book.color}40, ${book.color}20)`, border: `3px solid ${book.color}66` }}>
              <h3 className="font-display text-white text-lg mb-2">✨ Por que esse livro é incrível</h3>
              <p className="font-body text-white/85 text-sm leading-relaxed">{plan.intro}</p>
              {plan.author_context && (
                <p className="font-body text-white/60 text-xs mt-2 leading-relaxed">✍️ {plan.author_context}</p>
              )}
            </div>

            {/* Key verse */}
            {plan.key_verse && (
              <div className="bg-white/10 rounded-2xl p-4 border border-yellow-300/40">
                <p className="font-body text-yellow-200 text-sm italic text-center">📖 {plan.key_verse}</p>
              </div>
            )}

            {/* Days */}
            <h3 className="font-display text-white text-lg pt-2">🗓️ Seu plano dia a dia</h3>
            {(plan.days || []).map((day, i) => {
              const open = openDay === i;
              return (
                <div key={i} className="rounded-2xl overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.1)', border: open ? `2px solid ${book.color}` : '2px solid rgba(255,255,255,0.15)' }}>
                  <button onClick={() => { SFX.click(); setOpenDay(open ? null : i); }}
                    className="w-full flex items-center gap-3 p-3 text-left">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display text-white flex-shrink-0"
                      style={{ background: book.color }}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-display text-white text-sm">{day.title}</p>
                      <p className="font-body text-white/50 text-xs">📜 {day.reading}</p>
                    </div>
                    <span className="text-white/50 text-sm transition-transform"
                      style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                  </button>
                  {open && (
                    <div className="px-4 pb-4 space-y-3">
                      <p className="font-body text-white/85 text-sm leading-relaxed">{day.summary}</p>
                      <div className="bg-green-400/15 rounded-xl p-3 border border-green-300/30">
                        <p className="font-body text-green-200 text-xs"><strong>💪 Lição pra vida:</strong> {day.life_lesson}</p>
                      </div>
                      <div className="bg-purple-400/15 rounded-xl p-3 border border-purple-300/30">
                        <p className="font-body text-purple-200 text-xs"><strong>🤔 Pra refletir:</strong> {day.reflection_question}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}