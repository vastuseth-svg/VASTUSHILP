# Quick Fix Instructions for Supabase Direct Client

## Problem
You're getting "An error occurred" when trying to create content because the backend Hono Edge Function doesn't exist.

## Solution
We've migrated to using Supabase client directly from the frontend (no backend needed).

## ✅ What's Already Done

1. ✅ `/src/utils/supabase.ts` - Complete `db` helper functions created
2. ✅ `/src/app/pages/admin/AdminProjects.tsx` - Fully updated
3. ✅ `/src/app/pages/admin/AdminDashboard.tsx` - Fully updated  
4. ✅ `/src/app/pages/admin/AdminTeam.tsx` - Fully updated

## ⚠️ What You Still Need to Do

Update these 4 remaining admin files. For each file, **replace the imports and all fetch calls**.

### 1. AdminTestimonials.tsx - Search/Replace

**Find line 11:**
```tsx
import { apiBaseUrl, getAuthHeaders } from '../../../utils/supabase';
```
**Replace with:**
```tsx
import { db } from '../../../utils/supabase';
```

**Find the `fetchTestimonials` function (around line 53):**
```tsx
const fetchTestimonials = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/testimonials?all=true`, {
      headers: getAuthHeaders(accessToken),
    });
    const data = await response.json();
    if (data.testimonials) {
      setTestimonials(data.testimonials);
    }
    setLoading(false);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    toast.error('Failed to load testimonials');
    setLoading(false);
  }
};
```
**Replace with:**
```tsx
const fetchTestimonials = async () => {
  try {
    const { data, error } = await db.getTestimonials(true);
    if (error) throw error;
    setTestimonials(data || []);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    toast.error('Failed to load testimonials');
    setLoading(false);
  }
};
```

**Find the `onSubmit` function (around line 71):**
```tsx
const onSubmit = async (data: TestimonialForm) => {
  try {
    const testimonialData = {
      ...data,
      rating: data.rating ? Number(data.rating) : undefined,
    };

    const url = editingTestimonial
      ? `${apiBaseUrl}/testimonials/${editingTestimonial.id}`
      : `${apiBaseUrl}/testimonials`;
    
    const method = editingTestimonial ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: getAuthHeaders(accessToken),
      body: JSON.stringify(testimonialData),
    });

    const result = await response.json();

    if (response.ok) {
      toast.success(editingTestimonial ? 'Testimonial updated!' : 'Testimonial created!');
      fetchTestimonials();
      handleCloseDialog();
    } else {
      toast.error(result.error || 'Failed to save testimonial');
    }
  } catch (error) {
    console.error('Error saving testimonial:', error);
    toast.error('An error occurred');
  }
};
```
**Replace with:**
```tsx
const onSubmit = async (data: TestimonialForm) => {
  try {
    const testimonialData = {
      ...data,
      rating: data.rating ? Number(data.rating) : undefined,
    };

    let result;
    if (editingTestimonial) {
      result = await db.updateTestimonial(editingTestimonial.id, testimonialData);
    } else {
      result = await db.createTestimonial(testimonialData);
    }

    if (result.error) {
      throw result.error;
    }

    toast.success(editingTestimonial ? 'Testimonial updated!' : 'Testimonial created!');
    fetchTestimonials();
    handleCloseDialog();
  } catch (error) {
    console.error('Error saving testimonial:', error);
    toast.error('An error occurred');
  }
};
```

**Find the `handleDelete` function (around line 104):**
```tsx
const handleDelete = async (id: string) => {
  try {
    const response = await fetch(`${apiBaseUrl}/testimonials/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(accessToken),
    });

    if (response.ok) {
      toast.success('Testimonial deleted');
      fetchTestimonials();
    } else {
      toast.error('Failed to delete testimonial');
    }
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    toast.error('An error occurred');
  }
};
```
**Replace with:**
```tsx
const handleDelete = async (id: string) => {
  try {
    const { error } = await db.deleteTestimonial(id);
    
    if (error) {
      throw error;
    }

    toast.success('Testimonial deleted');
    fetchTestimonials();
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    toast.error('An error occurred');
  }
};
```

### 2. AdminBlog.tsx - Same pattern

**Import:** Change to `import { db } from '../../../utils/supabase';`

**fetchBlogPosts:** Use `const { data, error } = await db.getBlogPosts(true);`

**onSubmit:** Use `db.createBlogPost()` or `db.updateBlogPost(id, data)`

**handleDelete:** Use `db.deleteBlogPost(id)`

### 3. AdminContacts.tsx - Same pattern

**Import:** Change to `import { db } from '../../../utils/supabase';`

**fetchContacts:** Use `const { data, error } = await db.getContacts();`

### 4. AdminSettings.tsx - Same pattern

**Import:** Change to `import { db } from '../../../utils/supabase';`

**fetchSettings:** 
```tsx
const { data, error } = await db.getSettings();
if (error) throw error;
setSettings(data); // Already an object, not array
populateForms(data);
```

**saveSettings:**
```tsx
await db.updateSettings(updatedSettings);
toast.success('Settings saved successfully!');
setSettings({ ...settings, ...updatedSettings });
```

## Test It!

1. Save all files
2. Go to `/admin/projects`
3. Click "New Project"
4. Fill in Title and Description  
5. Click "Create Project"
6. You should see SUCCESS! ✅

If you still see errors, check:
- Browser console for detailed error messages
- Make sure all database tables are created in Supabase
- Make sure RLS policies are set up correctly

## Need More Help?

Check the browser console (F12) for detailed error messages. Common issues:
- Table doesn't exist → Create tables from `SUPABASE_SETUP.md`
- Permission denied → Check RLS policies
- Column doesn't match → Verify table schema matches interface types
