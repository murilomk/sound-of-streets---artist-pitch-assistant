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
  const prompt = `Você é um assistente especializado em criar pitches profissionais para criadores de conteúdo e artistas.

Crie um e-mail de pitch profissional para um curador ou parceiro em potencial com as seguintes informações:
- Criador/Autor: ${data.name}
- Título do Trabalho: ${data.contentTitle}
- Categoria/Nicho: ${data.category}
- Estilo/Tom: ${data.style}
- Link: ${data.link}

O e-mail deve:
1. Ter um assunto atraente
2. Apresentar o criador de forma profissional
3. Destacar os pontos fortes do conteúdo
4. Explicar o valor para a audiência alvo
5. Incluir call-to-action claro

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
  const prompt = `Você é um especialista em análise de fit de conteúdo para plataformas digitais.

Analise o seguinte perfil de canal/criador e determine o potencial de engajamento e qualidade:
"${description}"

Retorne APENAS um objeto JSON no formato:
{
  "score": <número de 0 a 100>,
  "feedback": "<análise detalhada e construtiva em ${getLangName(lang)}>"
}`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.5,
    max_tokens: 512,
    response_format: { type: "json_object" }
  });

  return parseJsonResponse(completion.choices[0]?.message?.content || '{}', { score: 50, feedback: "Não foi possível analisar." });
};

export const generatePromotionKit = async (data: Partial<PitchData>, lang: Language): Promise<PromoKit> => {
  const groq = getGroqClient();
  const prompt = `Você é um especialista em marketing digital e estratégias de conteúdo viral.

Crie um kit de divulgação COMPLETO para o conteúdo "${data.contentTitle}" do criador "${data.name}".

Retorne APENAS um objeto JSON com:
{
  "platformTitle": "<título otimizado para a plataforma principal>",
  "platformDescription": "<descrição completa com hashtags e links>",
  "instagramCaption": "<legenda envolvente para Instagram>",
  "tiktokCaption": "<legenda viral para TikTok>",
  "tiktokScript": "<roteiro de 15-30 segs focado em retenção>",
  "twitterPost": "<post impactante para Twitter/X>",
  "hashtags": ["<array de 10-15 hashtags relevantes>"],
  "keywords": ["<array de 8-12 palavras-chave SEO>"],
  "launchStrategy": "<estratégia de distribuição em 3-4 parágrafos>"
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
  const prompt = `Você é um analista de dados estratégico especializado em tendências digitais.

Crie insights de audiência simulados (baseados em padrões reais do mercado atual) para o conteúdo "${contentTitle}".

Retorne APENAS um objeto JSON:
{
  "alerts": [
    {"title": "<título>", "message": "<mensagem>", "type": "viral|timing|growth"},
    {"title": "<título>", "message": "<mensagem>", "type": "viral|timing|growth"},
    {"title": "<título>", "message": "<mensagem>", "type": "viral|timing|growth"}
  ],
  "peakHour": "<horário de pico de engajamento, ex: 19:00-21:00>",
  "bestRegion": "<melhor região geográfica ou demográfica para focar>",
  "engagementTips": ["<dica de retenção>", "<dica de interação>", "<dica de CTA>", "<dica de comunidade>"]
}

Responda em ${getLangName(lang)}.`;

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
  const prompt = `Você é um estrategista de lançamentos digitais.

Crie um cronograma de 10 dias para o lançamento de "${contentTitle}" previsto para ${releaseDate}.

Retorne APENAS um array JSON com 10 eventos:
[
  {
    "day": "D-7",
    "platform": "Instagram|TikTok|YouTube|Twitter|Other",
    "action": "<ação estratégica específica>",
    "recommendedTime": "<horário de postagem>",
    "contentIdea": "<ideia criativa para o post>"
  },
  ...
]

Responda em ${getLangName(lang)}.`;

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
  const prompt = `Você é um analista de tendências digitais globais e criação de conteúdo.

Analise as tendências ATUAIS (dezembro 2024) para criadores de conteúdo na internet.

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
