import { AppProvider, useApp } from './store/AppContext';
import { Toast, SOSTechnicianFAB } from './components/Shared';
import { AdminLayout } from './components/AdminLayout';
import { LoginPage } from './pages/admin/LoginPage';
import { PartDetailPage } from './pages/client/SearchPage';
import {
  AdminDashboard, AdminUsers, AdminSuppliers, AdminCatalog,
  AdminStock, AdminReservations, AdminPayments, AdminCMS, AdminReports, AdminSettings
} from './pages/admin/AdminPages';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './i18n';

// =========================================================
// ROOT APP — ADMINISTRATION DASHBOARD
// Autopart Connects — Plateforme SaaS Automobile Cameroun
// =========================================================

function AdminShell() {
  const { adminPage } = useApp();
  const { t } = useTranslation();

  const title = t(`meta.${adminPage}.title`, adminPage);
  const subtitle = t(`meta.${adminPage}.subtitle`, '');

  return (
    <>
      <AdminLayout title={title} subtitle={subtitle}>
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
      {/* Bouton SOS Technicien flottant — visible partout dans l'app */}
      <SOSTechnicianFAB />
    </>
  );
}

function Shell() {
  const { user } = useApp();
  if (!user) {
    return <LoginPage />;
  }
  return <AdminShell />;
}

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AppProvider>
        <Shell />
      </AppProvider>
    </I18nextProvider>
  );
}
