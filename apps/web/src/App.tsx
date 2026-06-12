import { AppProvider, useApp } from './store/AppContext';
import { Toast } from './components/Shared';
import { AdminLayout } from './components/AdminLayout';
import { LoginPage } from './pages/admin/LoginPage';
import { PartDetailPage } from './pages/client/SearchPage';
import {
  AdminDashboard, AdminUsers, AdminSuppliers, AdminCatalog,
  AdminStock, AdminReservations, AdminPayments, AdminCMS, AdminReports, AdminSettings
} from './pages/admin/AdminPages';

// =========================================================
// ROOT APP — ADMINISTRATION DASHBOARD ONLY
// =========================================================

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
  const { user } = useApp();
  // Si l'utilisateur n'est pas connecté, on affiche la page de connexion
  if (!user) {
    return <LoginPage />;
  }

  // Sinon on affiche le tableau de bord
  return <AdminShell />;
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
