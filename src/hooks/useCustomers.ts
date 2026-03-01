import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Customer, CustomerInsert } from '../lib/types';
import { useAuth } from '../app/components/auth-provider';

export function useCustomers() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const fetchCustomers = async () => {
        if (!user) {
            setCustomers([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('customers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCustomers(data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch customers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();

        const subscription = supabase
            .channel('customers_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'customers' },
                () => {
                    fetchCustomers();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user]);

    return { customers, loading, error, refetch: fetchCustomers };
}

export function useAddCustomer() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const addCustomer = async (customer: Omit<CustomerInsert, 'user_id'>) => {
        if (!user) {
            setError('Must be logged in to add customers');
            return null;
        }

        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('customers')
                .insert({ ...customer, user_id: user.id })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add customer');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { addCustomer, loading, error };
}

export function useUpdateCustomer() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateCustomer = async (id: string, updates: Partial<Customer>) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('customers')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update customer');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { updateCustomer, loading, error };
}

export function useDeleteCustomer() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteCustomer = async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const { error } = await supabase
                .from('customers')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete customer');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { deleteCustomer, loading, error };
}
