import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { db } from '../../utils/supabase';
import { toast } from 'sonner';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  project_type: string;
  message: string;
}

export function Contact() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ContactForm>();

  useEffect(() => {
    db.getSettings()
      .then(({ data }) => {
        if (data) {
          setSettings(data);
        }
      })
      .catch(err => console.error('Error loading settings:', err));
  }, []);

  const onSubmit = async (data: ContactForm) => {
    try {
      const { error } = await db.createContact(data);

      if (error) {
        throw error;
      }

      toast.success('Message sent successfully! We\'ll be in touch soon.');
      reset();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

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
            Get In Touch
          </h1>
          <p className="text-xl text-muted-foreground font-inter max-w-2xl mx-auto">
            Let's discuss your project and bring your vision to life
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="backdrop-blur-md bg-card border border-border rounded-2xl p-8"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <h2 className="text-3xl font-bold font-montserrat mb-6">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                  placeholder="Your name"
                  className="mt-2"
                />
                {errors.name && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  placeholder="your@email.com"
                  className="mt-2"
                />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="+1 (555) 123-4567"
                  className="mt-2"
                />
              </div>

              {/* Project Type */}
              <div>
                <Label htmlFor="project_type">Project Type *</Label>
                <Select
                  onValueChange={(value) => setValue('project_type', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="interior">Interior Design</SelectItem>
                    <SelectItem value="urban">Urban Planning</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                    <SelectItem value="renovation">Renovation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register('project_type', {
                    required: 'Project type is required',
                  })}
                />
                {errors.project_type && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.project_type.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  {...register('message', { required: 'Message is required' })}
                  placeholder="Tell us about your project..."
                  rows={6}
                  className="mt-2"
                />
                {errors.message && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full group"
                size="lg"
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Contact Details */}
            <div
              className="backdrop-blur-md bg-card border border-border rounded-2xl p-8"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <h2 className="text-3xl font-bold font-montserrat mb-6">
                Contact Information
              </h2>

              <div className="space-y-6">
                {settings.contact_address && (
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-montserrat font-semibold mb-1">
                        Address
                      </h3>
                      <p className="text-muted-foreground font-inter">
                        {settings.contact_address}
                      </p>
                    </div>
                  </div>
                )}

                {settings.contact_email && (
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-montserrat font-semibold mb-1">
                        Email
                      </h3>
                      <a
                        href={`mailto:${settings.contact_email}`}
                        className="text-muted-foreground font-inter hover:text-primary transition-colors"
                      >
                        {settings.contact_email}
                      </a>
                    </div>
                  </div>
                )}

                {settings.contact_phone && (
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-montserrat font-semibold mb-1">
                        Phone
                      </h3>
                      <a
                        href={`tel:${settings.contact_phone}`}
                        className="text-muted-foreground font-inter hover:text-primary transition-colors"
                      >
                        {settings.contact_phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Map */}
            <div
              className="backdrop-blur-md bg-card border border-border rounded-2xl overflow-hidden h-80"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                <p className="text-muted-foreground font-inter">
                  Map placeholder - Add your Google Maps embed here
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}