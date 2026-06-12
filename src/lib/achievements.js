// Sistema de medalhas e conquistas — avaliação automática a partir do gameState
import { CHAPTERS, STORIES } from '@/data/stories';

const chapterDone = (state, chapterId) => {
  const ids = STORIES.filter(s => s.chapterId === chapterId).map(s => s.id);
  return ids.length > 0 && ids.every(id => state.completedStories?.includes(id));
};

export const CAT_LABELS = {
  explorer: '🗺️ Explorador',
  books: '📖 Livros da Bíblia',
  warrior: '⚔️ Guerreiro',
  treasure: '💰 Tesouro',
};

export const MEDALS = [
  // Explorador
  { id: 'first_story', cat: 'explorer', name: 'Primeiro Passo', emoji: '👣', desc: 'Complete sua 1ª história',
    check: s => (s.completedStories?.length || 0) >= 1 },
  { id: 'story_5', cat: 'explorer', name: 'Leitor Júnior', emoji: '📚', desc: '5 histórias completas',
    check: s => (s.completedStories?.length || 0) >= 5 },
  { id: 'story_10', cat: 'explorer', name: 'Biblista', emoji: '🏛️', desc: '10 histórias completas',
    check: s => (s.completedStories?.length || 0) >= 10 },
  { id: 'story_all', cat: 'explorer', name: 'Lenda Bíblica', emoji: '🌟', desc: 'Complete todas as histórias',
    check: s => (s.completedStories?.length || 0) >= STORIES.length },

  // Livros — uma medalha por capítulo/livro concluído
  ...CHAPTERS.map(ch => ({
    id: `book_${ch.id}`, cat: 'books', name: ch.name, emoji: ch.emoji,
    desc: `Conclua todos os desafios de ${ch.name}`,
    check: s => chapterDone(s, ch.id),
  })),

  // Guerreiro — jogos
  { id: 'game_memory', cat: 'warrior', name: 'Mestre Memória', emoji: '🃏', desc: 'Vença a Memória Bíblica',
    check: s => s.gamesPlayed?.includes('memory') },
  { id: 'game_puzzle', cat: 'warrior', name: 'Montador', emoji: '🧩', desc: 'Complete um quebra-cabeça',
    check: s => s.gamesPlayed?.includes('puzzle') },
  { id: 'game_ark', cat: 'warrior', name: 'Ajudante de Noé', emoji: '⛵', desc: 'Encha a Grande Arca',
    check: s => s.gamesPlayed?.includes('ark') },
  { id: 'game_runner', cat: 'warrior', name: 'Corredor da Fé', emoji: '🏃', desc: 'Complete a Corrida Bíblica',
    check: s => s.gamesPlayed?.includes('runner') },
  { id: 'game_wordsearch', cat: 'warrior', name: 'Caçador de Palavras', emoji: '🔍', desc: 'Vença o Caça-Palavras',
    check: s => s.gamesPlayed?.includes('wordsearch') },
  { id: 'game_exodus', cat: 'warrior', name: 'Travessia Completa', emoji: '🌊', desc: 'Monte o Mar Vermelho',
    check: s => s.gamesPlayed?.includes('exodus') },
  { id: 'game_sling', cat: 'warrior', name: 'Atirador de Funda', emoji: '🎯', desc: 'Vença Davi contra Golias',
    check: s => s.gamesPlayed?.includes('sling') },
  { id: 'game_adventure', cat: 'warrior', name: 'Aventureiro', emoji: '🏜️', desc: 'Complete a Jornada no Deserto',
    check: s => s.gamesPlayed?.includes('adventure') },
  { id: 'game_rpg', cat: 'warrior', name: 'Herói da Fé', emoji: '🛡️', desc: 'Vença a Batalha da Fé',
    check: s => s.gamesPlayed?.includes('rpg') },
  { id: 'game_strategy', cat: 'warrior', name: 'Grande Construtor', emoji: '🏛️', desc: 'Construa o Templo',
    check: s => s.gamesPlayed?.includes('strategy') },
  { id: 'game_all', cat: 'warrior', name: 'Campeão dos Jogos', emoji: '🏆', desc: 'Vença todos os 10 jogos',
    check: s => (s.gamesPlayed?.length || 0) >= 10 },

  // Tesouro
  { id: 'dracmas_100', cat: 'treasure', name: 'Poupador', emoji: '💵', desc: 'Junte 100 Dracmas',
    check: s => (s.dracmas || 0) >= 100 },
  { id: 'dracmas_500', cat: 'treasure', name: 'Tesouro de Sião', emoji: '💰', desc: 'Junte 500 Dracmas',
    check: s => (s.dracmas || 0) >= 500 },
  { id: 'level_5', cat: 'treasure', name: 'Nível 5', emoji: '🏅', desc: 'Alcance o nível 5',
    check: s => (s.level || 1) >= 5 },
  { id: 'level_10', cat: 'treasure', name: 'Campeão', emoji: '👑', desc: 'Alcance o nível 10',
    check: s => (s.level || 1) >= 10 },
  { id: 'streak_3', cat: 'treasure', name: 'Constante', emoji: '🔥', desc: '3 dias seguidos jogando',
    check: s => (s.dailyStreak || 0) >= 3 },
  { id: 'streak_7', cat: 'treasure', name: 'Devoto', emoji: '⭐', desc: '7 dias seguidos jogando',
    check: s => (s.dailyStreak || 0) >= 7 },
];

// Retorna ids de medalhas recém-conquistadas (ainda não no unlockedMedals)
export function getNewMedals(state) {
  return MEDALS
    .filter(m => !state.unlockedMedals?.includes(m.id) && m.check(state))
    .map(m => m.id);
}

export function getMedalById(id) {
  return MEDALS.find(m => m.id === id);
}