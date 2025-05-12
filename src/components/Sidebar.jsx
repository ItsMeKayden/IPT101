import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ children }) {
  const [collapsed, setCollapsed] = useState(true);
  const [blurred, setBlurred] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active panel from URL path
  const path = location.pathname.split('/')[1] || 'dashboard';
  const [activePanel, setActivePanel] = useState(path);
  
  // Update active panel when location changes or on initial load
  useEffect(() => {
    const currentPath = location.pathname.split('/')[1] || 'dashboard';
    setActivePanel(currentPath);
  }, [location.pathname]);

  // Animation state for main content
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setContentVisible(true);
  }, []);

  const items = [
    { 
      id: 'dashboard', 
      label: 'HOME', 
      icon: '/icons/home.png'
    },
    { 
      id: 'inventory', 
      label: 'INVENTORY', 
      icon: '/icons/inventory.png'
    },
    {
      id: 'sales-history',
      label: 'SALES HISTORY',
      icon: '/icons/saleshistory.png'
    }
  ];

  const handleNavigation = (itemId) => {
    setActivePanel(itemId);
    navigate(`/${itemId}`);
  };

  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today
    .toLocaleDateString('en-US', options)
    .toUpperCase();

  return (
    <>
      {/* Header */}
      <header className="w-full h-[65px] bg-[#f5eef3] shadow-[0_2px_12px_rgba(140,60,180,0.08)] p-2 z-10 flex justify-between items-center pl-10 pr-5">
        <h1 className="font-['Cinzel'] text-[45px] font-bold text-[#8E1751]">
          {activePanel.toUpperCase()}
        </h1>
        <div className="flex items-center text-[17px] font-semibold font-serif">
          <span className="text-[#8E1751] tracking-wide mr-2">DATE:</span>
          <div className="border border-gray-300 rounded-full px-4 py-1 text-[#8E1751]">
            {formattedDate}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-[65px] h-[calc(100vh-65px)] transition-all duration-300 z-10 shadow-[0_4px_24px_rgba(140,60,180,0.10)] ${
          collapsed ? 'w-20' : 'w-[250px]'
        }`}
        style={{
          background: 'linear-gradient(135deg, #e7d6f7 0%, #f7d6d0 100%)',
          borderTopLeftRadius: '7px',
          borderTopRightRadius: '7px',
          overflow: 'hidden'
        }}
        onMouseEnter={() => {
          setBlurred(true);
          setCollapsed(false);
        }}
        onMouseLeave={() => {
          setBlurred(false);
          setCollapsed(true);
        }}
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            {/* Branding Header - Only shown when expanded */}
            <div className={collapsed ? 'h-0 overflow-hidden' : 'p-4 border-b border-[#d2679f]'}>
              {!collapsed && (
                <div className="flex flex-col items-center justify-center text-[#8E1751]">
                  <h1 className="text-[30px] font-goudy">KARINEYOSA</h1>
                  <p className="text-[13px] leading-tight font-goudy">
                    What you see<br />
                    <span className="pl-6">is what you get</span>
                  </p>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className={`flex flex-col ${collapsed ? 'pt-0' : 'pt-2'}`}>
              <nav className="space-y-0">
                {items.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full p-3 flex items-center outline-none rounded-none transition-colors duration-200 ${
                      collapsed ? 'justify-center' : 'justify-start px-3'
                    } ${
                      activePanel === item.id 
                        ? 'bg-[#d4b9cc] text-[#8E1751]' 
                        : 'bg-transparent hover:bg-[#e7c9de] text-[#8E1751]'
                    } ${
                      collapsed && index === 0 ? 'mt-0' : ''
                    }`}
                  >
                    <div className="w-8 h-10 flex items-center justify-center">
                      <img 
                        src={item.icon} 
                        alt={item.label} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    {!collapsed && (
                      <span className="ml-3">
                        {item.label}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 pl-10 overflow-x-hidden ${
          blurred ? 'blur-sm' : ''
        } ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-opacity transition-transform duration-700`}
      >
        {children}
      </div>
    </>
  );
}