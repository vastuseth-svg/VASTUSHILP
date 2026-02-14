import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, BookOpen } from 'lucide-react';
import { db } from '../../../utils/supabase';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  author?: string;
  category?: string;
  tags?: string[];
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

interface BlogPostForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  author?: string;
  category?: string;
  tags?: string;
  featured: boolean;
  published: boolean;
}

export function AdminBlog({ accessToken }: { accessToken: string }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<BlogPostForm>({
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image: '',
      author: '',
      category: '',
      tags: '',
      featured: false,
      published: false
    }
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await db.getBlogPosts(true);
      if (error) throw error;
      setPosts(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Failed to load blog posts');
      setLoading(false);
    }
  };

  const onSubmit = async (data: BlogPostForm) => {
    try {
      const postData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
        slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      };

      let result;
      if (editingPost) {
        result = await db.updateBlogPost(editingPost.id, postData);
      } else {
        result = await db.createBlogPost(postData);
      }

      if (result.error) {
        throw result.error;
      }

      toast.success(editingPost ? 'Blog post updated!' : 'Blog post created!');
      fetchPosts();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast.error('An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await db.deleteBlogPost(id);
      
      if (error) {
        throw error;
      }

      toast.success('Blog post deleted');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast.error('An error occurred');
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setValue('title', post.title);
    setValue('slug', post.slug);
    setValue('excerpt', post.excerpt);
    setValue('content', post.content);
    setValue('featured_image', post.featured_image || '');
    setValue('author', post.author || '');
    setValue('category', post.category || '');
    setValue('tags', post.tags?.join(', ') || '');
    setValue('featured', post.featured);
    setValue('published', post.published);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPost(null);
    reset();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold font-montserrat mb-2">Blog</h1>
          <p className="text-muted-foreground font-inter">
            Manage your blog posts and articles
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingPost(null); reset(); }}>
              <Plus className="mr-2 h-4 w-4" />
              New Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-montserrat">
                {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...register('title', { required: 'Title is required' })}
                  placeholder="Blog post title"
                />
                {errors.title && (
                  <p className="text-destructive text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  {...register('slug')}
                  placeholder="blog-post-slug (auto-generated if empty)"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  {...register('excerpt', { required: 'Excerpt is required' })}
                  placeholder="A short summary of the blog post..."
                  rows={2}
                />
                {errors.excerpt && (
                  <p className="text-destructive text-sm mt-1">{errors.excerpt.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  {...register('content', { required: 'Content is required' })}
                  placeholder="Full blog post content..."
                  rows={8}
                />
                {errors.content && (
                  <p className="text-destructive text-sm mt-1">{errors.content.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="featured_image">Featured Image URL</Label>
                <Input
                  id="featured_image"
                  {...register('featured_image')}
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    {...register('author')}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    {...register('category')}
                    placeholder="Architecture, Design, etc."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  {...register('tags')}
                  placeholder="residential, modern, sustainable"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={watch('featured')}
                    onCheckedChange={(checked) => setValue('featured', checked)}
                  />
                  <Label htmlFor="featured" className="cursor-pointer">Featured</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={watch('published')}
                    onCheckedChange={(checked) => setValue('published', checked)}
                  />
                  <Label htmlFor="published" className="cursor-pointer">Published</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="ghost" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPost ? 'Update' : 'Create'} Blog Post
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground font-inter">Loading blog posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 backdrop-blur-md bg-card border border-border rounded-2xl">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground font-inter mb-4">No blog posts yet</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create First Blog Post
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="backdrop-blur-md bg-card border border-border rounded-2xl overflow-hidden"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <div className="flex flex-col md:flex-row">
                {post.featured_image && (
                  <div className="md:w-64 h-48 md:h-auto overflow-hidden">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 pr-4">
                      <h3 className="text-2xl font-bold font-montserrat mb-2">
                        {post.title}
                      </h3>
                      {post.category && (
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-inter mb-2">
                          {post.category}
                        </span>
                      )}
                      <p className="text-sm text-muted-foreground font-inter">
                        {post.author && `By ${post.author} · `}
                        {format(new Date(post.created_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      {post.featured && (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      )}
                      {post.published ? (
                        <Eye className="h-4 w-4 text-green-500" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground font-inter mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-background/50 text-foreground rounded text-xs font-inter"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(post)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Blog Post?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{post.title}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(post.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}