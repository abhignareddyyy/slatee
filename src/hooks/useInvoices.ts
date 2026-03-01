import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Invoice, Payment, PaymentInsert } from '../lib/types';
import { useAuth } from '../app/components/auth-provider';

interface InvoiceWithPayments extends Invoice {
    payments: Payment[];
    orders: { id: string } | null;
}

export function useInvoices() {
    const [invoices, setInvoices] = useState<InvoiceWithPayments[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const fetchInvoices = async () => {
        if (!user) {
            setInvoices([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('invoices')
                .select(`
          *,
          payments (*),
          orders (id)
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setInvoices((data as InvoiceWithPayments[]) || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();

        const subscription = supabase
            .channel('invoices_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'invoices' },
                () => {
                    fetchInvoices();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user]);

    return { invoices, loading, error, refetch: fetchInvoices };
}

export function useRecordPayment() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const recordPayment = async (payment: PaymentInsert) => {
        try {
            setLoading(true);
            setError(null);

            // Insert payment
            const { data: paymentData, error: paymentError } = await supabase
                .from('payments')
                .insert(payment)
                .select()
                .single();

            if (paymentError) throw paymentError;

            // Update invoice amount_paid and status
            const { data: invoice } = await supabase
                .from('invoices')
                .select('amount, amount_paid')
                .eq('id', payment.invoice_id)
                .single();

            if (invoice) {
                const newAmountPaid = (invoice.amount_paid || 0) + payment.amount;
                const newStatus = newAmountPaid >= invoice.amount ? 'paid' : 'partial';

                await supabase
                    .from('invoices')
                    .update({ amount_paid: newAmountPaid, status: newStatus })
                    .eq('id', payment.invoice_id);
            }

            return paymentData;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to record payment');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { recordPayment, loading, error };
}
