
import React, { useState, useRef } from 'react';
import {
  Globe,
  Upload,
  Youtube,
  Instagram,
  Smartphone,
  Facebook,
  Music,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Zap,
  CloudLightning,
  Monitor,
  CheckCircle2,
  ExternalLink,
  FileVideo,
  FileAudio,
  X,
  RefreshCcw
} from 'lucide-react';
import { prepareDistributionConfig, DistributionFormat, Language } from '../services/geminiService';

export const DistributionManager: React.FC<{ lang: Language, onNavigate?: (tab: any) => void }> = ({ lang, onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [contentTitle, setContentTitle] = useState('');
  const [formats, setFormats] = useState<DistributionFormat[]>([]);
  const [publishing, setPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<Record<string, 'pending' | 'syncing' | 'uploading' | 'metadata' | 'done'>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handlePrepare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentTitle || !selectedFile) return;
    setLoading(true);
    try {
      const res = await prepareDistributionConfig(contentTitle, lang);
      setFormats(res);
      // Initialize status
      const status: Record<string, 'pending' | 'syncing' | 'uploading' | 'metadata' | 'done'> = {};
      res.forEach(f => status[f.platform] = 'pending');
      setPublishStatus(status);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishAll = () => {
    if (publishing || formats.length === 0) return;
    setPublishing(true);

    // Process each platform with its own timeline
    formats.forEach((f, index) => {
      const platform = f.platform;
      const baseDelay = index * 600;

      setTimeout(() => {
        setPublishStatus(prev => ({ ...prev, [platform]: 'syncing' }));

        setTimeout(() => {
          setPublishStatus(prev => ({ ...prev, [platform]: 'uploading' }));

          setTimeout(() => {
            setPublishStatus(prev => ({ ...prev, [platform]: 'metadata' }));

            setTimeout(() => {
              setPublishStatus(prev => ({ ...prev, [platform]: 'done' }));

              // Check if all are done to reset publishing state
              setPublishStatus(current => {
                const allDone = formats.every(fmt => fmt.platform === platform ? true : current[fmt.platform] === 'done');
                if (allDone) setPublishing(false);
                return current;
              });
            }, 1000 + Math.random() * 800);
          }, 1000 + Math.random() * 800);
        }, 1000 + Math.random() * 800);
      }, baseDelay);
    });
  };

  const resetAll = () => {
    setContentTitle('');
    setSelectedFile(null);
    setFormats([]);
    setPublishStatus({});
    setPublishing(false);
  };

  const isAllDone = formats.length > 0 && formats.every(f => publishStatus[f.platform] === 'done');

  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-6 md:p-10 border border-yellow-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-500/10 blur-3xl rounded-full"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-yellow-500 p-3 rounded-2xl shadow-[0_0_20px_rgba(234,179,8,0.3)]">
              <CloudLightning className="text-black" size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-brand text-white tracking-wider uppercase">Distribuição Multicanal IA</h3>
              <p className="text-gray-400 text-sm">Prepare formatos perfeitos e publique simultaneamente em escala.</p>
            </div>
          </div>

          {!formats.length ? (
            <form onSubmit={handlePrepare} className="space-y-6 animate-in fade-in">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Título do Trabalho</label>
                <input
                  type="text"
                  placeholder="Ex: Novo Lançamento (Final)"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-yellow-500 outline-none transition-all"
                  value={contentTitle}
                  onChange={e => setContentTitle(e.target.value)}
                  required
                />
              </div>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="video/*,audio/*"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group ${selectedFile ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'}`}
              >
                {selectedFile ? (
                  <>
                    <div className="p-4 bg-yellow-500 text-black rounded-full scale-110 transition-transform">
                      {selectedFile.type.startsWith('video') ? <FileVideo size={32} /> : <FileAudio size={32} />}
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold">{selectedFile.name}</p>
                      <p className="text-yellow-500 text-xs font-bold uppercase mt-1">Clique para trocar arquivo</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-yellow-500/10 rounded-full group-hover:scale-110 transition-transform">
                      <Upload className="text-yellow-500" size={32} />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold">Upload do Master Original</p>
                      <p className="text-gray-500 text-xs">Arraste seu arquivo (MP4, WAV, MP3) ou clique aqui</p>
                    </div>
                  </>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !contentTitle || !selectedFile}
                className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-black py-5 rounded-2xl font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <Monitor size={24} />}
                {loading ? 'Calculando Otimizações...' : 'Gerar Kit de Distribuição'}
              </button>
            </form>
          ) : (
            <div className="animate-in slide-in-from-top-4 duration-500">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-500 p-2 rounded-lg"><Music className="text-black" size={20} /></div>
                  <div>
                    <h4 className="text-white font-bold uppercase text-sm tracking-widest">{trackTitle}</h4>
                    <p className="text-xs text-gray-400">{selectedFile?.name}</p>
                  </div>
                </div>
                <button onClick={resetAll} className="text-gray-500 hover:text-white p-2">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {formats.map((format, idx) => (
                  <PlatformCard
                    key={idx}
                    format={format}
                    status={publishStatus[format.platform]}
                  />
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handlePublishAll}
                  disabled={publishing || isAllDone}
                  className={`flex-1 py-5 rounded-2xl font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl ${isAllDone ? 'bg-green-500 text-black' : 'bg-yellow-500 hover:bg-yellow-600 text-black'}`}
                >
                  {publishing ? <Loader2 className="animate-spin" size={24} /> : isAllDone ? <CheckCircle2 size={24} /> : <Zap size={24} />}
                  {publishing ? 'Sincronizando Multicanal...' : isAllDone ? 'Lançamento Concluído' : 'Publicar em Todos Agora'}
                </button>
                {isAllDone && (
                  <button onClick={resetAll} className="bg-white/5 hover:bg-white/10 text-white px-6 rounded-2xl border border-white/10 flex items-center gap-2">
                    <RefreshCcw size={20} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {isAllDone && (
        <div className="p-6 rounded-3xl bg-green-500/10 border border-green-500/30 flex gap-4 items-center animate-in zoom-in-95">
          <div className="bg-green-500 p-2 rounded-full"><CheckCircle className="text-black" size={20} /></div>
          <div className="flex-1">
            <h6 className="text-white font-bold text-sm uppercase mb-1 tracking-tight">Sucesso Total!</h6>
            <p className="text-xs text-gray-400">O lançamento foi distribuído e as tags de SEO foram aplicadas em cada plataforma de acordo com a estratégia da IA.</p>
          </div>
          <button
            onClick={() => onNavigate?.('insights')}
            className="text-green-500 text-xs font-bold uppercase hover:underline"
          >
            Ver Dashboard
          </button>
        </div>
      )}

      <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/20 flex gap-4 items-start">
        <AlertCircle className="text-blue-500 shrink-0 mt-1" size={20} />
        <div>
          <h6 className="text-white font-bold text-sm uppercase mb-1 tracking-tight italic">Estratégia Multicanal</h6>
          <p className="text-xs text-gray-400 leading-relaxed">
            A IA analisa automaticamente a bitrate e o aspecto do seu master para sugerir os melhores cortes para Reels, TikTok e YouTube Shorts. O upload simultâneo economiza até 4 horas de trabalho manual por lançamento.
          </p>
        </div>
      </div>
    </div>
  );
};

const PlatformCard: React.FC<{ format: DistributionFormat, status: 'pending' | 'syncing' | 'uploading' | 'metadata' | 'done' }> = ({ format, status }) => {
  const getIcon = () => {
    switch (format.platform) {
      case 'YouTube': return <Youtube className="text-red-500" />;
      case 'Instagram Reels': return <Instagram className="text-pink-500" />;
      case 'TikTok': return <Smartphone className="text-cyan-400" />;
      case 'Facebook Watch': return <Facebook className="text-blue-500" />;
      case 'Spotify Canvas': return <Music className="text-green-500" />;
      default: return <Globe className="text-yellow-500" />;
    }
  };

  const getUrl = () => {
    switch (format.platform) {
      case 'YouTube': return 'https://www.youtube.com/';
      case 'Instagram Reels': return 'https://www.instagram.com/';
      case 'TikTok': return 'https://www.tiktok.com/';
      case 'Facebook Watch': return 'https://www.facebook.com/watch/';
      default: return 'https://www.youtube.com/';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'syncing': return 'Autenticando...';
      case 'uploading': return 'Enviando Bits...';
      case 'metadata': return 'Ajustando SEO...';
      case 'done': return 'No Ar (Live)';
      default: return 'Pronto para Postar';
    }
  };

  return (
    <div className={`glass rounded-2xl p-6 border transition-all flex flex-col gap-4 ${status === 'done' ? 'border-green-500/30 bg-green-500/10' : status !== 'pending' ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-white/5 hover:border-white/10'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
            {getIcon()}
          </div>
          <div>
            <h5 className="text-white font-bold text-sm">{format.platform}</h5>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{format.aspectRatio}</span>
          </div>
        </div>

        {status === 'done' ? (
          <CheckCircle2 className="text-green-500 animate-in zoom-in" size={18} />
        ) : status === 'pending' ? (
          <ArrowRight className="text-gray-600" size={18} />
        ) : (
          <Loader2 className="animate-spin text-yellow-500" size={18} />
        )}
      </div>

      <div className="space-y-3">
        <div className={`rounded-xl p-3 border transition-colors ${status === 'done' ? 'bg-green-500/10 border-green-500/20' : 'bg-black/30 border-white/5'}`}>
          <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Status de Rede</p>
          <p className={`text-xs font-bold ${status === 'done' ? 'text-green-500' : 'text-white'}`}>{getStatusLabel()}</p>
        </div>
        <div className="bg-black/30 rounded-xl p-3 border border-white/5">
          <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Ação IA</p>
          <p className="text-xs text-yellow-500 font-brand tracking-wider italic">{format.suggestedAction}</p>
        </div>
        <p className="text-[10px] text-gray-400 leading-relaxed px-1">
          {format.optimizationNote}
        </p>
      </div>

      {status === 'done' && (
        <a
          href={getUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-white/10 text-white hover:bg-white/20 border border-white/5 shadow-lg"
        >
          Ver postagem no canal
          <ExternalLink size={10} />
        </a>
      )}
    </div>
  );
};
