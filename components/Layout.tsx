import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-primary text-textMain font-sans selection:bg-accentGreen/30">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accentGreen to-transparent opacity-20" />
    </div>
  );
};

export default Layout;