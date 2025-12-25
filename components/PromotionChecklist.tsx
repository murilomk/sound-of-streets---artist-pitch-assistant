
import React, { useState } from 'react';
import { CheckSquare, Square, FileText, Image as ImageIcon, Link as LinkIcon, Share2, Search } from 'lucide-react';

export const PromotionChecklist: React.FC = () => {
  const [items, setItems] = useState([
    { id: 1, text: "Conteúdo finalizado e revisado em alta qualidade", checked: false, icon: <FileText size={18} /> },
    { id: 2, text: "Thumbnail ou Capa em alta resolução (ex: 1920x1080 / 3000x3000px)", checked: false, icon: <ImageIcon size={18} /> },
    { id: 3, text: "Descrição e metadados otimizados para SEO", checked: false, icon: <Search size={18} /> },
    { id: 4, text: "Links sociais e CTAs atualizados (Bio, Descrição, etc)", checked: false, icon: <LinkIcon size={18} /> },
    { id: 5, text: "Plano de engajamento pós-publicação definido", checked: false, icon: <Share2 size={18} /> },
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
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${item.checked
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
            Facilite o acesso ao seu trabalho. Use links diretos e públicos que não exijam login para visualização rápida.
          </li>
          <li className="flex gap-3 text-xs text-gray-400">
            <span className="text-yellow-500">•</span>
            Personalize cada abordagem. Curadores e marcas valorizam quando percebem que você pesquisou o perfil deles antes.
          </li>
          <li className="flex gap-3 text-xs text-gray-400">
            <span className="text-yellow-500">•</span>
            Crie um senso de comunidade. Interaja com quem comenta e incentive o compartilhamento genuíno do seu público.
          </li>
        </ul>
      </div>
    </div>
  );
};
