import { GoogleGenAI, Type } from "@google/genai";
import { TripConsultation, BookingOption } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

function extractJson(text: string): string {
  // Remove markdown code blocks if present
  const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/```([\s\S]*?)\n?```/);
  return jsonMatch ? jsonMatch[1].trim() : text.trim();
}

export async function consultGemini(prompt: string, lang: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `You are a professional travel consultant for "My Travel" agency. Provide detailed, helpful, and inspiring travel advice in ${lang === 'ar' ? 'Arabic' : lang === 'fr' ? 'French' : 'English'}.`,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Consultation error:", error);
    return null;
  }
}

export async function getStructuredTripInfo(location: string, lang: string): Promise<TripConsultation | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide structured travel information for ${location} in ${lang === 'ar' ? 'Arabic' : lang === 'fr' ? 'French' : 'English'}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            visaRequirements: { type: Type.STRING },
            howToApply: { type: Type.STRING },
            bestTimeToVisit: { type: Type.STRING },
            estimatedCost: { type: Type.STRING },
          },
          required: ["visaRequirements", "howToApply", "bestTimeToVisit", "estimatedCost"]
        }
      }
    });
    return JSON.parse(extractJson(response.text || "{}"));
  } catch (error) {
    console.error("Structured info error:", error);
    return null;
  }
}

export async function searchBooking(
  query: string, 
  type: "flight" | "hotel", 
  lang: string, 
  departure?: string,
  options?: any
): Promise<BookingOption[]> {
  try {
    const prompt = type === "flight" 
      ? `Search for flights from ${departure} to ${query} with options: ${JSON.stringify(options)}. Provide all descriptions and names in ${lang === 'ar' ? 'Arabic' : lang === 'fr' ? 'French' : 'English'}.`
      : `Search for hotels in ${query}. Provide all descriptions and names in ${lang === 'ar' ? 'Arabic' : lang === 'fr' ? 'French' : 'English'}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `You are a professional flight and hotel search engine for "My Travel" agency. 
        When searching for flights, provide realistic data similar to what a user would find on professional flight search engines (like vols.dz or Air Algérie). 
        When searching for hotels, provide data similar to booking.com.
        DO NOT mention any external websites, logos, or sources in the final output. 
        Return only the ${type} details in JSON format. 
        Prices should be in EUR. 
        Generate exactly 3 realistic ${type} booking options for ${query}. 
        Ensure the names and details are inspiring and professional. 
        Provide the response in ${lang === 'ar' ? 'Arabic' : lang === 'fr' ? 'French' : 'English'}.
        If you cannot find specific data, generate high-quality realistic placeholders that match the destination.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              airline: { type: Type.STRING },
              flightNumber: { type: Type.STRING },
              departureTime: { type: Type.STRING },
              arrivalTime: { type: Type.STRING },
              duration: { type: Type.STRING },
              stops: { type: Type.NUMBER },
              priceEUR: { type: Type.NUMBER },
              details: { type: Type.STRING },
            },
            required: ["name", "priceEUR", "details"]
          }
        }
      }
    });
    const results = JSON.parse(extractJson(response.text || "[]"));
    
    // Fallback if empty or failed
    if (!results || results.length === 0) {
      if (type === "flight") {
        return [
          {
            name: "Air Algérie Direct",
            airline: "Air Algérie",
            flightNumber: "AH3016",
            departureTime: "10:00",
            arrivalTime: "15:30",
            duration: "3h 30m",
            stops: 0,
            priceEUR: 363, // Approx 79,940 DA
            details: "Best value option - Direct flight"
          },
          {
            name: "Air Algérie Service",
            airline: "Air Algérie",
            flightNumber: "AH1020",
            departureTime: "08:30",
            arrivalTime: "12:45",
            duration: "4h 15m",
            stops: 0,
            priceEUR: 450,
            details: "Direct flight with full service."
          },
          {
            name: "Lufthansa Connection",
            airline: "Lufthansa",
            flightNumber: "LH 1312",
            departureTime: "10:15",
            arrivalTime: "18:30",
            duration: "8h 15m",
            stops: 1,
            priceEUR: 380,
            details: "Comfortable journey with one short stop."
          }
        ];
      }
 else {
        return [
          {
            name: "Grand Plaza Hotel & Spa",
            priceEUR: 120,
            details: "Luxury stay in the heart of the city. Features a rooftop pool and world-class spa."
          },
          {
            name: "City Center Boutique Hotel",
            priceEUR: 85,
            details: "Charming boutique hotel close to all major attractions. Highly rated for service."
          },
          {
            name: "Riverside Resort",
            priceEUR: 150,
            details: "Beautiful resort with stunning views. Perfect for a relaxing getaway."
          }
        ];
      }
    }
    return results;
  } catch (error) {
    console.error("Booking search error:", error);
    return [];
  }
}

export type { TripConsultation, BookingOption };
