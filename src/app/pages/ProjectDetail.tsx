import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { ArrowLeft, MapPin, Calendar, Maximize2 } from 'lucide-react';
import { db } from '../../utils/supabase';
import { motion } from 'motion/react';
import { Badge } from '../components/ui/badge';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  featured_image: string;
  gallery?: string[];
  location?: string;
  year?: number;
  area?: string;
  services?: string[];
}

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;

    db.getProjectBySlug(slug)
      .then(({ data }) => {
        if (data) {
          setProject(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading project:', err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground font-inter">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-muted-foreground font-inter text-lg mb-6">
          Project not found
        </p>
        <Button onClick={() => navigate('/projects')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Button
          onClick={() => navigate('/projects')}
          variant="ghost"
          className="group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Button>
      </div>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[70vh] mb-12"
      >
        <img
          src={project.featured_image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold font-montserrat mb-4 text-white"
            >
              {project.title}
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 text-white/90"
            >
              {project.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span className="font-inter">{project.location}</span>
                </div>
              )}
              {project.year && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-inter">{project.year}</span>
                </div>
              )}
              {project.area && (
                <div className="flex items-center space-x-2">
                  <Maximize2 className="h-4 w-4" />
                  <span className="font-inter">{project.area}</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Services Tags */}
        {project.services && project.services.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 flex flex-wrap gap-2"
          >
            {project.services.map((service) => (
              <Badge
                key={service}
                variant="secondary"
                className="px-4 py-2 text-sm font-inter"
              >
                {service}
              </Badge>
            ))}
          </motion.div>
        )}

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12 backdrop-blur-md bg-card border border-border rounded-2xl p-8"
          style={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <h2 className="text-3xl font-bold font-montserrat mb-4">
            Project Overview
          </h2>
          <p className="text-lg font-inter text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {project.description}
          </p>
        </motion.div>

        {/* Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold font-montserrat mb-8">
              Project Gallery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.gallery.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  className="relative group overflow-hidden rounded-2xl aspect-video"
                >
                  <img
                    src={image}
                    alt={`${project.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}