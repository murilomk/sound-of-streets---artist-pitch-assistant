
import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Loader2, 
  Youtube, 
  Instagram, 
  Smartphone, 
  Music, 
  Bell, 
  CheckCircle2, 
  Trash2,
  ChevronRight,
  Zap,
  Sparkles
} from 'lucide-react';
import { generateReleaseSchedule, ScheduleEvent, Language } from '../services/geminiService';

// Added lang prop to fix missing argument error on line 32
export const ReleasePlanner: React.FC<{ lang: Language }> = ({ lang }) => {
  const [loading, setLoading] = useState(false);
  const [trackTitle, setTrackTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [schedule, setSchedule] = useState<ScheduleEvent[]>([]);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackTitle || !releaseDate) return;
    setLoading(true);
    try {
      // Pass lang as third argument to generateReleaseSchedule
      const result = await generateReleaseSchedule(trackTitle, releaseDate, lang);
      setSchedule(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeEvent = (idx: number) => {
    setSchedule(schedule.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      {/* Configuration Form */}
      <div className="glass rounded-3xl p-6 md:p-8 border border-yellow-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Calendar size={120} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-yellow-500 p-2 rounded-lg">
              <Calendar className="text-black" size={20} />
            </div>
            <h3 className="text-xl font-bold text-white uppercase tracking-tight italic">Planejador Estratégico</h3>
          </div>

          <form onSubmit={handleCreatePlan} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nome da Track</label>
              <input 
                type="text" 
                placeholder="Ex: Vida de Neon" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-yellow-500 outline-none transition-all"
                value={trackTitle}
                onChange={e => setTrackTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Data do Lançamento</label>
              <input 
                type="date" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-yellow-500 outline-none transition-all"
                value={releaseDate}
                onChange={e => setReleaseDate(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="md:col-span-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-black py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
              {loading ? 'Sincronizando Calendário...' : 'Gerar Cronograma Automatizado'}
            </button>
          </form>
        </div>
      </div>

      {schedule.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-white font-bold uppercase text-xs tracking-[0.2em] flex items-center gap-2">
              <Bell size={14} className="text-yellow-500" /> Linha do Tempo de Divulgação
            </h4>
            <span className="text-[10px] text-gray-500 uppercase font-bold">{schedule.length} Eventos Agendados</span>
          </div>

          <div className="space-y-3">
            {schedule.map((event, idx) => (
              <ScheduleItem 
                key={idx} 
                event={event} 
                onRemove={() => removeEvent(idx)}
              />
            ))}
          </div>

          {/* Sync Button Simulation */}
          <div className="pt-6">
            <button className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white p-4 rounded-2xl flex items-center justify-center gap-3 transition-all group">
              <Smartphone size={20} className="text-gray-400 group-hover:text-yellow-500" />
              <span className="text-sm font-bold uppercase tracking-widest">Sincronizar Lembretes no Celular</span>
            </button>
          </div>
        </div>
      )}

      {!schedule.length && !loading && (
        <div className="flex flex-col items-center justify-center py-20 opacity-20 border-2 border-dashed border-white/5 rounded-3xl">
          <Calendar size={48} className="text-gray-500 mb-4" />
          <p className="text-gray-500 font-medium">Nenhum lançamento planejado ainda.</p>
        </div>
      )}
    </div>
  );
};

const ScheduleItem: React.FC<{ event: ScheduleEvent, onRemove: () => void }> = ({ event, onRemove }) => {
  const getIcon = () => {
    switch (event.platform) {
      case 'YouTube': return <Youtube className="text-red-500" />;
      case 'Instagram': return <Instagram className="text-pink-500" />;
      case 'TikTok': return <Smartphone className="text-cyan-400" />;
      case 'Spotify': return <Music className="text-green-500" />;
      default: return <Zap className="text-yellow-500" />;
    }
  };

  return (
    <div className="glass rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row gap-4 group">
      <div className="flex items-start gap-4 flex-1">
        <div className="bg-black/40 p-3 rounded-xl flex flex-col items-center justify-center min-w-[70px] border border-white/5">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Post em</span>
          <span className="text-sm font-bold text-yellow-500">{event.day.split('-').reverse().slice(0, 2).join('/')}</span>
        </div>
        
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            {getIcon()}
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{event.platform}</span>
          </div>
          <h5 className="font-bold text-white text-sm">{event.action}</h5>
          <p className="text-xs text-gray-400 leading-relaxed italic">"{event.contentIdea}"</p>
        </div>
      </div>

      <div className="flex items-center justify-between md:flex-col md:justify-center md:items-end gap-2 border-t md:border-t-0 md:border-l border-white/5 pt-3 md:pt-0 md:pl-6">
        <div className="flex items-center gap-2 text-yellow-500/80">
          <Clock size={14} />
          <span className="text-xs font-brand tracking-wider">{event.recommendedTime}</span>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-black transition-all">
            <CheckCircle2 size={16} />
          </button>
          <button 
            onClick={onRemove}
            className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-black transition-all opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
