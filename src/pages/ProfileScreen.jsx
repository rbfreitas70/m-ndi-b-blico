import { useState } from 'react';
import { motion } from 'framer-motion';
import { SFX } from '@/lib/audioEngine';
import { getXPProgress, getXPForNextLevel, getTitle } from '@/lib/gameState';
import { MEDALS, CAT_LABELS } from '@/lib/achievements';

const SHOP_ITEMS = [
  { id: 'av_boy', type: 'avatar', name: 'Menino Davi', emoji: '👦', color: '#4FC3F7', price: 0 },
  { id: 'av_girl', type: 'avatar', name: 'Menina Sara', emoji: '👧', color: '#F48FB1', price: 0 },
  { id: 'av_angel', type: 'avatar', name: 'Anjinho', emoji: '👼', color: '#FFD54F', price: 50 },
  { id: 'av_hero', type: 'avatar', name: 'Herói da Fé', emoji: '🦸', color: '#FF8A65', price: 80 },
  { id: 'av_king', type: 'avatar', name: 'Rei Davi', emoji: '🤴', color: '#9C27B0', price: 100 },
  { id: 'av_prophet', type: 'avatar', name: 'Profeta', emoji: '🧙', color: '#607D8B', price: 120 },
  { id: 'fr_gold', type: 'frame', name: 'Moldura Ouro', emoji: '✨', color: '#FFD54F', price: 60 },
  { id: 'fr_royal', type: 'frame', name: 'Moldura Real', emoji: '👑', color: '#9C27B0', price: 90 },
  { id: 'fr_heaven', type: 'frame', name: 'Moldura Celeste', emoji: '☁️', color: '#4FC3F7', price: 75 },
];

export default function ProfileScreen({ gameState, onUpdateState }) {
  const [tab, setTab] = useState('medals');

  const progress = getXPProgress(gameState.totalXP);
  const xpNext = getXPForNextLevel(gameState.totalXP);
  const title = getTitle(gameState.level);

  const currentAvatar = SHOP_ITEMS.find(i => i.id === gameState.avatarId) || SHOP_ITEMS[0];
  const currentFrame = SHOP_ITEMS.find(i => i.id === gameState.frameId);

  const handleBuy = (item) => {
    if (gameState.dracmas < item.price) return;
    SFX.coin();
    onUpdateState({
      dracmas: gameState.dracmas - item.price,
      ownedItems: [...(gameState.ownedItems || []), item.id],
    });
  };

  const handleEquip = (item) => {
    SFX.click();
    if (item.type === 'avatar') onUpdateState({ avatarId: item.id });
    else if (item.type === 'frame') onUpdateState({ frameId: gameState.frameId === item.id ? null : item.id });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #4a148c 0%, #1a237e 50%, #0d47a1 100%)' }}>

      {/* Profile header */}
      <div className="px-4 pt-10 pb-5">
        <div className="flex items-center gap-4">
          {/* Avatar circle */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-xl"
              style={{
                background: currentAvatar.color || '#4FC3F7',
                border: currentFrame ? `4px solid ${currentFrame.color}` : '4px solid rgba(255,255,255,0.5)',
                boxShadow: currentFrame ? `0 0 16px ${currentFrame.color}88` : '0 6px 20px rgba(0,0,0,0.3)',
              }}>
              {currentAvatar.emoji}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-gray-800 text-xs font-display px-2 py-0.5 rounded-full border-2 border-white">
              Lv.{gameState.level}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="font-display text-xl text-white">{gameState.name || 'Aventureiro'}</h2>
            <p className="font-body text-white/60 text-xs mb-2">{title}</p>
            {/* XP bar */}
            <div className="h-3 bg-white/15 rounded-full overflow-hidden border border-white/20">
              <motion.div className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.8 }}
                style={{ background: 'linear-gradient(90deg, #FFD54F, #FF8A65)' }}
              />
            </div>
            <p className="font-body text-white/50 text-xs mt-0.5">{gameState.totalXP}/{xpNext} XP</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { label: 'Histórias', val: gameState.completedStories?.length || 0, icon: '📖' },
            { label: 'Medalhas', val: gameState.unlockedMedals?.length || 0, icon: '🏅' },
            { label: 'Dracmas', val: gameState.dracmas || 0, icon: '🪙' },
          ].map(s => (
            <div key={s.label} className="bg-white/10 rounded-2xl py-3 text-center border border-white/15">
              <p className="text-lg">{s.icon}</p>
              <p className="font-display text-white text-lg leading-none">{s.val}</p>
              <p className="font-body text-white/50 text-[10px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/15 bg-white/5 px-2">
        {[
          { id: 'medals', label: '🏅 Medalhas' },
          { id: 'shop', label: '🛒 Loja' },
        ].map(t => (
          <button key={t.id} onClick={() => { SFX.click(); setTab(t.id); }}
            className={`flex-1 py-3 font-display text-sm transition-all ${tab === t.id ? 'text-yellow-300 border-b-2 border-yellow-300' : 'text-white/50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {tab === 'medals' && (
          <div className="space-y-5">
            {Object.entries(CAT_LABELS).map(([cat, label]) => {
              const catMedals = MEDALS.filter(m => m.cat === cat);
              const earnedCount = catMedals.filter(m => gameState.unlockedMedals?.includes(m.id)).length;
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display text-white/70 text-xs uppercase tracking-widest">{label}</h3>
                    <span className="font-body text-white/40 text-[10px]">{earnedCount}/{catMedals.length}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {catMedals.map(medal => {
                      const earned = gameState.unlockedMedals?.includes(medal.id);
                      return (
                        <motion.div key={medal.id}
                          initial={false}
                          animate={earned ? { scale: [1, 1.08, 1] } : {}}
                          title={medal.desc}
                          className={`rounded-2xl p-2.5 text-center border-2 transition-all ${earned ? 'border-yellow-400/50 bg-yellow-400/15 shadow-[0_0_12px_rgba(255,213,79,0.25)]' : 'border-white/10 bg-white/5 opacity-40'}`}>
                          <div className="text-2xl mb-0.5">{earned ? medal.emoji : '🔒'}</div>
                          <p className="font-body text-[9px] text-white/70 leading-tight">{medal.name}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'shop' && (
          <div className="space-y-5">
            <div className="bg-yellow-400/15 border border-yellow-400/30 rounded-2xl p-3 flex items-center gap-2">
              <span className="text-xl">🪙</span>
              <p className="font-body text-yellow-200 text-sm">
                Você tem <strong>{gameState.dracmas}</strong> Dracmas disponíveis!
              </p>
            </div>

            {['avatar', 'frame'].map(type => (
              <div key={type}>
                <h3 className="font-display text-white/70 text-xs uppercase tracking-widest mb-2">
                  {type === 'avatar' ? '👤 Avatares' : '🖼️ Molduras'}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {SHOP_ITEMS.filter(i => i.type === type).map(item => {
                    const owned = gameState.ownedItems?.includes(item.id) || item.price === 0;
                    const equipped = gameState.avatarId === item.id || gameState.frameId === item.id;
                    return (
                      <div key={item.id}
                        className={`rounded-2xl p-3 text-center border-2 transition-all ${equipped ? 'border-yellow-400 bg-yellow-400/20' : owned ? 'border-green-400/40 bg-green-400/10' : 'border-white/10 bg-white/5'}`}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mx-auto mb-1"
                          style={{ background: item.color + '55' }}>
                          {item.emoji}
                        </div>
                        <p className="font-body text-white text-[10px] leading-tight mb-1.5">{item.name}</p>
                        {equipped ? (
                          <span className="text-yellow-400 text-[10px] font-display">✓ Equipado</span>
                        ) : owned ? (
                          <button onClick={() => handleEquip(item)}
                            className="text-[10px] py-1 px-2 rounded-lg bg-green-500/30 text-green-300 font-body border border-green-500/30">
                            Usar
                          </button>
                        ) : (
                          <button onClick={() => handleBuy(item)}
                            disabled={gameState.dracmas < item.price}
                            className="text-[10px] py-1 px-2 rounded-lg font-body border transition-all"
                            style={{
                              background: gameState.dracmas >= item.price ? '#FFD54F33' : 'rgba(255,255,255,0.05)',
                              borderColor: gameState.dracmas >= item.price ? '#FFD54F55' : 'rgba(255,255,255,0.1)',
                              color: gameState.dracmas >= item.price ? '#FFD54F' : 'rgba(255,255,255,0.3)',
                            }}>
                            🪙{item.price}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}