import { motion } from 'motion/react';
import { Button } from './ui/button';

interface GlassCardProps {
  image?: string;
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

export function GlassCard({
  image,
  title,
  description,
  buttonText,
  onButtonClick,
  className = '',
}: GlassCardProps) {
  return (
    <motion.div
      className={`group relative overflow-hidden rounded-2xl backdrop-blur-md bg-card border border-border transition-all duration-500 hover:shadow-2xl ${className}`}
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-pink)]/10 via-[var(--accent-purple)]/10 to-[var(--accent-green)]/10" />
      </div>

      {/* Image */}
      {image && (
        <div className="relative h-64 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="p-6 relative z-10">
        <h3 className="text-2xl font-bold mb-3 font-montserrat text-card-foreground">
          {title}
        </h3>
        <p className="text-muted-foreground mb-4 line-clamp-3 font-inter">
          {description}
        </p>
        
        {buttonText && onButtonClick && (
          <Button
            onClick={onButtonClick}
            className="mt-4 group/btn relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <span className="relative z-10">{buttonText}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-pink)] via-[var(--accent-purple)] to-[var(--accent-green)] opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300" />
          </Button>
        )}
      </div>

      {/* Border glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl ring-1 ring-primary/30" />
      </div>
    </motion.div>
  );
}
