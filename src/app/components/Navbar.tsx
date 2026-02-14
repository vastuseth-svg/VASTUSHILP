import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
  isAuthenticated: boolean;
}

export function Navbar({ isDark, toggleTheme, isAuthenticated }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/80 backdrop-blur-xl shadow-lg'
          : 'bg-transparent backdrop-blur-sm'
      }`}
      style={{
        backdropFilter: isScrolled ? 'blur(20px)' : 'blur(8px)',
        WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'blur(8px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex flex-col leading-none">
            <span className="text-2xl font-bold font-montserrat tracking-wider text-foreground">
              VASTU
            </span>
            <span className="text-2xl font-bold font-montserrat tracking-wider text-foreground">
              PURTI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-inter font-medium transition-colors hover:text-primary ${
                  location.pathname === link.path
                    ? 'text-primary'
                    : 'text-foreground/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated && (
              <Link
                to="/admin"
                className="font-inter font-medium text-foreground/70 hover:text-primary transition-colors"
              >
                Admin
              </Link>
            )}

            {/* Theme Toggle */}
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            <Button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant="ghost"
              size="icon"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2 font-inter font-medium transition-colors hover:bg-secondary rounded-lg ${
                  location.pathname === link.path
                    ? 'text-primary bg-secondary'
                    : 'text-foreground/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 font-inter font-medium text-foreground/70 hover:bg-secondary rounded-lg transition-colors"
              >
                Admin
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
