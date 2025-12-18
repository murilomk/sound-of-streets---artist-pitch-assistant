
import React, { useState } from 'react';
import { Target, Zap, Users, Youtube, Award, Sparkles, Loader2, BarChart3 } from 'lucide-react';
import { analyzeVibe, Language } from '../services/geminiService';

const translations = {
  pt: {
    vibeTitle: "Simulador de 'Vibe Check' IA",
    vibeDesc: "Descreva sua track (instrumental, letra, mood) e a IA dirá qual a chance de ser aceita no <strong>Sound of Streets</strong>.",
    textareaPlaceholder: "Ex: É um trap melódico com violão, vibe dark mas relaxante...",
    btnCheck: "Verificar Fit com o Canal",
    btnLoading: "Analisando...",
    scoreLabel: "Street Fit Score",
    stratTitle: "Análise Estratégica",
    stratDesc: "O que você precisa saber antes de mandar sua track.",
    actionTitle: "💡 Plano de Ação para @soundofstreets-v1p:",
    actionItems: [
      "Assista aos últimos 5 vídeos. Sua música soaria bem entre eles?",
      "Verifique os links nas descrições para formulários.",
      "Tenha uma artwork em alta resolução.",
      "Se não responderem em 10 dias, envie um follow-up."
    ],
    stratCards: [
      { title: "Estética", desc: "Uso de visuais noturnos e luzes neon." },
      { title: "Público", desc: "Focado em jovens que buscam novos talentos." },
      { title: "Qualidade", desc: "Mix e master devem estar profissionais." },
      { title: "Exclusividade", desc: "Mencionar premiere ajuda na aceitação." }
    ]
  },
  en: {
    vibeTitle: "AI 'Vibe Check' Simulator",
    vibeDesc: "Describe your track (instrumental, lyrics, mood) and the AI will estimate your chance of acceptance on <strong>Sound of Streets</strong>.",
    textareaPlaceholder: "Ex: It's a melodic trap with guitar, dark yet relaxing vibe...",
    btnCheck: "Check Channel Fit",
    btnLoading: "Analyzing...",
    scoreLabel: "Street Fit Score",
    stratTitle: "Strategic Analysis",
    stratDesc: "What you need to know before submitting your track.",
    actionTitle: "💡 Action Plan for @soundofstreets-v1p:",
    actionItems: [
      "Watch the last 5 videos. Does your music fit between them?",
      "Check description links for submission forms.",
      "Have high-resolution artwork ready.",
      "If no reply in 10 days, send a polite follow-up."
    ],
    stratCards: [
      { title: "Aesthetics", desc: "Heavy use of night street visuals and neon lights." },
      { title: "Audience", desc: "Focused on youth looking for new talent." },
      { title: "Quality", desc: "Mix and master must be professional level." },
      { title: "Exclusivity", desc: "Mentioning a premiere helps acceptance." }
    ]
  }
};

export const ChannelAnalyzer: React.FC<{ lang: Language }> = ({ lang }) => {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<{ score: number; feedback: string } | null>(null);

  const t = translations[lang];

  const handleVibeCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setLoading(true);
    try {
      const result = await analyzeVibe(description, lang);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-6 md:p-8 border border-yellow-500/20 bg-yellow-500/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-yellow-500 p-2 rounded-lg"><Sparkles className="text-black" size={20} /></div>
          <h3 className="text-xl font-bold text-white uppercase italic tracking-tight">{t.vibeTitle}</h3>
        </div>
        <p className="text-gray-400 text-sm mb-4" dangerouslySetInnerHTML={{ __html: t.vibeDesc }} />
        <form onSubmit={handleVibeCheck} className="space-y-4">
          <textarea className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white min-h-[100px]" placeholder={t.textareaPlaceholder} value={description} onChange={(e) => setDescription(e.target.value)} />
          <button type="submit" disabled={loading || !description} className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <BarChart3 size={20} />}
            {loading ? t.btnLoading : t.btnCheck}
          </button>
        </form>

        {analysisResult && (
          <div className="mt-6 p-6 bg-black/60 rounded-2xl border border-white/5 animate-in fade-in">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.scoreLabel}</span>
              <span className={`text-2xl font-brand ${analysisResult.score >= 70 ? 'text-green-500' : 'text-yellow-500'}`}>{analysisResult.score}/100</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full mb-4 overflow-hidden">
              <div className={`h-full transition-all duration-1000 ${analysisResult.score >= 70 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${analysisResult.score}%` }} />
            </div>
            <div className="text-gray-300 text-sm italic leading-relaxed">{analysisResult.feedback}</div>
          </div>
        )}
      </div>

      <div className="glass rounded-3xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-500/20 p-3 rounded-xl"><Target className="text-blue-500" size={24} /></div>
          <div>
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">{t.stratTitle}</h3>
            <p className="text-gray-400 text-sm">{t.stratDesc}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.stratCards.map((card, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors">
              <h5 className="font-bold text-white text-sm uppercase mb-2">{card.title}</h5>
              <p className="text-gray-400 text-xs">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-500/20 to-transparent border-l-4 border-yellow-500 p-6 rounded-r-3xl">
        <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wider italic">{t.actionTitle}</h4>
        <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm">
          {t.actionItems.map((item, i) => <li key={i}>{item}</li>)}
        </ol>
      </div>
    </div>
  );
};
