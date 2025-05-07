import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/inventory';

export default function App() {
  const [blurred, setBlurred] = useState(false);
  const [activePanel, setActivePanel] = useState('dashboard');

  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today
    .toLocaleDateString('en-US', options)
    .toUpperCase();

  return (
    <Router>
      <div className="flex flex-col h-screen w-screen bg-white">
        {/* Full-width white header */}
        <header className="w-full h-[75px] bg-white shadow-sm p-2 z-10 flex justify-between items-center pl-10 pr-5">
          <h1 className="font-['Cinzel'] text-[55px] font-bold text-[#8E1751]">
            {activePanel === 'dashboard' ? 'DASHBOARD' : 'INVENTORY'}
          </h1>
          <div className="flex items-center text-[17px] font-semibold font-serif">
            <span className="text-[#8E1751] tracking-wide mr-2">DATE:</span>
            <div className="border border-gray-300 rounded-full px-4 py-1 text-[#8E1751]">
              {formattedDate}
            </div>
          </div>
        </header>

        {/* Main content area with sidebar */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - using your existing component */}
          <Sidebar
            onExpand={setBlurred}
            setActivePanel={setActivePanel}
            activePanel={activePanel}
          />

          {/* Content Area - with left margin to account for sidebar */}
          <main
            className={`flex-1 overflow-auto ml-20 transition-all duration-300 ${
              blurred ? 'blur-sm' : ''
            }`}
          >
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
