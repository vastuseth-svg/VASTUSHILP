import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey);

// Database helper functions
export const db = {
  // Projects
  async getProjects(includeUnpublished = false) {
    let query = supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (!includeUnpublished) {
      query = query.eq('published', true);
    }
    return query;
  },
  
  async getProjectBySlug(slug: string) {
    return supabase.from('projects').select('*').eq('slug', slug).single();
  },
  
  async createProject(data: any) {
    return supabase.from('projects').insert(data).select().single();
  },
  
  async updateProject(id: string, data: any) {
    return supabase.from('projects').update(data).eq('id', id).select().single();
  },
  
  async deleteProject(id: string) {
    return supabase.from('projects').delete().eq('id', id);
  },
  
  // Team
  async getTeam(includeUnpublished = false) {
    let query = supabase.from('team_members').select('*').order('order_index', { ascending: true });
    if (!includeUnpublished) {
      query = query.eq('published', true);
    }
    return query;
  },
  
  async createTeamMember(data: any) {
    return supabase.from('team_members').insert(data).select().single();
  },
  
  async updateTeamMember(id: string, data: any) {
    return supabase.from('team_members').update(data).eq('id', id).select().single();
  },
  
  async deleteTeamMember(id: string) {
    return supabase.from('team_members').delete().eq('id', id);
  },
  
  // Testimonials
  async getTestimonials(includeUnpublished = false) {
    let query = supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (!includeUnpublished) {
      query = query.eq('published', true);
    }
    return query;
  },
  
  async createTestimonial(data: any) {
    return supabase.from('testimonials').insert(data).select().single();
  },
  
  async updateTestimonial(id: string, data: any) {
    return supabase.from('testimonials').update(data).eq('id', id).select().single();
  },
  
  async deleteTestimonial(id: string) {
    return supabase.from('testimonials').delete().eq('id', id);
  },
  
  // Blog
  async getBlogPosts(includeUnpublished = false) {
    let query = supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    if (!includeUnpublished) {
      query = query.eq('published', true);
    }
    return query;
  },
  
  async getBlogPostBySlug(slug: string) {
    return supabase.from('blog_posts').select('*').eq('slug', slug).single();
  },
  
  async createBlogPost(data: any) {
    return supabase.from('blog_posts').insert(data).select().single();
  },
  
  async updateBlogPost(id: string, data: any) {
    return supabase.from('blog_posts').update(data).eq('id', id).select().single();
  },
  
  async deleteBlogPost(id: string) {
    return supabase.from('blog_posts').delete().eq('id', id);
  },
  
  // Contacts
  async getContacts() {
    return supabase.from('contacts').select('*').order('created_at', { ascending: false });
  },
  
  async createContact(data: any) {
    return supabase.from('contacts').insert(data).select().single();
  },
  
  // Settings
  async getSettings() {
    const { data, error } = await supabase.from('site_settings').select('*');
    if (error) throw error;
    
    // Convert array of key-value pairs to object
    const settings: Record<string, string> = {};
    data?.forEach(item => {
      settings[item.key] = item.value;
    });
    return { data: settings, error: null };
  },
  
  async updateSettings(settings: Record<string, string>) {
    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString()
    }));
    
    // Upsert each setting
    const promises = updates.map(update =>
      supabase.from('site_settings').upsert(update, { onConflict: 'key' })
    );
    
    return Promise.all(promises);
  },
  
  // Stats
  async getStats() {
    const [projects, team, testimonials, blog, contacts] = await Promise.all([
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('team_members').select('id', { count: 'exact', head: true }),
      supabase.from('testimonials').select('id', { count: 'exact', head: true }),
      supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
      supabase.from('contacts').select('id', { count: 'exact', head: true }),
    ]);
    
    return {
      data: {
        projects: projects.count || 0,
        team: team.count || 0,
        testimonials: testimonials.count || 0,
        blog: blog.count || 0,
        contacts: contacts.count || 0,
      },
      error: null
    };
  }
};