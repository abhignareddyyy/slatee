import { useState, useCallback } from 'react';
import {
    isAIConfigured,
    analyzeTextWithAI,
    analyzeImageWithAI,
    fileToBase64,
    getMimeType,
    type AIAnalysisResult,
    type ParsedOrderItem
} from '../lib/ai';
import { useProducts } from './useProducts';

export function useAIAnalysis() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AIAnalysisResult | null>(null);

    const { products } = useProducts();

    // Match parsed items to existing products in database
    const matchProducts = useCallback((items: ParsedOrderItem[]): ParsedOrderItem[] => {
        return items.map(item => {
            const productName = item.product.toLowerCase();

            // Try to find a matching product
            const matchedProduct = products.find(p => {
                const pName = p.name.toLowerCase();
                return pName.includes(productName) || productName.includes(pName);
            });

            if (matchedProduct) {
                return {
                    ...item,
                    matchedProductId: matchedProduct.id,
                    matchedProductName: matchedProduct.name,
                    price: matchedProduct.price,
                };
            }

            return item;
        });
    }, [products]);

    // Analyze text message
    const analyzeText = useCallback(async (message: string): Promise<AIAnalysisResult | null> => {
        if (!isAIConfigured) {
            setError('AI is not configured. Please add VITE_GROQ_API_KEY to your .env.local file.');
            return null;
        }

        if (!message.trim()) {
            setError('Please enter a message to analyze.');
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const analysisResult = await analyzeTextWithAI(message);
            if (!analysisResult) throw new Error('AI analysis failed');

            // Match items to products
            const matchedItems = matchProducts(analysisResult.items);
            const avgConfidence = matchedItems.length > 0
                ? matchedItems.reduce((sum, i) => sum + (i.confidence || 0.5), 0) / matchedItems.length
                : 0;

            const finalResult: AIAnalysisResult = {
                ...analysisResult,
                items: matchedItems,
                overallConfidence: avgConfidence,
            };

            setResult(finalResult);
            return finalResult;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to analyze message';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, [matchProducts]);

    // Analyze image
    const analyzeImage = useCallback(async (file: File): Promise<AIAnalysisResult | null> => {
        if (!isAIConfigured) {
            setError('AI is not configured. Please add VITE_GROQ_API_KEY to your .env.local file.');
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const base64 = await fileToBase64(file);
            const mimeType = getMimeType(file);

            const analysisResult = await analyzeImageWithAI(base64, mimeType);
            if (!analysisResult) throw new Error('AI vision analysis failed');

            // Match items to products
            const matchedItems = matchProducts(analysisResult.items);
            const avgConfidence = matchedItems.length > 0
                ? matchedItems.reduce((sum, i) => sum + (i.confidence || 0.5), 0) / matchedItems.length
                : 0;

            const finalResult: AIAnalysisResult = {
                ...analysisResult,
                items: matchedItems,
                overallConfidence: avgConfidence,
            };

            setResult(finalResult);
            return finalResult;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to analyze image';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, [matchProducts]);

    // Clear results
    const clearResult = useCallback(() => {
        setResult(null);
        setError(null);
    }, []);

    return {
        analyzeText,
        analyzeImage,
        clearResult,
        result,
        loading,
        error,
        isConfigured: isAIConfigured,
    };
}
