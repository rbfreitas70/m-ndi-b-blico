import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SFX } from '@/lib/audioEngine';
import { speak, stop } from '@/lib/speechEngine';
import ConfettiEffect from '@/components/ConfettiEffect';
import { NT_SCENES } from '@/components/story/NTScenes';

export default function StoryReader({ story, onComplete, onBack }) {
  const [page, setPage] = useState(0);
  const [mode, setMode] = useState('story'); // story | quiz
  const [quizIdx, setQuizIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [narrating, setNarrating] = useState(false);

  const slides = story.slides || [];
  const quiz = story.quiz || [];
  const currentSlide = slides[page];
  const currentQ = quiz[quizIdx];

  useEffect(() => { return () => stop(); }, []);

  const handleNarrate = () => {
    SFX.click();
    if (narrating) { stop(); setNarrating(false); return; }
    setNarrating(true);
    if (mode === 'story' && currentSlide) speak(currentSlide.text);
    else if (currentQ) speak(currentQ.q);
    setTimeout(() => setNarrating(false), 8000);
  };

  const nextPage = () => {
    SFX.pageFlip();
    stop();
    setNarrating(false);
    if (page < slides.length - 1) {
      setPage(p => p + 1);
    } else {
      if (quiz.length > 0) setMode('quiz');
      else completeStory();
    }
  };

  const prevPage = () => {
    SFX.click();
    if (page > 0) setPage(p => p - 1);
  };

  const handleAnswer = (idx) => {
    if (selected !== null) return;
    SFX.click();
    setSelected(idx);
    const isCorrect = idx === currentQ.ans;
    setCorrect(isCorrect);
    if (isCorrect) { SFX.match(); setScore(s => s + 1); }
    else SFX.error();
    speak(isCorrect ? 'Correto! Muito bem!' : `A resposta certa era: ${currentQ.opts[currentQ.ans]}`);
    setTimeout(() => {
      setSelected(null);
      setCorrect(null);
      if (quizIdx < quiz.length - 1) setQuizIdx(q => q + 1);
      else completeStory();
    }, 1800);
  };

  const completeStory = () => {
    setFinished(true);
    setShowConfetti(true);
    SFX.victory();
    const xp = story.xpReward;
    const dracmas = story.dracmasReward;
    setTimeout(() => onComplete(story.id, xp, dracmas), 2500);
  };

  const BG_GRADIENTS = {
    '#E3F2FD': 'linear-gradient(160deg, #E3F2FD 0%, #BBDEFB 100%)',
    '#FFF8E1': 'linear-gradient(160deg, #FFF8E1 0%, #FFE082 100%)',
    '#E8F5E9': 'linear-gradient(160deg, #E8F5E9 0%, #A5D6A7 100%)',
    '#F3E5F5': 'linear-gradient(160deg, #F3E5F5 0%, #CE93D8 100%)',
    '#FCE4EC': 'linear-gradient(160deg, #FCE4EC 0%, #F48FB1 100%)',
    '#FBE9E7': 'linear-gradient(160deg, #FBE9E7 0%, #FFAB91 100%)',
    '#E8EAF6': 'linear-gradient(160deg, #E8EAF6 0%, #9FA8DA 100%)',
    '#FFF3E0': 'linear-gradient(160deg, #FFF3E0 0%, #FFCC80 100%)',
    '#E1F5FE': 'linear-gradient(160deg, #E1F5FE 0%, #81D4FA 100%)',
    '#E0F7FA': 'linear-gradient(160deg, #E0F7FA 0%, #80DEEA 100%)',
  };

  if (finished) {
    return (
      <div className="h-full flex flex-col items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${story.color}CC, ${story.color}66)` }}>
        <ConfettiEffect active={showConfetti} />
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
          className="text-8xl mb-4">🏆</motion.div>
        <h2 className="font-display text-3xl text-white mb-2">Parabéns!</h2>
        <p className="font-body text-white/80 text-center px-6">
          Você completou "{story.title}"!<br />
          {quiz.length > 0 && `Acertou ${score}/${quiz.length} perguntas!`}
        </p>
        <div className="flex gap-4 mt-6 text-center">
          <div className="bg-white/20 rounded-2xl px-6 py-3">
            <p className="font-display text-2xl text-white">+{story.xpReward}</p>
            <p className="font-body text-white/70 text-xs">XP</p>
          </div>
          <div className="bg-white/20 rounded-2xl px-6 py-3">
            <p className="font-display text-2xl text-white">+{story.dracmasReward}</p>
            <p className="font-body text-white/70 text-xs">🪙</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden"
      style={{ background: currentSlide ? (BG_GRADIENTS[currentSlide.bg] || currentSlide.bg) : '#E3F2FD' }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-safe py-3 bg-white/30 backdrop-blur-sm border-b border-white/30">
        <button onClick={() => { stop(); onBack(); }}
          className="w-9 h-9 rounded-full bg-white/40 flex items-center justify-center text-gray-700 font-body text-sm">
          ←
        </button>
        <div className="flex-1">
          <p className="font-display text-sm text-gray-700 leading-tight truncate">{story.title}</p>
          <div className="flex gap-1 mt-1">
            {mode === 'story'
              ? slides.map((_, i) => (
                  <div key={i} className="h-1.5 rounded-full flex-1 transition-all"
                    style={{ background: i <= page ? story.color : 'rgba(0,0,0,0.15)' }} />
                ))
              : quiz.map((_, i) => (
                  <div key={i} className="h-1.5 rounded-full flex-1 transition-all"
                    style={{ background: i < quizIdx ? '#4CAF50' : i === quizIdx ? '#FFD54F' : 'rgba(0,0,0,0.15)' }} />
                ))
            }
          </div>
        </div>
        <button onClick={handleNarrate}
          className="w-9 h-9 rounded-full bg-white/40 flex items-center justify-center text-lg">
          {narrating ? '🔇' : '🔊'}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {mode === 'story' && currentSlide && (
            <motion.div key={page}
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col justify-between p-5"
            >
              {/* Illustration area */}
              <div className="flex-1 flex items-center justify-center">
                <SceneIllustration scene={currentSlide.scene} color={story.color} />
              </div>

              {/* Text */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 mt-4 border-2 border-white/50">
                <p className="font-body text-gray-800 text-lg leading-relaxed text-center">
                  {currentSlide.text}
                </p>
              </div>

              {/* Nav */}
              <div className="flex gap-3 mt-4">
                {page > 0 && (
                  <button onClick={prevPage}
                    className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/50 border-2 border-white/60 flex items-center justify-center text-gray-600 font-body text-lg">
                    ←
                  </button>
                )}
                <button onClick={nextPage}
                  className="flex-1 py-3 rounded-2xl font-display text-white text-lg"
                  style={{ background: story.color, boxShadow: `0 4px 0 ${story.color}88, 0 6px 12px rgba(0,0,0,0.15)` }}>
                  {page < slides.length - 1 ? 'Próximo →' : quiz.length > 0 ? 'Quiz! 🧠' : '🎉 Terminar!'}
                </button>
              </div>
            </motion.div>
          )}

          {mode === 'quiz' && currentQ && (
            <motion.div key={`quiz-${quizIdx}`}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col p-5 gap-4"
            >
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/50">
                <p className="text-xs text-gray-500 font-body mb-1">Pergunta {quizIdx + 1} de {quiz.length}</p>
                <p className="font-display text-gray-800 text-xl leading-snug">🧠 {currentQ.q}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 flex-1 content-center">
                {currentQ.opts.map((opt, i) => {
                  let bg = 'white';
                  let borderColor = 'rgba(0,0,0,0.1)';
                  if (selected !== null) {
                    if (i === currentQ.ans) { bg = '#C8E6C9'; borderColor = '#4CAF50'; }
                    else if (i === selected && !correct) { bg = '#FFCDD2'; borderColor = '#F44336'; }
                  }
                  return (
                    <button key={i} onClick={() => handleAnswer(i)}
                      className="py-4 px-3 rounded-2xl font-body text-gray-800 text-base text-center border-3 transition-all"
                      style={{
                        background: bg,
                        borderWidth: '3px',
                        borderColor,
                        boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
                        transform: selected === i ? 'scale(0.96)' : 'scale(1)',
                      }}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Simple scene illustrations using SVG
function SceneIllustration({ scene, color }) {
  const scenes = {
    ...NT_SCENES,
    creation: <CreationScene />,
    light: <LightScene />,
    earth: <EarthScene />,
    stars: <StarsScene />,
    animals: <AnimalsScene />,
    adam: <AdamScene />,
    eden: <EdenScene />,
    tree: <TreeScene />,
    snake: <SnakeScene />,
    exile: <ExileScene />,
    flood: <FloodScene />,
    rainbow: <RainbowScene />,
    noah_build: <NoahBuildScene />,
    tower: <TowerScene />,
    babel: <TowerScene />,
    scattered: <ScatteredScene />,
    abraham_call: <AbrahamScene />,
    isaac_birth: <IsaacScene />,
    joseph_coat: <JosephCoatScene />,
    joseph_pit: <JosephPitScene />,
    joseph_prison: <JosephPrisonScene />,
    joseph_pharaoh: <PharaohScene />,
    joseph_governor: <GovernorScene />,
    nile: <NileScene />,
    basket: <BasketScene />,
    princess: <PrincessScene />,
    bush: <BushScene />,
    god_speaks: <BushScene />,
    mission: <MountainScene />,
    pharaoh: <PharaohScene />,
    blood: <PlagueScene />,
    locusts: <LocustsScene />,
    passover: <PassoverScene />,
    exodus_march: <MarchScene />,
    chase: <ChaseScene />,
    sea_wall: <SeaWallScene />,
    crossing: <CrossingScene />,
    sea_close: <CrossingScene />,
    goliath: <GoliathScene />,
    david_offers: <DavidScene />,
    david_sling: <SlingshotScene />,
    victory: <VictoryScene />,
    solomon_dream: <SolomonScene />,
    wisdom: <WisdomScene />,
    temple: <TempleScene />,
    desert_walk: <DesertWalkScene />,
    sinai_fire: <SinaiFireScene />,
    cloud_mountain: <CloudMountainScene />,
    stone_tablets: <StoneTabletsScene />,
    golden_calf: <GoldenCalfScene />,
    moses_return: <MosesReturnScene />,
  };
  return (
    <div className="w-full max-w-xs">
      {scenes[scene] || <DefaultScene color={color} />}
    </div>
  );
}

// ── SVG Scene Components ──────────────────────────────────────────────────────
const SVG = ({ children, bg = '#E3F2FD' }) => (
  <svg viewBox="0 0 280 200" className="w-full drop-shadow-lg rounded-3xl" style={{ background: bg }}>
    {children}
  </svg>
);

const Sky = ({ top = '#1A237E', bottom = '#0288D1' }) => (
  <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor={top} /><stop offset="100%" stopColor={bottom} />
  </linearGradient></defs>
);

function CreationScene() {
  return <SVG bg="#1a237e">
    <Sky top="#0D0221" bottom="#1A237E" />
    <rect width="280" height="200" fill="url(#sky)" />
    {[...Array(12)].map((_, i) => (
      <circle key={i} cx={20 + i * 22} cy={20 + (i % 3) * 15} r={2 + Math.random() * 2} fill="white" opacity={0.8} />
    ))}
    <circle cx="140" cy="80" r="50" fill="#FFD54F" opacity={0.9} />
    <text x="140" y="90" textAnchor="middle" fontSize="40">🌍</text>
  </SVG>;
}

function LightScene() {
  return <SVG bg="#FFF8E1">
    <rect width="280" height="200" fill="#1a237e" />
    {[...Array(8)].map((_, i) => (
      <line key={i} x1="140" y1="100" x2={140 + Math.cos(i * 45 * Math.PI / 180) * 100} y2={100 + Math.sin(i * 45 * Math.PI / 180) * 100} stroke="#FFD54F" strokeWidth="6" opacity={0.6} />
    ))}
    <circle cx="140" cy="100" r="40" fill="#FFD54F" />
    <text x="140" y="113" textAnchor="middle" fontSize="35">✨</text>
  </SVG>;
}

function EarthScene() {
  return <SVG>
    <rect width="280" height="100" fill="#87CEEB" />
    <rect y="100" width="280" height="100" fill="#4CAF50" />
    <ellipse cx="140" cy="100" rx="120" ry="15" fill="#2196F3" />
    <text x="60" y="80" fontSize="28">☁️</text>
    <text x="180" y="65" fontSize="22">☁️</text>
    <text x="80" y="160" fontSize="28">🌳</text>
    <text x="160" y="155" fontSize="24">🌲</text>
  </SVG>;
}

function StarsScene() {
  return <SVG bg="#0D0221">
    <rect width="280" height="200" fill="#0D0221" />
    {[...Array(20)].map((_, i) => (
      <circle key={i} cx={10 + i * 13} cy={15 + (i % 4) * 20} r={1.5} fill="#FFD54F" />
    ))}
    <circle cx="80" cy="70" r="28" fill="#FFD54F" opacity={0.9} />
    <text x="80" y="80" textAnchor="middle" fontSize="28">🌙</text>
    <circle cx="200" cy="60" r="35" fill="#FFF176" opacity={0.85} />
    <text x="200" y="72" textAnchor="middle" fontSize="32">☀️</text>
  </SVG>;
}

function AnimalsScene() {
  return <SVG bg="#E8F5E9">
    <rect width="280" height="200" fill="#E8F5E9" />
    <rect y="150" width="280" height="50" fill="#8BC34A" />
    <text x="30" y="145" fontSize="32">🦁</text>
    <text x="90" y="148" fontSize="28">🐘</text>
    <text x="155" y="142" fontSize="30">🦒</text>
    <text x="220" y="148" fontSize="28">🐍</text>
    <text x="60" y="115" fontSize="26">🕊️</text>
    <text x="140" y="110" fontSize="24">🦅</text>
    <text x="200" y="118" fontSize="26">🐟</text>
  </SVG>;
}

function AdamScene() {
  return <SVG bg="#FFF3E0">
    <rect width="280" height="200" fill="#87CEEB" />
    <rect y="140" width="280" height="60" fill="#4CAF50" />
    <text x="80" y="140" fontSize="44">👨</text>
    <text x="155" y="142" fontSize="42">👩</text>
    <text x="110" y="95" fontSize="32">🌟</text>
  </SVG>;
}

function EdenScene() {
  return <SVG>
    <rect width="280" height="200" fill="#87CEEB" />
    <rect y="140" width="280" height="60" fill="#4CAF50" />
    <text x="20" y="135" fontSize="32">🌴</text>
    <text x="200" y="130" fontSize="36">🌳</text>
    <text x="100" y="125" fontSize="40">🌸</text>
    <text x="90" y="140" fontSize="34">👨</text>
    <text x="155" y="142" fontSize="34">👩</text>
    <text x="140" y="100" fontSize="24">🦋</text>
  </SVG>;
}

function TreeScene() {
  return <SVG>
    <rect width="280" height="200" fill="#87CEEB" />
    <rect y="150" width="280" height="50" fill="#4CAF50" />
    <text x="100" y="140" fontSize="56">🌳</text>
    <text x="150" y="100" fontSize="28">🍎</text>
    <text x="105" y="78" fontSize="22">🍎</text>
  </SVG>;
}

function SnakeScene() {
  return <SVG>
    <rect width="280" height="200" fill="#87CEEB" />
    <rect y="150" width="280" height="50" fill="#4CAF50" />
    <text x="90" y="130" fontSize="40">🌳</text>
    <text x="145" y="100" fontSize="30">🐍</text>
    <text x="160" y="145" fontSize="34">👩</text>
    <text x="120" y="85" fontSize="22">🍎</text>
  </SVG>;
}

function ExileScene() {
  return <SVG bg="#FFF3E0">
    <rect width="280" height="200" fill="#FF8A65" opacity={0.3} />
    <rect y="150" width="280" height="50" fill="#8BC34A" />
    <text x="60" y="145" fontSize="36">👨</text>
    <text x="130" y="147" fontSize="36">👩</text>
    <text x="210" y="80" fontSize="36">😢</text>
  </SVG>;
}

function FloodScene() {
  return <SVG bg="#0288D1">
    <rect width="280" height="200" fill="#0288D1" />
    <text x="100" y="90" fontSize="50">⛵</text>
    {[...Array(6)].map((_, i) => (
      <ellipse key={i} cx={20 + i * 45} cy={150 + (i % 2) * 8} rx="30" ry="12" fill="#1565C0" />
    ))}
    <text x="50" y="50" fontSize="24">🌧️</text>
    <text x="120" y="40" fontSize="24">🌧️</text>
    <text x="190" y="50" fontSize="24">🌧️</text>
  </SVG>;
}

function RainbowScene() {
  return <SVG bg="#E3F2FD">
    <rect width="280" height="200" fill="#B3E5FC" />
    <path d="M10,140 Q140,20 270,140" stroke="#E53935" strokeWidth="8" fill="none" />
    <path d="M20,145 Q140,35 260,145" stroke="#FF8A65" strokeWidth="8" fill="none" />
    <path d="M30,150 Q140,50 250,150" stroke="#FFD54F" strokeWidth="8" fill="none" />
    <path d="M40,155 Q140,65 240,155" stroke="#4CAF50" strokeWidth="8" fill="none" />
    <path d="M50,160 Q140,80 230,160" stroke="#1565C0" strokeWidth="8" fill="none" />
    <rect y="160" width="280" height="40" fill="#8BC34A" />
    <text x="110" y="195" fontSize="24">⛵</text>
  </SVG>;
}

function NoahBuildScene() {
  return <SVG>
    <rect width="280" height="200" fill="#87CEEB" />
    <rect y="150" width="280" height="50" fill="#8BC34A" />
    <rect x="60" y="90" width="160" height="65" rx="8" fill="#795548" />
    <rect x="80" y="60" width="120" height="40" rx="6" fill="#8D6E63" />
    <text x="180" y="148" fontSize="32">👴</text>
    <text x="30" y="145" fontSize="20">🔨</text>
  </SVG>;
}

function TowerScene() {
  return <SVG bg="#FFF3E0">
    <rect width="280" height="200" fill="#87CEEB" />
    <rect y="160" width="280" height="40" fill="#8BC34A" />
    <rect x="100" y="60" width="80" height="105" fill="#BCAAA4" />
    <rect x="110" y="30" width="60" height="45" fill="#A1887F" />
    <rect x="120" y="10" width="40" height="30" fill="#8D6E63" />
    {[...Array(4)].map((_, i) => (
      <rect key={i} x={104 + i * 18} y={62} width={14} height={10} rx={3} fill="#6D4C41" />
    ))}
    <text x="40" y="155" fontSize="20">👤</text>
    <text x="210" y="155" fontSize="20">👤</text>
    <text x="125" y="155" fontSize="20">👤</text>
  </SVG>;
}

function ScatteredScene() {
  return <SVG>
    <rect width="280" height="200" fill="#87CEEB" />
    <rect y="155" width="280" height="45" fill="#8BC34A" />
    <text x="20" y="150" fontSize="24">👤</text>
    <text x="110" y="155" fontSize="24">👤</text>
    <text x="220" y="148" fontSize="24">👤</text>
    <text x="65" y="148" fontSize="22">🗺️</text>
    <text x="160" y="152" fontSize="22">🗺️</text>
    <text x="130" y="90" fontSize="28">🌍</text>
  </SVG>;
}

function AbrahamScene() {
  return <SVG bg="#FFF8E1">
    <rect width="280" height="200" fill="#1a237e" />
    {[...Array(15)].map((_, i) => <circle key={i} cx={10 + i * 18} cy={10 + (i % 3) * 12} r="2" fill="#FFD54F" />)}
    <text x="120" y="150" fontSize="40">👴</text>
    <text x="80" y="100" fontSize="30">⭐</text>
    <text x="170" y="90" fontSize="24">⭐</text>
    <text x="130" y="70" fontSize="20">⭐</text>
    <text x="50" y="80" fontSize="18">⭐</text>
    <text x="195" y="115" fontSize="22">⭐</text>
  </SVG>;
}

function IsaacScene() {
  return <SVG bg="#FFF8E1">
    <rect width="280" height="200" fill="#FFF8E1" />
    <text x="80" y="150" fontSize="40">👴</text>
    <text x="145" y="145" fontSize="38">👵</text>
    <text x="112" y="130" fontSize="28">👶</text>
    <text x="130" y="80" fontSize="30">🌟</text>
  </SVG>;
}

function JosephCoatScene() {
  return <SVG bg="#FCE4EC">
    <rect width="280" height="200" fill="#FCE4EC" />
    <text x="110" y="155" fontSize="44">👦</text>
    <text x="160" y="130" fontSize="30">🌈</text>
    <text x="140" y="100" fontSize="24">👕</text>
  </SVG>;
}

function JosephPitScene() {
  return <SVG bg="#E8EAF6">
    <rect width="280" height="200" fill="#87CEEB" />
    <rect y="150" width="280" height="50" fill="#8BC34A" />
    <ellipse cx="140" cy="155" rx="40" ry="20" fill="#5D4037" />
    <text x="115" y="145" fontSize="28">😢</text>
    <text x="50" y="145" fontSize="24">😠</text>
    <text x="190" y="148" fontSize="24">😠</text>
  </SVG>;
}

function JosephPrisonScene() {
  return <SVG bg="#E8EAF6">
    <rect width="280" height="200" fill="#37474F" />
    {[...Array(6)].map((_, i) => <rect key={i} x={60 + i * 28} y={20} width={6} height={180} fill="#455A64" />)}
    <text x="110" y="160" fontSize="40">🤔</text>
    <text x="160" y="100" fontSize="28">💭</text>
    <text x="145" y="85" fontSize="18">⭐</text>
  </SVG>;
}

function PharaohScene() {
  return <SVG bg="#FFF8E1">
    <rect width="280" height="200" fill="#FFF8E1" />
    <text x="100" y="155" fontSize="44">🤴</text>
    <text x="60" y="100" fontSize="28">💭</text>
    <text x="75" y="85" fontSize="22">🌾</text>
    <text x="155" y="80" fontSize="22">🐄</text>
  </SVG>;
}

function GovernorScene() {
  return <SVG bg="#FFF3E0">
    <rect width="280" height="200" fill="#FFF3E0" />
    <text x="90" y="155" fontSize="44">👑</text>
    <text x="155" y="148" fontSize="40">🤴</text>
    <text x="40" y="145" fontSize="28">🌾</text>
    <text x="210" y="140" fontSize="28">🌾</text>
    <text x="130" y="85" fontSize="30">🌟</text>
  </SVG>;
}

function NileScene() {
  return <SVG bg="#E3F2FD">
    <rect width="280" height="200" fill="#E3F2FD" />
    <rect y="110" width="280" height="90" fill="#0288D1" />
    {[1, 2, 3].map(i => <ellipse key={i} cx={i * 80} cy={135} rx={35} ry={10} fill="#1565C0" />)}
    <text x="110" y="105" fontSize="32">👶</text>
    <text x="70" y="95" fontSize="24">😢</text>
  </SVG>;
}

function BasketScene() {
  return <SVG bg="#E3F2FD">
    <rect width="280" height="200" fill="#87CEEB" />
    <rect y="120" width="280" height="80" fill="#0288D1" />
    <ellipse cx="140" cy="120" rx="35" ry="20" fill="#8D6E63" />
    <text x="120" y="115" fontSize="24">👶</text>
    <text x="40" y="110" fontSize="28">🌿</text>
    <text x="200" y="108" fontSize="28">🌿</text>
  </SVG>;
}

function PrincessScene() {
  return <SVG bg="#FFF3E0">
    <rect width="280" height="200" fill="#FFF3E0" />
    <rect y="130" width="280" height="70" fill="#0288D1" />
    <text x="100" y="125" fontSize="40">👸</text>
    <text x="165" y="120" fontSize="30">👶</text>
    <text x="140" y="80" fontSize="24">💫</text>
  </SVG>;
}

function BushScene() {
  return <SVG bg="#FBE9E7">
    <rect width="280" height="200" fill="#FF8A65" opacity={0.2} />
    <rect y="150" width="280" height="50" fill="#8BC34A" />
    <text x="80" y="140" fontSize="52">🔥</text>
    <text x="100" y="105" fontSize="32">🌿</text>
    <text x="165" y="150" fontSize="38">👴</text>
    <text x="40" y="165" fontSize="22">👞</text>
    <text x="60" y="168" fontSize="22">👞</text>
  </SVG>;
}

function MountainScene() {
  return <SVG>
    <rect width="280" height="200" fill="#87CEEB" />
    <polygon points="80,160 160,30 240,160" fill="#607D8B" />
    <polygon points="0,160 80,60 160,160" fill="#78909C" />
    <rect y="160" width="280" height="40" fill="#8BC34A" />
    <text x="160" y="180" fontSize="32">🏃</text>
    <text x="130" y="140" fontSize="18">✨</text>
  </SVG>;
}

function PlagueScene() {
  return <SVG bg="#FCE4EC">
    <rect width="280" height="200" fill="#FCE4EC" />
    <text x="30" y="120" fontSize="32">🐸</text>
    <text x="100" y="110" fontSize="28">🐸</text>
    <text x="165" y="115" fontSize="30">🐸</text>
    <text x="225" y="105" fontSize="26">🐸</text>
    <text x="70" y="160" fontSize="28">🐸</text>
    <text x="140" y="155" fontSize="26">🐸</text>
    <text x="200" y="160" fontSize="30">🐸</text>
    <text x="115" y="70" fontSize="24">😱</text>
  </SVG>;
}

function LocustsScene() {
  return <SVG bg="#FFF3E0">
    <rect width="280" height="200" fill="#FFF3E0" />
    {[...Array(12)].map((_, i) => (
      <text key={i} x={10 + (i % 4) * 65} y={30 + Math.floor(i / 4) * 55} fontSize="26">🦗</text>
    ))}
    <rect y="160" width="280" height="40" fill="#8BC34A" />
  </SVG>;
}

function PassoverScene() {
  return <SVG bg="#FFF8E1">
    <rect width="280" height="200" fill="#FFF8E1" />
    <rect x="0" y="0" width="280" height="200" fill="#1a237e" opacity={0.3} />
    <rect x="40" y="30" width="80" height="150" rx="8" fill="#A1887F" />
    <text x="50" y="130" fontSize="22">🚪</text>
    <text x="30" y="50" fontSize="18" fill="red">🩸</text>
    <text x="110" y="45" fontSize="18" fill="red">🩸</text>
    <text x="110" y="175" fontSize="18" fill="red">🩸</text>
    <text x="170" y="150" fontSize="30">🙏</text>
  </SVG>;
}

function MarchScene() {
  return <SVG bg="#FFF3E0">
    <rect width="280" height="200" fill="#FFD54F" opacity={0.2} />
    <rect y="150" width="280" height="50" fill="#8BC34A" />
    {[0, 1, 2, 3, 4, 5].map(i => (
      <text key={i} x={15 + i * 42} y={148} fontSize="24">👤</text>
    ))}
    <text x="120" y="90" fontSize="36">☀️</text>
    <text x="10" y="85" fontSize="28">☁️</text>
  </SVG>;
}

function ChaseScene() {
  return <SVG bg="#E3F2FD">
    <rect width="280" height="200" fill="#0288D1" opacity={0.2} />
    <rect y="140" width="280" height="60" fill="#4CAF50" />
    <text x="20" y="135" fontSize="24">👤</text>
    <text x="60" y="135" fontSize="24">👤</text>
    <text x="100" y="138" fontSize="28">👤</text>
    <text x="155" y="138" fontSize="38">🏃</text>
    <text x="210" y="82" fontSize="32">🌊</text>
    <text x="20" y="60" fontSize="28">🐎</text>
    <text x="60" y="55" fontSize="28">⚔️</text>
  </SVG>;
}

function SeaWallScene() {
  return <SVG bg="#E0F7FA">
    <rect width="280" height="200" fill="#E0F7FA" />
    <rect x="0" y="40" width="60" height="130" rx="4" fill="#0288D1" opacity={0.8} />
    <rect x="220" y="40" width="60" height="130" rx="4" fill="#0288D1" opacity={0.8} />
    <rect y="160" width="280" height="40" fill="#A5D6A7" />
    {[0, 1, 2, 3, 4].map(i => <text key={i} x={65 + i * 35} y={155} fontSize="24">👤</text>)}
    <text x="105" y="60" fontSize="36">🙏</text>
  </SVG>;
}

function CrossingScene() {
  return <SVG bg="#E0F7FA">
    <rect width="280" height="200" fill="#E0F7FA" />
    <rect x="0" y="50" width="55" height="120" rx="4" fill="#0288D1" opacity={0.7} />
    <rect x="225" y="50" width="55" height="120" rx="4" fill="#0288D1" opacity={0.7} />
    <rect y="165" width="280" height="35" fill="#DEB887" />
    {[0, 1, 2, 3, 4].map(i => <text key={i} x={60 + i * 32} y={160} fontSize="22">👤</text>)}
    <text x="100" y="35" fontSize="24">☁️</text>
    <text x="155" y="38" fontSize="20">🌟</text>
  </SVG>;
}

function GoliathScene() {
  return <SVG bg="#F3E5F5">
    <rect width="280" height="200" fill="#E8EAF6" />
    <rect y="160" width="280" height="40" fill="#8BC34A" />
    <text x="155" y="155" fontSize="52">🧌</text>
    <text x="70" y="170" fontSize="28">👦</text>
    <text x="50" y="148" fontSize="20">🗡️</text>
    <text x="200" y="80" fontSize="28">⚔️</text>
    <text x="155" y="75" fontSize="22">🛡️</text>
  </SVG>;
}

function DavidScene() {
  return <SVG bg="#F3E5F5">
    <rect width="280" height="200" fill="#E8EAF6" />
    <rect y="160" width="280" height="40" fill="#8BC34A" />
    <text x="80" y="160" fontSize="36">👦</text>
    <text x="140" y="85" fontSize="24">💪</text>
    <text x="60" y="90" fontSize="28">✨</text>
    <text x="170" y="155" fontSize="32">🧌</text>
  </SVG>;
}

function SlingshotScene() {
  return <SVG bg="#F3E5F5">
    <rect width="280" height="200" fill="#E8EAF6" />
    <rect y="155" width="280" height="45" fill="#8BC34A" />
    <text x="40" y="152" fontSize="36">👦</text>
    <text x="175" y="150" fontSize="48">🧌</text>
    <circle cx="130" cy="100" r="8" fill="#607D8B" />
    <path d="M55 130 Q130 80 175 130" stroke="#795548" strokeWidth="3" fill="none" />
  </SVG>;
}

function VictoryScene() {
  return <SVG bg="#E8F5E9">
    <rect width="280" height="200" fill="#E8F5E9" />
    <rect y="150" width="280" height="50" fill="#4CAF50" />
    <text x="90" y="145" fontSize="48">🏆</text>
    <text x="155" y="100" fontSize="30">⭐</text>
    <text x="50" y="95" fontSize="26">🌟</text>
    <text x="195" y="95" fontSize="28">✨</text>
    <text x="115" y="60" fontSize="24">🎉</text>
  </SVG>;
}

function SolomonScene() {
  return <SVG bg="#FFF8E1">
    <rect width="280" height="200" fill="#1a237e" />
    {[...Array(12)].map((_, i) => <circle key={i} cx={15 + i * 22} cy={15 + (i % 3) * 12} r="2" fill="#FFD54F" />)}
    <text x="95" y="160" fontSize="44">🤴</text>
    <text x="135" y="100" fontSize="30">💭</text>
    <text x="150" y="82" fontSize="24">📖</text>
  </SVG>;
}

function WisdomScene() {
  return <SVG bg="#FFF8E1">
    <rect width="280" height="200" fill="#FFF8E1" />
    <text x="90" y="155" fontSize="44">🤴</text>
    <text x="155" y="145" fontSize="36">📖</text>
    <text x="50" y="90" fontSize="32">💡</text>
    <text x="190" y="95" fontSize="28">⭐</text>
    <text x="120" y="60" fontSize="26">✨</text>
  </SVG>;
}

function TempleScene() {
  return <SVG bg="#FFF3E0">
    <rect width="280" height="200" fill="#FFF3E0" />
    <rect y="150" width="280" height="50" fill="#8BC34A" />
    <rect x="40" y="50" width="200" height="110" fill="#FFCC80" />
    <rect x="55" y="25" width="170" height="35" fill="#FFB300" />
    {[...Array(5)].map((_, i) => (
      <rect key={i} x={55 + i * 38} y={60} width={18} height={90} fill="#E65100" />
    ))}
    <rect x="100" y="110" width="80" height="55" fill="#5D4037" />
    <text x="120" y="50" fontSize="22">⭐</text>
    <text x="55" y="30" fontSize="18">🌟</text>
    <text x="200" y="32" fontSize="18">🌟</text>
  </SVG>;
}

function DesertWalkScene() {
  return <SVG bg="#FFF8E1">
    <rect width="280" height="200" fill="#FFD54F" opacity={0.25} />
    <rect y="140" width="280" height="60" fill="#D7B07A" />
    {[0,1,2,3,4,5].map(i => <text key={i} x={10 + i * 44} y={138} fontSize="22">👤</text>)}
    <text x="110" y="85" fontSize="36">☀️</text>
    <text x="50" y="120" fontSize="24">🐪</text>
    <text x="185" y="118" fontSize="24">🐪</text>
  </SVG>;
}

function SinaiFireScene() {
  return <SVG bg="#FBE9E7">
    <rect width="280" height="200" fill="#1a237e" />
    {[...Array(10)].map((_, i) => <circle key={i} cx={12 + i * 26} cy={15 + (i % 3) * 10} r="2" fill="#FFD54F" />)}
    <polygon points="90,190 140,30 190,190" fill="#607D8B" />
    <polygon points="30,190 90,80 150,190" fill="#78909C" />
    <text x="110" y="90" fontSize="36">🔥</text>
    <text x="140" y="65" fontSize="26">⚡</text>
    <text x="80" y="55" fontSize="20">☁️</text>
    <text x="165" y="50" fontSize="22">☁️</text>
  </SVG>;
}

function CloudMountainScene() {
  return <SVG bg="#E8EAF6">
    <rect width="280" height="200" fill="#607D8B" opacity={0.3} />
    <polygon points="60,180 140,30 220,180" fill="#546E7A" />
    <rect y="175" width="280" height="25" fill="#8D6E63" />
    <text x="105" y="55" fontSize="34">☁️</text>
    <text x="145" y="75" fontSize="28">☁️</text>
    <text x="115" y="95" fontSize="36">✨</text>
    <text x="118" y="165" fontSize="32">👴</text>
    <text x="95" y="135" fontSize="18">🙏</text>
  </SVG>;
}

function StoneTabletsScene() {
  return <SVG bg="#FFF3E0">
    <rect width="280" height="200" fill="#FFF8E1" />
    <rect x="55" y="40" width="70" height="110" rx="10" fill="#9E9E9E" />
    <rect x="55" y="40" width="70" height="50" rx="10" fill="#BDBDBD" />
    <rect x="145" y="40" width="70" height="110" rx="10" fill="#9E9E9E" />
    <rect x="145" y="40" width="70" height="50" rx="10" fill="#BDBDBD" />
    {[1,2,3,4,5].map(i => <line key={i} x1="62" y1={95 + i*10} x2="118" y2={95 + i*10} stroke="#616161" strokeWidth="2" />)}
    {[1,2,3,4,5].map(i => <line key={i} x1="152" y1={95 + i*10} x2="208" y2={95 + i*10} stroke="#616161" strokeWidth="2" />)}
    <text x="75" y="68" fontSize="22">📜</text>
    <text x="165" y="68" fontSize="22">📜</text>
    <text x="110" y="175" fontSize="30">✨</text>
    <text x="140" y="178" fontSize="26">⚡</text>
  </SVG>;
}

function GoldenCalfScene() {
  return <SVG bg="#FCE4EC">
    <rect width="280" height="200" fill="#FFF3E0" />
    <rect y="155" width="280" height="45" fill="#8BC34A" />
    <text x="100" y="145" fontSize="52">🐄</text>
    <text x="145" y="105" fontSize="30">✨</text>
    <text x="155" y="90" fontSize="24">💛</text>
    <text x="40" y="152" fontSize="22">👤</text>
    <text x="190" y="150" fontSize="22">👤</text>
    <text x="230" y="148" fontSize="22">🎉</text>
    <text x="20" y="145" fontSize="20">🎉</text>
  </SVG>;
}

function MosesReturnScene() {
  return <SVG bg="#E8F5E9">
    <rect width="280" height="200" fill="#87CEEB" />
    <rect y="155" width="280" height="45" fill="#8BC34A" />
    <text x="108" y="148" fontSize="40">👴</text>
    <text x="65" y="130" fontSize="28">📜</text>
    <text x="165" y="125" fontSize="28">📜</text>
    <text x="30" y="152" fontSize="20">👤</text>
    <text x="200" y="150" fontSize="20">👤</text>
    <text x="120" y="80" fontSize="28">🌟</text>
    <text x="155" y="70" fontSize="22">✨</text>
  </SVG>;
}

function DefaultScene({ color }) {
  return (
    <SVG bg={color + '22'}>
      <rect width="280" height="200" fill={color + '22'} />
      <text x="140" y="110" textAnchor="middle" fontSize="60">📖</text>
    </SVG>
  );
}