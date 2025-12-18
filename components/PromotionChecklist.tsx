
import React, { useState } from 'react';
import { CheckSquare, Square, Music4, Image as ImageIcon, Link as LinkIcon, Share2 } from 'lucide-react';

export const PromotionChecklist: React.FC = () => {
  const [items, setItems] = useState([
    { id: 1, text: "Mixagem e Masterização profissional (WAV/320kbps MP3)", checked: false, icon: <Music4 size={18} /> },
    { id: 2, text: "Capa do Single/Álbum em alta resolução (3000x3000px)", checked: false, icon: <ImageIcon size={18} /> },
    { id: 3, text: "Letra da música organizada para a descrição", checked: false, icon: <CheckSquare size={18} /> },
    { id: 4, text: "Links sociais atualizados (Instagram, Spotify, etc)", checked: false, icon: <LinkIcon size={18} /> },
    { id: 5, text: "Plano de divulgação nas redes sociais após o post", checked: false, icon: <Share2 size={18} /> },
  ]);

  const toggleItem = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const progress = Math.round((items.filter(i => i.checked).length / items.length) * 100);

  return (
    <div className="glass rounded-3xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-white uppercase tracking-tight">Checklist de Lançamento</h3>
          <p className="text-gray-400 text-sm">Certifique-se de que tudo está pronto para o pitch.</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-brand text-yellow-500">{progress}%</span>
          <p className="text-[10px] text-gray-500 uppercase font-bold">Concluído</p>
        </div>
      </div>

      <div className="w-full bg-white/5 h-2 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-yellow-500 h-full transition-all duration-500" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <button 
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
              item.checked 
                ? 'bg-green-500/10 border-green-500/30 text-white' 
                : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20'
            }`}
          >
            <span className={item.checked ? 'text-green-500' : 'text-gray-600'}>
              {item.checked ? <CheckSquare size={20} /> : <Square size={20} />}
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium">{item.text}</p>
            </div>
            <span className="opacity-20">{item.icon}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 p-6 rounded-2xl bg-black/40 border border-white/5">
        <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-widest">Dicas Adicionais:</h4>
        <ul className="space-y-3">
          <li className="flex gap-3 text-xs text-gray-400">
            <span className="text-yellow-500">•</span>
            Não envie apenas o arquivo. Envie um link do Google Drive ou SoundCloud Privado para facilitar a audição do curador.
          </li>
          <li className="flex gap-3 text-xs text-gray-400">
            <span className="text-yellow-500">•</span>
            Personalize seu pitch. Canais grandes recebem centenas de e-mails genéricos por dia.
          </li>
          <li className="flex gap-3 text-xs text-gray-400">
            <span className="text-yellow-500">•</span>
            Ofereça-se para compartilhar o link do YouTube em seus stories assim que for postado. Isso cria uma parceria ganha-ganha.
          </li>
        </ul>
      </div>
    </div>
  );
};
