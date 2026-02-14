import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { db } from '../../../utils/supabase';
import { Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  project_type: string;
  message: string;
  created_at: string;
}

export function AdminContacts({ accessToken }: { accessToken: string }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data, error } = await db.getContacts();
        if (error) throw error;
        setContacts(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setLoading(false);
      }
    };

    fetchContacts();
  }, [accessToken]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-montserrat mb-2">Contact Messages</h1>
        <p className="text-muted-foreground font-inter">
          View messages from the contact form
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground font-inter">Loading contacts...</p>
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-20 backdrop-blur-md bg-card border border-border rounded-2xl">
          <Mail className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground font-inter">No contact messages yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="backdrop-blur-md bg-card border border-border rounded-2xl p-6"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold font-montserrat mb-1">
                    {contact.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-inter">
                    {contact.email} {contact.phone && `· ${contact.phone}`}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(contact.created_at), 'MMM dd, yyyy')}</span>
                </div>
              </div>

              <div className="mb-3">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-inter">
                  {contact.project_type}
                </span>
              </div>

              <p className="text-muted-foreground font-inter whitespace-pre-wrap">
                {contact.message}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}