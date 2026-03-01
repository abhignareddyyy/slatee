import { Sidebar } from './sidebar';
import { useState, useMemo } from 'react';
import { useProducts, useAddProduct, useUpdateProduct } from '../../hooks/useProducts';
import type { Product as SupabaseProduct } from '../../lib/types';

type Category = 'All' | 'Rice & Grains' | 'Sugar & Spices' | 'Oils' | 'Pulses' | 'Dairy' | 'Beverages' | 'Others';

const categories: Category[] = ['All', 'Rice & Grains', 'Sugar & Spices', 'Oils', 'Pulses', 'Dairy', 'Beverages', 'Others'];

export function Products() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState<Category>('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<SupabaseProduct | null>(null);
    const [showStockModal, setShowStockModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<SupabaseProduct | null>(null);
    const [stockAdjustment, setStockAdjustment] = useState({ type: 'add' as 'add' | 'remove', quantity: 0, reason: '' });

    // Supabase hooks
    const { products, loading, error } = useProducts();
    const { addProduct, loading: addingProduct } = useAddProduct();
    const { updateProduct, loading: updatingProduct } = useUpdateProduct();

    const [newProduct, setNewProduct] = useState({
        name: '',
        category: 'Rice & Grains' as string,
        unit: '',
        price: '',
        stock: '',
        lowStockThreshold: '10',
    });

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, filterCategory]);

    const stats = useMemo(() => ({
        total: products.length,
        active: products.filter(p => p.status === 'active').length,
        lowStock: products.filter(p => p.stock <= p.low_stock_threshold && p.stock > 0).length,
        outOfStock: products.filter(p => p.stock === 0).length,
    }), [products]);


    const getStockStatus = (product: SupabaseProduct) => {
        if (product.stock === 0) {
            return <span className="px-2 py-1 text-xs border bg-red-500/20 text-red-400 border-red-500/30">Out of Stock</span>;
        }
        if (product.stock <= product.low_stock_threshold) {
            return <span className="px-2 py-1 text-xs border bg-amber-500/20 text-amber-400 border-amber-500/30">Low Stock</span>;
        }
        return <span className="px-2 py-1 text-xs border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">In Stock</span>;
    };

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.unit || !newProduct.price) return;

        await addProduct({
            name: newProduct.name,
            category: newProduct.category,
            unit: newProduct.unit,
            price: parseFloat(newProduct.price),
            stock: parseInt(newProduct.stock) || 0,
            low_stock_threshold: parseInt(newProduct.lowStockThreshold) || 10,
            status: 'active',
        });

        setShowAddModal(false);
        setNewProduct({ name: '', category: 'Rice & Grains', unit: '', price: '', stock: '', lowStockThreshold: '10' });
    };

    const handleUpdateProduct = async () => {
        if (!editingProduct) return;
        await updateProduct(editingProduct.id, editingProduct);
        setEditingProduct(null);
    };

    const handleStockAdjustment = async () => {
        if (!selectedProduct || stockAdjustment.quantity <= 0) return;

        const newStock = stockAdjustment.type === 'add'
            ? selectedProduct.stock + stockAdjustment.quantity
            : Math.max(0, selectedProduct.stock - stockAdjustment.quantity);

        await updateProduct(selectedProduct.id, { stock: newStock });

        setShowStockModal(false);
        setSelectedProduct(null);
        setStockAdjustment({ type: 'add', quantity: 0, reason: '' });
    };

    return (
        <div className="flex h-screen bg-background text-foreground">
            <Sidebar />

            <div className="flex-1 overflow-auto">
                <div className="p-12">
                    {/* Header */}
                    <div className="mb-12 flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl mb-2">Products</h1>
                            <p className="text-muted-foreground">Manage your product catalog and inventory</p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-2 bg-primary text-primary-foreground border border-input hover:opacity-90 transition-opacity"
                        >
                            Add Product
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-6 mb-12">
                        <div className="p-6 border border-border bg-card">
                            <div className="text-muted-foreground text-sm mb-2">Total Products</div>
                            <div className="text-3xl tabular-nums">{stats.total}</div>
                        </div>
                        <div className="p-6 border border-border bg-card">
                            <div className="text-muted-foreground text-sm mb-2">Active</div>
                            <div className="text-3xl tabular-nums text-emerald-500">{stats.active}</div>
                        </div>
                        <div className="p-6 border border-border bg-card">
                            <div className="text-muted-foreground text-sm mb-2">Low Stock</div>
                            <div className="text-3xl tabular-nums text-amber-500">{stats.lowStock}</div>
                        </div>
                        <div className="p-6 border border-border bg-card">
                            <div className="text-muted-foreground text-sm mb-2">Out of Stock</div>
                            <div className="text-3xl tabular-nums text-red-500">{stats.outOfStock}</div>
                        </div>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors"
                            />
                        </div>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value as Category)}
                            className="px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Products Table */}
                    <div className="border border-border bg-card">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-muted/50">
                                    <th className="text-left p-4 text-muted-foreground font-medium">Product</th>
                                    <th className="text-left p-4 text-muted-foreground font-medium">Category</th>
                                    <th className="text-left p-4 text-muted-foreground font-medium">Unit</th>
                                    <th className="text-right p-4 text-muted-foreground font-medium">Price</th>
                                    <th className="text-right p-4 text-muted-foreground font-medium">Stock</th>
                                    <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
                                    <th className="text-right p-4 text-muted-foreground font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className={`border-b border-border last:border-0 hover:bg-muted/50 transition-colors ${product.status === 'inactive' ? 'opacity-50' : ''}`}>
                                        <td className="p-4">
                                            <div className="font-medium">{product.name}</div>
                                            <div className="text-xs text-muted-foreground mt-1">{product.id}</div>
                                        </td>
                                        <td className="p-4 text-muted-foreground">{product.category}</td>
                                        <td className="p-4 text-muted-foreground">{product.unit}</td>
                                        <td className="p-4 text-right tabular-nums">₹{product.price}</td>
                                        <td className="p-4 text-right tabular-nums">
                                            <span className={product.stock <= product.low_stock_threshold ? (product.stock === 0 ? 'text-red-500 font-medium' : 'text-amber-500 font-medium') : ''}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="p-4">{getStockStatus(product)}</td>
                                        <td className="p-4 text-right space-x-3">
                                            <button
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setShowStockModal(true);
                                                }}
                                                className="text-blue-500 hover:text-blue-400 transition-colors"
                                            >
                                                Stock
                                            </button>
                                            <button
                                                onClick={() => setEditingProduct(product)}
                                                className="text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-card border border-border p-8 w-full max-w-lg shadow-xl">
                        <h2 className="text-2xl mb-6">Add Product</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Product Name *</label>
                                <input
                                    type="text"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors"
                                    placeholder="e.g., Basmati Rice"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">Category *</label>
                                    <select
                                        value={newProduct.category}
                                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors"
                                    >
                                        {categories.filter(c => c !== 'All').map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">Unit *</label>
                                    <input
                                        type="text"
                                        value={newProduct.unit}
                                        onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                                        className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors"
                                        placeholder="e.g., 1kg, 5L, bag"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">Price (₹) *</label>
                                    <input
                                        type="number"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                        className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors tabular-nums"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">Initial Stock</label>
                                    <input
                                        type="number"
                                        value={newProduct.stock}
                                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                        className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors tabular-nums"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">Low Stock Alert</label>
                                    <input
                                        type="number"
                                        value={newProduct.lowStockThreshold}
                                        onChange={(e) => setNewProduct({ ...newProduct, lowStockThreshold: e.target.value })}
                                        className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors tabular-nums"
                                        placeholder="10"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setNewProduct({ name: '', category: 'Rice & Grains', unit: '', price: '', stock: '', lowStockThreshold: '10' });
                                }}
                                className="flex-1 px-6 py-3 text-muted-foreground border border-border hover:border-foreground/50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddProduct}
                                disabled={!newProduct.name || !newProduct.unit || !newProduct.price}
                                className="flex-1 px-6 py-3 bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add Product
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {editingProduct && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-card border border-border p-8 w-full max-w-lg shadow-xl">
                        <h2 className="text-2xl mb-6">Edit Product</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Product Name</label>
                                <input
                                    type="text"
                                    value={editingProduct.name}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">Category</label>
                                    <select
                                        value={editingProduct.category || ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors"
                                    >
                                        {categories.filter(c => c !== 'All').map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">Unit</label>
                                    <input
                                        type="text"
                                        value={editingProduct.unit || ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                                        className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">Price (₹)</label>
                                    <input
                                        type="number"
                                        value={editingProduct.price}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors tabular-nums"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">Low Stock Alert</label>
                                    <input
                                        type="number"
                                        value={editingProduct.low_stock_threshold}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, low_stock_threshold: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors tabular-nums"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Status</label>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setEditingProduct({ ...editingProduct, status: 'active' })}
                                        className={`px-4 py-2 border transition-colors ${editingProduct.status === 'active' ? 'border-emerald-500 bg-emerald-500/20 text-emerald-500' : 'border-border text-muted-foreground'}`}
                                    >
                                        Active
                                    </button>
                                    <button
                                        onClick={() => setEditingProduct({ ...editingProduct, status: 'inactive' })}
                                        className={`px-4 py-2 border transition-colors ${editingProduct.status === 'inactive' ? 'border-red-500 bg-red-500/20 text-red-500' : 'border-border text-muted-foreground'}`}
                                    >
                                        Inactive
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => setEditingProduct(null)}
                                className="flex-1 px-6 py-3 text-muted-foreground border border-border hover:border-foreground/50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateProduct}
                                className="flex-1 px-6 py-3 bg-primary text-primary-foreground hover:opacity-90 transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Stock Adjustment Modal */}
            {showStockModal && selectedProduct && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-card border border-border p-8 w-full max-w-md shadow-xl">
                        <h2 className="text-2xl mb-6">Adjust Stock</h2>

                        <div className="p-4 bg-muted/20 border border-border mb-6">
                            <div className="text-lg font-medium">{selectedProduct.name}</div>
                            <div className="text-muted-foreground mt-1">
                                Current Stock: <span className="text-foreground tabular-nums">{selectedProduct.stock} {selectedProduct.unit}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Adjustment Type</label>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setStockAdjustment({ ...stockAdjustment, type: 'add' })}
                                        className={`flex-1 px-4 py-3 border transition-colors ${stockAdjustment.type === 'add' ? 'border-emerald-500 bg-emerald-500/20 text-emerald-500' : 'border-border text-muted-foreground'}`}
                                    >
                                        + Add Stock
                                    </button>
                                    <button
                                        onClick={() => setStockAdjustment({ ...stockAdjustment, type: 'remove' })}
                                        className={`flex-1 px-4 py-3 border transition-colors ${stockAdjustment.type === 'remove' ? 'border-red-500 bg-red-500/20 text-red-500' : 'border-border text-muted-foreground'}`}
                                    >
                                        − Remove Stock
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Quantity</label>
                                <input
                                    type="number"
                                    value={stockAdjustment.quantity || ''}
                                    onChange={(e) => setStockAdjustment({ ...stockAdjustment, quantity: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors tabular-nums"
                                    placeholder="Enter quantity"
                                    min="1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Reason (optional)</label>
                                <input
                                    type="text"
                                    value={stockAdjustment.reason}
                                    onChange={(e) => setStockAdjustment({ ...stockAdjustment, reason: e.target.value })}
                                    className="w-full px-4 py-3 bg-input-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors"
                                    placeholder="e.g., New shipment, Damaged goods"
                                />
                            </div>

                            {stockAdjustment.quantity > 0 && (
                                <div className="p-4 bg-muted/20 border border-border">
                                    <span className="text-muted-foreground">New Stock: </span>
                                    <span className="tabular-nums font-medium">
                                        {stockAdjustment.type === 'add'
                                            ? selectedProduct.stock + stockAdjustment.quantity
                                            : Math.max(0, selectedProduct.stock - stockAdjustment.quantity)
                                        } {selectedProduct.unit}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => {
                                    setShowStockModal(false);
                                    setSelectedProduct(null);
                                    setStockAdjustment({ type: 'add', quantity: 0, reason: '' });
                                }}
                                className="flex-1 px-6 py-3 text-muted-foreground border border-border hover:border-foreground/50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleStockAdjustment}
                                disabled={stockAdjustment.quantity <= 0}
                                className={`flex-1 px-6 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${stockAdjustment.type === 'add'
                                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                    : 'bg-red-500 text-white hover:bg-red-600'
                                    }`}
                            >
                                {stockAdjustment.type === 'add' ? 'Add Stock' : 'Remove Stock'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
