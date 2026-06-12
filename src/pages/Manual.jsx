const SECTIONS = [
  {
    emoji: '🚀', title: '1. Primeiros Passos',
    items: [
      'Ao abrir o app pela primeira vez, toque em "Começar Aventura!".',
      'Digite o nome da criança e escolha um avatar divertido.',
      'Se quiser música de fundo, toque em "Ligar música" na tela inicial.',
      'Tudo fica salvo no próprio aparelho — funciona até sem internet!',
    ],
  },
  {
    emoji: '🗺️', title: '2. Mapa de Aventuras',
    items: [
      'O mapa mostra o Velho Testamento em cima e o Novo Testamento embaixo.',
      'Toque em um capítulo para abrir as histórias dele.',
      'Cada história completada dá XP (estrelas) e Dracmas (moedas).',
      'Novos capítulos são desbloqueados conforme você junta XP.',
      'Durante a história, toque no botão 🔊 para ouvir a narração em voz alta.',
      'No final de cada história tem um quiz para testar o que aprendeu!',
    ],
  },
  {
    emoji: '🎮', title: '3. Minijogos',
    items: [
      'Na aba "Jogos" há 10 minijogos: Memória, Quebra-Cabeça, Arca de Noé, Corrida, Caça-Palavras, Travessia do Mar, Davi contra Golias, Jornada no Deserto, Batalha da Fé e Construtor do Templo.',
      'Cada jogo vencido dá XP e Dracmas.',
      'Os jogos vencidos ficam marcados com uma estrela ⭐.',
    ],
  },
  {
    emoji: '📖', title: '4. Plano de Estudos',
    items: [
      'Na aba "Estudos", escolha qualquer um dos 66 livros da Bíblia.',
      'O app cria um plano de estudo de 5 a 7 dias (precisa de internet na primeira vez).',
      'Depois de criado, o plano fica salvo no aparelho para estudar offline.',
    ],
  },
  {
    emoji: '👤', title: '5. Perfil, Medalhas e Loja',
    items: [
      'Na aba "Perfil" você vê o nível, o XP e as estatísticas da criança.',
      'Há 27 medalhas para conquistar — elas aparecem automaticamente!',
      'Na Loja, use as Dracmas ganhas para comprar avatares e molduras.',
    ],
  },
  {
    emoji: '👨‍👩‍👧', title: '6. Painel dos Pais',
    items: [
      'No Perfil, toque em "Painel dos Pais".',
      'Resolva a continha de multiplicação para entrar (só adultos!).',
      'Veja os livros estudados, as medalhas conquistadas, as histórias completas e o tempo gasto nos jogos.',
    ],
  },
  {
    emoji: '📱', title: '7. Instalar no Celular',
    items: [
      'Abra o app no navegador do celular.',
      'No Android: toque no menu ⋮ e escolha "Adicionar à tela inicial".',
      'No iPhone: toque em Compartilhar e depois "Adicionar à Tela de Início".',
      'O Múndi Bíblico vira um aplicativo com ícone próprio e tela cheia!',
    ],
  },
];

export default function Manual() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Botão imprimir — escondido na impressão */}
      <div className="print:hidden sticky top-0 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <a href="/" className="text-sm text-blue-600 underline">← Voltar ao app</a>
        <button onClick={() => window.print()}
          className="bg-blue-600 text-white text-sm px-5 py-2 rounded-lg font-semibold">
          🖨️ Imprimir
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-8">
        {/* Capa */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-2">🌍</div>
          <h1 className="text-3xl font-bold text-blue-900">Múndi Bíblico</h1>
          <p className="text-gray-500 mt-1">Manual de Uso — Aventuras da Bíblia para crianças de 4 a 12 anos</p>
        </div>

        {SECTIONS.map(sec => (
          <div key={sec.title} className="mb-7" style={{ breakInside: 'avoid' }}>
            <h2 className="text-xl font-bold text-blue-800 border-b-2 border-blue-200 pb-1 mb-3">
              {sec.emoji} {sec.title}
            </h2>
            <ul className="space-y-1.5">
              {sec.items.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed">
                  <span className="text-blue-500">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="mt-10 border-t border-gray-200 pt-4 text-center text-xs text-gray-400">
          Múndi Bíblico — Explore, jogue e aprenda sobre a Bíblia! ⭐
        </div>
      </div>
    </div>
  );
}