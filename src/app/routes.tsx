import { createBrowserRouter, Navigate } from 'react-router';
import { PublicLayout } from './components/PublicLayout';
import { Home } from './pages/Home';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Contact } from './pages/Contact';
import { Blog } from './pages/Blog';
import { BlogDetail } from './pages/BlogDetail';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProjects } from './pages/admin/AdminProjects';
import { AdminContacts } from './pages/admin/AdminContacts';
import { AdminTeam } from './pages/admin/AdminTeam';
import { AdminTestimonials } from './pages/admin/AdminTestimonials';
import { AdminBlog } from './pages/admin/AdminBlog';
import { AdminSettings } from './pages/admin/AdminSettings';

interface RouteProps {
  isAuthenticated: boolean;
  accessToken: string;
  onLogin: (token: string) => void;
  onLogout: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  settings: Record<string, string>;
}

export const createRouter = ({ 
  isAuthenticated, 
  accessToken, 
  onLogin, 
  onLogout, 
  isDark, 
  toggleTheme,
  settings 
}: RouteProps) => {
  return createBrowserRouter([
    {
      path: '/',
      element: <PublicLayout isDark={isDark} toggleTheme={toggleTheme} isAuthenticated={isAuthenticated} settings={settings} />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: 'projects',
          element: <Projects />,
        },
        {
          path: 'projects/:slug',
          element: <ProjectDetail />,
        },
        {
          path: 'about',
          element: <About />,
        },
        {
          path: 'services',
          element: <Services />,
        },
        {
          path: 'contact',
          element: <Contact />,
        },
        {
          path: 'blog',
          element: <Blog />,
        },
        {
          path: 'blog/:slug',
          element: <BlogDetail />,
        },
      ],
    },
    {
      path: '/login',
      element: isAuthenticated ? <Navigate to="/admin" replace /> : <Login onLogin={onLogin} />,
    },
    {
      path: '/admin',
      element: isAuthenticated ? <AdminLayout onLogout={onLogout} /> : <Navigate to="/login" replace />,
      children: [
        {
          index: true,
          element: <AdminDashboard accessToken={accessToken} />,
        },
        {
          path: 'projects',
          element: <AdminProjects accessToken={accessToken} />,
        },
        {
          path: 'team',
          element: <AdminTeam accessToken={accessToken} />,
        },
        {
          path: 'testimonials',
          element: <AdminTestimonials accessToken={accessToken} />,
        },
        {
          path: 'blog',
          element: <AdminBlog accessToken={accessToken} />,
        },
        {
          path: 'contacts',
          element: <AdminContacts accessToken={accessToken} />,
        },
        {
          path: 'settings',
          element: <AdminSettings accessToken={accessToken} />,
        },
      ],
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);
};