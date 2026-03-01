import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Expense, ExpenseInsert } from '../lib/types';
import { useAuth } from '../app/components/auth-provider';

export function useExpenses() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const fetchExpenses = async () => {
        if (!user) {
            setExpenses([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('expenses')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;
            setExpenses(data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch expenses');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();

        const subscription = supabase
            .channel('expenses_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'expenses' },
                () => {
                    fetchExpenses();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user]);

    // Calculate stats
    const stats = {
        total: expenses.reduce((sum, e) => sum + e.amount, 0),
        count: expenses.length,
        average: expenses.length > 0 ? expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length : 0,
        largest: expenses.length > 0 ? Math.max(...expenses.map(e => e.amount)) : 0,
    };

    return { expenses, stats, loading, error, refetch: fetchExpenses };
}

export function useAddExpense() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const addExpense = async (expense: Omit<ExpenseInsert, 'user_id'>) => {
        if (!user) {
            setError('Must be logged in to add expenses');
            return null;
        }

        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('expenses')
                .insert({ ...expense, user_id: user.id })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add expense');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { addExpense, loading, error };
}

export function useDeleteExpense() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteExpense = async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const { error } = await supabase
                .from('expenses')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete expense');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { deleteExpense, loading, error };
}
