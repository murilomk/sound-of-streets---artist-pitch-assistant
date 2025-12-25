import Groq from "groq-sdk";

export type Language = 'pt' | 'en';

interface PitchData {
  name: string;
  contentTitle: string;
  category: string;
  style: string;
  link: string;
}

export interface PromoKit {
  platformTitle: string;
  platformDescription: string;
  instagramCaption: string;
  tiktokCaption: string;
  tiktokScript: string;
  twitterPost: string;
  hashtags: string[];
  keywords: string[];
  launchStrategy: string;
}

export interface AudienceAlert {
  title: string;
  message: string;
  type: 'viral' | 'timing' | 'growth';
}

export interface AudienceData {
  alerts: AudienceAlert[];
  peakHour: string;
  bestRegion: string;
  engagementTips: string[];
}

export interface ScheduleEvent {
  day: string;
  platform: 'YouTube' | 'TikTok' | 'Instagram' | 'Spotify' | 'Other';
  action: string;
  recommendedTime: string;
  contentIdea: string;
}

export interface VideoSuggestion {
  timestamp: string;
  reason: string;
  hook: string;
}

export interface DistributionFormat {
  platform: string;
  aspectRatio: string;
  maxDuration: string;
  optimizationNote: string;
  suggestedAction: string;
}

export interface ContentTrend {
  trendingTopics: { name: string; growth: string }[];
  trendingHashtags: string[];
  bestPostingTimes: { platform: string; time: string }[];
  dailyContentSuggestions: { title: string; idea: string }[];
}

// Initialize Groq client
const getGroqClient = () => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("VITE_GROQ_API_KEY não configurada. Adicione sua chave no arquivo .env.local");
  }
  return new Groq({ apiKey, dangerouslyAllowBrowser: true });
};

const getLangName = (lang: Language) => lang === 'pt' ? 'PORTUGUÊS (Brasil)' : 'ENGLISH';

const parseJsonResponse = (text: string, fallback: any = {}) => {
  try {
    // Remove markdown code blocks if present
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    return fallback;
  }
};

export const generatePitch = async (data: PitchData, lang: Language): Promise<string> => {
  const groq = getGroqClient();
  const prompt = `Você é um estrategista de negócios de elite e agente de talentos de alto nível.
  
Crie um pitch imbatível e ultra-assertivo para:
- Criador/Autor: ${data.name}
- Título do Trabalho: ${data.contentTitle}
- Categoria/Nicho: ${data.category}
- Estilo/Tom: ${data.style}
- Link: ${data.link}

Regras Cruciais:
1. Assunto magnético: Use gatilhos mentais para abrir o e-mail em segundos.
2. Sem enrolação: Vá direto ao ponto e destaque o retorno que o parceiro terá.
3. Autoridade: A linguagem deve exalar confiança, não parecer um pedido de favor.
4. Escassez e Valor: Mostre por que esse conteúdo é único no mercado agora.
5. CTA Inevitável: Uma chamada para ação que não possa ser ignorada.

Responda em ${getLangName(lang)}.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 1024,
  });

  return completion.choices[0]?.message?.content || "";
};

export const analyzeVibe = async (description: string, lang: Language): Promise<{ score: number; feedback: string }> => {
  const groq = getGroqClient();
  const prompt = `Você é um Head de Conteúdo brutalmente honesto de uma grande rede de mídia.
  
Analise o potencial de mercado desse criador:
"${description}"

Diretrizes de Resposta:
1. Seja direto: Se a ideia for ruim, explique o porquê sem rodeios. Se for boa, aponte como escalar.
2. Foco em Trend-jacking: Como isso se conecta com a cultura atual?
3. SWOT Rápida: Foque nos pontos de falha que podem matar o canal.

Retorne APENAS um objeto JSON no formato:
{
  "score": <0-100 refletindo real potencial de monetização e viralidade>,
  "feedback": "<análise ácida, estratégica e de alto impacto em ${getLangName(lang)}>"
}`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
    max_tokens: 512,
    response_format: { type: "json_object" }
  });

  return parseJsonResponse(completion.choices[0]?.message?.content || '{}', { score: 50, feedback: "Não foi possível analisar." });
};

export const generatePromotionKit = async (data: Partial<PitchData>, lang: Language): Promise<PromoKit> => {
  const groq = getGroqClient();
  const prompt = `Você é um Growth Hacker e Especialista em Viralização Multi-plataforma.
  
Crie um kit de guerra para o lançamento de "${data.contentTitle}" de "${data.name}".

Conteúdo Exigido:
1. Título "Magnético": Focado em CTR absurdo.
2. Descrição SEO Turbo: Otimizada para algoritmos de busca de 2025.
3. Captions de Alto Impacto: Gatilhos emocionais e retenção pura.
4. Roteiro de Retenção: Otimize cada segundo dos 15-30 seg para evitar o 'scroll'.
5. Estratégia de Guerrilha: 3-4 parágrafos de ações não convencionais para forçar o algoritmo.

Retorne APENAS um objeto JSON:
{
  "platformTitle": "...",
  "platformDescription": "...",
  "instagramCaption": "...",
  "tiktokCaption": "...",
  "tiktokScript": "...",
  "twitterPost": "...",
  "hashtags": ["15 tags estratégicas"],
  "keywords": ["10 termos de alto volume SEO"],
  "launchStrategy": "..."
}

Responda em ${getLangName(lang)}.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.8,
    max_tokens: 2048,
    response_format: { type: "json_object" }
  });

  return parseJsonResponse(completion.choices[0]?.message?.content || '{}', {
    platformTitle: "",
    platformDescription: "",
    instagramCaption: "",
    tiktokCaption: "",
    tiktokScript: "",
    twitterPost: "",
    hashtags: [],
    keywords: [],
    launchStrategy: ""
  });
};

export const generateAudienceInsights = async (link: string, contentTitle: string, lang: Language): Promise<AudienceData> => {
  const groq = getGroqClient();
  const prompt = `Você é um Quant-Analyst e Especialista em Psicologia de Audiência.
  
Preveja o comportamento e métricas para "${contentTitle}" com precisão estratégica.

O JSON deve conter:
1. Alertas de "Crise ou Oportunidade": Identifique falhas no timing ou brechas de viralização rápida.
2. Peak Hour: O minuto exato de maior pico baseado em janelas de retenção.
3. Audience Profile: Quem são e o que eles querem agora.
4. Growth Hacks: 4 dicas táticas agressivas para dobrar o engajamento orgânico.

Retorne APENAS um objeto JSON. Responda em ${getLangName(lang)}.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 1024,
    response_format: { type: "json_object" }
  });

  return parseJsonResponse(completion.choices[0]?.message?.content || '{}', {
    alerts: [],
    peakHour: "",
    bestRegion: "",
    engagementTips: []
  });
};

export const generateReleaseSchedule = async (contentTitle: string, releaseDate: string, lang: Language): Promise<ScheduleEvent[]> => {
  const groq = getGroqClient();
  const prompt = `Você é um Strategist Master de Lançamentos Milionários.
  
Crie uma "Operação de Guerra" de 10 dias para explodir o lançamento de "${contentTitle}" marcado para ${releaseDate}.

Requisitos:
1. Calendário Agressivo: Cada dia deve ter uma missão de alto impacto.
2. Timing de Mestre: Horários calculados para máxima entrega do algoritmo.
3. Ideias Disruptivas: Fuja do óbvio "venha ver meu vídeo". Crie curiosidade e FOMO.

Retorne APENAS um array JSON com 10 missões diárias. Responda em ${getLangName(lang)}.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 2048,
    response_format: { type: "json_object" }
  });

  const result = parseJsonResponse(completion.choices[0]?.message?.content || '{}', { schedule: [] });
  return result.schedule || result.events || result || [];
};

export const getVideoEditSuggestions = async (contentInfo: string, lang: Language): Promise<VideoSuggestion[]> => {
  const groq = getGroqClient();
  const prompt = `Você é um especialista em edição de vídeos de alta retenção para TikTok, Reels e Shorts.

Para o conteúdo: "${contentInfo}"

Sugira 5 momentos ou estilos de corte ideais para maximizar o alcance orgânico.

Retorne APENAS um array JSON:
[
  {
    "timestamp": "Sugestão de tempo ou momento",
    "reason": "<por que esse formato/momento engaja>",
    "hook": "<gancho visual ou textual para os primeiros 3 segundos>"
  },
  ...
]

Responda em ${getLangName(lang)}.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.8,
    max_tokens: 1024,
    response_format: { type: "json_object" }
  });

  const result = parseJsonResponse(completion.choices[0]?.message?.content || '{}', { suggestions: [] });
  return result.suggestions || result.clips || result || [];
};

export const prepareDistributionConfig = async (contentTitle: string, lang: Language): Promise<DistributionFormat[]> => {
  const groq = getGroqClient();
  const prompt = `Você é um especialista em otimização multiplataforma.

Crie configurações de distribuição otimizadas para o conteúdo "${contentTitle}" em diferentes redes sociais.

Retorne APENAS um array JSON:
[
  {
    "platform": "<nome da plataforma>",
    "aspectRatio": "<proporção de tela recomendada>",
    "maxDuration": "<duração ideal para o algoritmo>",
    "optimizationNote": "<nota sobre o algoritmo ou SEO>",
    "suggestedAction": "<ação imediata>"
  },
  ...
]

Inclua: YouTube, TikTok, Instagram Reels, Instagram Feed, Twitter.

Responda em ${getLangName(lang)}.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.5,
    max_tokens: 1536,
    response_format: { type: "json_object" }
  });

  const result = parseJsonResponse(completion.choices[0]?.message?.content || '{}', { formats: [] });
  return result.formats || result.platforms || result || [];
};

export const getMusicTrends = async (lang: Language): Promise<ContentTrend> => {
  const groq = getGroqClient();
  const prompt = `Você é o Diretor Global de Insights Criativos do TikTok e YouTube.
  
Analise o zeitgeist atual e as tendências de "vanguarda" para criadores (Dezembro 2024 / Janeiro 2025).

Retorne APENAS um objeto JSON:
{
  "trendingTopics": [
    {"name": "<tópico/nicho em alta>", "growth": "<nível de crescimento ou descrição>"},
    {"name": "<tópico/nicho em alta>", "growth": "<nível de crescimento ou descrição>"},
    {"name": "<tópico/nicho em alta>", "growth": "<nível de crescimento ou descrição>"}
  ],
  "trendingHashtags": ["<hashtag1>", "<hashtag2>", "...<12 hashtags>"],
  "bestPostingTimes": [
    {"platform": "TikTok", "time": "<horário recomendada>"},
    {"platform": "Instagram", "time": "<horário recomendada>"},
    {"platform": "YouTube", "time": "<horário recomendada>"}
  ],
  "dailyContentSuggestions": [
    {"title": "<ideia de conteúdo>", "idea": "<descrição curta da execução>"},
    {"title": "<ideia de conteúdo>", "idea": "<descrição curta da execução>"},
    {"title": "<ideia de conteúdo>", "idea": "<descrição curta da execução>"},
    {"title": "<ideia de conteúdo>", "idea": "<descrição curta da execução>"},
    {"title": "<ideia de conteúdo>", "idea": "<descrição curta da execução>"}
  ]
}

Responda em ${getLangName(lang)}.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 2048,
    response_format: { type: "json_object" }
  });

  return parseJsonResponse(completion.choices[0]?.message?.content || '{}', {
    trendingTopics: [],
    trendingHashtags: [],
    bestPostingTimes: [],
    dailyContentSuggestions: []
  });
};

export const generateThumbnail = async (promptInfo: string, lang: Language): Promise<string> => {
  const groq = getGroqClient();
  const prompt = `Você é um gerador de comandos para IAs de imagem (como Midjourney ou DALL-E).
  
Crie um prompt detalhado e visualmente impactante para uma capa/thumbnail com base nesta descrição:
"${promptInfo}"

O estilo deve ser moderno, com cores vibrantes e composição estratégica para YouTube.
Retorne APENAS o link de uma imagem placeholder premium que represente o estilo (via Unsplash Source ou similar) ou uma descrição textual do prompt se preferir, mas como o app espera uma URL, usaremos uma URL baseada em keywords:
https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1280&h=720

Responda APENAS com a URL.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 256,
  });

  const content = completion.choices[0]?.message?.content || "";
  const urlMatch = content.match(/https?:\/\/[^\s]+/);
  return urlMatch ? urlMatch[0] : "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1280&h=720";
};
