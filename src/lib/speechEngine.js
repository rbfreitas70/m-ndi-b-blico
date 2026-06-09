// Web Speech API — Portuguese narration for kids

let enabled = true;

export function setNarrationEnabled(val) {
  enabled = val;
}

export function isNarrationEnabled() {
  return enabled;
}

export function speak(text, opts = {}) {
  if (!enabled || !window.speechSynthesis) return;
  const { rate = 0.88, pitch = 1.25, volume = 1 } = opts;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'pt-BR';
  utter.rate = rate;
  utter.pitch = pitch;
  utter.volume = volume;

  const voices = window.speechSynthesis.getVoices();
  const ptVoice =
    voices.find(v => v.lang.startsWith('pt') && v.name.toLowerCase().includes('google')) ||
    voices.find(v => v.lang.startsWith('pt-BR')) ||
    voices.find(v => v.lang.startsWith('pt'));
  if (ptVoice) utter.voice = ptVoice;

  window.speechSynthesis.speak(utter);
}

export function stop() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

export function speakEli(text) {
  speak(text, { rate: 0.82, pitch: 1.4 });
}

export function speakStory(text) {
  speak(text, { rate: 0.85, pitch: 1.2 });
}