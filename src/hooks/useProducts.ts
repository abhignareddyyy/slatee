import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Product, ProductInsert } from '../lib/types';
import { useAuth } from '../app/components/auth-provider';

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const fetchProducts = async () => {
        if (!user) {
            setProducts([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();

        // Set up real-time subscription
        const subscription = supabase
            .channel('products_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'products' },
                () => {
                    fetchProducts();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user]);

    return { products, loading, error, refetch: fetchProducts };
}

export function useAddProduct() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const addProduct = async (product: Omit<ProductInsert, 'user_id'>) => {
        if (!user) {
            setError('Must be logged in to add products');
            return null;
        }

        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('products')
                .insert({ ...product, user_id: user.id })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add product');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { addProduct, loading, error };
}

export function useUpdateProduct() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateProduct = async (id: string, updates: Partial<Product>) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('products')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update product');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { updateProduct, loading, error };
}

export function useDeleteProduct() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteProduct = async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete product');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { deleteProduct, loading, error };
}
