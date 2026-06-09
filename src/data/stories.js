// Todas as histórias do Mapa de Aventuras
// Organizadas em capítulos/regiões, cada uma com requisitos de desbloqueio

export const CHAPTERS = [
  {
    id: 'genesis',
    name: 'O Jardim do Éden',
    emoji: '🌿',
    color: '#4CAF50',
    bgColor: '#E8F5E9',
    pathColor: '#A5D6A7',
    unlockXP: 0,
    position: { x: 10, y: 78 }, // percentual da tela
  },
  {
    id: 'patriarchs',
    name: 'Os Patriarcas',
    emoji: '⛺',
    color: '#FF9800',
    bgColor: '#FFF3E0',
    pathColor: '#FFCC80',
    unlockXP: 200,
    position: { x: 10, y: 55 },
  },
  {
    id: 'exodus',
    name: 'Saída do Egito',
    emoji: '🏛️',
    color: '#2196F3',
    bgColor: '#E3F2FD',
    pathColor: '#90CAF9',
    unlockXP: 500,
    position: { x: 10, y: 33 },
  },
  {
    id: 'kings',
    name: 'O Reino de Israel',
    emoji: '👑',
    color: '#9C27B0',
    bgColor: '#F3E5F5',
    pathColor: '#CE93D8',
    unlockXP: 900,
    position: { x: 10, y: 12 },
  },
];

export const STORIES = [
  // ===== CAPÍTULO 1: GÊNESIS =====
  {
    id: 'creation',
    chapterId: 'genesis',
    title: 'A Criação do Mundo',
    emoji: '🌍',
    color: '#4CAF50',
    unlockXP: 0,
    xpReward: 50,
    dracmasReward: 20,
    verse: 'No princípio, Deus criou os céus e a terra. — Gênesis 1:1',
    description: 'Descubra como Deus criou tudo em 6 dias!',
    slides: [
      { bg: '#E3F2FD', scene: 'creation', text: 'No começo, não havia nada. A Terra era vazia e escura.' },
      { bg: '#FFF8E1', scene: 'light', text: 'No primeiro dia, Deus disse: "Haja luz!" E a luz apareceu!' },
      { bg: '#E8F5E9', scene: 'earth', text: 'Deus separou o céu e a terra, criou os mares e as plantas.' },
      { bg: '#E3F2FD', scene: 'stars', text: 'No quarto dia, Deus criou o sol, a lua e as estrelas.' },
      { bg: '#F3E5F5', scene: 'animals', text: 'Deus fez todos os animais — aves, peixes e bestas da terra!' },
      { bg: '#FFF3E0', scene: 'adam', text: 'Por último, Deus criou Adão e Eva — e descansou no sétimo dia.' },
    ],
    quiz: [
      { q: 'Em quantos dias Deus criou o mundo?', opts: ['3', '6', '7', '10'], ans: 1 },
      { q: 'O que Deus criou no primeiro dia?', opts: ['Animais', 'Sol', 'Luz', 'Mares'], ans: 2 },
      { q: 'Quem foi o primeiro homem?', opts: ['Noé', 'Adão', 'Moisés', 'Abraão'], ans: 1 },
    ],
  },
  {
    id: 'adam_eve',
    chapterId: 'genesis',
    title: 'Adão e Eva',
    emoji: '🍎',
    color: '#E53935',
    unlockXP: 50,
    xpReward: 60,
    dracmasReward: 25,
    verse: 'E Deus criou o homem à sua imagem. — Gênesis 1:27',
    description: 'A história do jardim e da maçã proibida.',
    slides: [
      { bg: '#E8F5E9', scene: 'eden', text: 'Deus plantou um jardim lindo chamado Éden para Adão e Eva.' },
      { bg: '#FFF3E0', scene: 'tree', text: 'Havia uma árvore especial no meio do jardim. Deus disse para não comer seus frutos.' },
      { bg: '#FCE4EC', scene: 'snake', text: 'Uma cobra enganou Eva, que comeu o fruto e deu para Adão.' },
      { bg: '#E8EAF6', scene: 'exile', text: 'Adão e Eva tiveram que sair do jardim. Mas Deus ainda os amava!' },
    ],
    quiz: [
      { q: 'Como se chamava o jardim de Adão e Eva?', opts: ['Canaã', 'Éden', 'Israel', 'Belém'], ans: 1 },
      { q: 'Quem convenceu Eva a comer o fruto?', opts: ['Adão', 'Deus', 'A cobra', 'Um anjo'], ans: 2 },
    ],
  },
  {
    id: 'noah',
    chapterId: 'genesis',
    title: 'Noé e a Grande Arca',
    emoji: '⛵',
    color: '#1565C0',
    unlockXP: 110,
    xpReward: 70,
    dracmasReward: 30,
    verse: 'Noé achou graça aos olhos do Senhor. — Gênesis 6:8',
    description: 'A arca gigante que salvou os animais do dilúvio!',
    slides: [
      { bg: '#E3F2FD', scene: 'noah_build', text: 'Noé era um homem justo. Deus mandou ele construir uma arca enorme!' },
      { bg: '#F3E5F5', scene: 'animals', text: 'Noé levou dois de cada animal para dentro da arca — macho e fêmea.' },
      { bg: '#E1F5FE', scene: 'flood', text: 'Choveu por 40 dias e 40 noites. A água cobriu toda a terra!' },
      { bg: '#E8F5E9', scene: 'rainbow', text: 'Depois do dilúvio, Deus colocou um arco-íris no céu como promessa.' },
    ],
    quiz: [
      { q: 'Por quantos dias choveu no dilúvio?', opts: ['7', '20', '40', '100'], ans: 2 },
      { q: 'O que Deus colocou no céu como promessa?', opts: ['Sol', 'Arco-íris', 'Estrelas', 'Nuvens'], ans: 1 },
      { q: 'Quantos de cada animal entrou na arca?', opts: ['1', '2', '3', '7'], ans: 1 },
    ],
  },
  {
    id: 'tower_babel',
    chapterId: 'genesis',
    title: 'A Torre de Babel',
    emoji: '🏗️',
    color: '#FF8A65',
    unlockXP: 180,
    xpReward: 55,
    dracmasReward: 22,
    verse: 'Vamos construir uma cidade com uma torre que alcance o céu. — Gênesis 11:4',
    description: 'Por que existem tantas línguas no mundo?',
    slides: [
      { bg: '#FFF3E0', scene: 'tower', text: 'As pessoas queriam construir uma torre que chegasse ao céu!' },
      { bg: '#FBE9E7', scene: 'babel', text: 'Deus confundiu a linguagem deles. Eles não conseguiam mais se entender.' },
      { bg: '#E8F5E9', scene: 'scattered', text: 'As pessoas se espalharam pelo mundo todo, falando línguas diferentes.' },
    ],
    quiz: [
      { q: 'O que as pessoas queriam construir?', opts: ['Um palácio', 'Uma torre', 'Um barco', 'Um templo'], ans: 1 },
      { q: 'O que Deus fez para parar a construção?', opts: ['Chuva', 'Terremoto', 'Confundiu as línguas', 'Fogo'], ans: 2 },
    ],
  },

  // ===== CAPÍTULO 2: PATRIARCAS =====
  {
    id: 'abraham',
    chapterId: 'patriarchs',
    title: 'Abraão, Pai da Fé',
    emoji: '⭐',
    color: '#FF9800',
    unlockXP: 200,
    xpReward: 80,
    dracmasReward: 35,
    verse: 'Abraão creu em Deus e isso lhe foi imputado como justiça. — Gênesis 15:6',
    description: 'O homem que deixou tudo para seguir a Deus!',
    slides: [
      { bg: '#FFF8E1', scene: 'abraham_call', text: 'Deus chamou Abraão: "Deixe sua terra e vá para onde eu mostrar!"' },
      { bg: '#FFF3E0', scene: 'stars', text: 'Deus prometeu a Abraão: "Sua família será tão grande quanto as estrelas!"' },
      { bg: '#E8F5E9', scene: 'isaac_birth', text: 'Mesmo sendo muito velho, Abraão teve um filho: Isaque!' },
    ],
    quiz: [
      { q: 'Qual foi o filho prometido de Abraão?', opts: ['Jacó', 'Isaque', 'José', 'Moisés'], ans: 1 },
      { q: 'O que Deus comparou a família de Abraão?', opts: ['Areia', 'Estrelas', 'Pedras', 'Água'], ans: 1 },
    ],
  },
  {
    id: 'joseph',
    chapterId: 'patriarchs',
    title: 'José e o Sonho do Faraó',
    emoji: '🌈',
    color: '#E91E63',
    unlockXP: 280,
    xpReward: 90,
    dracmasReward: 40,
    verse: 'Vocês planejaram o mal contra mim, mas Deus planejou o bem. — Gênesis 50:20',
    description: 'A história do menino da túnica colorida que virou líder!',
    slides: [
      { bg: '#FCE4EC', scene: 'joseph_coat', text: 'José tinha uma túnica de muitas cores. Seus irmãos sentiam inveja.' },
      { bg: '#E8EAF6', scene: 'joseph_pit', text: 'Os irmãos jogaram José em um poço e o venderam como escravo.' },
      { bg: '#FFF8E1', scene: 'joseph_prison', text: 'Na prisão, José interpretou sonhos. Ele era especial!' },
      { bg: '#FFF3E0', scene: 'joseph_pharaoh', text: 'O Faraó teve um sonho e José o interpretou: 7 anos de abundância e 7 de fome.' },
      { bg: '#E8F5E9', scene: 'joseph_governor', text: 'José virou governador do Egito e salvou seu povo da fome!' },
    ],
    quiz: [
      { q: 'Como era a roupa especial de José?', opts: ['De ouro', 'Colorida', 'De linho', 'Preta'], ans: 1 },
      { q: 'O sonho do Faraó indicava quantos anos de fome?', opts: ['3', '5', '7', '10'], ans: 2 },
      { q: 'O que aconteceu com José no final?', opts: ['Ficou escravo', 'Voltou para casa', 'Virou governador', 'Foi preso'], ans: 2 },
    ],
  },

  // ===== CAPÍTULO 3: ÊXODO =====
  {
    id: 'moses_birth',
    chapterId: 'exodus',
    title: 'Moisés: O Bebê no Rio',
    emoji: '🌿',
    color: '#2196F3',
    unlockXP: 500,
    xpReward: 80,
    dracmasReward: 35,
    verse: 'A fé de Moisés o fez deixar o Egito sem temer o rei. — Hebreus 11:27',
    description: 'Como um bebê escapou do faraó num cesto no rio Nilo!',
    slides: [
      { bg: '#E3F2FD', scene: 'nile', text: 'O Faraó queria matar todos os bebês hebreus. A mãe de Moisés o escondeu.' },
      { bg: '#E8F5E9', scene: 'basket', text: 'Ela colocou Moisés em um cestinho e o pôs no rio Nilo.' },
      { bg: '#FFF8E1', scene: 'princess', text: 'A princesa do Egito encontrou o bebê e o adotou como filho!' },
    ],
    quiz: [
      { q: 'Onde a mãe de Moisés o colocou?', opts: ['Numa caverna', 'Num cesto no rio', 'Num palácio', 'No deserto'], ans: 1 },
      { q: 'Quem encontrou e adotou Moisés?', opts: ['A rainha', 'A princesa', 'Uma escrava', 'Uma profetisa'], ans: 1 },
    ],
  },
  {
    id: 'burning_bush',
    chapterId: 'exodus',
    title: 'A Sarça Ardente',
    emoji: '🔥',
    color: '#FF5722',
    unlockXP: 580,
    xpReward: 90,
    dracmasReward: 40,
    verse: 'Tire as sandálias, pois o lugar onde você está é terra santa. — Êxodo 3:5',
    description: 'Deus fala com Moisés numa moita que queima sem se apagar!',
    slides: [
      { bg: '#FBE9E7', scene: 'bush', text: 'Moisés viu um arbusto pegando fogo, mas ele não se queimava!' },
      { bg: '#FFF3E0', scene: 'god_speaks', text: 'Deus falou de dentro da sarça: "Moisés, tire os sapatos. Este lugar é sagrado!"' },
      { bg: '#E8F5E9', scene: 'mission', text: 'Deus mandou Moisés libertar o povo de Israel da escravidão do Egito.' },
    ],
    quiz: [
      { q: 'O que havia de especial na sarça ardente?', opts: ['Ela voava', 'Não se consumia', 'Era colorida', 'Era enorme'], ans: 1 },
      { q: 'Qual missão Deus deu a Moisés?', opts: ['Construir um templo', 'Libertar Israel', 'Ir para Canaã', 'Matar o faraó'], ans: 1 },
    ],
  },
  {
    id: 'plagues',
    chapterId: 'exodus',
    title: 'As 10 Pragas do Egito',
    emoji: '🐸',
    color: '#9C27B0',
    unlockXP: 670,
    xpReward: 100,
    dracmasReward: 50,
    verse: 'Deixe o meu povo ir! — Êxodo 5:1',
    description: 'Deus mostrou seu poder com 10 pragas incríveis!',
    slides: [
      { bg: '#FCE4EC', scene: 'pharaoh', text: 'O Faraó não queria libertar os hebreus. Então Deus enviou pragas!' },
      { bg: '#E3F2FD', scene: 'blood', text: 'Água virou sangue, rãs invadiram tudo, mosquitos e moscas por toda parte!' },
      { bg: '#FFF3E0', scene: 'locusts', text: 'Gafanhotos comeram tudo, trevas cobriram o Egito por 3 dias!' },
      { bg: '#E8F5E9', scene: 'passover', text: 'Na última praga, Deus poupou as famílias que pintaram sangue nas portas.' },
      { bg: '#FFF8E1', scene: 'exodus_march', text: 'O Faraó liberou o povo! Mais de 600.000 pessoas saíram do Egito!' },
    ],
    quiz: [
      { q: 'Quantas pragas Deus enviou ao Egito?', opts: ['7', '8', '10', '12'], ans: 2 },
      { q: 'O que os hebreus pintaram nas portas para serem poupados?', opts: ['Água', 'Leite', 'Sangue', 'Azeite'], ans: 2 },
    ],
  },
  {
    id: 'red_sea',
    chapterId: 'exodus',
    title: 'A Abertura do Mar Vermelho',
    emoji: '🌊',
    color: '#0097A7',
    unlockXP: 770,
    xpReward: 110,
    dracmasReward: 55,
    verse: 'Moisés estendeu a mão sobre o mar e as águas se abriram. — Êxodo 14:21',
    description: 'O milagre mais incrível: o mar se abre para deixar o povo passar!',
    slides: [
      { bg: '#E3F2FD', scene: 'chase', text: 'O Faraó se arrependeu e foi atrás dos hebreus com seu exército!' },
      { bg: '#E0F7FA', scene: 'sea_wall', text: 'Moisés levantou seu cajado e Deus abriu o Mar Vermelho ao meio!' },
      { bg: '#E8F5E9', scene: 'crossing', text: 'O povo cruzou o mar com paredes de água dos dois lados.' },
      { bg: '#E3F2FD', scene: 'sea_close', text: 'Quando os egípcios tentaram seguir, as águas fecharam sobre eles!' },
    ],
    quiz: [
      { q: 'O que Moisés usou para abrir o mar?', opts: ['Sua espada', 'Seu cajado', 'Suas mãos', 'Seu anel'], ans: 1 },
      { q: 'Qual mar foi dividido?', opts: ['Mar da Galileia', 'Mar Morto', 'Mar Vermelho', 'Mar Mediterrâneo'], ans: 2 },
    ],
  },

  // ===== CAPÍTULO 4: REIS =====
  {
    id: 'david_goliath',
    chapterId: 'kings',
    title: 'Davi e Golias',
    emoji: '🪨',
    color: '#9C27B0',
    unlockXP: 900,
    xpReward: 120,
    dracmasReward: 60,
    verse: 'O Senhor não salva por espada nem por lança. — 1 Samuel 17:47',
    description: 'O menino pastor que venceu o gigante com uma pedra!',
    slides: [
      { bg: '#F3E5F5', scene: 'goliath', text: 'Golias era um gigante de quase 3 metros! Ele desafiava o exército de Israel.' },
      { bg: '#E8EAF6', scene: 'david_offers', text: 'O jovem Davi disse: "Eu enfrento o gigante!" Todos duvidaram.' },
      { bg: '#FFF8E1', scene: 'david_sling', text: 'Davi escolheu 5 pedrinhas. Com uma funda, acertou Golias na testa!' },
      { bg: '#E8F5E9', scene: 'victory', text: 'Golias caiu! Davi venceu pela fé em Deus, não pelo tamanho!' },
    ],
    quiz: [
      { q: 'Quantas pedrinhas Davi escolheu?', opts: ['1', '3', '5', '10'], ans: 2 },
      { q: 'Com que arma Davi venceu Golias?', opts: ['Espada', 'Lança', 'Arco', 'Funda'], ans: 3 },
      { q: 'Onde a pedra acertou Golias?', opts: ['No peito', 'No joelho', 'Na testa', 'No ombro'], ans: 2 },
    ],
  },
  {
    id: 'solomon',
    chapterId: 'kings',
    title: 'Salomão e a Sabedoria',
    emoji: '💎',
    color: '#F57F17',
    unlockXP: 1020,
    xpReward: 110,
    dracmasReward: 55,
    verse: 'Dá ao teu servo um coração entendido. — 1 Reis 3:9',
    description: 'O rei mais sábio que já existiu pediu sabedoria a Deus!',
    slides: [
      { bg: '#FFF8E1', scene: 'solomon_dream', text: 'Deus apareceu em sonho para Salomão: "Peça o que quiser!"' },
      { bg: '#FFF3E0', scene: 'wisdom', text: 'Salomão pediu sabedoria para governar bem. Deus ficou muito feliz!' },
      { bg: '#E8F5E9', scene: 'temple', text: 'Salomão construiu o famoso Templo de Jerusalém, uma das obras mais belas do mundo.' },
    ],
    quiz: [
      { q: 'O que Salomão pediu a Deus?', opts: ['Riqueza', 'Sabedoria', 'Poder', 'Exército'], ans: 1 },
      { q: 'O que Salomão construiu em Jerusalém?', opts: ['Uma torre', 'Um palácio', 'Um templo', 'Uma muralha'], ans: 2 },
    ],
  },
];

export function getStoryById(id) {
  return STORIES.find(s => s.id === id);
}

export function getStoriesByChapter(chapterId) {
  return STORIES.filter(s => s.chapterId === chapterId);
}

export function isStoryUnlocked(story, totalXP) {
  return totalXP >= story.unlockXP;
}