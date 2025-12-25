import React, { useState, useRef, useEffect } from 'react';
import {
  Music, Send, Target, CheckCircle2, ChevronRight, ExternalLink,
  Search, Zap, Youtube, Info, Rocket, BarChart3, Bell, Calendar,
  Video, Share2, Globe, Flame, TrendingUp, Languages, Sparkles,
  Database, Trophy, Cpu, MousePointer2, Menu, X
} from 'lucide-react';
import { Language } from './services/geminiService';
import { PitchGenerator } from './components/PitchGenerator';
import { ChannelAnalyzer } from './components/ChannelAnalyzer';
import { PromotionChecklist } from './components/PromotionChecklist';
import { AutoPromotion } from './components/AutoPromotion';
import { AudienceInsights } from './components/AudienceInsights';
import { ReleasePlanner } from './components/ReleasePlanner';
import { TrendsTool } from './components/TrendsTool';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { Capacitor } from '@capacitor/core';


const translations = {
  pt: {
    title: "Content Pitch Pro",
    analyzer: "Análise",
    pitch: "Pitch",
    promotion: "Divulgação",
    insights: "Insights",
    trends: "Tendências",
    agenda: "Agenda",
    checklist: "Checklist",
    welcomeTitle: "CONQUISTE O SEU <span class='text-yellow-500'>PÚBLICO</span>",
    welcomeDesc: "O seu assistente de IA para criação, estratégia e divulgação de conteúdo em qualquer nicho. Do gaming à educação, domine as redes.",
    welcomeBtn: "Ver Tendências Atuais",
    welcomeStatus: "Novas tendências identificadas",
    benefitsTitle: "POR QUE USAR O CONTENT PITCH PRO?",
    benefits: [
      { title: "Criação inteligente", desc: "IA que gera roteiros, legendas e ganchos em segundos.", icon: <Sparkles size={20} /> },
      { title: "Estratégia baseada em dados", desc: "Sugestões fundamentadas em tendências reais de mercado.", icon: <Database size={20} /> },
      { title: "Publicação otimizada", desc: "Formatos prontos para distribuir em todas as redes.", icon: <Zap size={20} /> },
      { title: "Crescimento acelerado", desc: "Não dependa da sorte, use métricas e IA para crescer.", icon: <Trophy size={20} /> },
      { title: "Ferramentas Pro integradas", desc: "Suíte completa para criadores de alta performance.", icon: <Cpu size={20} /> }
    ],
    tabAnalyzerDesc: "Análise de perfil",
    tabPitchDesc: "Pitch profissional",
    tabPromoDesc: "Kit de divulgação",
    tabInsightsDesc: "Métricas e Alertas",
    tabTrendsDesc: "O que está em alta",
    tabAgendaDesc: "Cronograma de conteúdo",
    tabCheckDesc: "Checklist de lançamento"
  },
  en: {
    title: "Content Pitch Pro",
    analyzer: "Analysis",
    pitch: "Pitch",
    promotion: "Promotion",
    insights: "Insights",
    trends: "Trends",
    agenda: "Planner",
    checklist: "Checklist",
    welcomeTitle: "GROW YOUR <span class='text-yellow-500'>AUDIENCE</span>",
    welcomeDesc: "Your AI assistant for content creation, strategy, and promotion in any niche. From gaming to education, master social media.",
    welcomeBtn: "View Current Trends",
    welcomeStatus: "New trends identified",
    benefitsTitle: "WHY USE CONTENT PITCH PRO?",
    benefits: [
      { title: "Smart creation", desc: "AI that generates scripts, captions, and hooks in seconds.", icon: <Sparkles size={20} /> },
      { title: "Data-driven strategy", desc: "Suggestions based on real-time market trends.", icon: <Database size={20} /> },
      { title: "Optimized publishing", desc: "Pre-formatted content ready for all platforms.", icon: <Zap size={20} /> },
      { title: "Accelerated growth", desc: "Don't rely on luck, use metrics and AI to grow.", icon: <Trophy size={20} /> },
      { title: "Integrated Pro tools", desc: "Complete suite for high-performance creators.", icon: <Cpu size={20} /> }
    ],
    tabAnalyzerDesc: "Profile analysis",
    tabPitchDesc: "Professional pitch",
    tabPromoDesc: "Promotion kit",
    tabInsightsDesc: "Metrics & Alerts",
    tabTrendsDesc: "What's trending",
    tabAgendaDesc: "Content schedule",
    tabCheckDesc: "Launch checklist"
  }
};

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('pt');
  const [activeTab, setActiveTab] = useState<'analyzer' | 'pitch' | 'promotion' | 'checklist' | 'insights' | 'planner' | 'trends'>('analyzer');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [minutesSinceUpdate, setMinutesSinceUpdate] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      CapacitorUpdater.notifyAppReady().catch(console.error);
    }

    const timer = setInterval(() => {
      setMinutesSinceUpdate(prev => prev + 1);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const t = translations[language];

  const scrollToContent = (tab: any) => {

    setActiveTab(tab);
    setMobileMenuOpen(false);
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-[100] bg-black border-b border-white/5 px-4 py-4 md:px-8">

        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-500 p-2 rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.4)]">
              <Target className="text-black" size={24} />
            </div>
            <h1 className="text-xl md:text-2xl font-brand tracking-wider text-yellow-500 uppercase">
              {t.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <nav className="hidden lg:flex items-center gap-6 mr-4">

              <NavBtn active={activeTab === 'analyzer'} onClick={() => scrollToContent('analyzer')} label={t.analyzer} />
              <NavBtn active={activeTab === 'pitch'} onClick={() => scrollToContent('pitch')} label={t.pitch} />
              <NavBtn active={activeTab === 'promotion'} onClick={() => scrollToContent('promotion')} label={t.promotion} />
              <NavBtn active={activeTab === 'insights'} onClick={() => scrollToContent('insights')} label={t.insights} />
              <NavBtn active={activeTab === 'trends'} onClick={() => scrollToContent('trends')} label={t.trends} />
            </nav>

            <div className="hidden lg:flex items-center bg-white/5 rounded-full p-1 border border-white/10">

              <button
                onClick={() => setLanguage('pt')}
                className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all ${language === 'pt' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                PT
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all ${language === 'en' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                EN
              </button>
            </div>

            <button
              className="lg:hidden p-2 flex-shrink-0 bg-white/5 hover:bg-white/10 rounded-lg text-yellow-500 transition-all border border-white/10"

              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-[100] bg-[#050505] flex flex-col animate-in fade-in duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Target className="text-yellow-500" size={24} />
                <span className="font-brand tracking-wider text-yellow-500 uppercase">{t.title}</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-yellow-500 bg-white/5 rounded-lg">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <TabButton active={activeTab === 'analyzer'} onClick={() => scrollToContent('analyzer')} icon={<Search size={20} />} label={t.analyzer} description={t.tabAnalyzerDesc} />
              <TabButton active={activeTab === 'pitch'} onClick={() => scrollToContent('pitch')} icon={<Send size={20} />} label={t.pitch} description={t.tabPitchDesc} />
              <TabButton active={activeTab === 'promotion'} onClick={() => scrollToContent('promotion')} icon={<Rocket size={20} />} label={t.promotion} description={t.tabPromoDesc} />
              <TabButton active={activeTab === 'insights'} onClick={() => scrollToContent('insights')} icon={<BarChart3 size={20} />} label={t.insights} description={t.tabInsightsDesc} />
              <TabButton active={activeTab === 'trends'} onClick={() => scrollToContent('trends')} icon={<Flame size={20} />} label={t.trends} description={t.tabTrendsDesc} />
              <TabButton active={activeTab === 'planner'} onClick={() => scrollToContent('planner')} icon={<Calendar size={20} />} label={t.agenda} description={t.tabAgendaDesc} />
              <TabButton active={activeTab === 'checklist'} onClick={() => scrollToContent('checklist')} icon={<CheckCircle2 size={20} />} label={t.checklist} description={t.tabCheckDesc} />
            </div>
            <div className="p-6 border-t border-white/10 bg-[#080808]">
              <div className="flex items-center justify-center gap-4">
                <button onClick={() => setLanguage('pt')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${language === 'pt' ? 'bg-yellow-500 text-black' : 'bg-white/5 text-gray-400'}`}>PORTUGUÊS</button>
                <button onClick={() => setLanguage('en')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${language === 'en' ? 'bg-yellow-500 text-black' : 'bg-white/5 text-gray-400'}`}>ENGLISH</button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 space-y-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-500/10 to-transparent p-6 md:p-12 border border-yellow-500/20 shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-brand text-white mb-4 leading-tight uppercase" dangerouslySetInnerHTML={{ __html: t.welcomeTitle }} />
            <p className="text-gray-400 text-sm md:text-lg mb-8">{t.welcomeDesc}</p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollToContent('trends')}
                className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group shadow-lg"
              >
                {t.welcomeBtn}
                <Flame size={20} className="group-hover:scale-110 transition-transform" />
              </button>
              <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm italic">
                <TrendingUp size={16} className="text-yellow-500 animate-pulse" />
                {t.welcomeStatus} {language === 'pt' ? `há ${minutesSinceUpdate} min.` : `${minutesSinceUpdate} min ago.`}
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none hidden md:block"><Flame size={300} /></div>
        </div>

        {/* Benefits Grid */}
        <section className="space-y-6">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] text-center">{t.benefitsTitle}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {t.benefits.map((benefit, i) => (
              <div key={i} className="glass p-5 rounded-2xl border border-white/5 hover:border-yellow-500/20 transition-all group">
                <div className="bg-yellow-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                  {benefit.icon}
                </div>
                <h4 className="text-white font-bold text-sm mb-1 leading-tight">{benefit.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Navigation & Tab Content */}
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 scroll-mt-24">
          <div className="hidden lg:block lg:col-span-3 space-y-2">
            <TabButton active={activeTab === 'analyzer'} onClick={() => setActiveTab('analyzer')} icon={<Search size={18} />} label={t.analyzer} description={t.tabAnalyzerDesc} />
            <TabButton active={activeTab === 'pitch'} onClick={() => setActiveTab('pitch')} icon={<Send size={18} />} label={t.pitch} description={t.tabPitchDesc} />
            <TabButton active={activeTab === 'promotion'} onClick={() => setActiveTab('promotion')} icon={<Rocket size={18} />} label={t.promotion} description={t.tabPromoDesc} />
            <TabButton active={activeTab === 'insights'} onClick={() => setActiveTab('insights')} icon={<BarChart3 size={18} />} label={t.insights} description={t.tabInsightsDesc} />
            <TabButton active={activeTab === 'trends'} onClick={() => setActiveTab('trends')} icon={<Flame size={18} />} label={t.trends} description={t.tabTrendsDesc} />
            <TabButton active={activeTab === 'planner'} onClick={() => setActiveTab('planner')} icon={<Calendar size={18} />} label={t.agenda} description={t.tabAgendaDesc} />
            <TabButton active={activeTab === 'checklist'} onClick={() => setActiveTab('checklist')} icon={<CheckCircle2 size={18} />} label={t.checklist} description={t.tabCheckDesc} />
          </div>

          <div className="lg:col-span-9 min-h-[500px] relative">
            <div className={activeTab === 'analyzer' ? "animate-in fade-in duration-300" : "hidden"}>
              <ChannelAnalyzer lang={language} />
            </div>
            <div className={activeTab === 'pitch' ? "animate-in fade-in duration-300" : "hidden"}>
              <PitchGenerator lang={language} />
            </div>
            <div className={activeTab === 'promotion' ? "animate-in fade-in duration-300" : "hidden"}>
              <AutoPromotion lang={language} />
            </div>
            <div className={activeTab === 'insights' ? "animate-in fade-in duration-300" : "hidden"}>
              <AudienceInsights lang={language} />
            </div>
            <div className={activeTab === 'trends' ? "animate-in fade-in duration-300" : "hidden"}>
              <TrendsTool lang={language} />
            </div>
            <div className={activeTab === 'planner' ? "animate-in fade-in duration-300" : "hidden"}>
              <ReleasePlanner lang={language} />
            </div>
            <div className={activeTab === 'checklist' ? "animate-in fade-in duration-300" : "hidden"}>
              <PromotionChecklist />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-8 px-4 text-center text-gray-500 text-xs">
        <p>&copy; 2024 Content Pitch Pro. Powered by Groq AI.</p>
        <p className="mt-2 text-[10px] opacity-50 uppercase tracking-widest">Sucesso em todos os nichos</p>
      </footer>
    </div>
  );
};

const NavBtn: React.FC<{ active: boolean, onClick: () => void, label: string }> = ({ active, onClick, label }) => (
  <button onClick={onClick} className={`text-sm font-medium transition-colors ${active ? 'text-yellow-500' : 'text-gray-400 hover:text-white'}`}>
    {label}
  </button>
);

const TabButton: React.FC<any> = ({ active, onClick, icon, label, description }) => (
  <button onClick={onClick} className={`w-full text-left p-4 rounded-2xl transition-all border ${active ? 'bg-yellow-500/10 border-yellow-500/50 text-white shadow-[0_4px_15px_rgba(234,179,8,0.1)]' : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'}`}>
    <div className="flex items-center gap-3 mb-1">
      <span className={active ? 'text-yellow-500' : 'text-gray-500'}>{icon}</span>
      <span className="font-bold text-sm uppercase tracking-wide">{label}</span>
    </div>
    <p className="text-xs opacity-60 ml-7">{description}</p>
  </button>
);

export default App;