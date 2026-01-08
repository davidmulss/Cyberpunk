import { GoogleGenAI, Type } from "@google/genai";
import { AssetData, ApiResponse, GroundingSource, NewsItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchMarketNews = async (): Promise<NewsItem[]> => {
  if (!process.env.API_KEY) return [];

  try {
    const modelId = "gemini-3-flash-preview";
    
    const newsSchema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          source: { type: Type.STRING },
          time: { type: Type.STRING, description: "Relative time (e.g. '5m ago', '1h ago')" },
          url: { type: Type.STRING, description: "URL to the news article if available, otherwise empty." },
          sentiment: { type: Type.STRING, enum: ["positive", "negative", "neutral"] },
          isBreaking: { type: Type.BOOLEAN, description: "True if the news is high-impact and happened within the last hour." }
        },
        required: ["title", "source", "time", "sentiment", "isBreaking"]
      }
    };

    const response = await ai.models.generateContent({
      model: modelId,
      contents: "Search for the absolute latest financial market news headlines right now. Look for 'breaking news' tags on Yahoo Finance, Bloomberg, or CoinDesk. If a major market-moving event happened in the last hour, mark 'isBreaking' as true.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: newsSchema,
        systemInstruction: "You are a real-time financial news scanner. Prioritize accuracy and recency. Flag urgent stories as breaking."
      }
    });

    const rawText = response.text;
    if (!rawText) return [];

    return JSON.parse(rawText) as NewsItem[];
  } catch (e) {
    console.error("Failed to fetch news", e);
    return [];
  }
};

export const fetchAssetInformation = async (query: string): Promise<ApiResponse> => {
  try {
    const modelId = "gemini-3-flash-preview"; 

    // Define the schema with new Forecast fields
    const assetSchema = {
      type: Type.OBJECT,
      properties: {
        symbol: { type: Type.STRING, description: "The ticker symbol (e.g., AAPL, BTC)." },
        name: { type: Type.STRING, description: "The full name of the asset." },
        price: { type: Type.NUMBER, description: "The EXACT current real-time price from the search result." },
        currency: { type: Type.STRING, description: "Currency symbol (e.g., USD, EUR)." },
        changePercent: { type: Type.NUMBER, description: "24h or daily percentage change." },
        changeValue: { type: Type.NUMBER, description: "24h or daily value change." },
        marketCap: { type: Type.STRING, description: "Market Capitalization formatted string." },
        volume: { type: Type.STRING, description: "Volume formatted string." },
        peRatio: { type: Type.STRING, description: "P/E Ratio or 'N/A'." },
        weekRange: { type: Type.STRING, description: "52 Week Range." },
        movingAverage50d: { type: Type.STRING, description: "50-Day Moving Average formatted price." },
        movingAverage200d: { type: Type.STRING, description: "200-Day Moving Average formatted price." },
        description: { type: Type.STRING, description: "Brief description of the asset (max 2 sentences)." },
        
        // New Analyst fields
        analystRating: { 
            type: Type.STRING, 
            enum: ['Strong Buy', 'Buy', 'Hold', 'Sell', 'Strong Sell'],
            description: "Consensus analyst rating." 
        },
        priceTarget: { type: Type.STRING, description: "Average analyst price target (e.g. '$150.00')." },
        forecastDescription: { 
            type: Type.STRING, 
            description: "A summary of forecasts from major institutions (Goldman Sachs, Morgan Stanley, JP Morgan, etc.) explaining why it is a Buy/Sell/Hold." 
        },

        chartData24H: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING, description: "Format: HH:MM" },
              value: { type: Type.NUMBER }
            }
          }
        },
        chartData7D: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                date: { type: Type.STRING, description: "Format: DD/MM" },
                value: { type: Type.NUMBER }
              }
            }
          },
        chartData1M: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING, description: "Format: MMM DD" },
              value: { type: Type.NUMBER }
            }
          }
        },
        chartData1Y: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING, description: "Format: MMM 'YY" },
              value: { type: Type.NUMBER }
            }
          }
        },
        chartData5Y: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING, description: "Format: YYYY" },
              value: { type: Type.NUMBER }
            }
          }
        },
        stats: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    label: { type: Type.STRING },
                    value: { type: Type.STRING }
                }
            }
        }
      },
      required: ["symbol", "name", "price", "changePercent", "analystRating", "forecastDescription", "chartData24H", "chartData7D", "chartData1M", "chartData1Y", "chartData5Y"]
    };

    const response = await ai.models.generateContent({
      model: modelId,
      contents: `
      You are a specialized Real-Time Financial Data Engine.
      
      TARGET ASSET: '${query}'

      YOUR MISSION:
      1. **GET EXACT PRICE**: 
         - **CRYPTO**: Search specifically for "${query} coinmarketcap price live" and "${query} binance price". Prioritize CoinMarketCap.
         - **STOCKS**: Search "${query} yahoo finance price live".
      2. **VERIFY**: Look at the latest timestamped result. If CoinMarketCap says $1.82 and Yahoo says $1.82, use 1.82. Do not use Yesterday's close.
      3. **EXTRACT**: Get the Price, Change %, Market Cap, and Volume.
      4. **FORECAST**: Search for "${query} stock forecast analyst ratings" or "${query} crypto price prediction 2025".
      5. **CHART SYNC**: Generate the chart data. 
         - **CRITICAL**: The LAST entry in 'chartData24H', 'chartData7D', 'chartData1M', 'chartData1Y', and 'chartData5Y' MUST be EXACTLY equal to the 'price' you found in step 2.
         - **SOURCE**: For crypto, approximate the curve based on CoinMarketCap's 24h and 7d charts found in search images or descriptions.
      
      Output strict JSON.
      `,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: assetSchema,
        systemInstruction: "You are a low-latency financial data fetcher. You NEVER guess the price. You ALWAYS extract the most recent bold text price from the search snippets. You MUST synchronize the chart's final data point with the current price."
      }
    });

    const rawText = response.text;
    if (!rawText) {
        throw new Error("No response text generated.");
    }

    const assetData: AssetData = JSON.parse(rawText);

    // Extract grounding metadata (sources)
    const sources: GroundingSource[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title,
            url: chunk.web.uri
          });
        }
      });
    }

    const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => (t.url === v.url)) === i);

    return {
      asset: assetData,
      sources: uniqueSources
    };

  } catch (err: any) {
    console.error("Gemini API Error:", err);
    return {
      asset: null,
      sources: [],
      error: err.message || "Failed to fetch asset data. Please try again."
    };
  }
};
