import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth.store';

// ==========================================
// Lazy Loading لكل الصفحات
// ==========================================
// موقع عام
const HomePage           = React.lazy(() => import('./pages/HomePage'));
const AboutPage          = React.lazy(() => import('./pages/AboutPage'));
const ProjectsPage       = React.lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailPage  = React.lazy(() => import('./pages/ProjectDetailPage'));
const DonatePage         = React.lazy(() => import('./pages/DonatePage'));
const ApplyPage          = React.lazy(() => import('./pages/ApplyPage'));
const StoriesPage        = React.lazy(() => import('./pages/StoriesPage'));
const TransparencyPage   = React.lazy(() => import('./pages/TransparencyPage'));
const PartnersPage       = React.lazy(() => import('./pages/PartnersPage'));
const NewsPage           = React.lazy(() => import('./pages/NewsPage'));
const VolunteersFrontPage= React.lazy(() => import('./pages/VolunteersFrontPage'));
const ContactPage        = React.lazy(() => import('./pages/ContactPage'));

// نظام إداري
const LoginPage             = React.lazy(() => import('./pages/admin/LoginPage'));
const DashboardPage         = React.lazy(() => import('./pages/admin/DashboardPage'));
const ProjectsAdminPage     = React.lazy(() => import('./pages/admin/ProjectsAdminPage'));
const DonationsAdminPage    = React.lazy(() => import('./pages/admin/DonationsAdminPage'));
const ApplicationsAdminPage = React.lazy(() => import('./pages/admin/ApplicationsAdminPage'));
const UsersAdminPage        = React.lazy(() => import('./pages/admin/UsersAdminPage'));
const BeneficiariesAdminPage= React.lazy(() => import('./pages/admin/BeneficiariesAdminPage'));
const EmployeesPage         = React.lazy(() => import('./pages/admin/EmployeesPage'));
const VolunteersPage        = React.lazy(() => import('./pages/admin/VolunteersPage'));
const TasksKanbanPage       = React.lazy(() => import('./pages/admin/TasksKanbanPage'));
const ReportsPage           = React.lazy(() => import('./pages/admin/ReportsPage'));
const AdminStoriesPage      = React.lazy(() => import('./pages/admin/AdminStoriesPage'));
const AdminNewsPage         = React.lazy(() => import('./pages/admin/AdminNewsPage'));
const AdminPartnersPage     = React.lazy(() => import('./pages/admin/AdminPartnersPage'));
const AdminTransparencyPage = React.lazy(() => import('./pages/admin/AdminTransparencyPage'));
const RolesAdminPage        = React.lazy(() => import('./pages/admin/RolesAdminPage'));
const PermissionsAdminPage  = React.lazy(() => import('./pages/admin/PermissionsAdminPage'));

// ==========================================
// Loading Spinner
// ==========================================
const Loading = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', background: '#F5F5F5', fontFamily: 'Tajawal, sans-serif',
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌙</div>
      <div style={{
        width: '40px', height: '40px', border: '4px solid #E0E0E0',
        borderTop: '4px solid #FF8C00', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem',
      }} />
      <p style={{ color: '#1B3A5C', fontWeight: 700, fontSize: '1rem' }}>مؤسسة اليتامى الخيرية</p>
    </div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// ==========================================
// Protected Route
// ==========================================
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuthStore();
  return token ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

// ==========================================
// 404 Page
// ==========================================
const NotFoundPage = () => (
  <div style={{ textAlign: 'center', padding: '5rem 2rem', fontFamily: 'Tajawal, sans-serif', direction: 'rtl', background: '#F5F5F5', minHeight: '100vh' }}>
    <div style={{ fontSize: '5rem' }}>🌙</div>
    <h1 style={{ color: '#1B3A5C', fontSize: '2.5rem', fontWeight: 900, marginTop: '1rem' }}>الصفحة غير موجودة</h1>
    <p style={{ color: '#6B7280', fontSize: '1.1rem', marginTop: '0.5rem' }}>الصفحة التي تبحث عنها غير موجودة أو تم نقلها</p>
    <a href="/" style={{ display: 'inline-block', marginTop: '2rem', background: '#FF8C00', color: '#fff', padding: '0.875rem 2rem', borderRadius: '12px', fontWeight: 800, textDecoration: 'none', fontSize: '1.05rem' }}>
      العودة للصفحة الرئيسية
    </a>
  </div>
);

// ==========================================
// Main App Router
// ==========================================
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<Loading />}>
        <Routes>
          {/* ======= الموقع العام ======= */}
          <Route path="/"              element={<HomePage />} />
          <Route path="/about"         element={<AboutPage />} />
          <Route path="/projects"      element={<ProjectsPage />} />
          <Route path="/projects/:id"  element={<ProjectDetailPage />} />
          <Route path="/donate"        element={<DonatePage />} />
          <Route path="/apply"         element={<ApplyPage />} />
          <Route path="/stories"       element={<StoriesPage />} />
          <Route path="/transparency"  element={<TransparencyPage />} />
          <Route path="/partners"      element={<PartnersPage />} />
          <Route path="/news"          element={<NewsPage />} />
          <Route path="/volunteer"     element={<VolunteersFrontPage />} />
          <Route path="/contact"       element={<ContactPage />} />

          {/* ======= النظام الإداري ======= */}
          <Route path="/admin/login"   element={<LoginPage />} />

          {/* المسارات المحمية */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/admin/projects" element={
            <ProtectedRoute><ProjectsAdminPage /></ProtectedRoute>
          } />
          <Route path="/admin/donations" element={
            <ProtectedRoute><DonationsAdminPage /></ProtectedRoute>
          } />
          <Route path="/admin/applications" element={
            <ProtectedRoute><ApplicationsAdminPage /></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute><UsersAdminPage /></ProtectedRoute>
          } />
          <Route path="/admin/beneficiaries" element={
            <ProtectedRoute><BeneficiariesAdminPage /></ProtectedRoute>
          } />
          <Route path="/admin/employees" element={
            <ProtectedRoute><EmployeesPage /></ProtectedRoute>
          } />
          <Route path="/admin/volunteers" element={
            <ProtectedRoute><VolunteersPage /></ProtectedRoute>
          } />
          <Route path="/admin/tasks" element={
            <ProtectedRoute><TasksKanbanPage /></ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute><ReportsPage /></ProtectedRoute>
          } />
          <Route path="/admin/cms/stories" element={
            <ProtectedRoute><AdminStoriesPage /></ProtectedRoute>
          } />
          <Route path="/admin/cms/news" element={
            <ProtectedRoute><AdminNewsPage /></ProtectedRoute>
          } />
          <Route path="/admin/cms/partners" element={
            <ProtectedRoute><AdminPartnersPage /></ProtectedRoute>
          } />
          <Route path="/admin/cms/transparency" element={
            <ProtectedRoute><AdminTransparencyPage /></ProtectedRoute>
          } />
          <Route path="/admin/roles" element={
            <ProtectedRoute><RolesAdminPage /></ProtectedRoute>
          } />
          <Route path="/admin/permissions" element={
            <ProtectedRoute><PermissionsAdminPage /></ProtectedRoute>
          } />

          {/* إعادة توجيه /admin إلى /admin/dashboard */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default App;
