import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { SFX } from '@/lib/audioEngine';
import { BIBLE_SECTIONS } from '@/data/bibleBooks';
import StudyPlanView from '@/components/study/StudyPlanView';

const CACHE_KEY = 'mundi_study_plans';

function getCachedPlan(book) {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    return cache[book] || null;
  } catch { return null; }
}

function cachePlan(book, plan) {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    cache[book] = plan;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch { /* storage full — ignore */ }
}

export default function StudyScreen() {
  const [openSection, setOpenSection] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSelectBook = async (book, color) => {
    SFX.click();
    setSelectedBook({ name: book, color });
    setError(null);

    const cached = getCachedPlan(book);
    if (cached) { setPlan(cached); return; }

    setPlan(null);
    setLoading(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Crie um plano de estudos do livro bíblico de "${book}" para um público JUVENIL (10 a 15 anos), em português do Brasil. Use linguagem jovem, leve e empolgante, mas fiel à Bíblia. O plano deve ter de 5 a 7 dias de estudo. Para cada dia inclua: título criativo do dia, trecho bíblico para ler (capítulos/versículos), um resumo curto e empolgante do que o trecho conta, uma "lição pra vida" prática para um adolescente, e uma pergunta para refletir. Inclua também uma introdução curta sobre o livro (quem escreveu, quando, e por que é incrível) e um versículo-chave do livro.`,
        response_json_schema: {
          type: 'object',
          properties: {
            intro: { type: 'string' },
            author_context: { type: 'string' },
            key_verse: { type: 'string' },
            days: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  reading: { type: 'string' },
                  summary: { type: 'string' },
                  life_lesson: { type: 'string' },
                  reflection_question: { type: 'string' },
                },
              },
            },
          },
        },
      });
      cachePlan(book, result);
      setPlan(result);
    } catch {
      setError('Não foi possível carregar o plano. Verifique sua conexão e tente de novo!');
    } finally {
      setLoading(false);
    }
  };

  // ── Detail view ──
  if (selectedBook) {
    return (
      <StudyPlanView
        book={selectedBook}
        plan={plan}
        loading={loading}
        error={error}
        onRetry={() => handleSelectBook(selectedBook.name, selectedBook.color)}
        onBack={() => { SFX.click(); setSelectedBook(null); setPlan(null); setError(null); }}
      />
    );
  }

  // ── Book list ──
  return (
    <div className="h-full overflow-y-auto"
      style={{ background: 'linear-gradient(180deg, #1A237E 0%, #283593 50%, #4527A0 100%)' }}>
      <div className="px-4 pt-10 pb-5">
        <h1 className="font-display text-3xl text-white drop-shadow">📖 Plano de Estudos</h1>
        <p className="font-body text-white/70 text-sm mt-1">Escolha um livro da Bíblia e estude por alguns dias!</p>
      </div>

      <div className="px-4 pb-32 space-y-3">
        {BIBLE_SECTIONS.map(section => {
          const open = openSection === section.id;
          return (
            <div key={section.id} className="rounded-3xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${section.color}33, ${section.color}15)`,
                border: `3px solid ${section.color}66`,
              }}>
              <button onClick={() => { SFX.click(); setOpenSection(open ? null : section.id); }}
                className="w-full flex items-center gap-3 p-4 text-left">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${section.color}44`, border: `2px solid ${section.color}66` }}>
                  {section.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-white text-lg">{section.name}</h3>
                  <p className="font-body text-white/50 text-xs">{section.books.length} livros</p>
                </div>
                <span className="text-white/60 text-lg transition-transform"
                  style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden">
                    <div className="px-4 pb-4 grid grid-cols-2 gap-2">
                      {section.books.map(book => (
                        <button key={book}
                          onClick={() => handleSelectBook(book, section.color)}
                          className="py-3 px-3 rounded-xl font-body text-white text-sm text-left transition-all hover:scale-[1.03] active:scale-[0.97]"
                          style={{
                            background: 'rgba(255,255,255,0.12)',
                            border: '2px solid rgba(255,255,255,0.18)',
                          }}>
                          📕 {book}
                          {getCachedPlan(book) && <span className="ml-1 text-green-300 text-xs">✓</span>}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        <div className="mt-4 bg-white/10 rounded-2xl p-4 border border-white/15 text-center">
          <p className="font-body text-white/60 text-sm">
            💡 O plano é criado na hora e fica <strong className="text-green-300">salvo no aparelho</strong> para você estudar quando quiser!
          </p>
        </div>
      </div>
    </div>
  );
}