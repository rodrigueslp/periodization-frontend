// src/components/layout/Layout.jsx

import React from 'react';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1 relative overflow-y-auto focus:outline-none">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;