// Web Audio API Engine — all sounds generated synthetically (no files needed)

let ctx = null;
let masterGain = null;
let bgLoopTimeout = null;
let bgEnabled = false;

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.55;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function playTone(freq, type = 'sine', duration = 0.15, volume = 0.4, delay = 0, startFade = false) {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(masterGain);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime + delay);
    gain.gain.setValueAtTime(volume, c.currentTime + delay);
    if (startFade) gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);
    osc.start(c.currentTime + delay);
    osc.stop(c.currentTime + delay + duration);
  } catch {}
}

function playArpeggio(notes, type = 'sine', duration = 0.12, vol = 0.35, interval = 0.1) {
  notes.forEach((f, i) => playTone(f, type, duration, vol, i * interval, true));
}

// ─── SFX ───────────────────────────────────────────────────────────────────
export const SFX = {
  click() {
    playTone(880, 'sine', 0.07, 0.3, 0, true);
  },
  flip() {
    playTone(660, 'triangle', 0.1, 0.25, 0, true);
    playTone(880, 'triangle', 0.1, 0.2, 0.05, true);
  },
  match() {
    playArpeggio([523, 659, 784], 'sine', 0.15, 0.3, 0.08);
  },
  coin() {
    playArpeggio([784, 1047, 1319], 'sine', 0.1, 0.3, 0.06);
  },
  error() {
    playTone(220, 'sawtooth', 0.2, 0.3, 0, true);
    playTone(196, 'sawtooth', 0.2, 0.2, 0.1, true);
  },
  victory() {
    const melody = [523, 659, 784, 1047, 784, 1047, 1319];
    melody.forEach((f, i) => playTone(f, 'sine', 0.18, 0.35, i * 0.09, true));
  },
  pageFlip() {
    playTone(440, 'triangle', 0.08, 0.2, 0, true);
    playTone(550, 'triangle', 0.08, 0.15, 0.04, true);
  },
  unlock() {
    playArpeggio([262, 330, 392, 523, 659, 784, 1047], 'sine', 0.12, 0.3, 0.07);
  },
  jump() {
    playTone(440, 'square', 0.05, 0.2, 0, true);
    playTone(660, 'square', 0.08, 0.2, 0.05, true);
    playTone(880, 'square', 0.06, 0.15, 0.1, true);
  },
  hit() {
    playTone(150, 'sawtooth', 0.15, 0.4, 0, true);
  },
};

// ─── Background Music ───────────────────────────────────────────────────────
const BG_MELODY = [
  [392, 0.25], [392, 0.25], [440, 0.25], [392, 0.25],
  [523, 0.5],  [494, 0.5],
  [392, 0.25], [392, 0.25], [440, 0.25], [392, 0.25],
  [587, 0.5],  [523, 0.5],
  [392, 0.25], [392, 0.25], [784, 0.25], [659, 0.25],
  [523, 0.25], [494, 0.25], [440, 0.5],
  [698, 0.25], [698, 0.25], [659, 0.25], [523, 0.25],
  [587, 0.5],  [523, 1.0],
];

function scheduleMelody() {
  if (!bgEnabled) return;
  try {
    const c = getCtx();
    let t = c.currentTime + 0.1;
    const tempo = 0.38;
    BG_MELODY.forEach(([freq, beats]) => {
      const dur = beats * tempo;
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.connect(g);
      g.connect(masterGain);
      osc.type = 'triangle';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.12, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.85);
      osc.start(t);
      osc.stop(t + dur);
      t += dur;
    });
    const totalDur = BG_MELODY.reduce((s, [, b]) => s + b * tempo, 0) * 1000;
    bgLoopTimeout = setTimeout(scheduleMelody, totalDur + 200);
  } catch {}
}

export function startBgMusic() {
  if (bgEnabled) return;
  bgEnabled = true;
  scheduleMelody();
}

export function stopBgMusic() {
  bgEnabled = false;
  clearTimeout(bgLoopTimeout);
}

export function isBgMusicPlaying() {
  return bgEnabled;
}

export function setMasterVolume(v) {
  if (masterGain) masterGain.gain.value = v;
}