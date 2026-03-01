import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Order, OrderItem, OrderInsert, OrderItemInsert } from '../lib/types';
import { useAuth } from '../app/components/auth-provider';

interface OrderWithItems extends Order {
    order_items: OrderItem[];
    customers: { name: string; phone: string | null } | null;
}

export function useOrders() {
    const [orders, setOrders] = useState<OrderWithItems[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const fetchOrders = async () => {
        if (!user) {
            setOrders([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('orders')
                .select(`
          *,
          order_items (*),
          customers (name, phone)
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders((data as OrderWithItems[]) || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();

        const subscription = supabase
            .channel('orders_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders' },
                () => {
                    fetchOrders();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user]);

    return { orders, loading, error, refetch: fetchOrders };
}

interface CreateOrderInput {
    order: Omit<OrderInsert, 'user_id'>;
    items: Omit<OrderItemInsert, 'order_id'>[];
}

export function useCreateOrder() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const createOrder = async ({ order, items }: CreateOrderInput) => {
        if (!user) {
            setError('Must be logged in to create orders');
            return null;
        }

        try {
            setLoading(true);
            setError(null);

            // Create order
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert({ ...order, user_id: user.id })
                .select()
                .single();

            if (orderError) throw orderError;

            // Create order items
            const itemsWithOrderId = items.map(item => ({
                ...item,
                order_id: orderData.id,
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(itemsWithOrderId);

            if (itemsError) throw itemsError;

            return orderData;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create order');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { createOrder, loading, error };
}

export function useUpdateOrderStatus() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateStatus = async (id: string, status: Order['status']) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('orders')
                .update({ status })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update order status');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { updateStatus, loading, error };
}
