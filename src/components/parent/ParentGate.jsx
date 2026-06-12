import { useState } from 'react';
import { SFX } from '@/lib/audioEngine';

export default function ParentGate({ onPass, onCancel }) {
  const [challenge] = useState(() => {
    const a = 3 + Math.floor(Math.random() * 7);
    const b = 4 + Math.floor(Math.random() * 6);
    return { a, b, ans: a * b };
  });
  const [value, setValue] = useState('');
  const [wrong, setWrong] = useState(false);

  const check = () => {
    SFX.click();
    if (parseInt(value, 10) === challenge.ans) onPass();
    else { setWrong(true); setValue(''); }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center px-8"
      style={{ height: '100dvh', background: 'linear-gradient(180deg, #263238, #37474F)' }}>
      <div className="text-6xl mb-4">🔐</div>
      <h2 className="font-display text-2xl text-white mb-2">Área dos Pais</h2>
      <p className="font-body text-white/60 text-sm mb-6">Para entrar, resolva: quanto é <strong className="text-yellow-300">{challenge.a} × {challenge.b}</strong>?</p>
      <input type="number" value={value} onChange={e => { setValue(e.target.value); setWrong(false); }}
        onKeyDown={e => e.key === 'Enter' && check()}
        className="w-32 text-center rounded-2xl px-4 py-3 font-display text-2xl bg-white/90 text-gray-800 outline-none border-4 border-white/40 focus:border-yellow-400"
        placeholder="?" />
      {wrong && <p className="font-body text-red-300 text-sm mt-2">Ops, tente novamente!</p>}
      <button onClick={check}
        className="mt-5 w-full max-w-xs py-3 rounded-2xl font-display text-lg text-gray-900 bg-yellow-400"
        style={{ boxShadow: '0 4px 0 rgba(0,0,0,0.3)' }}>
        Entrar
      </button>
      <button onClick={() => { SFX.click(); onCancel(); }} className="mt-4 font-body text-white/50 text-sm">← Voltar</button>
    </div>
  );
}