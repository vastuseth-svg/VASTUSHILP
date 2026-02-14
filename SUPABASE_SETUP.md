# VASTUPURTI - Supabase Setup Guide

This document provides the complete database schema and setup instructions for your VASTUPURTI architectural firm CMS.

## Database Tables Required

### 1. Projects Table
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  featured_image TEXT,
  gallery TEXT[], -- Array of image URLs
  location TEXT,
  year INTEGER,
  area TEXT,
  services TEXT[], -- Array of service types
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_published ON projects(published);
CREATE INDEX idx_projects_featured ON projects(featured);
```

### 2. Team Members Table
```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT NOT NULL,
  image TEXT,
  email TEXT,
  linkedin TEXT,
  twitter TEXT,
  order_index INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for ordering
CREATE INDEX idx_team_members_order ON team_members(order_index);
CREATE INDEX idx_team_members_published ON team_members(published);
```

### 3. Testimonials Table
```sql
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_position TEXT,
  client_company TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  project_name TEXT,
  client_image TEXT,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_testimonials_published ON testimonials(published);
CREATE INDEX idx_testimonials_featured ON testimonials(featured);
```

### 4. Blog Posts Table
```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  author TEXT,
  category TEXT,
  tags TEXT[], -- Array of tags
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
```

### 5. Contacts Table
```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  project_type TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);
```

### 6. Site Settings Table
```sql
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (key, value) VALUES
  ('site_name', 'VASTUPURTI'),
  ('site_tagline', 'Architectural Excellence'),
  ('site_description', 'Leading architectural firm specializing in innovative design solutions'),
  ('contact_email', 'info@vastupurti.com'),
  ('contact_phone', '+1 (555) 123-4567'),
  ('contact_address', ''),
  ('contact_city', ''),
  ('contact_country', ''),
  ('contact_postal_code', ''),
  ('social_facebook', ''),
  ('social_twitter', ''),
  ('social_instagram', ''),
  ('social_linkedin', ''),
  ('social_youtube', ''),
  ('business_hours_weekday', 'Mon-Fri: 9:00 AM - 6:00 PM'),
  ('business_hours_weekend', 'Sat-Sun: Closed'),
  ('meta_keywords', 'architecture, design, construction'),
  ('google_analytics_id', ''),
  ('copyright_text', '© 2026 VASTUPURTI. All rights reserved.'),
  ('footer_text', '');
```

## Row Level Security (RLS) Policies

### Enable RLS on all tables
```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
```

### Public Read Policies (for published content)
```sql
-- Projects: Public can read published projects
CREATE POLICY "Public can view published projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Team: Public can read published team members
CREATE POLICY "Public can view published team"
  ON team_members FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Testimonials: Public can read published testimonials
CREATE POLICY "Public can view published testimonials"
  ON testimonials FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Blog: Public can read published posts
CREATE POLICY "Public can view published blog posts"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Settings: Public can read all settings
CREATE POLICY "Public can view settings"
  ON site_settings FOR SELECT
  TO anon, authenticated
  USING (true);
```

### Admin Policies (authenticated users with admin role)
```sql
-- Projects: Admins can do everything
CREATE POLICY "Admins can manage projects"
  ON projects FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Team: Admins can do everything
CREATE POLICY "Admins can manage team"
  ON team_members FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Testimonials: Admins can do everything
CREATE POLICY "Admins can manage testimonials"
  ON testimonials FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Blog: Admins can do everything
CREATE POLICY "Admins can manage blog"
  ON blog_posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Contacts: Anyone can insert, admins can view
CREATE POLICY "Anyone can submit contact form"
  ON contacts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view contacts"
  ON contacts FOR SELECT
  TO authenticated
  USING (true);

-- Settings: Admins can manage
CREATE POLICY "Admins can manage settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

## Automatic Updated_at Trigger

```sql
-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON testimonials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Authentication Setup

### Create Admin User

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User"
3. Enter email and password for your admin account
4. Confirm the user

Alternative: Use the login page at `/login` after deployment

## Quick Setup Instructions

### Step 1: Copy All SQL Commands
Copy all the SQL commands from the sections above (Tables + Indexes + RLS + Policies + Triggers)

### Step 2: Run in Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Click on "SQL Editor" in the left sidebar
3. Create a new query
4. Paste all SQL commands
5. Click "Run" to execute

### Step 3: Create Admin User
1. Go to Authentication → Users
2. Add a new user with email/password
3. Confirm the user

### Step 4: Test the Application
1. Navigate to `/login`
2. Login with your admin credentials
3. Access the admin panel at `/admin`
4. Start managing your content!

## Sample Data (Optional)

You can insert sample data for testing:

```sql
-- Sample Project
INSERT INTO projects (title, slug, description, featured_image, location, year, area, featured, published) 
VALUES (
  'Modern Villa',
  'modern-villa',
  'A stunning contemporary residence featuring clean lines and sustainable design principles.',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
  'Los Angeles, CA',
  2024,
  '3,500 sq ft',
  true,
  true
);

-- Sample Team Member
INSERT INTO team_members (name, position, bio, image, order_index, published)
VALUES (
  'Sarah Anderson',
  'Lead Architect',
  'With over 15 years of experience in residential and commercial architecture, Sarah brings creative vision and technical expertise to every project.',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
  1,
  true
);

-- Sample Testimonial
INSERT INTO testimonials (client_name, client_position, client_company, content, rating, featured, published)
VALUES (
  'Michael Johnson',
  'CEO',
  'Tech Innovations Inc.',
  'VASTUPURTI transformed our vision into reality. Their attention to detail and commitment to excellence is unmatched. Our new office space has exceeded all expectations!',
  5,
  true,
  true
);

-- Sample Blog Post
INSERT INTO blog_posts (title, slug, excerpt, content, featured_image, author, category, tags, featured, published)
VALUES (
  'Sustainable Architecture Trends 2026',
  'sustainable-architecture-trends-2026',
  'Exploring the latest trends in eco-friendly building design and how they are reshaping the future of architecture.',
  'The architecture industry is experiencing a paradigm shift towards sustainability. From passive solar design to green roofs, architects are embracing innovative solutions that minimize environmental impact while maximizing efficiency and beauty.\n\nKey trends include biophilic design, renewable materials, energy-efficient systems, and adaptive reuse of existing structures. These approaches not only reduce carbon footprints but also create healthier, more inspiring spaces for occupants.',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
  'VASTUPURTI Team',
  'Sustainability',
  ARRAY['sustainable', 'green building', 'architecture trends'],
  true,
  true
);
```

## Verification Checklist

After running the setup, verify:

- ✅ All 6 tables created successfully
- ✅ Indexes created on all tables
- ✅ RLS enabled on all tables
- ✅ Public read policies active
- ✅ Admin policies active
- ✅ Triggers created for updated_at
- ✅ Default settings inserted
- ✅ Admin user created
- ✅ Can login at `/login`
- ✅ Can access admin panel at `/admin`

## Database Schema Summary

**Table Names (Correct):**
- `projects`
- `team_members` (not `team`)
- `testimonials`
- `blog_posts` (not `blog`)
- `contacts`
- `site_settings` (not `settings`)

## Troubleshooting

### Error: "Could not find table"
Make sure you're using the exact table names as specified above. The application uses:
- `team_members` NOT `team`
- `blog_posts` NOT `blog`
- `site_settings` NOT `settings`

### Error: "Permission denied"
Verify that RLS policies are correctly set up for both public and authenticated users.

### Error: "Failed to fetch"
Check that your Supabase project URL and anon key are correctly configured in `/utils/supabase/info.tsx`

---

**Need Help?** Check Supabase documentation at https://supabase.com/docs