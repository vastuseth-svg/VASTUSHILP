import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Settings, Save, Globe, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { db } from '../../../utils/supabase';
import { toast } from 'sonner';

interface SettingsData {
  // General Settings
  site_name?: string;
  site_tagline?: string;
  site_description?: string;
  site_logo?: string;
  site_favicon?: string;
  
  // Contact Information
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  contact_city?: string;
  contact_country?: string;
  contact_postal_code?: string;
  
  // Social Media
  social_facebook?: string;
  social_twitter?: string;
  social_instagram?: string;
  social_linkedin?: string;
  social_youtube?: string;
  
  // Business Hours
  business_hours_weekday?: string;
  business_hours_weekend?: string;
  
  // SEO
  meta_keywords?: string;
  google_analytics_id?: string;
  
  // Other
  copyright_text?: string;
  footer_text?: string;
}

interface GeneralForm {
  site_name: string;
  site_tagline: string;
  site_description: string;
  site_logo: string;
  site_favicon: string;
}

interface ContactForm {
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  contact_city: string;
  contact_country: string;
  contact_postal_code: string;
  business_hours_weekday: string;
  business_hours_weekend: string;
}

interface SocialForm {
  social_facebook: string;
  social_twitter: string;
  social_instagram: string;
  social_linkedin: string;
  social_youtube: string;
}

interface SEOForm {
  meta_keywords: string;
  google_analytics_id: string;
  copyright_text: string;
  footer_text: string;
}

export function AdminSettings({ accessToken }: { accessToken: string }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SettingsData>({});

  const generalForm = useForm<GeneralForm>({
    defaultValues: {
      site_name: '',
      site_tagline: '',
      site_description: '',
      site_logo: '',
      site_favicon: ''
    }
  });
  const contactForm = useForm<ContactForm>({
    defaultValues: {
      contact_email: '',
      contact_phone: '',
      contact_address: '',
      contact_city: '',
      contact_country: '',
      contact_postal_code: '',
      business_hours_weekday: '',
      business_hours_weekend: ''
    }
  });
  const socialForm = useForm<SocialForm>({
    defaultValues: {
      social_facebook: '',
      social_twitter: '',
      social_instagram: '',
      social_linkedin: '',
      social_youtube: ''
    }
  });
  const seoForm = useForm<SEOForm>({
    defaultValues: {
      meta_keywords: '',
      google_analytics_id: '',
      copyright_text: '',
      footer_text: ''
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await db.getSettings();
      if (error) throw error;
      
      if (data) {
        setSettings(data);
        populateForms(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
      setLoading(false);
    }
  };

  const populateForms = (data: SettingsData) => {
    // General
    generalForm.setValue('site_name', data.site_name || '');
    generalForm.setValue('site_tagline', data.site_tagline || '');
    generalForm.setValue('site_description', data.site_description || '');
    generalForm.setValue('site_logo', data.site_logo || '');
    generalForm.setValue('site_favicon', data.site_favicon || '');

    // Contact
    contactForm.setValue('contact_email', data.contact_email || '');
    contactForm.setValue('contact_phone', data.contact_phone || '');
    contactForm.setValue('contact_address', data.contact_address || '');
    contactForm.setValue('contact_city', data.contact_city || '');
    contactForm.setValue('contact_country', data.contact_country || '');
    contactForm.setValue('contact_postal_code', data.contact_postal_code || '');
    contactForm.setValue('business_hours_weekday', data.business_hours_weekday || '');
    contactForm.setValue('business_hours_weekend', data.business_hours_weekend || '');

    // Social
    socialForm.setValue('social_facebook', data.social_facebook || '');
    socialForm.setValue('social_twitter', data.social_twitter || '');
    socialForm.setValue('social_instagram', data.social_instagram || '');
    socialForm.setValue('social_linkedin', data.social_linkedin || '');
    socialForm.setValue('social_youtube', data.social_youtube || '');

    // SEO
    seoForm.setValue('meta_keywords', data.meta_keywords || '');
    seoForm.setValue('google_analytics_id', data.google_analytics_id || '');
    seoForm.setValue('copyright_text', data.copyright_text || '');
    seoForm.setValue('footer_text', data.footer_text || '');
  };

  const saveSettings = async (updatedSettings: Partial<SettingsData>) => {
    setSaving(true);
    try {
      await db.updateSettings(updatedSettings as Record<string, string>);
      
      toast.success('Settings saved successfully!');
      setSettings({ ...settings, ...updatedSettings });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const onGeneralSubmit = async (data: GeneralForm) => {
    await saveSettings(data);
  };

  const onContactSubmit = async (data: ContactForm) => {
    await saveSettings(data);
  };

  const onSocialSubmit = async (data: SocialForm) => {
    await saveSettings(data);
  };

  const onSEOSubmit = async (data: SEOForm) => {
    await saveSettings(data);
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground font-inter">Loading settings...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Settings className="h-8 w-8" />
          <h1 className="text-4xl font-bold font-montserrat">Settings</h1>
        </div>
        <p className="text-muted-foreground font-inter">
          Configure your site settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="general">
            <Globe className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="contact">
            <Phone className="h-4 w-4 mr-2" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="social">
            <Facebook className="h-4 w-4 mr-2" />
            Social
          </TabsTrigger>
          <TabsTrigger value="seo">
            <Settings className="h-4 w-4 mr-2" />
            SEO
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-md bg-card border border-border rounded-2xl p-6"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <h2 className="text-2xl font-bold font-montserrat mb-6">General Settings</h2>
            <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="site_name">Site Name</Label>
                <Input
                  id="site_name"
                  {...generalForm.register('site_name')}
                  placeholder="VASTUPURTI"
                />
              </div>

              <div>
                <Label htmlFor="site_tagline">Site Tagline</Label>
                <Input
                  id="site_tagline"
                  {...generalForm.register('site_tagline')}
                  placeholder="Architectural Excellence"
                />
              </div>

              <div>
                <Label htmlFor="site_description">Site Description</Label>
                <Textarea
                  id="site_description"
                  {...generalForm.register('site_description')}
                  placeholder="A brief description of your architectural firm..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="site_logo">Logo URL</Label>
                <Input
                  id="site_logo"
                  {...generalForm.register('site_logo')}
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label htmlFor="site_favicon">Favicon URL</Label>
                <Input
                  id="site_favicon"
                  {...generalForm.register('site_favicon')}
                  placeholder="https://..."
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save General Settings'}
                </Button>
              </div>
            </form>
          </motion.div>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-md bg-card border border-border rounded-2xl p-6"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <h2 className="text-2xl font-bold font-montserrat mb-6">Contact Information</h2>
            <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_email">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email Address
                  </Label>
                  <Input
                    id="contact_email"
                    type="email"
                    {...contactForm.register('contact_email')}
                    placeholder="info@vastupurti.com"
                  />
                </div>

                <div>
                  <Label htmlFor="contact_phone">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Phone Number
                  </Label>
                  <Input
                    id="contact_phone"
                    {...contactForm.register('contact_phone')}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="contact_address">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  Street Address
                </Label>
                <Input
                  id="contact_address"
                  {...contactForm.register('contact_address')}
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="contact_city">City</Label>
                  <Input
                    id="contact_city"
                    {...contactForm.register('contact_city')}
                    placeholder="New York"
                  />
                </div>

                <div>
                  <Label htmlFor="contact_postal_code">Postal Code</Label>
                  <Input
                    id="contact_postal_code"
                    {...contactForm.register('contact_postal_code')}
                    placeholder="10001"
                  />
                </div>

                <div>
                  <Label htmlFor="contact_country">Country</Label>
                  <Input
                    id="contact_country"
                    {...contactForm.register('contact_country')}
                    placeholder="United States"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="business_hours_weekday">Business Hours (Weekdays)</Label>
                  <Input
                    id="business_hours_weekday"
                    {...contactForm.register('business_hours_weekday')}
                    placeholder="Mon-Fri: 9:00 AM - 6:00 PM"
                  />
                </div>

                <div>
                  <Label htmlFor="business_hours_weekend">Business Hours (Weekend)</Label>
                  <Input
                    id="business_hours_weekend"
                    {...contactForm.register('business_hours_weekend')}
                    placeholder="Sat-Sun: Closed"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Contact Settings'}
                </Button>
              </div>
            </form>
          </motion.div>
        </TabsContent>

        {/* Social Media Settings */}
        <TabsContent value="social">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-md bg-card border border-border rounded-2xl p-6"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <h2 className="text-2xl font-bold font-montserrat mb-6">Social Media Links</h2>
            <form onSubmit={socialForm.handleSubmit(onSocialSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="social_facebook">
                  <Facebook className="h-4 w-4 inline mr-2" />
                  Facebook URL
                </Label>
                <Input
                  id="social_facebook"
                  {...socialForm.register('social_facebook')}
                  placeholder="https://facebook.com/vastupurti"
                />
              </div>

              <div>
                <Label htmlFor="social_twitter">
                  <Twitter className="h-4 w-4 inline mr-2" />
                  Twitter/X URL
                </Label>
                <Input
                  id="social_twitter"
                  {...socialForm.register('social_twitter')}
                  placeholder="https://twitter.com/vastupurti"
                />
              </div>

              <div>
                <Label htmlFor="social_instagram">
                  <Instagram className="h-4 w-4 inline mr-2" />
                  Instagram URL
                </Label>
                <Input
                  id="social_instagram"
                  {...socialForm.register('social_instagram')}
                  placeholder="https://instagram.com/vastupurti"
                />
              </div>

              <div>
                <Label htmlFor="social_linkedin">
                  <Linkedin className="h-4 w-4 inline mr-2" />
                  LinkedIn URL
                </Label>
                <Input
                  id="social_linkedin"
                  {...socialForm.register('social_linkedin')}
                  placeholder="https://linkedin.com/company/vastupurti"
                />
              </div>

              <div>
                <Label htmlFor="social_youtube">
                  <Youtube className="h-4 w-4 inline mr-2" />
                  YouTube URL
                </Label>
                <Input
                  id="social_youtube"
                  {...socialForm.register('social_youtube')}
                  placeholder="https://youtube.com/@vastupurti"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Social Settings'}
                </Button>
              </div>
            </form>
          </motion.div>
        </TabsContent>

        {/* SEO & Other Settings */}
        <TabsContent value="seo">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-md bg-card border border-border rounded-2xl p-6"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <h2 className="text-2xl font-bold font-montserrat mb-6">SEO & Other Settings</h2>
            <form onSubmit={seoForm.handleSubmit(onSEOSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="meta_keywords">Meta Keywords</Label>
                <Input
                  id="meta_keywords"
                  {...seoForm.register('meta_keywords')}
                  placeholder="architecture, design, construction, residential, commercial"
                />
                <p className="text-xs text-muted-foreground mt-1">Comma-separated keywords for SEO</p>
              </div>

              <div>
                <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
                <Input
                  id="google_analytics_id"
                  {...seoForm.register('google_analytics_id')}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>

              <div>
                <Label htmlFor="copyright_text">Copyright Text</Label>
                <Input
                  id="copyright_text"
                  {...seoForm.register('copyright_text')}
                  placeholder="© 2026 VASTUPURTI. All rights reserved."
                />
              </div>

              <div>
                <Label htmlFor="footer_text">Footer Text</Label>
                <Textarea
                  id="footer_text"
                  {...seoForm.register('footer_text')}
                  placeholder="Additional footer information..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save SEO Settings'}
                </Button>
              </div>
            </form>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}