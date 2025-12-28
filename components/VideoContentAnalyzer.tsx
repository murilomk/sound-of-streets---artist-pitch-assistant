import React, { useState, useEffect } from 'react';
import {
    Video, Upload, Link as LinkIcon, AlertCircle, CheckCircle2, XCircle,
    TrendingUp, Play, FileVideo, Music, Mic, Clock, Megaphone,
    Youtube, Instagram, Copy, RefreshCw, BarChart
} from 'lucide-react';
import { analyzeVideoStrategy, VideoAnalysisResult, Language, ContentMode } from '../services/geminiService';

interface VideoContentAnalyzerProps {
    lang: Language;
}

export const VideoContentAnalyzer: React.FC<VideoContentAnalyzerProps> = ({ lang }) => {
    const [mode, setMode] = useState<'link' | 'upload'>('link');
    const [contentMode, setContentMode] = useState<ContentMode>('short');
    const [content, setContent] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<VideoAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    // Translations
    const t = {
        pt: {
            title: "Análise de Conteúdo",
            subtitle: "Seu consultor de IA para otimizar vídeos, músicas e anúncios.",
            modes: {
                music: "Música",
                short: "Curto/Reels",
                long: "Vídeo Longo",
                ad: "Anúncio"
            },
            tabs: { link: "Análise por Link", upload: "Upload de Vídeo" },
            placeholders: {
                link: "Cole o link (YouTube, TikTok, Reels)...",
                upload: "Arraste seu vídeo ou clique para selecionar (MP4, MOV)",
                context: "Descreva o objetivo ou contexto do vídeo..."
            },
            buttons: {
                analyze: "Analisar Conteúdo com IA",
                analyzing: "IA Analisando...",
                uploading: "Enviando...",
                new: "Nova Análise",
                copy: "Copiar Feedback"
            },
            results: {
                score: "Nota Geral",
                viral: "Potencial Viral",
                good: "Pontos Fortes",
                bad: "Pontos Fracos",
                improve: "O que melhorar",
                suggestions: "Sugestões Práticas",
                verdict: "Veredito Final"
            },
            notes: {
                upload: "Limite: 500MB. Suporta MP4, MOV, WEBM.",
                link: "Plataforma detectada automaticamente."
            }
        },
        en: {
            title: "Content Analysis",
            subtitle: "Your AI consultant to optimize videos, music, and ads.",
            modes: {
                music: "Music",
                short: "Short/Reels",
                long: "Long Video",
                ad: "Ad/Promo"
            },
            tabs: { link: "Link Analysis", upload: "Video Upload" },
            placeholders: {
                link: "Paste link (YouTube, TikTok, Reels)...",
                upload: "Drag video or click to upload (MP4, MOV)",
                context: "Describe the video goal or context..."
            },
            buttons: {
                analyze: "Analyze Content with AI",
                analyzing: "AI Analyzing...",
                uploading: "Uploading...",
                new: "New Analysis",
                copy: "Copy Feedback"
            },
            results: {
                score: "Overall Score",
                viral: "Viral Potential",
                good: "Strengths",
                bad: "Weaknesses",
                improve: "Start Improving",
                suggestions: "Practical Suggestions",
                verdict: "Final Verdict"
            },
            notes: {
                upload: "Limit: 500MB. Support MP4, MOV, WEBM.",
                link: "Platform detected automatically."
            }
        }
    }[lang];

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > 500 * 1024 * 1024) {
                alert("File too large (>500MB)");
                return;
            }
            setFile(selectedFile);
            setContent(selectedFile.name); // Using filename as content for specific mock analysis
            simulateUpload();
        }
    };

    const simulateUpload = () => {
        setIsUploading(true);
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const handleAnalyze = async () => {
        if (!content.trim()) return;

        setIsAnalyzing(true);
        setResult(null);
        setError(null);

        try {
            // In a real scenario, we'd send the file or link to a backend that extracts frames/audio
            // Here we simulate the context by sending the user provided text/link + selected mode
            const analysis = await analyzeVideoStrategy(content, mode === 'link' ? 'link' : 'file', lang, contentMode);
            setResult(analysis);
        } catch (error: any) {
            console.error("Analysis failed", error);
            setError(error.message || "Falha na análise. Verifique sua conexão ou tente novamente.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const copyFeedback = () => {
        if (!result) return;
        const text = `
${t.results.score}: ${result.score}/10
${t.results.viral}: ${result.viralPotential}

${t.results.verdict}: ${result.verdict}

✅ ${t.results.good}:
${result.positives.map(p => `- ${p}`).join('\n')}

❌ ${t.results.bad}:
${result.negatives.map(p => `- ${p}`).join('\n')}

💡 ${t.results.suggestions}:
${result.suggestions.map(p => `- ${p}`).join('\n')}
    `.trim();
        navigator.clipboard.writeText(text);
        alert("Feedback copiado!");
    };

    const getPlatformIcon = (url: string) => {
        if (url.includes('youtube') || url.includes('youtu.be')) return <Youtube className="text-red-500" />;
        if (url.includes('instagram')) return <Instagram className="text-pink-500" />;
        if (url.includes('tiktok')) return <span className="text-white font-bold text-xs bg-black px-1 rounded">TikTok</span>;
        return <LinkIcon className="text-gray-400" />;
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-3xl md:text-4xl font-brand text-yellow-500 uppercase tracking-widest">{t.title}</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">{t.subtitle}</p>
            </div>

            {/* Mode Selector */}
            <div className="flex flex-wrap justify-center gap-4">
                {[
                    { id: 'music', label: t.modes.music, icon: <Music size={18} /> },
                    { id: 'short', label: t.modes.short, icon: <Clock size={18} /> },
                    { id: 'long', label: t.modes.long, icon: <Play size={18} /> },
                    { id: 'ad', label: t.modes.ad, icon: <Megaphone size={18} /> },
                ].map((m) => (
                    <button
                        key={m.id}
                        onClick={() => setContentMode(m.id as ContentMode)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all border ${contentMode === m.id
                            ? 'bg-yellow-500 text-black border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                            : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                            }`}
                    >
                        {m.icon}
                        {m.label}
                    </button>
                ))}
            </div>

            <div className="glass p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8">
                {/* Tabs */}
                <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
                    <button
                        onClick={() => setMode('link')}
                        className={`flex-1 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${mode === 'link' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <LinkIcon size={18} />
                        {t.tabs.link}
                    </button>
                    <button
                        onClick={() => setMode('upload')}
                        className={`flex-1 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${mode === 'upload' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <Upload size={18} />
                        {t.tabs.upload}
                    </button>
                </div>

                {/* Input Area */}
                <div className="space-y-6">
                    {mode === 'link' ? (
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-transform group-focus-within:scale-110">
                                {content ? getPlatformIcon(content) : <LinkIcon className="text-gray-500" size={20} />}
                            </div>
                            <input
                                type="text"
                                placeholder={t.placeholders.link}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-5 pl-12 pr-4 text-white placeholder-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all text-lg"
                            />
                            <p className="text-xs text-gray-600 mt-2 ml-1 flex items-center gap-1"><CheckCircle2 size={10} /> {t.notes.link}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <label
                                className={`border-2 border-dashed rounded-xl p-10 text-center bg-black/20 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group ${content ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 hover:border-yellow-500/50 hover:bg-white/5'
                                    }`}
                            >
                                <input type="file" accept="video/mp4,video/quicktime,video/webm" onChange={handleFileUpload} className="hidden" />
                                {content ? (
                                    <>
                                        <FileVideo size={48} className="text-green-500" />
                                        <div className="space-y-1">
                                            <p className="font-bold text-white">{content}</p>
                                            <p className="text-xs text-green-500">Pronto para análise</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="bg-white/5 p-4 rounded-full group-hover:scale-110 transition-transform">
                                            <Upload className="text-gray-400 group-hover:text-yellow-500 transition-colors" size={32} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-gray-300">{t.placeholders.upload}</p>
                                            <p className="text-xs text-gray-500">{t.notes.upload}</p>
                                        </div>
                                    </>
                                )}
                            </label>

                            {/* Progress Bar */}
                            {isUploading && (
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>{t.buttons.uploading}</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-500 transition-all duration-200"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Context Input for File Mode (since we can't really upload 500MB to text-LLM) */}
                            <div className="bg-yellow-500/5 p-4 rounded-xl border border-yellow-500/10">
                                <p className="text-xs text-yellow-500 mb-2 flex items-center gap-1">
                                    <AlertCircle size={12} /> Ajude a IA a ver seu vídeo (Contexto):
                                </p>
                                <textarea
                                    placeholder={t.placeholders.context}
                                    rows={2}
                                    className="w-full bg-transparent border-none text-sm text-white placeholder-gray-600 focus:ring-0 resize-none"
                                    onChange={(e) => setContent(prev => prev + " | Contexto: " + e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || (mode === 'link' && !content) || (mode === 'upload' && (!file || isUploading))}
                        className="w-full py-5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-brand text-xl uppercase tracking-wider rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)]"
                    >
                        {isAnalyzing ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                                {t.buttons.analyzing}
                            </>
                        ) : (
                            <>
                                <TrendingUp size={24} />
                                {t.buttons.analyze}
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                    <AlertCircle size={20} />
                    <p>{error}</p>
                </div>
            )}

            {/* Structured Results */}
            {result && (
                <div className="space-y-8 animate-in slide-in-from-bottom-5 fade-in duration-500">

                    {/* Main Action Bar */}
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setResult(null)} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg text-sm font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                            <RefreshCw size={16} /> {t.buttons.new}
                        </button>
                        <button onClick={copyFeedback} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg text-sm font-bold text-green-500 hover:text-green-400 hover:bg-white/10 transition-all border border-green-500/20">
                            <Copy size={16} /> {t.buttons.copy}
                        </button>
                    </div>

                    {/* Top Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass p-8 rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-transparent flex items-center justify-between relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-gray-400 text-sm uppercase tracking-widest mb-1">{t.results.score}</p>
                                <span className="text-6xl font-brand text-white">{result.score}<span className="text-2xl text-gray-500">/10</span></span>
                            </div>
                            <div className="relative z-10 text-right">
                                <p className="text-gray-400 text-sm uppercase tracking-widest mb-1">{t.results.viral}</p>
                                <span className={`text-2xl font-bold px-4 py-1 rounded-full border ${result.viralPotential === 'Alto' ? 'text-green-500 border-green-500 bg-green-500/10' :
                                    result.viralPotential === 'Médio' ? 'text-yellow-500 border-yellow-500 bg-yellow-500/10' :
                                        'text-red-500 border-red-500 bg-red-500/10'
                                    }`}>
                                    {result.viralPotential}
                                </span>
                            </div>
                            <BarChart className="absolute -bottom-4 -left-4 text-yellow-500/10 transform rotate-12" size={150} />
                        </div>

                        <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col justify-center">
                            <p className="text-gray-400 text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Mic size={16} className="text-yellow-500" /> {t.results.verdict}
                            </p>
                            <p className="text-xl md:text-2xl font-medium text-white italic leading-relaxed">
                                "{result.verdict}"
                            </p>
                        </div>
                    </div>

                    {/* Detailed analysis blocks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Strengths */}
                        <div className="glass p-6 rounded-2xl border-l-4 border-green-500">
                            <h3 className="flex items-center gap-2 font-bold text-green-500 mb-4 text-lg">
                                <CheckCircle2 /> {t.results.good}
                            </h3>
                            <ul className="space-y-3">
                                {result.positives.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 bg-green-500/5 p-3 rounded-lg border border-green-500/10">
                                        <span className="text-green-500 font-bold">•</span>
                                        <span className="text-gray-300 text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Weaknesses */}
                        <div className="glass p-6 rounded-2xl border-l-4 border-red-500">
                            <h3 className="flex items-center gap-2 font-bold text-red-500 mb-4 text-lg">
                                <XCircle /> {t.results.bad}
                            </h3>
                            <ul className="space-y-3">
                                {result.negatives.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 bg-red-500/5 p-3 rounded-lg border border-red-500/10">
                                        <span className="text-red-500 font-bold">•</span>
                                        <span className="text-gray-300 text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Improvements & Suggestions */}
                    <div className="glass p-8 rounded-3xl border border-blue-500/20 bg-blue-500/5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="flex items-center gap-2 font-bold text-blue-400 mb-4 uppercase tracking-wider">
                                    <TrendingUp size={18} /> {t.results.improve}
                                </h3>
                                <ul className="space-y-2">
                                    {result.improvements.map((item, i) => (
                                        <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                                            <span className="text-blue-500 mt-1">➜</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="flex items-center gap-2 font-bold text-yellow-500 mb-4 uppercase tracking-wider">
                                    <Megaphone size={18} /> {t.results.suggestions}
                                </h3>
                                <div className="space-y-3">
                                    {result.suggestions.map((item, i) => (
                                        <div key={i} className="bg-black/30 p-3 rounded-lg border border-white/5 text-sm text-gray-200">
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
