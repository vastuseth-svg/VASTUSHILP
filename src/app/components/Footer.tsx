import { Link } from 'react-router';
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  settings: Record<string, string>;
}

export function Footer({ settings }: FooterProps) {
  return (
    <footer className="relative mt-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex flex-col leading-none mb-4">
              <span className="text-2xl font-bold font-montserrat tracking-wider">
                VASTU
              </span>
              <span className="text-2xl font-bold font-montserrat tracking-wider">
                PURTI
              </span>
            </div>
            <p className="text-muted-foreground font-inter text-sm">
              We Build Dreams
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-montserrat font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/projects"
                  className="text-muted-foreground hover:text-primary transition-colors font-inter text-sm"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary transition-colors font-inter text-sm"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-muted-foreground hover:text-primary transition-colors font-inter text-sm"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-muted-foreground hover:text-primary transition-colors font-inter text-sm"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-montserrat font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-muted-foreground font-inter text-sm">
              <li>Residential Design</li>
              <li>Commercial Architecture</li>
              <li>Interior Design</li>
              <li>Urban Planning</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-montserrat font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              {settings.contact_address && (
                <li className="flex items-start space-x-2 text-muted-foreground font-inter text-sm">
                  <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                  <span>{settings.contact_address}</span>
                </li>
              )}
              {settings.contact_email && (
                <li className="flex items-center space-x-2 text-muted-foreground font-inter text-sm">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="hover:text-primary transition-colors"
                  >
                    {settings.contact_email}
                  </a>
                </li>
              )}
              {settings.contact_phone && (
                <li className="flex items-center space-x-2 text-muted-foreground font-inter text-sm">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <a
                    href={`tel:${settings.contact_phone}`}
                    className="hover:text-primary transition-colors"
                  >
                    {settings.contact_phone}
                  </a>
                </li>
              )}
            </ul>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {settings.social_facebook && (
                <a
                  href={settings.social_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {settings.social_facebook && (
                <a
                  href={settings.social_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {settings.social_linkedin && (
                <a
                  href={settings.social_linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {settings.social_twitter && (
                <a
                  href={settings.social_twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-muted-foreground font-inter text-sm">
            © {new Date().getFullYear()} VASTUPURTI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
