
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';

import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Leads from './pages/Leads';
import Opportunities from './pages/Opportunities';
import Activities from './pages/Activities';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import './App.css';

function PlaceholderPage({ title }) {
  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <h1>{title}</h1>
          <p>This section is being developed.</p>
        </div>
      </div>
    </div>
  );
}

function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Topbar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/opportunities" element={<Opportunities />} /><Route path="/opportunities" element={<Opportunities />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<PlaceholderPage title="Page not found" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
