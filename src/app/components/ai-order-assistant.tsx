import { useState, useRef, useCallback } from 'react';
import { Sidebar } from './sidebar';
import { useAIAnalysis } from '../../hooks/useAIAnalysis';
import { useCreateOrder } from '../../hooks/useOrders';
import { useCustomers } from '../../hooks/useCustomers';
import type { ParsedOrderItem } from '../../lib/ai';

export function AIOrderAssistant() {
    const [inputMode, setInputMode] = useState<'text' | 'image'>('text');
    const [messageInput, setMessageInput] = useState('');
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
    const [editableItems, setEditableItems] = useState<ParsedOrderItem[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { analyzeText, analyzeImage, result, loading, error, isConfigured, clearResult } = useAIAnalysis();
    const { createOrder, loading: creatingOrder } = useCreateOrder();
    const { customers } = useCustomers();

    // Handle text analysis
    const handleAnalyzeText = async () => {
        const analysisResult = await analyzeText(messageInput);
        if (analysisResult) {
            setEditableItems(analysisResult.items);
        }
    };

    // Handle image upload
    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);

        // Analyze image
        const analysisResult = await analyzeImage(file);
        if (analysisResult) {
            setEditableItems(analysisResult.items);
        }
    };

    // Handle drag and drop
    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file || !file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);

        const analysisResult = await analyzeImage(file);
        if (analysisResult) {
            setEditableItems(analysisResult.items);
        }
    }, [analyzeImage]);

    // Update item quantity
    const updateItemQuantity = (index: number, quantity: number) => {
        const updated = [...editableItems];
        updated[index] = { ...updated[index], quantity };
        setEditableItems(updated);
    };

    // Remove item
    const removeItem = (index: number) => {
        setEditableItems(items => items.filter((_, i) => i !== index));
    };

    // Calculate total
    const total = editableItems.reduce((sum, item) => {
        return sum + (item.quantity * (item.price || 0));
    }, 0);

    // Create order from parsed items
    const handleCreateOrder = async () => {
        if (editableItems.length === 0) return;

        const orderItems = editableItems.map(item => ({
            product_id: item.matchedProductId || null,
            name: item.matchedProductName || item.product,
            quantity: item.quantity,
            price: item.price || 0,
        }));

        const subtotal = total;
        const tax = subtotal * 0.18;

        await createOrder({
            order: {
                customer_id: selectedCustomerId || null,
                status: 'pending',
                subtotal,
                tax,
                total: subtotal + tax,
                address: result?.deliveryAddress || null,
            },
            items: orderItems,
        });

        // Reset
        setEditableItems([]);
        setMessageInput('');
        setImagePreview(null);
        setSelectedCustomerId('');
        clearResult();
    };

    // Clear all
    const handleClear = () => {
        setEditableItems([]);
        setMessageInput('');
        setImagePreview(null);
        clearResult();
    };

    return (
        <div className="flex h-screen bg-background text-foreground">
            <Sidebar />

            <div className="flex-1 overflow-auto">
                <div className="p-12 max-w-5xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl mb-2">AI Order Assistant</h1>
                        <p className="text-muted-foreground">
                            Paste a message or upload an image to automatically extract order items
                        </p>
                    </div>

                    {/* API Key Warning */}
                    {!isConfigured && (
                        <div className="mb-8 p-4 border border-amber-500/30 bg-amber-500/10 text-amber-400">
                            <strong>AI Not Configured:</strong> Add <code className="bg-black/30 px-1">VITE_GEMINI_API_KEY</code> to your .env.local file to enable AI features.
                        </div>
                    )}

                    {/* Mode Toggle */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setInputMode('text')}
                            className={`px-4 py-2 border transition-colors ${inputMode === 'text'
                                    ? 'border-primary bg-primary/20 text-primary'
                                    : 'border-border text-muted-foreground hover:border-foreground/50'
                                }`}
                        >
                            📝 Text Message
                        </button>
                        <button
                            onClick={() => setInputMode('image')}
                            className={`px-4 py-2 border transition-colors ${inputMode === 'image'
                                    ? 'border-primary bg-primary/20 text-primary'
                                    : 'border-border text-muted-foreground hover:border-foreground/50'
                                }`}
                        >
                            📷 Image Upload
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        {/* Input Section */}
                        <div>
                            {inputMode === 'text' ? (
                                <div className="space-y-4">
                                    <label className="block text-sm text-muted-foreground">
                                        Paste WhatsApp message or order text
                                    </label>
                                    <textarea
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder={`Example:\n"Hi, I need:\n- 5kg Rice\n- 2kg Sugar\n- 1L Cooking Oil\n\nDelivery to Park Street.\nThanks!"`}
                                        className="w-full h-64 px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors resize-none font-mono text-sm"
                                        disabled={!isConfigured}
                                    />
                                    <button
                                        onClick={handleAnalyzeText}
                                        disabled={loading || !messageInput.trim() || !isConfigured}
                                        className="w-full px-6 py-3 bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? '🔄 Analyzing...' : '✨ Analyze Message'}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <label className="block text-sm text-muted-foreground">
                                        Upload image of order/list
                                    </label>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        onDrop={handleDrop}
                                        onDragOver={(e) => e.preventDefault()}
                                        className={`
                      w-full h-64 border-2 border-dashed border-border 
                      flex items-center justify-center cursor-pointer
                      hover:border-foreground/50 transition-colors
                      ${imagePreview ? 'p-2' : ''}
                      ${!isConfigured ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                                    >
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain" />
                                        ) : (
                                            <div className="text-center text-muted-foreground">
                                                <div className="text-4xl mb-2">📷</div>
                                                <div>Click or drag image here</div>
                                                <div className="text-xs mt-1">Supports JPG, PNG, WEBP</div>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        className="hidden"
                                        disabled={!isConfigured}
                                    />
                                    {loading && (
                                        <div className="text-center text-muted-foreground">
                                            🔄 Analyzing image...
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Error Display */}
                            {error && (
                                <div className="mt-4 p-3 border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Suggestions */}
                            {result?.suggestions && result.suggestions.length > 0 && (
                                <div className="mt-4 p-3 border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm">
                                    <strong>💡 Suggestions:</strong>
                                    <ul className="mt-1 list-disc list-inside">
                                        {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Results Section */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl">Parsed Order</h2>
                                {editableItems.length > 0 && (
                                    <button
                                        onClick={handleClear}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            {/* Confidence Indicator */}
                            {result && (
                                <div className="mb-4 flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Confidence:</span>
                                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all ${result.overallConfidence > 0.8 ? 'bg-emerald-500' :
                                                    result.overallConfidence > 0.5 ? 'bg-amber-500' : 'bg-red-500'
                                                }`}
                                            style={{ width: `${result.overallConfidence * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-sm tabular-nums">{Math.round(result.overallConfidence * 100)}%</span>
                                </div>
                            )}

                            {/* Items Table */}
                            {editableItems.length > 0 ? (
                                <div className="border border-border bg-card mb-4">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-border bg-muted/50">
                                                <th className="text-left p-3 text-muted-foreground text-sm font-medium">Product</th>
                                                <th className="text-right p-3 text-muted-foreground text-sm font-medium">Qty</th>
                                                <th className="text-right p-3 text-muted-foreground text-sm font-medium">Price</th>
                                                <th className="text-right p-3 text-muted-foreground text-sm font-medium">Total</th>
                                                <th className="p-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {editableItems.map((item, idx) => (
                                                <tr key={idx} className="border-b border-border last:border-0">
                                                    <td className="p-3">
                                                        <div>{item.matchedProductName || item.product}</div>
                                                        {!item.matchedProductId && (
                                                            <div className="text-xs text-amber-400">⚠️ Not in inventory</div>
                                                        )}
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        <input
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => updateItemQuantity(idx, parseInt(e.target.value) || 0)}
                                                            className="w-16 px-2 py-1 bg-input-background border border-input text-right tabular-nums"
                                                            min="1"
                                                        />
                                                    </td>
                                                    <td className="p-3 text-right tabular-nums">
                                                        {item.price ? `₹${item.price}` : '-'}
                                                    </td>
                                                    <td className="p-3 text-right tabular-nums">
                                                        {item.price ? `₹${(item.quantity * item.price).toLocaleString('en-IN')}` : '-'}
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        <button
                                                            onClick={() => removeItem(idx)}
                                                            className="text-red-400 hover:text-red-300"
                                                        >
                                                            ×
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="bg-muted/30">
                                                <td colSpan={3} className="p-3 text-right font-medium">Total:</td>
                                                <td className="p-3 text-right tabular-nums font-medium">₹{total.toLocaleString('en-IN')}</td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            ) : (
                                <div className="border border-border bg-card p-8 text-center text-muted-foreground mb-4">
                                    {loading ? '🔄 Analyzing...' : 'No items yet. Analyze a message or image to get started.'}
                                </div>
                            )}

                            {/* Customer Selection */}
                            {editableItems.length > 0 && (
                                <>
                                    <div className="mb-4">
                                        <label className="block text-sm text-muted-foreground mb-2">Customer (optional)</label>
                                        <select
                                            value={selectedCustomerId}
                                            onChange={(e) => setSelectedCustomerId(e.target.value)}
                                            className="w-full px-4 py-3 bg-input-background border border-input text-foreground"
                                        >
                                            <option value="">Select customer...</option>
                                            {customers.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                        {result?.customerName && (
                                            <div className="text-xs text-muted-foreground mt-1">
                                                AI detected: "{result.customerName}"
                                            </div>
                                        )}
                                    </div>

                                    {/* Create Order Button */}
                                    <button
                                        onClick={handleCreateOrder}
                                        disabled={creatingOrder || editableItems.length === 0}
                                        className="w-full px-6 py-3 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                    >
                                        {creatingOrder ? '🔄 Creating Order...' : '✅ Create Order'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
