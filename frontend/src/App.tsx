import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { RootLayout } from './layouts/RootLayout';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { IntelligencePage } from './pages/IntelligencePage';
import { AINegotiatorPage } from './pages/AINegotiatorPage';
import { CampaignSimulatorPage } from './pages/CampaignSimulatorPage';
import { RAGCopilotPage } from './pages/RAGCopilotPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ArtisanRegisterPage } from './pages/ArtisanRegisterPage';
import { ProductRegisterPage } from './pages/ProductRegisterPage';
import { FavoritesPage } from './pages/FavoritesPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<RootLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="marketplace" element={<MarketplacePage />} />
                <Route path="products/:slug" element={<ProductDetailPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="intelligence" element={<IntelligencePage />} />
                <Route path="negotiator" element={<AINegotiatorPage />} />
                <Route path="campaign-simulator" element={<CampaignSimulatorPage />} />
                <Route path="copilot" element={<RAGCopilotPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="register-artisan" element={<ArtisanRegisterPage />} />
                <Route path="add-product" element={<ProductRegisterPage />} />
                <Route path="favorites" element={<FavoritesPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
          </Router>
        </CartProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
