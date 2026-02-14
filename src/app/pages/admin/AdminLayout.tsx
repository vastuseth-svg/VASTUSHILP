import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router';
import { Button } from '../../components/ui/button';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  MessageSquareQuote, 
  FileText, 
  Mail, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { supabase } from '../../../utils/supabase';
import { toast } from 'sonner';

interface AdminLayoutProps {
  onLogout: () => void;
}

export function AdminLayout({ onLogout }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      onLogout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { path: '/admin/team', label: 'Team', icon: Users },
    { path: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    { path: '/admin/blog', label: 'Blog', icon: FileText },
    { path: '/admin/contacts', label: 'Contacts', icon: Mail },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border backdrop-blur-md z-50"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              {isSidebarOpen ? <X /> : <Menu />}
            </Button>
            
            <Link to="/admin" className="flex flex-col leading-none">
              <span className="text-lg font-bold font-montserrat tracking-wider">
                VASTUPURTI
              </span>
              <span className="text-xs text-muted-foreground font-inter">
                Admin Panel
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
            >
              View Site
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-16 bottom-0 w-64 bg-card border-r border-border backdrop-blur-md transition-transform duration-300 lg:translate-x-0 z-40 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-inter transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-8">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}