import { useState } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { MobileHeader, BottomNav, MoreMenu, PageContainer, Toast, ViewSwitcher } from './components/Shared';
import { Onboarding, PWAInstallBanner } from './components/Onboarding';
import { AdminLayout } from './components/AdminLayout';
import { HomePage } from './pages/client/HomePage';
import { SearchPage, PartDetailPage } from './pages/client/SearchPage';
import {
  ReservationsPage, NotificationsPage, CartPage, CheckoutPage,
  ProfilePage, VehiclesPage, FavoritesPage, HistoryPage, SettingsPage, SupportPage
} from './pages/client/SecondaryPages';
import {
  AdminDashboard, AdminUsers, AdminSuppliers, AdminCatalog,
  AdminStock, AdminReservations, AdminPayments, AdminCMS, AdminReports, AdminSettings
} from './pages/admin/AdminPages';

// =========================================================
// ROOT APP — orchestrates routing + layouts
// CLIENT (PWA) vs BACKOFFICE — strictly separated
// =========================================================

const PAGE_META: Record<string, { title: string; subtitle?: string }> = {
  home:          { title: 'AutoParts Connect' },
  search:        { title: 'Catalogue', subtitle: '5 000+ pièces disponibles' },
  reservations:  { title: 'Mes réservations' },
  notifications: { title: 'Notifications' },
  more:          { title: 'Menu' },
  'part-detail': { title: 'Détail pièce' },
  cart:          { title: 'Mon panier' },
  checkout:      { title: 'Finaliser' },
  profile:       { title: 'Mon profil' },
  vehicles:      { title: 'Mes véhicules' },
  history:       { title: 'Historique' },
  favorites:     { title: 'Mes favoris' },
  settings:      { title: 'Paramètres' },
  support:       { title: 'Support' },
};

const ADMIN_META: Record<string, { title: string; subtitle?: string }> = {
  dashboard:    { title: 'Dashboard',       subtitle: 'Vue d\'ensemble de la plateforme' },
  users:        { title: 'Utilisateurs',    subtitle: '8 421 comptes clients et administrateurs' },
  suppliers:    { title: 'Fournisseurs',    subtitle: '20 partenaires validés' },
  catalog:      { title: 'Catalogue',       subtitle: '5 000+ pièces référencées' },
  stock:        { title: 'Stocks',          subtitle: 'Suivi des inventaires en temps réel' },
  reservations: { title: 'Réservations',    subtitle: '2 154 commandes en cours' },
  payments:     { title: 'Paiements',       subtitle: 'Transactions et règlements' },
  cms:          { title: 'CMS',             subtitle: 'Gestion de contenu' },
  reports:      { title: 'Rapports',        subtitle: 'Analyses et exports' },
  settings:     { title: 'Configuration',   subtitle: 'Paramètres de la plateforme' },
};

function ClientShell() {
  const { clientPage, setClientPage } = useApp();
  const [moreOpen, setMoreOpen] = useState(false);
  const meta = PAGE_META[clientPage] || { title: 'AutoParts' };

  if (clientPage === 'more') {
    setClientPage('profile');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <MobileHeader
        title={meta.title}
        subtitle={meta.subtitle}
        onBack={clientPage !== 'home' ? () => setClientPage('home') : undefined}
      />
      <PageContainer>
        {clientPage === 'home' && <HomePage />}
        {clientPage === 'search' && <SearchPage />}
        {clientPage === 'part-detail' && <PartDetailPage />}
        {clientPage === 'reservations' && <ReservationsPage />}
        {clientPage === 'notifications' && <NotificationsPage />}
        {clientPage === 'cart' && <CartPage />}
        {clientPage === 'checkout' && <CheckoutPage />}
        {clientPage === 'profile' && <ProfilePage />}
        {clientPage === 'vehicles' && <VehiclesPage />}
        {clientPage === 'favorites' && <FavoritesPage />}
        {clientPage === 'history' && <HistoryPage />}
        {clientPage === 'settings' && <SettingsPage />}
        {clientPage === 'support' && <SupportPage />}
      </PageContainer>
      <BottomNav onMore={() => setMoreOpen(true)} />
      <MoreMenu open={moreOpen} onClose={() => setMoreOpen(false)} />
      <Toast />
    </div>
  );
}

function AdminShell() {
  const { adminPage } = useApp();
  const meta = ADMIN_META[adminPage] || { title: 'Admin' };

  return (
    <>
      <AdminLayout title={meta.title} subtitle={meta.subtitle}>
        {adminPage === 'dashboard' && <AdminDashboard />}
        {adminPage === 'users' && <AdminUsers />}
        {adminPage === 'suppliers' && <AdminSuppliers />}
        {adminPage === 'catalog' && <AdminCatalog />}
        {adminPage === 'stock' && <AdminStock />}
        {adminPage === 'reservations' && <AdminReservations />}
        {adminPage === 'payments' && <AdminPayments />}
        {adminPage === 'cms' && <AdminCMS />}
        {adminPage === 'reports' && <AdminReports />}
        {adminPage === 'settings' && <AdminSettings />}
        {adminPage === 'part-detail' && <PartDetailPage />}
      </AdminLayout>
      <Toast />
    </>
  );
}

function Shell() {
  const { view } = useApp();
  return view === 'client' ? <ClientShell /> : <AdminShell />;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars

export default function App() {
  return (
    <AppProvider>
      <Shell />
      <ViewSwitcher />
      <Onboarding />
      <PWAInstallBanner />
    </AppProvider>
  );
}
