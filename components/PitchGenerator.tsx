import React, { useState } from 'react';
import { Copy, Loader2, RefreshCw, Send, Check, Share2 } from 'lucide-react';
import { generatePitch, Language } from '../services/geminiService';

const translations = {
  pt: {
    title: "Gerador de Pitch Profissional",
    desc: "Crie uma mensagem impactante para o curador do Sound of Streets.",
    nameLabel: "Seu Nome Artístico",
    trackLabel: "Título da Música",
    genreLabel: "Gênero",
    vibeLabel: "Vibe / Mood",
    linkLabel: "Link (SoundCloud/Drive/Youtube)",
    btnGenerate: "Gerar Pitch Personalizado",
    btnLoading: "Gerando Proposta...",
    copy: "Copiar",
    copied: "Copiado!",
    share: "Compartilhar",
    pitchResult: "Seu Pitch Gerado:",
    tip: "<strong>Dica Pro:</strong> Tente enviar sua música via DM no Instagram do canal ou procure o e-mail na aba 'Sobre' do YouTube."
  },
  en: {
    title: "Professional Pitch Generator",
    desc: "Create an impactful message for the Sound of Streets curator.",
    nameLabel: "Stage Name",
    trackLabel: "Track Title",
    genreLabel: "Genre",
    vibeLabel: "Vibe / Mood",
    linkLabel: "Link (SoundCloud/Drive/Youtube)",
    btnGenerate: "Generate Custom Pitch",
    btnLoading: "Generating Proposal...",
    copy: "Copy",
    copied: "Copied!",
    share: "Share",
    pitchResult: "Your Generated Pitch:",
    tip: "<strong>Pro Tip:</strong> Try sending your music via Instagram DM or look for the email in the 'About' tab on YouTube."
  }
};

export const PitchGenerator: React.FC<{ lang: Language }> = ({ lang }) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pitch, setPitch] = useState<string>('');
  const [formData, setFormData] = useState({ name: '', trackTitle: '', genre: 'Trap', mood: 'Dark/Chill', link: '' });

  const t = translations[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await generatePitch(formData, lang);
      setPitch(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pitch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Pitch: ${formData.trackTitle}`,
          text: pitch,
        });
      } catch (err) {
        console.error("Erro ao compartilhar", err);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="glass rounded-3xl p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-yellow-500/20 p-3 rounded-xl"><Send className="text-yellow-500" size={24} /></div>
        <div>
          <h3 className="text-xl font-bold text-white uppercase tracking-tight">{t.title}</h3>
          <p className="text-gray-400 text-sm">{t.desc}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase">{t.nameLabel}</label>
          <input type="text" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-500" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase">{t.trackLabel}</label>
          <input type="text" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-500" value={formData.trackTitle} onChange={(e) => setFormData({...formData, trackTitle: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase">{t.genreLabel}</label>
          <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-500" value={formData.genre} onChange={(e) => setFormData({...formData, genre: e.target.value})}>
            <option value="Trap">Trap</option><option value="Boom Bap">Boom Bap</option><option value="Drill">Drill</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase">{t.vibeLabel}</label>
          <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-500" value={formData.mood} onChange={(e) => setFormData({...formData, mood: e.target.value})} />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase">{t.linkLabel}</label>
          <input type="url" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-500" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} />
        </div>
        <div className="md:col-span-2 pt-4">
          <button type="submit" disabled={loading} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-4 rounded-xl font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <RefreshCw size={20} />}
            {loading ? t.btnLoading : t.btnGenerate}
          </button>
        </div>
      </form>

      {pitch && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t.pitchResult}</h4>
            <div className="flex gap-2">
              <button onClick={copyToClipboard} className="flex items-center gap-2 text-xs bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                {copied ? t.copied : t.copy}
              </button>
              {navigator.share && (
                <button onClick={handleShare} className="flex items-center gap-2 text-xs bg-yellow-500 text-black px-3 py-1.5 rounded-lg font-bold">
                  <Share2 size={14} />
                  {t.share}
                </button>
              )}
            </div>
          </div>
          <div className="bg-black/40 border border-white/5 rounded-2xl p-6 text-gray-300 italic whitespace-pre-line leading-relaxed text-sm">
            {pitch}
          </div>
          <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs flex gap-3">
            <div className="mt-0.5">💡</div>
            <p dangerouslySetInnerHTML={{ __html: t.tip }} />
          </div>
        </div>
      )}
    </div>
  );
};