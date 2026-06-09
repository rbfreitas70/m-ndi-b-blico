import { useEffect, useRef, useState } from 'react';
import { SFX } from '@/lib/audioEngine';

const W = 360, H = 200, GROUND = 156;
const GRAVITY = 0.55, JUMP_V = -13, SPEED0 = 4;

export default function RunnerGame({ onBack, onComplete, highScore = 0, onHighScore }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const rafRef = useRef(null);
  const [phase, setPhase] = useState('idle'); // idle | playing | over
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);

  function initState() {
    return {
      player: { x: 55, y: GROUND, vy: 0, grounded: true, w: 28, h: 36 },
      obstacles: [], collectibles: [],
      score: 0, coins: 0, frame: 0, speed: SPEED0, alive: true,
    };
  }

  const jump = () => {
    const s = stateRef.current;
    if (!s || !s.player.grounded || !s.alive) return;
    SFX.jump();
    s.player.vy = JUMP_V;
    s.player.grounded = false;
  };

  const startGame = () => {
    stateRef.current = initState();
    setPhase('playing');
    setScore(0);
    setCoins(0);
  };

  useEffect(() => {
    if (phase !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const onKey = e => { if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump(); } };
    window.addEventListener('keydown', onKey);

    function collision(a, b) {
      return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }

    function loop() {
      const s = stateRef.current;
      if (!s || !s.alive) return;

      s.frame++;
      s.score++;
      s.speed = SPEED0 + Math.min(s.score / 400, 3);

      // Physics
      s.player.vy += GRAVITY;
      s.player.y += s.player.vy;
      if (s.player.y >= GROUND) { s.player.y = GROUND; s.player.vy = 0; s.player.grounded = true; }

      // Spawn obstacles
      const spawnRate = Math.max(55, 90 - Math.floor(s.score / 200) * 5);
      if (s.frame % spawnRate === 0) {
        const h = 18 + Math.random() * 28;
        s.obstacles.push({ x: W + 10, y: GROUND + 36 - h, w: 16, h });
      }
      // Spawn collectibles
      if (s.frame % 110 === 0) {
        s.collectibles.push({ x: W + Math.random() * 40, y: GROUND - 18 - Math.random() * 45, r: 9, type: Math.random() > 0.35 ? 'coin' : 'scroll' });
      }

      // Update obstacles
      s.obstacles = s.obstacles.filter(o => {
        o.x -= s.speed;
        const pb = { x: s.player.x + 5, y: s.player.y + 4, w: s.player.w - 10, h: s.player.h - 4 };
        if (collision(pb, o)) { SFX.hit(); s.alive = false; return false; }
        return o.x > -30;
      });

      // Update collectibles
      s.collectibles = s.collectibles.filter(c => {
        c.x -= s.speed;
        const pb = { x: s.player.x, y: s.player.y, w: s.player.w, h: s.player.h };
        const cb = { x: c.x - c.r, y: c.y - c.r, w: c.r * 2, h: c.r * 2 };
        if (collision(pb, cb)) { SFX.coin(); s.coins++; return false; }
        return c.x > -20;
      });

      // ─── Draw ───────────────────────────────────────────────
      ctx.clearRect(0, 0, W, H);

      // Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
      skyGrad.addColorStop(0, '#1565C0');
      skyGrad.addColorStop(0.6, '#42A5F5');
      skyGrad.addColorStop(1, '#81C784');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      // Clouds
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      [[40, 22, 0.4], [130, 15, 0.3], [230, 28, 0.35]].forEach(([bx, by, sp]) => {
        const cx = ((bx - s.frame * sp * 0.5) % (W + 60) + W + 60) % (W + 60) - 10;
        ctx.beginPath(); ctx.ellipse(cx, by, 22, 11, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx - 13, by + 4, 14, 10, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx + 13, by + 4, 14, 10, 0, 0, Math.PI * 2); ctx.fill();
      });

      // Ground
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(0, GROUND + 36, W, H - GROUND - 36);
      ctx.fillStyle = '#795548';
      ctx.fillRect(0, GROUND + 36, W, 5);

      // Obstacles
      s.obstacles.forEach(o => {
        ctx.fillStyle = '#78909C';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(o.x, o.y, o.w, o.h, 4);
        else ctx.rect(o.x, o.y, o.w, o.h);
        ctx.fill();
        ctx.fillStyle = '#B0BEC5';
        ctx.fillRect(o.x + 3, o.y + 3, o.w - 6, 4);
      });

      // Collectibles
      s.collectibles.forEach(c => {
        if (c.type === 'coin') {
          ctx.fillStyle = '#FFD54F';
          ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#FF8A65';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🪙', c.x, c.y + 4);
        } else {
          ctx.fillStyle = '#A1887F';
          if (ctx.roundRect) ctx.roundRect(c.x - c.r, c.y - c.r, c.r * 2, c.r * 1.4, 3);
          else ctx.rect(c.x - c.r, c.y - c.r, c.r * 2, c.r * 1.4);
          ctx.fill();
          ctx.fillStyle = 'white';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('📜', c.x, c.y + 3);
        }
      });

      // Player
      const px = s.player.x, py = s.player.y;
      const legAnim = s.player.grounded ? Math.sin(s.frame * 0.3) * 4 : 0;
      // Legs
      ctx.fillStyle = '#1565C0';
      ctx.fillRect(px + 5, py + 22, 8, 14 + legAnim);
      ctx.fillRect(px + 15, py + 22, 8, 14 - legAnim);
      // Body
      ctx.fillStyle = '#FF8A65';
      if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(px + 2, py + 8, 24, 18, 5); ctx.fill(); }
      else ctx.fillRect(px + 2, py + 8, 24, 18);
      // Head
      ctx.fillStyle = '#FFCCBC';
      ctx.beginPath(); ctx.arc(px + 14, py + 5, 11, 0, Math.PI * 2); ctx.fill();
      // Eyes
      ctx.fillStyle = '#333';
      ctx.beginPath(); ctx.arc(px + 10, py + 4, 2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(px + 18, py + 4, 2, 0, Math.PI * 2); ctx.fill();
      // Smile
      ctx.strokeStyle = '#E53935'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(px + 14, py + 7, 4, 0, Math.PI); ctx.stroke();
      // Hat
      ctx.fillStyle = '#795548';
      ctx.fillRect(px + 4, py - 7, 20, 6);
      ctx.fillRect(px + 7, py - 13, 14, 8);

      // HUD
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(5, 5, 110, 24, 8); ctx.fill(); }
      else ctx.fillRect(5, 5, 110, 24);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 12px Fredoka One, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${Math.floor(s.score / 10)}m  🪙${s.coins}`, 11, 21);

      setScore(Math.floor(s.score / 10));
      setCoins(s.coins);

      if (!s.alive) {
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 22px Fredoka One, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Fim de Jogo!', W / 2, H / 2 - 10);
        ctx.font = '13px Fredoka One, sans-serif';
        ctx.fillText(`${Math.floor(s.score / 10)}m  ·  🪙${s.coins}`, W / 2, H / 2 + 12);
        setPhase('over');
        const dist = Math.floor(s.score / 10);
        if (dist > highScore && onHighScore) onHighScore(dist);
        cancelAnimationFrame(rafRef.current);
        return;
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('keydown', onKey); };
  }, [phase]);

  const wonCondition = score >= 50;

  return (
    <div className="h-full flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #311B92 0%, #1A237E 100%)' }}>

      <div className="px-4 pt-10 pb-3 flex items-center gap-3">
        <button onClick={() => { cancelAnimationFrame(rafRef.current); SFX.click(); onBack(); }}
          className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">←</button>
        <div className="flex-1">
          <h2 className="font-display text-xl text-white">🏃 Corrida Bíblica</h2>
          <p className="font-body text-white/50 text-xs">Recorde: {highScore}m</p>
        </div>
        {phase === 'playing' && (
          <div className="bg-white/15 px-3 py-1 rounded-full">
            <span className="font-body text-white text-sm">{score}m 🪙{coins}</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
        <canvas ref={canvasRef} width={W} height={H}
          className="rounded-2xl border-4 border-white/20 shadow-2xl"
          style={{ maxWidth: '100%' }}
        />

        {phase === 'idle' && (
          <button onClick={startGame}
            className="w-full max-w-xs py-4 rounded-2xl font-display text-xl text-white"
            style={{ background: 'linear-gradient(135deg, #FF8A65, #E64A19)', boxShadow: '0 6px 0 rgba(0,0,0,0.25)' }}>
            ▶ Começar!
          </button>
        )}

        {phase === 'playing' && (
          <button onTouchStart={jump} onClick={jump}
            className="w-full max-w-xs py-4 rounded-2xl font-display text-xl text-white select-none"
            style={{ background: 'linear-gradient(135deg, #1565C0, #0D47A1)', boxShadow: '0 6px 0 rgba(0,0,0,0.25)' }}>
            ⬆ Pular!
          </button>
        )}

        {phase === 'over' && (
          <div className="flex flex-col items-center gap-3 w-full max-w-xs">
            <p className="font-body text-white/70 text-center text-sm">
              Distância: <strong className="text-white">{score}m</strong> · Moedas: <strong className="text-yellow-300">{coins} 🪙</strong>
            </p>
            {wonCondition && (
              <button onClick={() => onComplete(score >= 100 ? 80 : 40, coins)}
                className="w-full py-4 rounded-2xl font-display text-xl text-white"
                style={{ background: 'linear-gradient(135deg, #FFD54F, #FF8A65)', boxShadow: '0 6px 0 rgba(0,0,0,0.25)' }}>
                🎉 Resgatar Prêmio! (+{score >= 100 ? 80 : 40} XP)
              </button>
            )}
            <button onClick={startGame}
              className="w-full py-3 rounded-2xl font-display text-lg text-white"
              style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)' }}>
              🔄 Tentar de novo
            </button>
            {!wonCondition && (
              <p className="font-body text-white/40 text-xs text-center">
                Corra pelo menos 50m para ganhar XP!
              </p>
            )}
          </div>
        )}

        {phase === 'idle' && (
          <p className="font-body text-white/40 text-xs text-center">
            Pressione Espaço ou toque em "Pular" para desviar dos obstáculos!
          </p>
        )}
      </div>
    </div>
  );
}