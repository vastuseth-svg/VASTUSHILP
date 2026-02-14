import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { toast } from 'sonner';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginProps {
  onLogin: (token: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      if (authData.session) {
        onLogin(authData.session.access_token);
      }

      toast.success('Login successful!');
      navigate('/admin');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div
          className="bg-card border border-border rounded-2xl p-8 shadow-2xl"
          style={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-montserrat tracking-wider mb-2">
              VASTUPURTI
            </h1>
            <p className="text-muted-foreground font-inter">
              Admin Portal
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@vastupurti.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="mr-2"
                  >
                    <LogIn className="h-4 w-4" />
                  </motion.div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Footer Info */}
          <div className="mt-6 p-4 bg-secondary/50 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground font-inter text-center">
              Default credentials: admin@vastupurti.com / admin123
            </p>
            <p className="text-xs text-muted-foreground font-inter text-center mt-1">
              (Change password after first login)
            </p>
          </div>

          {/* Back to Site Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-inter"
            >
              ← Back to Website
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}