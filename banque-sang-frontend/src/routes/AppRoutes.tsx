import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import HomePageNew from '../pages/HomePageNew';
import LoginPage from '../pages/auth/LoginPage';
import AboutPageNew from '../pages/about/AboutPageNew';
import CentersPageNew from '../pages/centers/CentersPageNew';
import ContactPageNew from '../pages/contact/ContactPageNew';
import DonorPageNew from '../pages/donate/DonorPageNew';
import DonorRegistrationNew from '../pages/donor/DonorRegistrationNew';
import DonorDashboardNew from '../pages/donor/DonorDashboardNew';
import AppointmentFormNew from '../pages/appointment/AppointmentFormNew';
import AppointmentConfirmationNew from '../pages/appointment/AppointmentConfirmationNew';
import HospitalLogin from '../pages/hospital/HospitalLogin';
import HospitalDashboardNew from '../pages/hospital/HospitalDashboardNew';
import AgentDashboardNew from '../pages/agent/AgentDashboardNew';
import AdminDashboard from '../pages/admin/AdminDashboard';
import DashboardPage from '../pages/dashboard/DashboardPage';
import StocksPage from '../pages/admin/StocksPage';

export const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePageNew />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/about" element={<AboutPageNew />} />
      <Route path="/centers" element={<CentersPageNew />} />
      <Route path="/contact" element={<ContactPageNew />} />
      <Route path="/don" element={<DonorPageNew />} />
      <Route path="/donor/inscription" element={<DonorRegistrationNew />} />
      <Route path="/hospital/login" element={<HospitalLogin />} />

      {/* Le formulaire de RDV est protégé : seuls les donneurs y ont accès */}
      <Route element={<ProtectedRoute allowedRoles={['DONNEUR']} />}>
        <Route path="/donor/dashboard" element={<DonorDashboardNew />} />
        <Route path="/appointment/new" element={<AppointmentFormNew />} />
        <Route path="/appointment/confirmation" element={<AppointmentConfirmationNew />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['MEDECIN_HOPITAL']} />}>
        <Route path="/hospital/dashboard" element={<HospitalDashboardNew />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['AGENT_BANQUE']} />}>
        <Route path="/agent/dashboard" element={<AgentDashboardNew />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['ADMINISTRATEUR']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="overview" element={<DashboardPage />} />
          <Route path="stocks" element={<StocksPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);
