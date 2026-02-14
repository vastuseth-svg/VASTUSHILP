import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Initialize storage buckets on startup
async function initializeStorage() {
  const buckets = [
    'make-3a6ae6aa-project-images',
    'make-3a6ae6aa-team-photos',
    'make-3a6ae6aa-testimonial-photos',
    'make-3a6ae6aa-blog-images',
  ];

  for (const bucketName of buckets) {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 10485760, // 10MB
      });
      if (error) {
        console.log(`Error creating bucket ${bucketName}: ${error.message}`);
      } else {
        console.log(`Created bucket: ${bucketName}`);
      }
    }
  }
}

// Call initialization
initializeStorage();

// Health check endpoint
app.get("/make-server-3a6ae6aa/health", (c) => {
  return c.json({ status: "ok" });
});

// ===== AUTH ROUTES =====

// Sign up new admin user
app.post("/make-server-3a6ae6aa/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (err) {
    console.log(`Signup exception: ${err}`);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Helper function to verify user authentication
async function verifyAuth(authHeader: string | null) {
  if (!authHeader) {
    return { user: null, error: 'No authorization header' };
  }

  const accessToken = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);

  if (error || !user) {
    return { user: null, error: 'Unauthorized' };
  }

  return { user, error: null };
}

// ===== PROJECTS ROUTES =====

// Get all published projects or all projects (admin)
app.get("/make-server-3a6ae6aa/projects", async (c) => {
  try {
    const showAll = c.req.query('all') === 'true';
    const featured = c.req.query('featured') === 'true';
    const projectType = c.req.query('type');
    const location = c.req.query('location');
    const year = c.req.query('year');

    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!showAll) {
      query = query.eq('published', true);
    }

    if (featured) {
      query = query.eq('featured', true);
    }

    if (projectType) {
      query = query.contains('services', [projectType]);
    }

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    if (year) {
      query = query.eq('year', year);
    }

    const { data, error } = await query;

    if (error) {
      console.log(`Error fetching projects: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ projects: data });
  } catch (err) {
    console.log(`Projects fetch exception: ${err}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get single project by slug
app.get("/make-server-3a6ae6aa/projects/:slug", async (c) => {
  try {
    const slug = c.req.param('slug');
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.log(`Error fetching project: ${error.message}`);
      return c.json({ error: 'Project not found' }, 404);
    }

    return c.json({ project: data });
  } catch (err) {
    console.log(`Project fetch exception: ${err}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Create project (admin only)
app.post("/make-server-3a6ae6aa/projects", async (c) => {
  try {
    const authResult = await verifyAuth(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, 401);
    }

    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('projects')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.log(`Error creating project: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ project: data });
  } catch (err) {
    console.log(`Project creation exception: ${err}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Update project (admin only)
app.put("/make-server-3a6ae6aa/projects/:id", async (c) => {
  try {
    const authResult = await verifyAuth(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, 401);
    }

    const id = c.req.param('id');
    const body = await c.req.json();

    const { data, error } = await supabase
      .from('projects')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.log(`Error updating project: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ project: data });
  } catch (err) {
    console.log(`Project update exception: ${err}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Delete project (admin only)
app.delete("/make-server-3a6ae6aa/projects/:id", async (c) => {
  try {
    const authResult = await verifyAuth(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, 401);
    }

    const id = c.req.param('id');

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.log(`Error deleting project: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true });
  } catch (err) {
    console.log(`Project deletion exception: ${err}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ===== TEAM ROUTES =====

app.get("/make-server-3a6ae6aa/team", async (c) => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.log(`Error fetching team: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ team: data });
  } catch (err) {
    console.log(`Team fetch exception: ${err}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post("/make-server-3a6ae6aa/team", async (c) => {
  try {
    const authResult = await verifyAuth(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, 401);
    }

    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('team_members')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.log(`Error creating team member: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ member: data });
  } catch (err) {
    console.log(`Team creation exception: ${err}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.put("/make-server-3a6ae6aa/team/:id", async (c) => {
  try {
    const authResult = await verifyAuth(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, 401);
    }

    const id = c.req.param('id');
    const body = await c.req.json();

    const { data, error } = await supabase
      .from('team_members')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.log(`Error updating team member: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ member: data });
  } catch (err) {
    console.log(`Team update exception: ${err}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.delete("/make-server-3a6ae6aa/team/:id", async (c) => {
  try {
    const authResult = await verifyAuth(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, 401);
    }

    const id = c.req.param('id');

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);

    if (error) {
      console.log(`Error deleting team member: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true });
  } catch (err) {
    console.log(`Team deletion exception: ${err}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ===== TESTIMONIALS ROUTES =====

app.get("/make-server-3a6ae6aa/testimonials", async (c) => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.log(`Error fetching testimonials: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ testimonials: data });
  } catch (err) {
    console.log(`Testimonials fetch exception: ${err}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post("/make-server-3a6ae6aa/testimonials", async (c) => {
  try {
    const authResult = await verifyAuth(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, 401);
    }

    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('testimonials')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.log(`Error creating testimonial: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ testimonial: data });
  } catch (err) {
    console.log(`Testimonial creation exception: ${err}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.put("/make-server-3a6ae6aa/testimonials/:id", async (c) => {
  try {
    const authResult = await verifyAuth(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, 401);
    }

    const id = c.req.param('id');
    const body = await c.req.json();

    const { data, error } = await supabase
      .from('testimonials')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.log(`Error updating testimonial: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ testimonial: data });
  } catch (err) {
    console.log(`Testimonial update exception: ${err}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.delete("/make-server-3a6ae6aa/testimonials/:id", async (c) => {
  try {
    const authResult = await verifyAuth(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, 401);
    }

    const id = c.req.param('id');

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      console.log(`Error deleting testimonial: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true });
  } catch (err) {
    console.log(`Testimonial deletion exception: ${err}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ===== BLOG ROUTES =====

app.get("/make-server-3a6ae6aa/blog", async (c) => {
  try {
    const showAll = c.req.query('all') === 'true';

    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('publish_date', { ascending: false });

    if (!showAll) {
      query = query.eq('published', true);
    }

    const { data, error } = await query;

    if (error) {
      console.log(`Error fetching blog posts: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ posts: data });
  } catch (err) {
    console.log(`Blog fetch exception: ${err}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.get("/make-server-3a6ae6aa/blog/:slug", async (c) => {
  try {
    const slug = c.req.param('slug');
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.log(`Error fetching blog post: ${error.message}`);
      return c.json({ error: 'Blog post not found' }, 404);
    }

    return c.json({ post: data });
  } catch (err) {
    console.log(`Blog post fetch exception: ${err}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post("/make-server-3a6ae6aa/blog", async (c) => {
  try {
    const authResult = await verifyAuth(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, 401);
    }

    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.log(`Error creating blog post: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ post: data });
  } catch (err) {
    console.log(`Blog creation exception: ${err}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.put("/make-server-3a6ae6aa/blog/:id", async (c) => {
  try {
    const authResult = await verifyAuth(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, 401);
    }

    const id = c.req.param('id');
    const body = await c.req.json();

    const { data, error } = await supabase
      .from('blog_posts')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.log(`Error updating blog post: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ post: data });
  } catch (err) {
    console.log(`Blog update exception: ${err}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.delete("/make-server-3a6ae6aa/blog/:id", async (c) => {
  try {
    const authResult = await verifyAuth(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, 401);
    }

    const id = c.req.param('id');

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.log(`Error deleting blog post: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true });
  } catch (err) {
    console.log(`Blog deletion exception: ${err}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ===== CONTACTS ROUTES =====

app.get("/make-server-3a6ae6aa/contacts", async (c) => {
  try {
    const authResult = await verifyAuth(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, 401);
    }

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.log(`Error fetching contacts: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ contacts: data });
  } catch (err) {
    console.log(`Contacts fetch exception: ${err}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post("/make-server-3a6ae6aa/contacts", async (c) => {
  try {
    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('contacts')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.log(`Error creating contact: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ contact: data });
  } catch (err) {
    console.log(`Contact creation exception: ${err}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ===== SITE SETTINGS ROUTES =====

app.get("/make-server-3a6ae6aa/settings", async (c) => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*');

    if (error) {
      console.log(`Error fetching settings: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Convert array to key-value object
    const settings: Record<string, string> = {};
    data.forEach((item: { key: string; value: string }) => {
      settings[item.key] = item.value;
    });

    return c.json({ settings });
  } catch (err) {
    console.log(`Settings fetch exception: ${err}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.put("/make-server-3a6ae6aa/settings/:key", async (c) => {
  try {
    const authResult = await verifyAuth(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, 401);
    }

    const key = c.req.param('key');
    const body = await c.req.json();

    const { data, error } = await supabase
      .from('site_settings')
      .upsert({ key, value: body.value })
      .select()
      .single();

    if (error) {
      console.log(`Error updating setting: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ setting: data });
  } catch (err) {
    console.log(`Settings update exception: ${err}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ===== FILE UPLOAD ROUTES =====

app.post("/make-server-3a6ae6aa/upload/:bucket", async (c) => {
  try {
    const authResult = await verifyAuth(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, 401);
    }

    const bucket = c.req.param('bucket');
    const bucketName = `make-3a6ae6aa-${bucket}`;
    
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.log(`Error uploading file: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Generate signed URL for private bucket
    const { data: signedData, error: signedError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(data.path, 60 * 60 * 24 * 365); // 1 year

    if (signedError) {
      console.log(`Error creating signed URL: ${signedError.message}`);
      return c.json({ error: signedError.message }, 400);
    }

    return c.json({ 
      path: data.path, 
      url: signedData.signedUrl,
      publicUrl: signedData.signedUrl
    });
  } catch (err) {
    console.log(`Upload exception: ${err}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

Deno.serve(app.fetch);
