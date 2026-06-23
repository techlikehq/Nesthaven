import { BrowserRouter, Routes, Route, Outlet } from 'react-router';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HomePage from '../pages/HomePage';
import ListingsPage from '../pages/ListingsPage';
import AgentsPage from '../pages/AgentsPage';
import AreasPage from '../pages/AreasPage';
import ListPropertyPage from '../pages/ListPropertyPage';
import CalculatorPage from '../pages/CalculatorPage';
import AlertsPage from '../pages/AlertsPage';
import PropertyPage from '../pages/PropertyPage';
import AreaDetailPage from '../pages/AreaDetailPage';
import AgentInboxPage from '../pages/AgentInboxPage';
import AdminReportsPage from '../pages/AdminReportsPage';
import AdminDashboard from '../pages/AdminDashboard';

// Public layout — wraps every public page with Navbar + Footer
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Admin routes — no Navbar, no Footer, full screen */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />

        {/* Public routes — wrapped in Navbar + Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/areas" element={<AreasPage />} />
          <Route path="/list-property" element={<ListPropertyPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/property/:id" element={<PropertyPage />} />
          <Route path="/areas/:slug" element={<AreaDetailPage />} />
          <Route path="/agents/inbox/:agentId" element={<AgentInboxPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
