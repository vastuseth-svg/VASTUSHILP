import { Outlet } from 'react-router';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface PublicLayoutProps {
  isDark: boolean;
  toggleTheme: () => void;
  isAuthenticated: boolean;
  settings: Record<string, string>;
}

export function PublicLayout({ isDark, toggleTheme, isAuthenticated, settings }: PublicLayoutProps) {
  return (
    <>
      <Navbar
        isDark={isDark}
        toggleTheme={toggleTheme}
        isAuthenticated={isAuthenticated}
      />
      <div className="relative z-10">
        <Outlet />
        <Footer settings={settings} />
      </div>
    </>
  );
}
