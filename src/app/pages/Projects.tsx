import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { db } from '../../utils/supabase';
import { motion } from 'motion/react';
import { Search, Filter } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  featured_image: string;
  location?: string;
  year?: number;
  services?: string[];
}

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    db.getProjects()
      .then(({ data }) => {
        if (data) {
          setProjects(data);
          setFilteredProjects(data);
        }
      })
      .catch(err => console.error('Error loading projects:', err));
  }, []);

  useEffect(() => {
    let filtered = [...projects];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter(project => project.location === locationFilter);
    }

    // Year filter
    if (yearFilter !== 'all') {
      filtered = filtered.filter(project => project.year?.toString() === yearFilter);
    }

    setFilteredProjects(filtered);
  }, [searchTerm, locationFilter, yearFilter, projects]);

  // Get unique locations and years for filters
  const locations = Array.from(new Set(projects.map(p => p.location).filter(Boolean)));
  const years = Array.from(new Set(projects.map(p => p.year).filter(Boolean))).sort((a, b) => (b as number) - (a as number));

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-7xl font-bold font-montserrat mb-6">
            Our Projects
          </h1>
          <p className="text-xl text-muted-foreground font-inter max-w-2xl mx-auto">
            Explore our portfolio of exceptional architectural works
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 backdrop-blur-md bg-card border border-border rounded-2xl p-6"
          style={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 mr-2 text-muted-foreground" />
            <h3 className="font-montserrat font-semibold text-lg">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Location Filter */}
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location as string}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year Filter */}
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year?.toString() || ''}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {(searchTerm || locationFilter !== 'all' || yearFilter !== 'all') && (
            <Button
              onClick={() => {
                setSearchTerm('');
                setLocationFilter('all');
                setYearFilter('all');
              }}
              variant="ghost"
              size="sm"
              className="mt-4"
            >
              Clear Filters
            </Button>
          )}
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-inter">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-inter text-lg">
              No projects found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <GlassCard
                  image={project.featured_image}
                  title={project.title}
                  description={project.description}
                  buttonText="View Details"
                  onButtonClick={() => navigate(`/projects/${project.slug}`)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}