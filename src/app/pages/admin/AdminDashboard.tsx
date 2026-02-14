import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FolderKanban, Users, MessageSquareQuote, FileText, Mail } from 'lucide-react';
import { db } from '../../../utils/supabase';

interface DashboardStats {
  projects: number;
  team: number;
  testimonials: number;
  blog: number;
  contacts: number;
}

export function AdminDashboard({ accessToken }: { accessToken: string }) {
  const [stats, setStats] = useState({
    projects: 0,
    team: 0,
    testimonials: 0,
    blog: 0,
    contacts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await db.getStats();
        
        if (error) throw error;

        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, [accessToken]);

  const statCards = [
    { label: 'Projects', value: stats.projects, icon: FolderKanban, color: 'from-[var(--accent-purple)]' },
    { label: 'Team Members', value: stats.team, icon: Users, color: 'from-[var(--accent-green)]' },
    { label: 'Testimonials', value: stats.testimonials, icon: MessageSquareQuote, color: 'from-[var(--accent-pink)]' },
    { label: 'Blog Posts', value: stats.blog, icon: FileText, color: 'from-[var(--accent-purple)]' },
    { label: 'Contact Messages', value: stats.contacts, icon: Mail, color: 'from-[var(--accent-green)]' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-montserrat mb-2">Dashboard</h1>
        <p className="text-muted-foreground font-inter">
          Welcome to the VASTUPURTI admin panel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="backdrop-blur-md bg-card border border-border rounded-2xl p-6 relative overflow-hidden group"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${stat.color} to-transparent flex items-center justify-center opacity-80`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-4xl font-bold font-montserrat">
                    {stat.value}
                  </div>
                </div>
                <p className="text-muted-foreground font-inter">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="mt-12 backdrop-blur-md bg-card border border-border rounded-2xl p-8"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <h2 className="text-2xl font-bold font-montserrat mb-6">
          Quick Guide
        </h2>
        <div className="space-y-4 text-muted-foreground font-inter">
          <p>
            <strong>Projects:</strong> Manage your architectural projects, add images, and control visibility.
          </p>
          <p>
            <strong>Team:</strong> Add and edit team member profiles.
          </p>
          <p>
            <strong>Testimonials:</strong> Showcase client feedback.
          </p>
          <p>
            <strong>Blog:</strong> Create and publish blog posts.
          </p>
          <p>
            <strong>Contacts:</strong> View messages from the contact form.
          </p>
          <p>
            <strong>Settings:</strong> Update site information like address, email, and social links.
          </p>
        </div>
      </motion.div>
    </div>
  );
}