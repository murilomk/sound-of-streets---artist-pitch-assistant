
import React, { useState } from 'react';
import { 
  Rocket, 
  Instagram, 
  Twitter, 
  Music2, 
  Hash, 
  Copy, 
  Check, 
  Loader2, 
  Sparkles, 
  Youtube, 
  FileText, 
  LayoutGrid, 
  Smartphone,
  Tag,
  Search
} from 'lucide-react';
import { generatePromotionKit, PromoKit, Language } from '../services/geminiService';

// Added lang prop to fix missing argument error on line 38
export const AutoPromotion: React.FC<{ lang: Language }> = ({ lang }) => {
  const [loading, setLoading] = useState(false);
  const [kit, setKit] = useState<PromoKit | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    trackTitle: '',
    genre: 'Trap',
    mood: 'Urban Night / Street Vibe',
    link: ''
  });
  const [copyState, setCopyState] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Pass lang as second argument to generatePromotionKit
      const result = await generatePromotionKit(formData, lang);
      setKit(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyState(id);
    setTimeout(() => setCopyState(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input Form Section */}
      <div className="glass rounded-3xl p-6 md:p-10 border border-yellow-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/10 blur-3xl rounded-full"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-yellow-500 p-3 rounded-2xl shadow-[0_0_20px_rgba(234,179,8,0.3)]">
              <Rocket className="text-black" size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-brand text-white tracking-wider uppercase">Gerador de Conteúdo Automatizado</h3>
              <p className="text-gray-400 text-sm">Insira o link ou info da track para criar o kit pronto para publicar.</p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Search size={14} className="text-yellow-500" /> Link do Vídeo ou Música
              </label>
              <input 
                type="url" 
                placeholder="Cole o link do YouTube, SoundCloud ou Drive aqui..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-yellow-500 focus:bg-white/10 outline-none transition-all placeholder:text-gray-600"
                value={formData.link}
                onChange={e => setFormData({...formData, link: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Artista / MC</label>
              <input 
                type="text" 
                placeholder="Seu nome artístico" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-yellow-500 outline-none transition-all"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nome da Track</label>
              <input 
                type="text" 
                placeholder="Título da música" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-yellow-500 outline-none transition-all"
                value={formData.trackTitle}
                onChange={e => setFormData({...formData, trackTitle: e.target.value})}
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading || !formData.name || !formData.trackTitle}
              className="md:col-span-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-black py-5 rounded-2xl font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-[0_10px_30px_rgba(234,179,8,0.2)]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span>Sincronizando com as Redes...</span>
                </>
              ) : (
                <>
                  <Sparkles size={24} />
                  <span>Gerar Conteúdo Pronto</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {kit && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          
          {/* Main Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* YouTube SEO Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PromoCard 
                  title="Títulos de Alto Alcance" 
                  description="Focados em cliques e retenção"
                  icon={<Youtube className="text-red-500" size={18} />}
                  content={kit.youtubeTitle}
                  onCopy={() => copyToClipboard(kit.youtubeTitle, 'yt-title')}
                  isCopied={copyState === 'yt-title'}
                />
                <PromoCard 
                  title="Keywords SEO" 
                  description="Para tags e metadados"
                  icon={<Tag className="text-yellow-500" size={18} />}
                  content={kit.keywords.join(', ')}
                  onCopy={() => copyToClipboard(kit.keywords.join(', '), 'keywords')}
                  isCopied={copyState === 'keywords'}
                />
              </div>
              
              <PromoCard 
                title="Descrição Otimizada (YouTube)" 
                description="Texto completo com SEO e links"
                icon={<FileText className="text-gray-400" size={18} />}
                content={kit.youtubeDescription}
                onCopy={() => copyToClipboard(kit.youtubeDescription, 'yt-desc')}
                isCopied={copyState === 'yt-desc'}
              />
            </div>

            {/* Social Media Shorts */}
            <div className="space-y-6">
               <PromoCard 
                title="Legenda Instagram" 
                description="Engajamento e Vibe"
                icon={<Instagram className="text-pink-500" size={18} />}
                content={kit.instagramCaption}
                onCopy={() => copyToClipboard(kit.instagramCaption, 'ig')}
                isCopied={copyState === 'ig'}
              />
               <PromoCard 
                title="Viral TikTok Caption" 
                description="Curto e direto"
                icon={<Smartphone className="text-cyan-400" size={18} />}
                content={kit.tiktokCaption}
                onCopy={() => copyToClipboard(kit.tiktokCaption, 'tk-cap')}
                isCopied={copyState === 'tk-cap'}
              />
               <PromoCard 
                title="Hashtags Sugeridas" 
                description="Tendências Rap/Trap"
                icon={<Hash className="text-yellow-500" size={18} />}
                content={kit.hashtags.join(' ')}
                onCopy={() => copyToClipboard(kit.hashtags.join(' '), 'hash')}
                isCopied={copyState === 'hash'}
              />
            </div>
          </div>

          {/* Additional Assets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PromoCard 
              title="Roteiro TikTok/Reels" 
              description="Sugestão de vídeo curto"
              icon={<Music2 className="text-white" size={18} />}
              content={kit.tiktokScript}
              onCopy={() => copyToClipboard(kit.tiktokScript, 'tk-script')}
              isCopied={copyState === 'tk-script'}
            />
            <PromoCard 
              title="Post para Twitter/X" 
              description="Rápido e clicável"
              icon={<Twitter className="text-blue-400" size={18} />}
              content={kit.twitterPost}
              onCopy={() => copyToClipboard(kit.twitterPost, 'tw')}
              isCopied={copyState === 'tw'}
            />
          </div>

          {/* Strategy Tip */}
          <div className="glass rounded-3xl p-8 border-l-8 border-yellow-500 bg-yellow-500/5 shadow-inner">
            <h4 className="text-white font-bold mb-3 flex items-center gap-3 uppercase text-sm tracking-[0.2em]">
              <LayoutGrid size={20} className="text-yellow-500" />
              Estratégia do Especialista
            </h4>
            <p className="text-gray-300 text-base italic leading-relaxed">
              {kit.launchStrategy}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

interface PromoCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  content: string;
  onCopy: () => void;
  isCopied: boolean;
}

const PromoCard: React.FC<PromoCardProps> = ({ title, description, icon, content, onCopy, isCopied }) => (
  <div className="glass rounded-2xl p-6 border border-white/5 space-y-4 hover:border-white/20 transition-all group flex flex-col">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
          {icon}
        </div>
        <div>
          <h5 className="font-bold text-xs uppercase tracking-widest text-white">{title}</h5>
          {description && <p className="text-[10px] text-gray-500 font-medium">{description}</p>}
        </div>
      </div>
      <button 
        onClick={onCopy}
        title="Copiar conteúdo"
        className={`p-2 rounded-xl transition-all ${isCopied ? 'bg-green-500 text-black' : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}
      >
        {isCopied ? <Check size={16} /> : <Copy size={16} />}
      </button>
    </div>
    <div className="bg-black/50 rounded-xl p-5 text-sm text-gray-300 flex-1 min-h-[100px] max-h-[250px] overflow-y-auto font-sans leading-relaxed whitespace-pre-line border border-white/5 scrollbar-thin scrollbar-thumb-white/10">
      {content}
    </div>
  </div>
);
