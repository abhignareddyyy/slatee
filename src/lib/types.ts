// Database types for Supabase
// These match the schema defined in the implementation plan

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            customers: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    phone: string | null;
                    email: string | null;
                    address: string | null;
                    tags: string[] | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    phone?: string | null;
                    email?: string | null;
                    address?: string | null;
                    tags?: string[] | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    name?: string;
                    phone?: string | null;
                    email?: string | null;
                    address?: string | null;
                    tags?: string[] | null;
                    created_at?: string;
                };
            };
            products: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    category: string | null;
                    unit: string | null;
                    price: number;
                    stock: number;
                    low_stock_threshold: number;
                    status: 'active' | 'inactive';
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    category?: string | null;
                    unit?: string | null;
                    price: number;
                    stock?: number;
                    low_stock_threshold?: number;
                    status?: 'active' | 'inactive';
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    name?: string;
                    category?: string | null;
                    unit?: string | null;
                    price?: number;
                    stock?: number;
                    low_stock_threshold?: number;
                    status?: 'active' | 'inactive';
                    created_at?: string;
                };
            };
            orders: {
                Row: {
                    id: string;
                    user_id: string;
                    customer_id: string | null;
                    status: 'pending' | 'invoiced' | 'completed';
                    subtotal: number;
                    tax: number;
                    total: number;
                    address: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    customer_id?: string | null;
                    status?: 'pending' | 'invoiced' | 'completed';
                    subtotal: number;
                    tax: number;
                    total: number;
                    address?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    customer_id?: string | null;
                    status?: 'pending' | 'invoiced' | 'completed';
                    subtotal?: number;
                    tax?: number;
                    total?: number;
                    address?: string | null;
                    created_at?: string;
                };
            };
            order_items: {
                Row: {
                    id: string;
                    order_id: string;
                    product_id: string | null;
                    name: string;
                    quantity: number;
                    price: number;
                };
                Insert: {
                    id?: string;
                    order_id: string;
                    product_id?: string | null;
                    name: string;
                    quantity: number;
                    price: number;
                };
                Update: {
                    id?: string;
                    order_id?: string;
                    product_id?: string | null;
                    name?: string;
                    quantity?: number;
                    price?: number;
                };
            };
            invoices: {
                Row: {
                    id: string;
                    order_id: string | null;
                    user_id: string;
                    amount: number;
                    amount_paid: number;
                    status: 'paid' | 'partial' | 'unpaid' | 'overdue';
                    due_date: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    order_id?: string | null;
                    user_id: string;
                    amount: number;
                    amount_paid?: number;
                    status?: 'paid' | 'partial' | 'unpaid' | 'overdue';
                    due_date?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    order_id?: string | null;
                    user_id?: string;
                    amount?: number;
                    amount_paid?: number;
                    status?: 'paid' | 'partial' | 'unpaid' | 'overdue';
                    due_date?: string | null;
                    created_at?: string;
                };
            };
            payments: {
                Row: {
                    id: string;
                    invoice_id: string;
                    amount: number;
                    method: 'cash' | 'upi' | 'bank' | 'other';
                    note: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    invoice_id: string;
                    amount: number;
                    method: 'cash' | 'upi' | 'bank' | 'other';
                    note?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    invoice_id?: string;
                    amount?: number;
                    method?: 'cash' | 'upi' | 'bank' | 'other';
                    note?: string | null;
                    created_at?: string;
                };
            };
            expenses: {
                Row: {
                    id: string;
                    user_id: string;
                    description: string;
                    amount: number;
                    category: string | null;
                    payment_method: string | null;
                    date: string | null;
                    notes: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    description: string;
                    amount: number;
                    category?: string | null;
                    payment_method?: string | null;
                    date?: string | null;
                    notes?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    description?: string;
                    amount?: number;
                    category?: string | null;
                    payment_method?: string | null;
                    date?: string | null;
                    notes?: string | null;
                    created_at?: string;
                };
            };
            team_members: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    email: string | null;
                    role: 'admin' | 'manager' | 'staff';
                    status: 'active' | 'inactive';
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    email?: string | null;
                    role?: 'admin' | 'manager' | 'staff';
                    status?: 'active' | 'inactive';
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    name?: string;
                    email?: string | null;
                    role?: 'admin' | 'manager' | 'staff';
                    status?: 'active' | 'inactive';
                    created_at?: string;
                };
            };
            deliveries: {
                Row: {
                    id: string;
                    order_id: string | null;
                    driver: string | null;
                    status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'failed';
                    address: string | null;
                    scheduled_at: string | null;
                    completed_at: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    order_id?: string | null;
                    driver?: string | null;
                    status?: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'failed';
                    address?: string | null;
                    scheduled_at?: string | null;
                    completed_at?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    order_id?: string | null;
                    driver?: string | null;
                    status?: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'failed';
                    address?: string | null;
                    scheduled_at?: string | null;
                    completed_at?: string | null;
                    created_at?: string;
                };
            };
        };
        Views: {};
        Functions: {};
        Enums: {};
    };
}

// Helper types for easier use
export type Customer = Database['public']['Tables']['customers']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type Invoice = Database['public']['Tables']['invoices']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
export type Expense = Database['public']['Tables']['expenses']['Row'];
export type TeamMember = Database['public']['Tables']['team_members']['Row'];
export type Delivery = Database['public']['Tables']['deliveries']['Row'];

// Insert types
export type CustomerInsert = Database['public']['Tables']['customers']['Insert'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];
export type InvoiceInsert = Database['public']['Tables']['invoices']['Insert'];
export type PaymentInsert = Database['public']['Tables']['payments']['Insert'];
export type ExpenseInsert = Database['public']['Tables']['expenses']['Insert'];
export type TeamMemberInsert = Database['public']['Tables']['team_members']['Insert'];
export type DeliveryInsert = Database['public']['Tables']['deliveries']['Insert'];
