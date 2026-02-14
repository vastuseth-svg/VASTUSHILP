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
import { Plus, Edit, Trash2, Eye, EyeOff, Star, MessageSquare } from 'lucide-react';
import { db } from '../../../utils/supabase';
import { toast } from 'sonner';

interface Testimonial {
  id: string;
  client_name: string;
  client_position?: string;
  client_company?: string;
  content: string;
  rating: number;
  project_name?: string;
  client_image?: string;
  featured: boolean;
  published: boolean;
}

interface TestimonialForm {
  client_name: string;
  client_position?: string;
  client_company?: string;
  content: string;
  rating: number;
  project_name?: string;
  client_image?: string;
  featured: boolean;
  published: boolean;
}

export function AdminTestimonials({ accessToken }: { accessToken: string }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<TestimonialForm>();

  useEffect(() => {
    fetchTestimonials();
  }, []);

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

  const onSubmit = async (data: TestimonialForm) => {
    try {
      const testimonialData = {
        ...data,
        rating: Number(data.rating),
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

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setValue('client_name', testimonial.client_name);
    setValue('client_position', testimonial.client_position || '');
    setValue('client_company', testimonial.client_company || '');
    setValue('content', testimonial.content);
    setValue('rating', testimonial.rating);
    setValue('project_name', testimonial.project_name || '');
    setValue('client_image', testimonial.client_image || '');
    setValue('featured', testimonial.featured);
    setValue('published', testimonial.published);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTestimonial(null);
    reset();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold font-montserrat mb-2">Testimonials</h1>
          <p className="text-muted-foreground font-inter">
            Manage client testimonials and reviews
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingTestimonial(null); reset(); }}>
              <Plus className="mr-2 h-4 w-4" />
              New Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-montserrat">
                {editingTestimonial ? 'Edit Testimonial' : 'Create New Testimonial'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="client_name">Client Name *</Label>
                <Input
                  id="client_name"
                  {...register('client_name', { required: 'Client name is required' })}
                  placeholder="Jane Smith"
                />
                {errors.client_name && (
                  <p className="text-destructive text-sm mt-1">{errors.client_name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client_position">Position</Label>
                  <Input
                    id="client_position"
                    {...register('client_position')}
                    placeholder="CEO"
                  />
                </div>

                <div>
                  <Label htmlFor="client_company">Company</Label>
                  <Input
                    id="client_company"
                    {...register('client_company')}
                    placeholder="Acme Corp"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="content">Testimonial Content *</Label>
                <Textarea
                  id="content"
                  {...register('content', { required: 'Content is required' })}
                  placeholder="The testimonial message..."
                  rows={5}
                />
                {errors.content && (
                  <p className="text-destructive text-sm mt-1">{errors.content.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="rating">Rating (1-5) *</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  {...register('rating', { 
                    required: 'Rating is required',
                    min: { value: 1, message: 'Minimum rating is 1' },
                    max: { value: 5, message: 'Maximum rating is 5' }
                  })}
                  placeholder="5"
                />
                {errors.rating && (
                  <p className="text-destructive text-sm mt-1">{errors.rating.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="project_name">Project Name</Label>
                <Input
                  id="project_name"
                  {...register('project_name')}
                  placeholder="Related project name"
                />
              </div>

              <div>
                <Label htmlFor="client_image">Client Image URL</Label>
                <Input
                  id="client_image"
                  {...register('client_image')}
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    {...register('featured')}
                    onCheckedChange={(checked) => setValue('featured', checked)}
                  />
                  <Label htmlFor="featured" className="cursor-pointer">Featured</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    {...register('published')}
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
                  {editingTestimonial ? 'Update' : 'Create'} Testimonial
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground font-inter">Loading testimonials...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-20 backdrop-blur-md bg-card border border-border rounded-2xl">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground font-inter mb-4">No testimonials yet</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create First Testimonial
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="backdrop-blur-md bg-card border border-border rounded-2xl p-6"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {testimonial.client_image && (
                    <img
                      src={testimonial.client_image}
                      alt={testimonial.client_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-bold font-montserrat">
                      {testimonial.client_name}
                    </h3>
                    {(testimonial.client_position || testimonial.client_company) && (
                      <p className="text-xs text-muted-foreground font-inter">
                        {testimonial.client_position}
                        {testimonial.client_position && testimonial.client_company && ' at '}
                        {testimonial.client_company}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1">
                  {testimonial.featured && (
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  )}
                  {testimonial.published ? (
                    <Eye className="h-4 w-4 text-green-500" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>

              <p className="text-sm text-muted-foreground font-inter mb-4 line-clamp-4">
                "{testimonial.content}"
              </p>

              {testimonial.project_name && (
                <p className="text-xs text-muted-foreground font-inter mb-4">
                  Project: {testimonial.project_name}
                </p>
              )}

              <div className="flex justify-between items-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(testimonial)}
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
                      <AlertDialogTitle>Delete Testimonial?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this testimonial from "{testimonial.client_name}". This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(testimonial.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}