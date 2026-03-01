import { Sidebar } from './sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useCallback } from 'react';
import { useAIAnalysis } from '../../hooks/useAIAnalysis';
import { useCreateOrder } from '../../hooks/useOrders';
import { useCustomers } from '../../hooks/useCustomers';
import type { ParsedOrderItem } from '../../lib/ai';

export function NewOrder() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('text');
  const [textInput, setTextInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string>('');
  const [editableItems, setEditableItems] = useState<ParsedOrderItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { analyzeText, analyzeImage, result, loading, error, isConfigured, clearResult } = useAIAnalysis();
  const { createOrder, loading: creatingOrder } = useCreateOrder();
  const { customers } = useCustomers();

  const handleAnalyzeText = async () => {
    const analysisResult = await analyzeText(textInput);
    if (analysisResult) setEditableItems(analysisResult.items);
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    const analysisResult = await analyzeImage(file);
    if (analysisResult) setEditableItems(analysisResult.items);
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    const analysisResult = await analyzeImage(file);
    if (analysisResult) setEditableItems(analysisResult.items);
  }, [analyzeImage]);

  const updateItemQuantity = (index: number, quantity: number) => {
    const updated = [...editableItems];
    updated[index] = { ...updated[index], quantity };
    setEditableItems(updated);
  };

  const removeItem = (index: number) => {
    setEditableItems(items => items.filter((_, i) => i !== index));
  };

  const total = editableItems.reduce((sum, item) => sum + (item.quantity * (item.price || 0)), 0);

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
    const order = await createOrder({
      order: { customer_id: null, status: 'pending', subtotal, tax, total: subtotal + tax, address: result?.deliveryAddress || null },
      items: orderItems,
    });
    if (order) navigate('/orders');
  };

  const handleClear = () => {
    setEditableItems([]);
    setTextInput('');
    setImagePreview(null);
    clearResult();
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl mb-2">New Order</h1>
            <p className="text-muted-foreground">Capture order from WhatsApp — AI will extract items</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-border mb-8">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('text')}
                className={`pb-4 transition-colors ${activeTab === 'text' ? 'text-foreground border-b-2 border-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Paste WhatsApp Text
              </button>
              <button
                onClick={() => setActiveTab('image')}
                className={`pb-4 transition-colors ${activeTab === 'image' ? 'text-foreground border-b-2 border-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Upload Image
              </button>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'text' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">WhatsApp Message</label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="w-full h-64 p-4 bg-muted/50 border-2 border-dashed border-border text-foreground focus:outline-none focus:border-ring transition-colors resize-none"
                  placeholder={`Paste WhatsApp message here...\n\nExample:\nHi! Need 5 bags rice\n2kg sugar\nSend to Park Street`}
                  disabled={!isConfigured}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAnalyzeText}
                  disabled={loading || !textInput.trim() || !isConfigured}
                  className="px-8 py-3 bg-primary text-primary-foreground border border-input hover:opacity-90 transition-all font-medium disabled:opacity-50"
                >
                  {loading ? 'Analyzing...' : 'Convert to Order'}
                </button>
                <button onClick={handleClear} className="px-8 py-3 text-muted-foreground border border-border hover:border-foreground transition-colors">
                  Clear
                </button>
              </div>
            </div>
          )}

          {activeTab === 'image' && (
            <div className="space-y-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="w-full h-64 border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-foreground/50 transition-colors"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain" />
                ) : (
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">Drop image or click to upload</p>
                    <button className="px-6 py-2 text-muted-foreground border border-border hover:border-foreground transition-colors">
                      Choose File
                    </button>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              {loading && <div className="text-center text-muted-foreground">Analyzing image...</div>}
            </div>
          )}

          {/* Error */}
          {error && <div className="mt-4 p-3 border border-red-500/30 bg-red-500/10 text-red-400 text-sm">{error}</div>}

          {/* Parsed Order Results */}
          {editableItems.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl">Extracted Items</h2>
                {result && (
                  <span className={`text-sm px-3 py-1 border ${result.overallConfidence > 0.8 ? 'border-emerald-500/30 text-emerald-400' : 'border-amber-500/30 text-amber-400'}`}>
                    {Math.round(result.overallConfidence * 100)}% confidence
                  </span>
                )}
              </div>

              <div className="border border-border rounded-sm bg-card mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-4 text-muted-foreground font-medium">Product</th>
                      <th className="text-right p-4 text-muted-foreground font-medium">Qty</th>
                      <th className="text-right p-4 text-muted-foreground font-medium">Price</th>
                      <th className="text-right p-4 text-muted-foreground font-medium">Total</th>
                      <th className="p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {editableItems.map((item, idx) => (
                      <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="p-4">
                          <div>{item.matchedProductName || item.product}</div>
                          {!item.matchedProductId && <div className="text-xs text-amber-400">Product not found in inventory</div>}
                        </td>
                        <td className="p-4 text-right">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItemQuantity(idx, parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 bg-input-background border border-input text-right tabular-nums"
                            min="1"
                          />
                        </td>
                        <td className="p-4 text-right tabular-nums">{item.price ? `₹${item.price}` : '-'}</td>
                        <td className="p-4 text-right tabular-nums">{item.price ? `₹${(item.quantity * item.price).toLocaleString('en-IN')}` : '-'}</td>
                        <td className="p-4 text-right">
                          <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted/30">
                      <td colSpan={3} className="p-4 text-right font-medium">Total:</td>
                      <td className="p-4 text-right tabular-nums font-medium text-lg">₹{total.toLocaleString('en-IN')}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Customer Name */}
              <div className="mb-6">
                <label className="block text-sm text-muted-foreground mb-2">Customer Name (optional)</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                  className="w-full max-w-md px-4 py-3 bg-input-background border border-input focus:outline-none focus:border-ring transition-colors"
                />
              </div>

              {/* Create Order */}
              <div className="flex gap-4">
                <button
                  onClick={handleCreateOrder}
                  disabled={creatingOrder}
                  className="px-8 py-3 bg-primary text-primary-foreground border border-input hover:opacity-90 transition-all font-medium disabled:opacity-50"
                >
                  {creatingOrder ? 'Creating...' : 'Create Order'}
                </button>
                <Link to="/orders" className="px-8 py-3 text-muted-foreground border border-border hover:border-foreground transition-colors">
                  Cancel
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
