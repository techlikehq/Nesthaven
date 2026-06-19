import { BrowserRouter, Routes, Route } from 'react-router';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HomePage from '../pages/HomePage';
import ListingsPage from '../pages/ListingsPage';
import AgentsPage from '../pages/AgentsPage';
import AreasPage from '../pages/AreasPage';
import ListPropertyPage from '../pages/ListPropertyPage';
import CalculatorPage from '../pages/CalculatorPage';
import AlertsPage from '../pages/AlertsPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/listings" element={<ListingsPage />} />
            <Route path="/agents" element={<AgentsPage />} />
            <Route path="/areas" element={<AreasPage />} />
            <Route path="/list-property" element={<ListPropertyPage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
