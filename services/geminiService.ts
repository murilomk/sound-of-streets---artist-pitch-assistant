
import { GoogleGenAI, Type } from "@google/genai";

export type Language = 'pt' | 'en';

interface PitchData {
  name: string;
  trackTitle: string;
  genre: string;
  mood: string;
  link: string;
}

export interface PromoKit {
  youtubeTitle: string;
  youtubeDescription: string;
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
  platform: 'YouTube' | 'TikTok' | 'Instagram' | 'Spotify';
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

export interface MusicTrend {
  trendingGenres: { name: string; growth: string }[];
  trendingHashtags: string[];
  bestPostingTimes: { platform: string; time: string }[];
  dailyContentSuggestions: { title: string; idea: string }[];
}

const getLangName = (lang: Language) => lang === 'pt' ? 'PORTUGUÊS (Brasil)' : 'ENGLISH';

const cleanJsonResponse = (text: string) => {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const generatePitch = async (data: PitchData, lang: Language): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Gere um e-mail de pitch profissional para @soundofstreets-v1p. Artista: ${data.name}, Track: ${data.trackTitle}, Gênero: ${data.genre}, Mood: ${data.mood}, Link: ${data.link}. Responda em ${getLangName(lang)}.`;
  const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
  return response.text || "";
};

export const analyzeVibe = async (description: string, lang: Language): Promise<{ score: number; feedback: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analise o fit com @soundofstreets-v1p. Descrição: ${description}. Responda em ${getLangName(lang)}.`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: { score: { type: Type.INTEGER }, feedback: { type: Type.STRING } },
        required: ["score", "feedback"],
      },
    },
  });
  return JSON.parse(cleanJsonResponse(response.text || '{"score": 50, "feedback": ""}'));
};

export const generatePromotionKit = async (data: Partial<PitchData>, lang: Language): Promise<PromoKit> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Crie um kit de divulgação completo para "${data.trackTitle}" de "${data.name}". Responda em ${getLangName(lang)}.`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          youtubeTitle: { type: Type.STRING },
          youtubeDescription: { type: Type.STRING },
          instagramCaption: { type: Type.STRING },
          tiktokCaption: { type: Type.STRING },
          tiktokScript: { type: Type.STRING },
          twitterPost: { type: Type.STRING },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          launchStrategy: { type: Type.STRING },
        },
        required: ["youtubeTitle", "youtubeDescription", "instagramCaption", "tiktokCaption", "tiktokScript", "twitterPost", "hashtags", "keywords", "launchStrategy"],
      },
    },
  });
  return JSON.parse(cleanJsonResponse(response.text || '{}'));
};

export const generateAudienceInsights = async (link: string, trackTitle: string, lang: Language): Promise<AudienceData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Simule análise de audiência para "${trackTitle}". Responda em ${getLangName(lang)}.`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          alerts: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, message: { type: Type.STRING }, type: { type: Type.STRING } }, required: ["title", "message", "type"] } },
          peakHour: { type: Type.STRING },
          bestRegion: { type: Type.STRING },
          engagementTips: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["alerts", "peakHour", "bestRegion", "engagementTips"],
      }
    }
  });
  return JSON.parse(cleanJsonResponse(response.text || '{}'));
};

export const generateReleaseSchedule = async (trackTitle: string, releaseDate: string, lang: Language): Promise<ScheduleEvent[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Crie cronograma de 10 dias para "${trackTitle}" em ${releaseDate}. Responda em ${getLangName(lang)}.`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.STRING },
            platform: { type: Type.STRING },
            action: { type: Type.STRING },
            recommendedTime: { type: Type.STRING },
            contentIdea: { type: Type.STRING }
          },
          required: ["day", "platform", "action", "recommendedTime", "contentIdea"]
        }
      }
    }
  });
  return JSON.parse(cleanJsonResponse(response.text || '[]'));
};

export const getVideoEditSuggestions = async (trackInfo: string, lang: Language): Promise<VideoSuggestion[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Sugira momentos para shorts/tiktok para "${trackInfo}". Responda em ${getLangName(lang)}.`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            timestamp: { type: Type.STRING },
            reason: { type: Type.STRING },
            hook: { type: Type.STRING }
          },
          required: ["timestamp", "reason", "hook"]
        }
      }
    }
  });
  return JSON.parse(cleanJsonResponse(response.text || '[]'));
};

export const generateThumbnail = async (prompt: string, lang: Language): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: `YouTube thumbnail urban rap: ${prompt}. Cinematic lighting.` }] },
    config: { imageConfig: { aspectRatio: "16:9" } }
  });
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("Falha.");
};

export const prepareDistributionConfig = async (trackTitle: string, lang: Language): Promise<DistributionFormat[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Configs multicanal para "${trackTitle}". Responda em ${getLangName(lang)}.`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            platform: { type: Type.STRING },
            aspectRatio: { type: Type.STRING },
            maxDuration: { type: Type.STRING },
            optimizationNote: { type: Type.STRING },
            suggestedAction: { type: Type.STRING }
          },
          required: ["platform", "aspectRatio", "maxDuration", "optimizationNote", "suggestedAction"]
        }
      }
    }
  });
  return JSON.parse(cleanJsonResponse(response.text || '[]'));
};

export const getMusicTrends = async (lang: Language): Promise<MusicTrend> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analise as tendências atuais da música urbana (Trap, Rap, Drill). Responda em ${getLangName(lang)}. Inclua ritmos, hashtags, horários e ideias de conteúdo.`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          trendingGenres: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, growth: { type: Type.STRING } }, required: ["name", "growth"] } },
          trendingHashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          bestPostingTimes: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { platform: { type: Type.STRING }, time: { type: Type.STRING } }, required: ["platform", "time"] } },
          dailyContentSuggestions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, idea: { type: Type.STRING } }, required: ["title", "idea"] } }
        },
        required: ["trendingGenres", "trendingHashtags", "bestPostingTimes", "dailyContentSuggestions"]
      }
    }
  });
  return JSON.parse(cleanJsonResponse(response.text || '{}'));
};
