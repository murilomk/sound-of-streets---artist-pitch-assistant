
import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Globe,
  Clock,
  Zap,
  Loader2,
  Bell,
  ArrowUpRight,
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  Play
} from 'lucide-react';
import { generateAudienceInsights, AudienceData, Language } from '../services/geminiService';

// Added lang prop to fix missing argument error on line 32
export const AudienceInsights: React.FC<{ lang: Language }> = ({ lang }) => {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState('');
  const [contentTitle, setContentTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<AudienceData | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link || !contentTitle) return;
    setLoading(true);
    setError(null);
    try {
      // Pass lang as third argument to generateAudienceInsights
      const result = await generateAudienceInsights(link, contentTitle, lang);
      setInsights(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao analisar audiência');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="glass rounded-3xl p-6 border border-yellow-500/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-yellow-500 p-2 rounded-lg">
            <BarChart3 className="text-black" size={20} />
          </div>
          <h3 className="text-xl font-bold text-white uppercase tracking-tight italic">Analisador de Audiência IA</h3>
        </div>

        <form onSubmit={handleAnalyze} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Título do Conteúdo"
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none transition-all"
            value={contentTitle}
            onChange={e => setContentTitle(e.target.value)}
            required
          />
          <input
            type="url"
            placeholder="Link do Conteúdo (YouTube/Post/Etc)"
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none transition-all"
            value={link}
            onChange={e => setLink(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-black py-4 rounded-xl font-bold uppercase flex items-center justify-center gap-2 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Play size={20} />}
            {loading ? 'Sincronizando Dados IA...' : 'Analisar Performance & Público'}
          </button>
        </form>

        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm italic">
            ⚠️ {error.includes('401') || error.includes('API KEY') ? 'Chave de API inválida no Vercel.' : error}
          </div>
        )}
      </div>

      {insights && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard icon={<TrendingUp className="text-green-500" />} label="Crescimento Diário" value="+12.4%" color="green" />
            <StatCard icon={<Heart className="text-red-500" />} label="Engagement Rate" value="8.7%" color="red" />
            <StatCard icon={<Users className="text-blue-500" />} label="Retenção Média" value="64%" color="blue" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Charts Simulation Section */}
            <div className="glass rounded-3xl p-6 border border-white/5">
              <h4 className="text-white font-bold mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
                <Globe size={16} className="text-yellow-500" /> Distribuição por Região
              </h4>
              <div className="space-y-4">
                <RegionProgress region={insights.bestRegion} percentage={45} />
                <RegionProgress region="Crescimento Orgânico" percentage={28} />
                <RegionProgress region="Busca Direta" percentage={15} />
                <RegionProgress region="Explorar / Viral" percentage={12} />
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="text-gray-500" size={16} />
                  <span className="text-xs text-gray-400 uppercase tracking-widest">Horário de Pico:</span>
                </div>
                <span className="text-yellow-500 font-bold font-brand text-xl">{insights.peakHour}</span>
              </div>
            </div>

            {/* Smart Alerts Section */}
            <div className="space-y-4">
              <h4 className="text-white font-bold mb-2 flex items-center gap-2 uppercase text-xs tracking-widest px-2">
                <Bell size={16} className="text-yellow-500" /> Alertas Inteligentes
              </h4>
              {insights.alerts?.map((alert, idx) => (
                <AlertItem key={idx} alert={alert} />
              ))}
            </div>
          </div>

          {/* Engagement Tips */}
          <div className="glass rounded-3xl p-6 bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2 uppercase text-xs tracking-widest">
              <Sparkles size={16} className="text-blue-500" /> Recomendações de Engajamento
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.engagementTips?.map((tip, idx) => (
                <div key={idx} className="bg-black/30 p-4 rounded-2xl border border-white/5 text-xs text-gray-300 leading-relaxed italic">
                  "{tip}"
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Placeholder for no insights */}
      {!insights && !loading && (
        <div className="flex flex-col items-center justify-center py-20 opacity-30">
          <Zap size={48} className="text-gray-500 mb-4" />
          <p className="text-gray-500 font-medium">Aguardando dados para análise...</p>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, color: string }> = ({ icon, label, value, color }) => (
  <div className="glass rounded-2xl p-5 border border-white/5 hover:border-white/20 transition-all">
    <div className="flex items-center justify-between mb-2">
      <span className="p-2 bg-white/5 rounded-lg">{icon}</span>
      <ArrowUpRight size={16} className="text-gray-600" />
    </div>
    <h5 className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">{label}</h5>
    <p className="text-2xl font-brand text-white">{value}</p>
  </div>
);

const RegionProgress: React.FC<{ region: string, percentage: number }> = ({ region, percentage }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
      <span className="text-gray-400">{region}</span>
      <span className="text-yellow-500">{percentage}%</span>
    </div>
    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
      <div
        className="bg-yellow-500 h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

const AlertItem: React.FC<{ alert: any }> = ({ alert }) => {
  const getIcon = () => {
    switch (alert.type) {
      case 'viral': return <Zap className="text-yellow-500" />;
      case 'timing': return <Clock className="text-blue-500" />;
      default: return <TrendingUp className="text-green-500" />;
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex gap-4 hover:bg-white/10 transition-colors">
      <div className="mt-1">{getIcon()}</div>
      <div>
        <h5 className="font-bold text-sm text-white">{alert.title}</h5>
        <p className="text-xs text-gray-400 leading-relaxed mt-1">{alert.message}</p>
      </div>
    </div>
  );
};
