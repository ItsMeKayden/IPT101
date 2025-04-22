import React from 'react';

export const MainContent = ({ activePanel }) => {
  const panels = [
    {
      id: 1,
      title: "Home Dashboard",
      content: "Welcome to the home panel"
    },
    {
      id: 2,
      title: "Inventory Management",
      content: "Inventory items will appear here"
    }
  ];

  const panel = panels.find(p => p.id === activePanel) || panels[0];

  return (
    <div className="flex-1 p-4 overflow-hidden"> {/* ml-20 matches collapsed sidebar width */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-purple-800 mb-4">{panel.title}</h1>
        <p className="text-gray-700">{panel.content}</p>
      </div>
    </div>
  );
};