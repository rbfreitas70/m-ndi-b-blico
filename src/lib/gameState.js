// Game state management — localStorage persistence

const KEY = 'mundi_gamestate_v2';
const XP_PER_LEVEL = 300;

const TITLES = [
  'Aprendiz Bíblico', 'Discípulo Curioso', 'Guardião das Escrituras',
  'Explorador do Éden', 'Herói do Deserto', 'Cavaleiro da Fé',
  'Profeta Mirim', 'Sábio de Sião', 'Campeão do Senhor',
];

export const DEFAULT_STATE = {
  name: '',
  avatarEmoji: '👦',
  level: 1,
  totalXP: 0,
  dracmas: 50,
  completedStories: [],
  unlockedMedals: [],
  dailyStreak: 1,
  lastPlayDate: null,
  gamesPlayed: [],
  ownedItems: ['avatar_default'],
  avatarId: 'avatar_default',
  frameId: null,
  runnerHighScore: 0,
  parentPin: null,
  soundEnabled: true,
  narrationEnabled: true,
  masterVolume: 0.55,
  onboardingDone: false,
};

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_STATE };
}

export function saveState(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

export function getLevel(totalXP) {
  return Math.floor(totalXP / XP_PER_LEVEL) + 1;
}

export function getTitle(level) {
  return TITLES[Math.min(level - 1, TITLES.length - 1)];
}

export function getXPForNextLevel(totalXP) {
  const level = getLevel(totalXP);
  return level * XP_PER_LEVEL;
}

export function getXPProgress(totalXP) {
  const level = getLevel(totalXP);
  const levelStart = (level - 1) * XP_PER_LEVEL;
  const levelEnd = level * XP_PER_LEVEL;
  return (totalXP - levelStart) / (levelEnd - levelStart);
}

export function applyReward(state, xp, dracmas = 0, storyId = null, medalIds = []) {
  const newTotal = state.totalXP + xp;
  const newLevel = getLevel(newTotal);
  const leveledUp = newLevel > state.level;

  const completedStories = storyId && !state.completedStories.includes(storyId)
    ? [...state.completedStories, storyId]
    : state.completedStories;

  const unlockedMedals = [
    ...state.unlockedMedals,
    ...medalIds.filter(m => !state.unlockedMedals.includes(m)),
  ];

  return {
    ...state,
    totalXP: newTotal,
    dracmas: state.dracmas + dracmas,
    level: newLevel,
    completedStories,
    unlockedMedals,
    leveledUp,
  };
}

export function resetProgress(state) {
  return {
    ...DEFAULT_STATE,
    name: state.name,
    avatarEmoji: state.avatarEmoji,
    parentPin: state.parentPin,
    soundEnabled: state.soundEnabled,
    narrationEnabled: state.narrationEnabled,
    onboardingDone: true,
  };
}