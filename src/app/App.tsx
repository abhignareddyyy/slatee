import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/landing-page';
import { LoginPage } from './components/login-page';
import { SignupPage } from './components/signup-page';
import { Dashboard } from './components/dashboard';
import { NewOrder } from './components/new-order';
import { ReviewOrder } from './components/review-order';
import { CreateInvoice } from './components/create-invoice';
import { InvoicePreview } from './components/invoice-preview';
import { Orders } from './components/orders';
import { Invoices } from './components/invoices';
import { Customers } from './components/customers';
import { Products } from './components/products';
import { Deliveries } from './components/deliveries';
import { Team } from './components/team';
import { Expenses } from './components/expenses';
import { Analytics } from './components/analytics';
import { Exports } from './components/exports';
import { Settings } from './components/settings';
import { AIOrderAssistant } from './components/ai-order-assistant';
import { ThemeProvider } from './components/theme-provider';
import { AuthProvider } from './components/auth-provider';
import { ProtectedRoute } from './components/protected-route';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/ai-order" element={<ProtectedRoute><AIOrderAssistant /></ProtectedRoute>} />
            <Route path="/new-order" element={<ProtectedRoute><NewOrder /></ProtectedRoute>} />
            <Route path="/review-order" element={<ProtectedRoute><ReviewOrder /></ProtectedRoute>} />
            <Route path="/create-invoice" element={<ProtectedRoute><CreateInvoice /></ProtectedRoute>} />
            <Route path="/invoice-preview" element={<ProtectedRoute><InvoicePreview /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/deliveries" element={<ProtectedRoute><Deliveries /></ProtectedRoute>} />
            <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
            <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
            <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
            <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/exports" element={<ProtectedRoute><Exports /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
