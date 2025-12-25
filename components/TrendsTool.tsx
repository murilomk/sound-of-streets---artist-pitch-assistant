
import React, { useState, useEffect } from 'react';
import { Flame, TrendingUp, Hash, Clock, Sparkles, Loader2, RefreshCw, Zap, Youtube, Instagram, Smartphone, ChevronRight } from 'lucide-react';
import { getMusicTrends, ContentTrend, Language } from '../services/geminiService';

const translations = {
  pt: {
    title: "Trends & Insights Digitais",
    loading: "Escaneando tendências globais...",
    ritmos: "Tópicos em Alta",
    tempos: "Melhores Horários",
    hashtags: "Hashtags Virais",
    sugestoes: "Sugestões de Conteúdo Diário",
    dica: "Dica Estratégica IA"
  },
  en: {
    title: "Digital Trends & Insights",
    loading: "Scanning global trends...",
    ritmos: "Trending Topics",
    tempos: "Best Posting Times",
    hashtags: "Viral Hashtags",
    sugestoes: "Daily Content Suggestions",
    dica: "AI Strategic Tip"
  }
};

export const TrendsTool: React.FC<{ lang: Language }> = ({ lang }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trends, setTrends] = useState<ContentTrend | null>(null);

  const t = translations[lang];

  const fetchTrends = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMusicTrends(lang);
      setTrends(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao carregar tendências');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();

    // Auto-refresh every 10 minutes
    const interval = setInterval(() => {
      fetchTrends();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [lang]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-500 p-2 rounded-lg"><Flame className="text-black" size={20} /></div>
          <h3 className="text-xl font-bold text-white uppercase italic tracking-tight">{t.title}</h3>
        </div>
        <button onClick={fetchTrends} disabled={loading} className="p-2 bg-white/5 hover:bg-white/10 rounded-full">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm italic">
          ⚠️ {error.includes('401') || error.includes('API KEY') ? 'Chave de API inválida no Vercel.' : error}
        </div>
      )}

      {!trends && loading ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-50 space-y-4">
          <Loader2 className="animate-spin text-yellow-500" size={48} />
          <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">{t.loading}</p>
        </div>
      ) : trends && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
          <div className="lg:col-span-4 space-y-6">
            <div className="glass rounded-3xl p-6 border border-white/5">
              <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <TrendingUp size={16} className="text-yellow-500" /> {t.ritmos}
              </h4>
              <div className="space-y-5">
                {trends.trendingTopics.map((g, idx) => (
                  <div key={idx} className="group">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-bold text-gray-300">{g.name}</span>
                      <span className="text-[10px] font-black text-yellow-500">+{g.growth}</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full"><div className="bg-yellow-500 h-full rounded-full" style={{ width: g.growth }} /></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-6 border border-white/5 bg-gradient-to-br from-blue-500/5 to-transparent">
              <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Clock size={16} className="text-blue-500" /> {t.tempos}
              </h4>
              <div className="space-y-4">
                {trends.bestPostingTimes.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{item.platform}</span>
                    <span className="text-sm font-brand text-white tracking-widest">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="glass rounded-3xl p-6 border border-white/5">
              <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Hash size={16} className="text-yellow-500" /> {t.hashtags}
              </h4>
              <div className="flex flex-wrap gap-2">
                {trends.trendingHashtags.map((tag, idx) => <span key={idx} className="bg-white/5 px-4 py-2 rounded-full text-xs text-gray-400">{tag}</span>)}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                <Sparkles size={16} className="text-yellow-500" /> {t.sugestoes}
              </h4>
              {trends.dailyContentSuggestions.map((s, idx) => (
                <div key={idx} className="glass rounded-3xl p-6 border border-yellow-500/10 hover:border-yellow-500/30 transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="bg-yellow-500/10 p-3 rounded-2xl"><Zap size={20} className="text-yellow-500" /></div>
                    <div className="flex-1">
                      <h5 className="text-white font-bold text-base mb-1">{s.title}</h5>
                      <p className="text-sm text-gray-400 italic leading-relaxed">"{s.idea}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-500/20 to-transparent border-l-4 border-blue-500 p-6 rounded-r-3xl">
              <h6 className="text-white font-bold text-xs uppercase tracking-widest mb-2">{t.dica}</h6>
              <p className="text-xs text-gray-400 leading-relaxed italic">Insights baseados em padrões de algoritmos e comportamento de audiência atual.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
