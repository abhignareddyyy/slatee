// AI service using Groq (free tier, fast)
import Groq from 'groq-sdk';

const apiKey = import.meta.env.VITE_GROQ_API_KEY;

export const isAIConfigured = !!apiKey;

// Initialize Groq client
const groq = apiKey ? new Groq({ apiKey, dangerouslyAllowBrowser: true }) : null;

// Types for AI analysis results
export interface ParsedOrderItem {
    product: string;
    quantity: number;
    unit: string;
    confidence: number;
    matchedProductId?: string;
    matchedProductName?: string;
    price?: number;
}

export interface AIAnalysisResult {
    items: ParsedOrderItem[];
    customerName?: string;
    deliveryAddress?: string;
    rawText?: string;
    overallConfidence: number;
    suggestions: string[];
}

// Analyze text using Groq
export async function analyzeTextWithAI(message: string): Promise<AIAnalysisResult | null> {
    if (!groq) return null;

    const prompt = `You are an order analysis assistant for a grocery/retail store. Analyze the following message and extract order items.

Message:
"${message}"

Instructions:
1. Extract product names, quantities, and units
2. Look for customer name if mentioned
3. Look for delivery address if mentioned
4. Be flexible with spelling mistakes and informal language
5. Handle Hindi/English mixed text

Return ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "items": [
    {"product": "Rice", "quantity": 5, "unit": "kg", "confidence": 0.9}
  ],
  "customerName": null,
  "deliveryAddress": null,
  "suggestions": []
}`;

    const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1024,
    });

    const text = response.choices[0]?.message?.content || '';

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response format');

    const parsed = JSON.parse(jsonMatch[0]);

    const avgConfidence = parsed.items?.length > 0
        ? parsed.items.reduce((sum: number, i: ParsedOrderItem) => sum + (i.confidence || 0.5), 0) / parsed.items.length
        : 0;

    return {
        items: parsed.items || [],
        customerName: parsed.customerName || undefined,
        deliveryAddress: parsed.deliveryAddress || undefined,
        overallConfidence: avgConfidence,
        suggestions: parsed.suggestions || [],
    };
}

// Analyze image using Groq (vision model)
export async function analyzeImageWithAI(base64: string, mimeType: string): Promise<AIAnalysisResult | null> {
    if (!groq) return null;

    const response = await groq.chat.completions.create({
        model: 'llama-3.2-90b-vision-preview',
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: `Analyze this image which may contain a handwritten order list, WhatsApp screenshot, or shopping list.
Extract all product items with quantities and units.
Return ONLY valid JSON: {"items": [{"product": "Rice", "quantity": 5, "unit": "kg", "confidence": 0.8}], "customerName": null, "deliveryAddress": null, "rawText": "text from image", "suggestions": []}`,
                    },
                    {
                        type: 'image_url',
                        image_url: { url: `data:${mimeType};base64,${base64}` },
                    },
                ],
            },
        ],
        temperature: 0.3,
        max_tokens: 1024,
    });

    const text = response.choices[0]?.message?.content || '';

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response format');

    const parsed = JSON.parse(jsonMatch[0]);

    const avgConfidence = parsed.items?.length > 0
        ? parsed.items.reduce((sum: number, i: ParsedOrderItem) => sum + (i.confidence || 0.5), 0) / parsed.items.length
        : 0;

    return {
        items: parsed.items || [],
        customerName: parsed.customerName || undefined,
        deliveryAddress: parsed.deliveryAddress || undefined,
        rawText: parsed.rawText || undefined,
        overallConfidence: avgConfidence,
        suggestions: parsed.suggestions || [],
    };
}

// Convert File to base64
export async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Get mime type from file
export function getMimeType(file: File): string {
    return file.type || 'image/jpeg';
}
