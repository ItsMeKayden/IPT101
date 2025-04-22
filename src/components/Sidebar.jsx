import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Sidebar({ onExpand, setActivePanel, activePanel = 'dashboard' }) {
  const [collapsed, setCollapsed] = useState(true)
  const navigate = useNavigate()

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
    }
  ]

  const handleNavigation = (itemId) => {
    setActivePanel(itemId)
    navigate(`/${itemId}`)
  }

  return (
    <div 
      className={`fixed h-full text-white transition-all duration-300 z-10 ${
        collapsed ? 'w-20' : 'w-[250px]'
      }`}
      style={{
        background: 'linear-gradient(to bottom, #FF88C2 2%, #DE67A1 13%, #8E325E 75%, #591536 97%)'
      }}
      onMouseEnter={() => {
        onExpand(true)
        setCollapsed(false)
      }}
      onMouseLeave={() => {
        onExpand(false)
        setCollapsed(true)
      }}
    >
      {/* Branding Header - Only shown when expanded */}
      {!collapsed && (
        <div className="p-4 border-b border-[#d2679f]">
          <div className="flex flex-col items-center justify-center text-[#ffea99]">
            <h1 className="text-[30px] font-goudy">KARINEYOSA</h1>
            <p className="text-[13px] leading-tight font-goudy">
              What you see<br />
              <span className="pl-6">is what you get</span>
            </p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className={`flex flex-col ${collapsed ? 'pt-0' : 'pt-2'}`}>
        <nav className="space-y-0"> {/* Changed from space-y-2 to remove gap between buttons */}
          {items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`w-full p-3 flex items-center outline-none rounded-none ${
                collapsed ? 'justify-center' : 'justify-start px-3'
              } ${
                activePanel === item.id 
                  ? 'bg-[#FB9DCB]' 
                  : 'bg-transparent hover:bg-[#d2679f]'
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
                <span className="ml-3 text-[#ffea99]">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Footer Button */}
      <div className="mt-[270px] border-t border-[#d2679f]">
        <button className={`mt-auto w-full p-3 flex items-center outline-none rounded-none transition-colors hover:bg-[#d2679f] ${
          collapsed ? 'justify-center' : 'justify-start px-3'
        }`}>
          <div className="mt-auto w-8 h-10 flex items-center justify-center">
            <img 
              src="/icons/settings.png" 
              alt="Settings" 
              className="w-full h-full object-contain"
            />
          </div>
          {!collapsed && (
            <span className="ml-3 text-[#ffea99]">
              SETTINGS
            </span>
          )}
        </button>
      </div>

    </div>
  )
}