import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/ui/button';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { db } from '../../utils/supabase';
import { motion } from 'motion/react';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  featured_image: string;
  featured: boolean;
  published: boolean;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  publish_date: string;
}

interface Testimonial {
  id: string;
  client_name: string;
  project: string;
  quote: string;
  photo?: string;
}

export function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch featured projects
    db.getProjects()
      .then(({ data }) => {
        if (data) {
          const featured = data.filter((p: any) => p.featured).slice(0, 3);
          setFeaturedProjects(featured);
        }
      })
      .catch(err => console.error('Error loading projects:', err));

    // Fetch latest blog posts
    db.getBlogPosts()
      .then(({ data }) => {
        if (data) {
          setLatestPosts(data.slice(0, 3));
        }
      })
      .catch(err => console.error('Error loading blog:', err));

    // Fetch testimonials
    db.getTestimonials()
      .then(({ data }) => {
        if (data) {
          setTestimonials(data.slice(0, 3));
        }
      })
      .catch(err => console.error('Error loading testimonials:', err));
  }, []);

  const scrollToProjects = () => {
    document.getElementById('featured-projects')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-center z-10"
        >
          <h1 className="text-8xl md:text-9xl font-bold font-montserrat tracking-wider mb-4">
            VASTU
          </h1>
          <h1 className="text-8xl md:text-9xl font-bold font-montserrat tracking-wider mb-8">
            PURTI
          </h1>
          <p className="text-xl md:text-2xl font-inter text-muted-foreground mb-12">
            We Build Dreams
          </p>
          
          <Button
            onClick={scrollToProjects}
            size="lg"
            className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full"
          >
            Explore Our Work
            <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <ArrowDown className="h-8 w-8 text-muted-foreground animate-bounce" />
        </motion.div>
      </section>

      {/* Featured Projects */}
      <section id="featured-projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold font-montserrat mb-4">
              Featured Projects
            </h2>
            <p className="text-xl text-muted-foreground font-inter max-w-2xl mx-auto">
              Discover our most innovative and inspiring architectural works
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GlassCard
                  image={project.featured_image}
                  title={project.title}
                  description={project.description}
                  buttonText="View Project"
                  onButtonClick={() => navigate(`/projects/${project.slug}`)}
                />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={() => navigate('/projects')}
              size="lg"
              variant="outline"
              className="group"
            >
              View All Projects
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold font-montserrat mb-4">
              Our Services
            </h2>
            <p className="text-xl text-muted-foreground font-inter max-w-2xl mx-auto">
              Comprehensive architectural solutions tailored to your vision
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Residential Design',
                description: 'Creating dream homes that reflect your personality and lifestyle with meticulous attention to detail.',
              },
              {
                title: 'Commercial Architecture',
                description: 'Innovative commercial spaces designed to enhance productivity and create lasting impressions.',
              },
              {
                title: 'Interior Design',
                description: 'Transforming interiors into harmonious spaces that blend aesthetics with functionality.',
              },
              {
                title: 'Urban Planning',
                description: 'Sustainable urban development solutions that shape vibrant and livable communities.',
              },
              {
                title: 'Landscape Architecture',
                description: 'Integrating natural elements with built environments to create serene outdoor spaces.',
              },
              {
                title: 'Renovation & Restoration',
                description: 'Breathing new life into existing structures while preserving their historic character.',
              },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GlassCard
                  title={service.title}
                  description={service.description}
                  buttonText="Learn More"
                  onButtonClick={() => navigate('/services')}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl md:text-6xl font-bold font-montserrat mb-4">
                Client Testimonials
              </h2>
              <p className="text-xl text-muted-foreground font-inter max-w-2xl mx-auto">
                What our clients say about working with us
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="backdrop-blur-md bg-card border border-border rounded-2xl p-8"
                  style={{
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                >
                  <p className="text-lg font-inter italic mb-6 text-card-foreground">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center space-x-4">
                    {testimonial.photo && (
                      <img
                        src={testimonial.photo}
                        alt={testimonial.client_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-montserrat font-semibold text-card-foreground">
                        {testimonial.client_name}
                      </p>
                      <p className="text-sm text-muted-foreground font-inter">
                        {testimonial.project}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Insights */}
      {latestPosts.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl md:text-6xl font-bold font-montserrat mb-4">
                Latest Insights
              </h2>
              <p className="text-xl text-muted-foreground font-inter max-w-2xl mx-auto">
                Explore our thoughts on architecture, design, and innovation
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <GlassCard
                    image={post.featured_image}
                    title={post.title}
                    description={post.excerpt}
                    buttonText="Read More"
                    onButtonClick={() => navigate(`/blog/${post.slug}`)}
                  />
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                onClick={() => navigate('/blog')}
                size="lg"
                variant="outline"
                className="group"
              >
                View All Posts
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}