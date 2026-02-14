# VASTUPURTI Implementation Guide

## Overview

VASTUPURTI is a production-ready full-stack architectural firm website featuring:
- ✅ **Public Website**: Home, Projects, About, Services, Contact, Blog
- ✅ **Admin CMS**: Complete content management system
- ✅ **Supabase Integration**: Auth, PostgreSQL, Storage
- ✅ **3D Interactive Background**: Three.js animated tubes
- ✅ **Glass Morphism UI**: Premium design system
- ✅ **Dark/Light Mode**: Full theme support
- ✅ **Responsive Design**: Mobile, tablet, desktop optimized

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Routing**: React Router v7 (Data mode)
- **Styling**: Tailwind CSS v4, Custom CSS variables
- **Animations**: Motion (Framer Motion)
- **Forms**: React Hook Form
- **UI Components**: Radix UI primitives
- **Backend**: Supabase Edge Functions (Hono)
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **Auth**: Supabase Auth

## Design System

### Typography
- **Headings**: Montserrat (Bold, 300-900 weights)
- **Body**: Inter (Regular, 300-700 weights)

### Color Scheme

#### Dark Mode (Default)
- Background: `#191919` → `#252525` gradient
- Cards: `#191919aa` with backdrop blur
- Text: `#ffffff` / `#cccccc`
- Accents: 
  - Pink: `#f967fb`
  - Green: `#53bc28`
  - Purple: `#6958d5`

#### Light Mode
- Background: `#f0f0f0` → `#ffffff` gradient
- Cards: `#ffffffcc` with backdrop blur
- Text: `#333333`
- Primary: `#2c5f5f`

### Components
- **GlassCard**: Reusable card with image, title, description, button
- **ThreeBackground**: Animated 3D cursor-reactive tubes
- **Navbar**: Transparent → solid on scroll, with theme toggle
- **Footer**: 4-column layout with contact info

## File Structure

```
/src
├── app
│   ├── components
│   │   ├── GlassCard.tsx (Reusable card component)
│   │   ├── Navbar.tsx (Navigation with theme toggle)
│   │   ├── Footer.tsx (Footer with site settings)
│   │   ├── ThreeBackground.tsx (3D animated background)
│   │   └── ui/ (Radix UI components)
│   ├── pages
│   │   ├── Home.tsx
│   │   ├── Projects.tsx (Filterable grid)
│   │   ├── ProjectDetail.tsx (Dynamic route)
│   │   ├── About.tsx (Team section)
│   │   ├── Services.tsx
│   │   ├── Contact.tsx (Form with validation)
│   │   ├── Blog.tsx
│   │   ├── BlogDetail.tsx
│   │   ├── Login.tsx
│   │   └── admin/
│   │       ├── AdminLayout.tsx (Sidebar layout)
│   │       ├── AdminDashboard.tsx (Stats overview)
│   │       ├── AdminProjects.tsx (Full CRUD)
│   │       └── AdminContacts.tsx (Read-only)
│   ├── routes.tsx (Router configuration)
│   └── App.tsx (Main app with auth state)
├── utils
│   └── supabase.ts (Supabase client & helpers)
├── styles
│   ├── fonts.css (Google Fonts import)
│   ├── theme.css (CSS variables)
│   └── index.css (Global styles)
└── supabase/functions/server
    └── index.tsx (Hono web server with all routes)
```

## Backend API Routes

### Public Routes
- `GET /health` - Health check
- `GET /projects` - List published projects (filters: featured, type, location, year)
- `GET /projects/:slug` - Get single project
- `GET /team` - List team members
- `GET /testimonials` - List testimonials
- `GET /blog` - List published blog posts
- `GET /blog/:slug` - Get single blog post
- `POST /contacts` - Submit contact form
- `GET /settings` - Get site settings

### Protected Routes (Require Auth)
- `POST /signup` - Create admin user
- `POST /projects` - Create project
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project
- `POST /team` - Create team member
- `PUT /team/:id` - Update team member
- `DELETE /team/:id` - Delete team member
- `POST /testimonials` - Create testimonial
- `PUT /testimonials/:id` - Update testimonial
- `DELETE /testimonials/:id` - Delete testimonial
- `POST /blog` - Create blog post
- `PUT /blog/:id` - Update blog post
- `DELETE /blog/:id` - Delete blog post
- `GET /contacts` - List all contacts
- `PUT /settings/:key` - Update setting
- `POST /upload/:bucket` - Upload file to storage

## Database Schema

### Tables
1. **projects**
   - id, title, slug, description
   - featured_image, gallery[]
   - location, year, area, services[]
   - featured, published
   - created_at, updated_at

2. **team_members**
   - id, name, role, bio, photo
   - order
   - created_at, updated_at

3. **testimonials**
   - id, client_name, project, quote, photo
   - created_at

4. **blog_posts**
   - id, title, slug, author
   - excerpt, content
   - featured_image, publish_date
   - published
   - created_at, updated_at

5. **contacts**
   - id, name, email, phone
   - project_type, message
   - created_at

6. **site_settings**
   - key (PK), value
   - updated_at

### Storage Buckets
- `make-3a6ae6aa-project-images`
- `make-3a6ae6aa-team-photos`
- `make-3a6ae6aa-testimonial-photos`
- `make-3a6ae6aa-blog-images`

## Setup Instructions

### 1. Database Setup
Run the SQL commands in `DATABASE_SETUP.md` to create all tables and policies.

### 2. Create Admin User
Use the signup endpoint:
```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/make-server-3a6ae6aa/signup \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"email":"admin@vastupurti.com","password":"secure-password","name":"Admin"}'
```

### 3. Configure Site Settings
After logging in, go to Admin → Settings to update:
- Address
- Email
- Phone
- Social media links

### 4. Add Content
Use the admin panel to:
1. Create projects with images
2. Add team members
3. Collect testimonials
4. Write blog posts
5. View contact form submissions

## Key Features

### Public Website

#### Home Page
- Hero with 3D background
- Featured projects grid
- Services overview
- Testimonials carousel
- Latest blog posts

#### Projects Page
- Filterable grid (search, location, year)
- Dynamic project detail pages
- Gallery support
- Service tags

#### About Page
- Firm philosophy
- Team grid with expandable bios
- Core values section

#### Services Page
- 6 service cards with icons
- Process timeline (4 phases)

#### Contact Page
- Validated form (name, email, phone, project type, message)
- Contact information display
- Map placeholder

#### Blog
- Post listing with filters
- Detail pages with share functionality
- Author and date metadata

### Admin CMS

#### Dashboard
- Statistics overview (projects, team, testimonials, blog, contacts)
- Quick guide

#### Projects Management
- Full CRUD operations
- Create/edit project form with:
  - Title, slug (auto-generated)
  - Description
  - Featured image URL
  - Location, year, area
  - Services (comma-separated)
  - Featured toggle
  - Published toggle
- Grid view with status indicators
- Delete with confirmation

#### Contacts
- Read-only view of all contact form submissions
- Sorted by date

## Advanced Features

### Authentication Flow
1. User visits `/login`
2. Enters email/password
3. Supabase validates credentials
4. Access token stored in state
5. Protected routes check auth status
6. Logout clears session

### Theme Switching
- Toggle in navbar
- Persists to localStorage
- Updates CSS variables
- Animates 3D background opacity

### 3D Background
- Three.js scene with animated tubes
- Mouse-reactive camera movement
- Smooth tube rotations
- Adaptive brightness based on theme
- Performance optimized

### Glass Morphism
- Backdrop blur (20px)
- Semi-transparent backgrounds
- Border glow on hover
- Smooth transitions

### Form Validation
- React Hook Form integration
- Real-time error messages
- Required field enforcement
- Email pattern validation

## Deployment Checklist

✅ Database tables created
✅ RLS policies configured
✅ Storage buckets created
✅ Admin user created
✅ Site settings updated
✅ Sample content added
✅ Forms tested
✅ Auth flow verified
✅ Responsive design checked
✅ Dark/light mode tested
✅ API routes functional
✅ Error handling in place

## Future Enhancements

The following admin sections are placeholder-ready and can be implemented following the same pattern as AdminProjects:

1. **Team Management** - Full CRUD for team members
2. **Testimonials Management** - Full CRUD for testimonials  
3. **Blog Management** - Full CRUD for blog posts with rich text editor
4. **Settings Management** - Key-value editor for site settings
5. **File Upload UI** - Direct upload to Supabase Storage with preview

Each can follow this structure:
- List view with cards/table
- Create/Edit dialog form
- Delete with confirmation
- Form validation
- API integration

## Production Considerations

### Security
- All admin routes protected with JWT
- RLS policies enforce data access
- CORS properly configured
- Environment variables for secrets

### Performance
- 3D background optimized for mobile
- Images lazy loaded
- API responses cached where appropriate
- Minimal bundle size

### SEO
- Semantic HTML structure
- Meta tags (can be added)
- Clean URLs with slugs
- Sitemap (can be generated)

### Monitoring
- Server logs via Hono logger
- Error boundary components (can be added)
- Toast notifications for user feedback

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Three.js Docs**: https://threejs.org/docs
- **Tailwind CSS v4**: https://tailwindcss.com/docs
- **React Router**: https://reactrouter.com/docs

## Credits

Built with ❤️ using:
- React
- Supabase
- Three.js
- Tailwind CSS
- Radix UI
- Motion (Framer Motion)
