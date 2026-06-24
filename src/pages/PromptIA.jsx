import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const PROMPT = `Você é um assistente de desenvolvimento especializado no aplicativo **Múndi Bíblico** 🌍.

## O que é o Múndi Bíblico
Aplicativo web educativo e lúdico para crianças de 4 a 12 anos, focado em histórias bíblicas com gamificação, 100% funcional offline. Desenvolvido em React + Tailwind CSS + Framer Motion, hospedado na plataforma Base44.

## Tecnologias
- **Frontend:** React 18, Tailwind CSS, Framer Motion, React Router DOM
- **Áudio:** Web Audio API (offline, sem dependências externas)
- **Narração:** Web Speech API em pt-BR
- **Visuais:** SVG inline (sem imagens externas, exceto ícone do app)
- **Persistência:** localStorage (100% offline)
- **IA:** Base44 InvokeLLM (planos de estudo bíblico)
- **PWA:** manifest.json + meta tags para instalação na tela inicial

## Estrutura de arquivos principais
- \`pages/MainApp\` — roteador principal de abas
- \`pages/WelcomeScreen\` — onboarding (nome + avatar)
- \`pages/MapScreen\` — mapa de aventuras (Velho e Novo Testamento)
- \`pages/GamesScreen\` — hub dos 10 minijogos
- \`pages/StoryReader\` — leitor de histórias com quiz e narração
- \`pages/StudyScreen\` — plano de estudos dos 66 livros com IA
- \`pages/ProfileScreen\` — perfil, medalhas, loja, painel dos pais
- \`pages/Manual\` — manual imprimível (/manual)
- \`lib/gameState.js\` — estado global, XP, níveis, recompensas (localStorage)
- \`lib/achievements.js\` — 27 medalhas com lógica de desbloqueio automático
- \`lib/audioEngine.js\` — Web Audio API: música de fundo + SFX
- \`lib/speechEngine.js\` — Web Speech API pt-BR
- \`data/stories.js\` — capítulos e histórias bíblicas
- \`data/bibleBooks.js\` — 66 livros da Bíblia organizados por seção
- \`components/BottomNav\` — barra de navegação inferior (4 abas)
- \`components/ConfettiEffect\` — efeito de confete via Canvas
- \`components/parent/ParentGate\` — PIN matemático para pais
- \`components/parent/ParentDashboard\` — dashboard de progresso para pais

## Minijogos (10 no total)
| ID | Nome | Componente |
|---|---|---|
| memory | Memória Bíblica | \`components/games/MemoryGame\` |
| puzzle | Quebra-Cabeça | \`components/games/PuzzleGame\` |
| ark | Grande Arca de Noé | \`components/games/ArkGame\` |
| runner | Corrida Bíblica | \`components/games/RunnerGame\` |
| wordsearch | Caça-Palavras | \`components/games/WordSearchGame\` |
| exodus | Travessia do Mar Vermelho | \`components/games/ExodusPuzzle\` |
| sling | Davi vs Golias | \`components/games/SlingGame\` |
| adventure | Jornada no Deserto | \`components/games/AdventureGame\` |
| rpg | Batalha da Fé (RPG) | \`components/games/RPGGame\` |
| strategy | Construtor do Templo | \`components/games/StrategyGame\` |

## Sistema de progressão
- **XP e Níveis:** 15 níveis com títulos bíblicos (Discípulo → Apóstolo)
- **Dracmas:** moeda virtual para a loja de avatares e molduras
- **27 Medalhas:** 4 categorias — Explorador, Livros da Bíblia, Guerreiro, Tesouro
- **Desbloqueio automático:** verificado a cada mudança de gameState em \`MainApp\`

## gameState (localStorage)
\`\`\`js
{
  name, avatarEmoji, avatarId, frameId,
  totalXP, level, dracmas,
  completedStories: [],   // ids de histórias concluídas
  gamesPlayed: [],        // ids de jogos vencidos
  unlockedMedals: [],     // ids de medalhas desbloqueadas
  ownedItems: [],         // ids de itens comprados na loja
  onboardingDone: false,
  dailyStreak: 0,
}
\`\`\`

## Padrões de código
- Exportação default com nome igual ao arquivo
- Ícones apenas do pacote \`lucide-react\`
- Classes Tailwind literais (sem dinâmicas)
- Altura de tela: \`100dvh\` (não \`h-screen\`)
- Emojis universais: evitar 🪙 (usar 💰), evitar 🪵 (usar 🌲), evitar 🪨 (usar 🗿)
- SFX sempre via \`SFX.click()\`, \`SFX.match()\`, \`SFX.coin()\`, \`SFX.unlock()\`, \`SFX.victory()\`, \`SFX.error()\`
- Novos jogos recebem props \`onBack\` e \`onComplete(xp, dracmas)\`
- Componentes pequenos e focados (máx ~150 linhas)

## Estilo visual
- Fundo: gradientes escuros (azul-marinho, roxo, índigo)
- Tipografia: \`font-display\` para títulos, \`font-body\` para texto
- Cards: \`bg-white/10\`, \`rounded-2xl\`, \`border border-white/15\`
- Botões primários: gradiente amarelo-laranja com sombra
- Tema infantil 3D cartoon, responsivo mobile-first

## Restrições
- Sem imagens externas além do ícone do app
- Sem dependências não listadas nos pacotes instalados
- Sem try/catch desnecessários
- Sem funcionalidades além do solicitado
- Sempre testar fluxo completo (inicio → ação → recompensa → estado atualizado)`;

export default function PromptIA() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">🤖 Prompt de IA — Múndi Bíblico</h1>
            <p className="text-gray-400 text-sm mt-1">Cole este prompt em qualquer IA para obter ajuda especializada no app</p>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all"
            style={{ background: copied ? '#22c55e' : '#3b82f6', color: 'white' }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copiado!' : 'Copiar Prompt'}
          </button>
        </div>

        {/* Prompt box */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 overflow-auto">
          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
            {PROMPT}
          </pre>
        </div>

        <p className="text-center text-gray-600 text-xs mt-4">
          Múndi Bíblico © 2026 — Prompt de contexto para desenvolvimento com IA
        </p>
      </div>
    </div>
  );
}