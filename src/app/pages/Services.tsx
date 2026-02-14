import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { Building2, Home, Lightbulb, Trees, Hammer, Ruler } from 'lucide-react';

const services = [
  {
    icon: Home,
    title: 'Residential Design',
    description: 'Creating dream homes that reflect your personality and lifestyle. From modern villas to cozy apartments, we design living spaces that blend comfort, aesthetics, and functionality with meticulous attention to every detail.',
  },
  {
    icon: Building2,
    title: 'Commercial Architecture',
    description: 'Innovative commercial spaces designed to enhance productivity and create lasting impressions. We specialize in office buildings, retail spaces, and mixed-use developments that drive business success.',
  },
  {
    icon: Lightbulb,
    title: 'Interior Design',
    description: 'Transforming interiors into harmonious spaces that blend aesthetics with functionality. Our interior design services cover everything from concept development to furniture selection and styling.',
  },
  {
    icon: Ruler,
    title: 'Urban Planning',
    description: 'Sustainable urban development solutions that shape vibrant and livable communities. We create masterplans that balance growth, sustainability, and quality of life for current and future generations.',
  },
  {
    icon: Trees,
    title: 'Landscape Architecture',
    description: 'Integrating natural elements with built environments to create serene outdoor spaces. Our landscape designs enhance beauty, promote sustainability, and create seamless indoor-outdoor connections.',
  },
  {
    icon: Hammer,
    title: 'Renovation & Restoration',
    description: 'Breathing new life into existing structures while preserving their historic character. We specialize in sensitive renovations that honor the past while meeting contemporary needs and standards.',
  },
];

export function Services() {
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
            Our Services
          </h1>
          <p className="text-xl text-muted-foreground font-inter max-w-3xl mx-auto">
            Comprehensive architectural solutions tailored to bring your vision to life
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="backdrop-blur-md bg-card border border-border rounded-2xl p-8 group hover:shadow-2xl transition-all duration-500"
                style={{
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                {/* Icon */}
                <div className="mb-6 relative">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-pink)]/20 via-[var(--accent-purple)]/20 to-[var(--accent-green)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold font-montserrat mb-4 text-card-foreground">
                  {service.title}
                </h3>
                <p className="text-muted-foreground font-inter leading-relaxed">
                  {service.description}
                </p>

                {/* Hover border glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-primary/30" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Process Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat mb-4">
              Our Process
            </h2>
            <p className="text-xl text-muted-foreground font-inter max-w-2xl mx-auto">
              A collaborative approach that transforms ideas into reality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Discovery',
                description: 'We begin by understanding your vision, needs, and aspirations.',
              },
              {
                step: '02',
                title: 'Design',
                description: 'Our team creates innovative concepts that bring your vision to life.',
              },
              {
                step: '03',
                title: 'Development',
                description: 'We refine the design with detailed plans and documentation.',
              },
              {
                step: '04',
                title: 'Delivery',
                description: 'We oversee construction to ensure flawless execution.',
              },
            ].map((phase, index) => (
              <motion.div
                key={phase.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="backdrop-blur-md bg-card border border-border rounded-2xl p-6"
                style={{
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                <div className="text-5xl font-bold font-montserrat text-primary/20 mb-4">
                  {phase.step}
                </div>
                <h3 className="text-xl font-bold font-montserrat mb-3 text-card-foreground">
                  {phase.title}
                </h3>
                <p className="text-muted-foreground font-inter leading-relaxed">
                  {phase.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
