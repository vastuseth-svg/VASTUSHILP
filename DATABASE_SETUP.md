# VASTUPURTI Database Setup Guide

This application requires several database tables to be created in your Supabase project. Follow these steps:

## Step 1: Access Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to the "SQL Editor" tab
3. Create a new query

## Step 2: Run the Following SQL Commands

Copy and paste the SQL commands below into the SQL editor and execute them:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  featured_image TEXT,
  gallery TEXT[],
  location TEXT,
  year INTEGER,
  area TEXT,
  services TEXT[],
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  photo TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  project TEXT NOT NULL,
  quote TEXT NOT NULL,
  photo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  author TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  publish_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  project_type TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (key, value) VALUES
  ('address', '123 Architecture Lane, Design City, DC 12345'),
  ('email', 'hello@vastupurti.com'),
  ('phone', '+1 (555) 123-4567'),
  ('facebook', 'https://facebook.com/vastupurti'),
  ('instagram', 'https://instagram.com/vastupurti'),
  ('linkedin', 'https://linkedin.com/company/vastupurti'),
  ('twitter', 'https://twitter.com/vastupurti')
ON CONFLICT (key) DO NOTHING;

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Step 3: Set Up Row Level Security (RLS)

Execute these commands to enable RLS and create policies:

```sql
-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view published projects" ON projects
  FOR SELECT USING (published = true);

CREATE POLICY "Public can view team members" ON team_members
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public can view testimonials" ON testimonials
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public can view published blog posts" ON blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Public can view site settings" ON site_settings
  FOR SELECT TO anon, authenticated USING (true);

-- Allow public to insert contacts
CREATE POLICY "Anyone can submit contact form" ON contacts
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Admin full access (authenticated users)
CREATE POLICY "Authenticated users full access to projects" ON projects
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access to team" ON team_members
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access to testimonials" ON testimonials
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access to blog" ON blog_posts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view contacts" ON contacts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users full access to settings" ON site_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

## Step 4: Create Storage Buckets

The application will automatically create the necessary storage buckets when the server starts. However, you can manually create them if needed:

1. Go to "Storage" in your Supabase dashboard
2. Create these buckets:
   - `make-3a6ae6aa-project-images`
   - `make-3a6ae6aa-team-photos`
   - `make-3a6ae6aa-testimonial-photos`
   - `make-3a6ae6aa-blog-images`
3. Set all buckets to "Private"

## Step 5: Create Admin User

To access the admin panel, you need to create a user. You have two options:

### Option A: Use Supabase Dashboard
1. Go to "Authentication" → "Users"
2. Click "Add user"
3. Create a user with email/password
4. Confirm the user's email manually

### Option B: Use the Signup API (Recommended)
Use the signup endpoint that automatically confirms the email:

```bash
curl -X POST https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-3a6ae6aa/signup \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "email": "admin@vastupurti.com",
    "password": "your-secure-password",
    "name": "Admin User"
  }'
```

## Step 6: Access the Admin Panel

1. Navigate to `/login` on your application
2. Enter your admin credentials
3. You'll be redirected to the admin dashboard

## Done!

Your VASTUPURTI application is now fully set up and ready to use!

## Optional: Add Sample Data

If you want to add some sample data for testing, run:

```sql
-- Sample Project
INSERT INTO projects (title, slug, description, featured_image, location, year, area, services, featured, published) VALUES
  (
    'Modern Villa Residence',
    'modern-villa-residence',
    'A stunning contemporary villa featuring clean lines, expansive glass walls, and seamless indoor-outdoor living spaces.',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    'Los Angeles, CA',
    2024,
    '4,500 sq ft',
    ARRAY['Residential Design', 'Interior Design'],
    true,
    true
  );

-- Sample Team Member
INSERT INTO team_members (name, role, bio, photo, "order") VALUES
  (
    'Sarah Johnson',
    'Principal Architect',
    'With over 15 years of experience in sustainable architecture, Sarah leads our design vision with passion and precision.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    1
  );

-- Sample Testimonial
INSERT INTO testimonials (client_name, project, quote, photo) VALUES
  (
    'Michael Roberts',
    'Roberts Family Home',
    'Working with VASTUPURTI was an absolute pleasure. They transformed our vision into reality and exceeded all our expectations.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
  );

-- Sample Blog Post
INSERT INTO blog_posts (title, slug, author, excerpt, content, featured_image, published) VALUES
  (
    'The Future of Sustainable Architecture',
    'future-of-sustainable-architecture',
    'Sarah Johnson',
    'Exploring innovative approaches to eco-friendly building design and their impact on our environment.',
    'Sustainable architecture is no longer just a trend—it''s a necessity. As we face global climate challenges, architects must embrace innovative solutions that minimize environmental impact while maximizing comfort and efficiency.

In this article, we explore the latest trends in green building, from passive solar design to carbon-neutral materials. The future of architecture lies in our ability to create spaces that work in harmony with nature, not against it.

Join us as we delve into the technologies and philosophies shaping tomorrow''s built environment.',
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800',
    true
  );
```

## Troubleshooting

- **Cannot login**: Make sure you've created a user and the email is confirmed
- **Tables not found**: Ensure all SQL commands ran successfully
- **Images not loading**: Check that storage buckets are created and accessible
- **403 errors**: Verify RLS policies are set up correctly

For more help, consult the Supabase documentation or contact support.
