import { useState, useEffect, useMemo } from 'react';
import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { ThreeBackground } from './components/ThreeBackground';
import { createRouter } from './routes';
import { supabase, db } from '../utils/supabase';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        setAccessToken(session.access_token);
      }
      setLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        setAccessToken(session.access_token);
      } else {
        setIsAuthenticated(false);
        setAccessToken('');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }

    // Fetch site settings
    db.getSettings()
      .then(({ data }) => {
        if (data) {
          setSettings(data);
        }
      })
      .catch(err => console.error('Error loading settings:', err));
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogin = (token: string) => {
    setIsAuthenticated(true);
    setAccessToken(token);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAccessToken('');
  };

  const router = useMemo(
    () => createRouter({ 
      isAuthenticated, 
      accessToken, 
      onLogin: handleLogin, 
      onLogout: handleLogout,
      isDark,
      toggleTheme,
      settings
    }),
    [isAuthenticated, accessToken, isDark, settings]
  );

  if (loading) {
    return (
      <div className="size-full flex items-center justify-center">
        <div className="text-center">
          <div className="flex flex-col leading-none mb-4">
            <span className="text-4xl font-bold font-montserrat tracking-wider">
              VASTU
            </span>
            <span className="text-4xl font-bold font-montserrat tracking-wider">
              PURTI
            </span>
          </div>
          <p className="text-muted-foreground font-inter">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full relative">
      {/* 3D Background */}
      <ThreeBackground isDark={isDark} />

      {/* Router */}
      <div className="relative z-10">
        <RouterProvider router={router} />
      </div>

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </div>
  );
}