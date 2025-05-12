import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/inventory';
import SalesHistory from './components/SalesHistory';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen w-screen bg-[#f5eef3] dark:bg-dark-background">
        <Sidebar>
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/sales-history" element={<SalesHistory />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </Sidebar>
      </div>
    </Router>
  );
}
