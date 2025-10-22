import { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
}

export const Layout = ({ children, showNavbar = true }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {showNavbar && <Navbar />}
      <main className={showNavbar ? "pt-0" : ""}>
        {children}
      </main>
    </div>
  );
};