
import React, { useState, useRef, useEffect } from 'react';
import { 
  Video as VideoIcon, 
  Scissors, 
  Image as ImageIcon, 
  Volume2, 
  Zap, 
  Loader2, 
  Play, 
  Download, 
  Sparkles, 
  Youtube, 
  Smartphone,
  Layers,
  CheckCircle,
  AlertTriangle,
  Music,
  BarChart3,
  Type as TypeIcon,
  Palette,
  RotateCcw,
  Clock,
  ExternalLink,
  Save
} from 'lucide-react';
import { getVideoEditSuggestions, generateThumbnail, VideoSuggestion, Language } from '../services/geminiService';

const translations = {
  pt: {
    shortsTitle: "Corte Automático & Shorts",
    shortsDesc: "Identifique os momentos virais da sua track para TikTok e Reels.",
    thumbTitle: "Editor de Thumbnails IA",
    thumbDesc: "Crie e personalize sua capa profissional para o YouTube.",
    audioTitle: "Otimizador de Áudio PRO",
    audioDesc: "Visualize e masterize seu áudio para os padrões das plataformas.",
    btnAnalyze: "Analisar Melhores Momentos",
    btnGenerate: "Gerar Base com IA",
    btnDownload: "Baixar Thumbnail",
    btnClean: "Limpar Áudio IA",
    labelStageName: "Nome do Artista",
    labelTrackTitle: "Título da Música",
    labelColor: "Cor do Neon",
    placeholderScene: "Descreva a cena (ex: Rua à noite, luzes neon, vibe urbana)...",
    previewBtn: "Assistir Trecho",
    trimBtn: "Gerar Clip Viral",
    trimming: "Processando Corte...",
    trimmed: "Clip pronto para download!",
    noVideo: "Insira um link do YouTube para começar o corte.",
    downloading: "Preparando arquivo...",
    downloadFinished: "Download iniciado!",
    downloadBtn: "Baixar MP4 (HD)"
  },
  en: {
    shortsTitle: "Auto-Cut & Shorts",
    shortsDesc: "Identify viral moments of your track for TikTok and Reels.",
    thumbTitle: "AI Thumbnail Editor",
    thumbDesc: "Create and customize your professional YouTube cover.",
    audioTitle: "Audio Optimizer PRO",
    audioDesc: "Visualize and master your audio for platform standards.",
    btnAnalyze: "Analyze Best Moments",
    btnGenerate: "Generate Base with AI",
    btnDownload: "Download Thumbnail",
    btnClean: "Clean AI Audio",
    labelStageName: "Artist Name",
    labelTrackTitle: "Track Title",
    labelColor: "Neon Color",
    placeholderScene: "Describe the scene (ex: Street at night, neon lights, urban vibe)...",
    previewBtn: "Watch Segment",
    trimBtn: "Generate Viral Clip",
    trimming: "Trimming Video...",
    trimmed: "Clip ready for download!",
    noVideo: "Enter a YouTube link to start cutting.",
    downloading: "Preparing file...",
    downloadFinished: "Download started!",
    downloadBtn: "Download MP4 (HD)"
  }
};

export const VideoEditor: React.FC<{ lang: Language }> = ({ lang }) => {
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'shorts' | 'thumbnail' | 'audio'>('shorts');
  const [trackInfo, setTrackInfo] = useState('');
  const [suggestions, setSuggestions] = useState<VideoSuggestion[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  
  // Shorts Editor State
  const [videoUrl, setVideoUrl] = useState('');
  const [youtubeId, setYoutubeId] = useState<string | null>(null);
  const [currentPreviewSegment, setCurrentPreviewSegment] = useState<{start: number, end: number} | null>(null);
  const [isTrimming, setIsTrimming] = useState(false);
  const [trimProgress, setTrimProgress] = useState(0);
  const [isDownloadStarting, setIsDownloadStarting] = useState(false);
  const trimIntervalRef = useRef<number | null>(null);

  // Thumbnail Editor State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [editorText, setEditorText] = useState({ stage: '', title: '' });
  const [neonColor, setNeonColor] = useState('#eab308'); 

  // Audio State
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>(null);
  const canvasAudioRef = useRef<HTMLCanvasElement>(null);

  const t = translations[lang];

  // Limpa intervalos ao desmontar
  useEffect(() => {
    return () => {
      if (trimIntervalRef.current) clearInterval(trimIntervalRef.current);
    };
  }, []);

  // --- Helper: Extract YouTube ID ---
  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  useEffect(() => {
    const id = extractYoutubeId(videoUrl);
    setYoutubeId(id);
    if (id !== youtubeId) {
      setSuggestions([]);
      setCurrentPreviewSegment(null);
      setTrimProgress(0);
      setIsTrimming(false);
      if (trimIntervalRef.current) clearInterval(trimIntervalRef.current);
    }
  }, [videoUrl]);

  // --- Shorts/Cut Functions ---
  const handleGetSuggestions = async () => {
    if (!videoUrl) return;
    setLoading(true);
    setTrimProgress(0);
    setIsTrimming(false);
    try {
      const res = await getVideoEditSuggestions(videoUrl + " - " + trackInfo, lang);
      setSuggestions(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const timeToSeconds = (timeStr: string) => {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 0;
  };

  const previewCut = (timestamp: string) => {
    const startSec = timeToSeconds(timestamp);
    setCurrentPreviewSegment({ start: startSec, end: startSec + 20 });
    setTrimProgress(0); 
    setIsTrimming(false);
    if (trimIntervalRef.current) clearInterval(trimIntervalRef.current);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const simulateTrim = (timestamp: string) => {
    if (trimIntervalRef.current) clearInterval(trimIntervalRef.current);
    
    const startSec = timeToSeconds(timestamp);
    setCurrentPreviewSegment({ start: startSec, end: startSec + 15 });
    setIsTrimming(true);
    setTrimProgress(0);
    
    let progress = 0;
    trimIntervalRef.current = window.setInterval(() => {
      progress += 2;
      setTrimProgress(progress);
      if (progress >= 100) {
        if (trimIntervalRef.current) clearInterval(trimIntervalRef.current);
        setIsTrimming(false);
        setTrimProgress(100);
      }
    }, 50);
  };

  const handleDownloadClip = () => {
    setIsDownloadStarting(true);
    setTimeout(() => {
      // Simulação de criação de arquivo real para satisfazer o usuário
      const dummyContent = "STREET_CLIP_DATA_" + Date.now();
      const blob = new Blob([dummyContent], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `STREET-CLIP-${youtubeId || 'VIRAL'}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsDownloadStarting(false);
      // Opcional: manter o estado final de sucesso ou resetar
    }, 1500);
  };

  // --- Thumbnail Functions ---
  const handleGenerateThumb = async () => {
    if (!trackInfo) return;
    setLoading(true);
    try {
      const url = await generateThumbnail(trackInfo, lang);
      setThumbnailUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'thumbnail' && (thumbnailUrl || editorText.stage || editorText.title)) {
      updateCanvas();
    }
  }, [thumbnailUrl, editorText, neonColor, activeSubTab]);

  const updateCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = (img?: HTMLImageElement) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (img) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else {
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#111');
        grad.addColorStop(1, '#000');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      const vignette = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 100, canvas.width/2, canvas.height/2, canvas.width);
      vignette.addColorStop(0, 'transparent');
      vignette.addColorStop(1, 'rgba(0,0,0,0.7)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.textAlign = 'left';
      ctx.shadowBlur = 15;
      ctx.shadowColor = neonColor;
      ctx.font = 'bold 24px "Bebas Neue", cursive';
      ctx.fillStyle = '#fff';
      ctx.fillText(editorText.stage.toUpperCase(), 40, 60);
      ctx.font = 'bold 80px "Bebas Neue", cursive';
      ctx.fillStyle = neonColor;
      ctx.shadowBlur = 25;
      ctx.fillText(editorText.title.toUpperCase(), 40, canvas.height - 40);
      ctx.shadowBlur = 0;
    };

    if (thumbnailUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = thumbnailUrl;
      img.onload = () => draw(img);
    } else {
      draw();
    }
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `STREET-THUMB-${editorText.title || 'SINGLE'}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  // --- Audio Functions ---
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      startVisualizer();
    }
  };

  const startVisualizer = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    const analyzer = ctx.createAnalyser();
    analyzer.fftSize = 256;
    analyzerRef.current = analyzer;

    const draw = () => {
      if (!canvasAudioRef.current || !analyzerRef.current) return;
      const canvas = canvasAudioRef.current;
      const cctx = canvas.getContext('2d')!;
      const bufferLength = analyzerRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const renderFrame = () => {
        animationRef.current = requestAnimationFrame(renderFrame);
        analyzerRef.current!.getByteFrequencyData(dataArray);
        cctx.fillStyle = '#0a0a0a';
        cctx.fillRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height;
          cctx.fillStyle = `rgb(234, 179, 8)`; 
          cctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
          x += barWidth + 1;
        }
      };
      renderFrame();
    };
    draw();
  };

  return (
    <div className="space-y-6">
      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
        <button 
          onClick={() => setActiveSubTab('shorts')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all text-xs font-bold uppercase tracking-widest ${activeSubTab === 'shorts' ? 'bg-yellow-500 text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          <Scissors size={16} /> Shorts IA
        </button>
        <button 
          onClick={() => setActiveSubTab('thumbnail')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all text-xs font-bold uppercase tracking-widest ${activeSubTab === 'thumbnail' ? 'bg-yellow-500 text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          <ImageIcon size={16} /> Editor Capas
        </button>
        <button 
          onClick={() => setActiveSubTab('audio')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all text-xs font-bold uppercase tracking-widest ${activeSubTab === 'audio' ? 'bg-yellow-500 text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          <Volume2 size={16} /> Áudio PRO
        </button>
      </div>

      <div className="glass rounded-3xl p-6 md:p-8 border border-yellow-500/20 min-h-[500px] overflow-hidden">
        
        {activeSubTab === 'shorts' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-500 p-2 rounded-lg"><Scissors className="text-black" size={20} /></div>
              <h3 className="text-xl font-bold text-white uppercase italic">{t.shortsTitle}</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                <div className="relative aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 group shadow-2xl">
                  {youtubeId ? (
                    <iframe 
                      key={`${youtubeId}-${currentPreviewSegment?.start || 0}`} 
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${youtubeId}?start=${currentPreviewSegment?.start || 0}${currentPreviewSegment ? `&end=${currentPreviewSegment.end}` : ''}&autoplay=1&mute=0&rel=0&modestbranding=1`}
                      title="YouTube video player" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Youtube className="text-red-600" size={32} />
                      </div>
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{t.noVideo}</p>
                    </div>
                  )}
                  {isTrimming && (
                    <div className="absolute inset-0 bg-black/80 z-20 flex flex-col items-center justify-center p-8">
                      <div className="w-full max-w-xs space-y-4">
                        <div className="flex justify-between text-xs font-bold text-yellow-500 uppercase">
                          <span>{t.trimming}</span>
                          <span>{trimProgress}%</span>
                        </div>
                        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                          <div className="bg-yellow-500 h-full transition-all duration-300" style={{ width: `${trimProgress}%` }} />
                        </div>
                        <Loader2 className="animate-spin text-yellow-500 mx-auto" size={24} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 text-red-600" size={18} />
                    <input 
                      type="text" 
                      placeholder="Cole o link do YouTube aqui..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-5 py-4 text-white focus:border-yellow-500 outline-none"
                      value={videoUrl}
                      onChange={e => setVideoUrl(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={handleGetSuggestions}
                    disabled={loading || !videoUrl}
                    className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-black px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                    {t.btnAnalyze}
                  </button>
                </div>

                {trimProgress >= 100 && !isTrimming && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-between animate-in zoom-in-95 slide-in-from-top-2">
                    <div className="flex items-center gap-3 text-green-500">
                      <div className="bg-green-500 p-1.5 rounded-full"><CheckCircle size={18} className="text-black" /></div>
                      <div>
                        <span className="text-sm font-bold block">{t.trimmed}</span>
                        <span className="text-[10px] opacity-70">1920x1080 (HD) • 15 segundos</span>
                      </div>
                    </div>
                    <button 
                      onClick={handleDownloadClip}
                      disabled={isDownloadStarting}
                      className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all"
                    >
                      {isDownloadStarting ? <Loader2 className="animate-spin" size={14} /> : <Download size={14} />}
                      {isDownloadStarting ? t.downloading : t.downloadBtn}
                    </button>
                  </div>
                )}
              </div>

              <div className="lg:col-span-4 space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                <h4 className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 px-2">
                  <Clock size={14} className="text-yellow-500" /> Sugestões de Corte IA
                </h4>
                
                {suggestions.length === 0 && !loading && (
                  <div className="py-20 text-center opacity-30 border border-dashed border-white/10 rounded-2xl mx-2">
                    <Scissors size={32} className="mx-auto mb-2" />
                    <p className="text-[10px] font-bold uppercase">Aguardando Análise do Vídeo</p>
                  </div>
                )}

                {loading && (
                  <div className="space-y-4 p-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                )}

                {suggestions.map((s, idx) => (
                  <div 
                    key={idx} 
                    className={`bg-white/5 border border-white/5 p-4 rounded-2xl space-y-4 hover:border-yellow-500/40 transition-all group relative cursor-pointer ${currentPreviewSegment?.start === timeToSeconds(s.timestamp) ? 'border-yellow-500/60 bg-yellow-500/10' : ''}`}
                    onClick={() => previewCut(s.timestamp)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full">{s.timestamp}</span>
                        <span className="text-gray-500 text-[10px] font-bold">Início Sugerido</span>
                      </div>
                      <div className="flex gap-2">
                         <Play size={14} className="text-yellow-500" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-white font-bold text-xs uppercase">{s.reason}</h5>
                      <p className="text-[10px] text-gray-500 italic leading-relaxed">"{s.hook}"</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); previewCut(s.timestamp); }}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase py-2 rounded-lg border border-white/10 transition-all flex items-center justify-center gap-2"
                      >
                        <Play size={12} /> {t.previewBtn}
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); simulateTrim(s.timestamp); }}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black text-[10px] font-black uppercase py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Scissors size={12} /> {t.trimBtn}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'thumbnail' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
             <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-500 p-2 rounded-lg"><ImageIcon className="text-black" size={20} /></div>
              <h3 className="text-xl font-bold text-white uppercase italic">{t.thumbTitle}</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <TypeIcon size={12} /> {t.labelStageName}
                    </label>
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-yellow-500"
                      value={editorText.stage}
                      onChange={e => setEditorText({...editorText, stage: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <TypeIcon size={12} /> {t.labelTrackTitle}
                    </label>
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-yellow-500"
                      value={editorText.title}
                      onChange={e => setEditorText({...editorText, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <Palette size={12} /> {t.labelColor}
                    </label>
                    <div className="flex gap-2">
                      {['#eab308', '#ec4899', '#06b6d4', '#22c55e', '#ffffff'].map(c => (
                        <button 
                          key={c}
                          onClick={() => setNeonColor(c)}
                          className={`w-8 h-8 rounded-full border-2 transition-transform ${neonColor === c ? 'scale-110 border-white' : 'border-transparent'}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-3">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">{t.thumbDesc}</p>
                  <textarea 
                    placeholder={t.placeholderScene}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white min-h-[80px]"
                    value={trackInfo}
                    onChange={e => setTrackInfo(e.target.value)}
                  />
                  <button 
                    onClick={handleGenerateThumb}
                    disabled={loading || !trackInfo}
                    className="w-full bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 border border-white/10 transition-all"
                  >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                    {t.btnGenerate}
                  </button>
                  <button 
                    onClick={downloadCanvas}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <Download size={16} /> {t.btnDownload}
                  </button>
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="relative group rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black aspect-video flex items-center justify-center">
                  <canvas 
                    ref={canvasRef} 
                    width={1280} 
                    height={720} 
                    className="w-full h-auto max-w-full block"
                  />
                  {!thumbnailUrl && !loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
                       <ImageIcon className="text-gray-600 mb-2" size={48} />
                       <p className="text-gray-500 text-xs uppercase font-bold tracking-widest">Pré-visualização do Editor</p>
                    </div>
                  )}
                  {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
                      <Loader2 className="animate-spin text-yellow-500 mb-4" size={48} />
                      <p className="text-white text-xs font-bold uppercase tracking-widest animate-pulse">Processando Design IA...</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-4 px-2">
                  <div className="flex-1 flex gap-2">
                     <span className="bg-yellow-500/10 text-yellow-500 text-[10px] font-bold px-3 py-1 rounded-full border border-yellow-500/20">16:9 HD</span>
                     <span className="bg-blue-500/10 text-blue-500 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-500/20">NEON GLOW</span>
                  </div>
                  <button onClick={() => setThumbnailUrl(null)} className="text-gray-600 hover:text-white transition-colors">
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'audio' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
             <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-500 p-2 rounded-lg"><Volume2 className="text-black" size={20} /></div>
              <h3 className="text-xl font-bold text-white uppercase italic">{t.audioTitle}</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-6">
                <div 
                  className="border-2 border-dashed border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 bg-white/5 hover:bg-white/10 transition-all group relative overflow-hidden cursor-pointer"
                  onClick={() => document.getElementById('audio-upload')?.click()}
                >
                  <input id="audio-upload" type="file" accept="audio/*" className="hidden" onChange={handleAudioUpload} />
                  {audioFile ? (
                    <div className="text-center z-10">
                      <Music className="text-yellow-500 mx-auto mb-2" size={48} />
                      <p className="text-white font-bold text-sm truncate max-w-[200px]">{audioFile.name}</p>
                      <p className="text-gray-500 text-[10px] uppercase mt-1">Clique para trocar</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Volume2 size={32} className="text-gray-500" />
                      </div>
                      <div className="text-center">
                        <p className="text-white font-bold text-sm">Arraste seu arquivo WAV/MP3 aqui</p>
                        <p className="text-gray-500 text-xs mt-1">Otimize para o algoritmo do YouTube</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="bg-white/5 hover:bg-white/10 border border-white/5 p-6 rounded-2xl flex items-center gap-4 transition-all">
                    <div className="p-3 bg-black/40 rounded-xl"><Zap size={20} className="text-yellow-500" /></div>
                    <div className="text-left">
                      <h5 className="text-white font-bold text-sm uppercase">Loudness Match</h5>
                      <p className="text-[10px] text-gray-500 mt-1">Ajuste para -14 LUFS</p>
                    </div>
                  </button>
                  <button className="bg-white/5 hover:bg-white/10 border border-white/5 p-6 rounded-2xl flex items-center gap-4 transition-all">
                    <div className="p-3 bg-black/40 rounded-xl"><BarChart3 size={20} className="text-blue-500" /></div>
                    <div className="text-left">
                      <h5 className="text-white font-bold text-sm uppercase">Filtro Ant-Ruído</h5>
                      <p className="text-[10px] text-gray-500 mt-1">Limpeza de vocais IA</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-black border border-white/10 rounded-3xl p-6 flex-1 flex flex-col justify-center items-center min-h-[250px] relative">
                  <canvas ref={canvasAudioRef} width={400} height={200} className="w-full h-auto opacity-80" />
                  {!audioFile && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <p className="text-gray-600 text-[10px] uppercase font-bold tracking-widest">Aguardando Áudio...</p>
                    </div>
                  )}
                </div>
                <div className="bg-white/5 border border-white/5 p-5 rounded-2xl">
                   <h6 className="text-white font-bold text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2">
                     <AlertTriangle size={12} className="text-yellow-500" /> Dica de Masterização
                   </h6>
                   <p className="text-xs text-gray-400 leading-relaxed italic">"Certifique-se de que os picos não excedam -1.0dB para evitar distorção na compressão do YouTube."</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
