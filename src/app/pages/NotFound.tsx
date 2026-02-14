import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router';
import { Home } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-9xl font-bold font-montserrat mb-4 bg-gradient-to-r from-[var(--accent-pink)] via-[var(--accent-purple)] to-[var(--accent-green)] bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-4xl font-bold font-montserrat mb-4">
          Page Not Found
        </h2>
        <p className="text-xl text-muted-foreground font-inter mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button
          onClick={() => navigate('/')}
          size="lg"
          className="group"
        >
          <Home className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
          Back to Home
        </Button>
      </motion.div>
    </div>
  );
}
