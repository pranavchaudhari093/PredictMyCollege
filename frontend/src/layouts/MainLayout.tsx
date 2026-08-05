import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => (
  <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-background)' }}>
    <Navbar />
    <main className="flex-1">
      {children}
    </main>
    <Footer />
  </div>
);

export default MainLayout;
