
import React, { useState } from 'react';
import { Target, Zap, Users, Youtube, Award, Sparkles, Loader2, BarChart3 } from 'lucide-react';
import { analyzeVibe, Language } from '../services/geminiService';

const translations = {
  pt: {
    vibeTitle: "Simulador de Qualidade IA",
    vibeDesc: "Descreva seu conteúdo (tema, estilo, público-alvo) e a IA analisará o potencial de engajamento e qualidade.",
    textareaPlaceholder: "Ex: É um canal de receitas rápidas para estudantes, focado em simplicidade e economia...",
    btnCheck: "Analisar Perfil de Conteúdo",
    btnLoading: "Analisando...",
    scoreLabel: "Content Quality Score",
    stratTitle: "Análise Estratégica",
    stratDesc: "O que você precisa saber para otimizar seu conteúdo.",
    actionTitle: "💡 Plano de Ação Estratégico:",
    actionItems: [
      "Analise os vídeos de maior sucesso do seu nicho nos últimos 30 dias.",
      "Otimize seu título e thumbnail para maximizar o CTR.",
      "Mantenha uma consistência visual em todo o perfil.",
      "Interaja com a audiência nos comentários na primeira hora do post."
    ],
    stratCards: [
      { title: "Estética", desc: "Identidade visual coerente com o nicho escolhido." },
      { title: "Público", desc: "Definição clara da persona que consome seu conteúdo." },
      { title: "Qualidade", desc: "Áudio e vídeo devem ter clareza e boa edição." },
      { title: "Retenção", desc: "Ganchos fortes nos primeiros 3-5 segundos." }
    ]
  },
  en: {
    vibeTitle: "AI Quality Simulator",
    vibeDesc: "Describe your content (topic, style, target audience) and the AI will analyze engagement potential and quality.",
    textareaPlaceholder: "Ex: It's a quick recipe channel for students, focused on simplicity and savings...",
    btnCheck: "Analyze Content Profile",
    btnLoading: "Analyzing...",
    scoreLabel: "Content Quality Score",
    stratTitle: "Strategic Analysis",
    stratDesc: "What you need to know to optimize your content.",
    actionTitle: "💡 Strategic Action Plan:",
    actionItems: [
      "Analyze the most successful videos in your niche over the last 30 days.",
      "Optimize your title and thumbnail to maximize CTR.",
      "Maintain a consistent visual identity across the profile.",
      "Interact with the audience in comments within the first hour of posting."
    ],
    stratCards: [
      { title: "Aesthetics", desc: "Visual identity consistent with the chosen niche." },
      { title: "Audience", desc: "Clear definition of the persona consuming your content." },
      { title: "Quality", desc: "Audio and video must have clarity and good editing." },
      { title: "Retention", desc: "Strong hooks in the first 3-5 seconds." }
    ]
  }
};

export const ChannelAnalyzer: React.FC<{ lang: Language }> = ({ lang }) => {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{ score: number; feedback: string } | null>(null);

  const t = translations[lang];

  const handleVibeCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeVibe(description, lang);
      setAnalysisResult(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro na análise de IA');
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

        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm italic">
            ⚠️ {error.includes('401') || error.includes('API KEY') ? 'Chave de API inválida no Vercel.' : error}
          </div>
        )}

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
