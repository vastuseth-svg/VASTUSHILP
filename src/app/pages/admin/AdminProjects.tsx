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
import { Plus, Edit, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import { db } from '../../../utils/supabase';
import { toast } from 'sonner';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  featured_image?: string;
  gallery?: string[];
  location?: string;
  year?: number;
  area?: string;
  services?: string[];
  featured: boolean;
  published: boolean;
}

interface ProjectForm {
  title: string;
  slug: string;
  description: string;
  featured_image?: string;
  location?: string;
  year?: number;
  area?: string;
  services?: string;
  featured: boolean;
  published: boolean;
}

export function AdminProjects({ accessToken }: { accessToken: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ProjectForm>({
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      featured_image: '',
      location: '',
      year: undefined,
      area: '',
      services: '',
      featured: false,
      published: false
    }
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await db.getProjects(true);
      if (error) throw error;
      setProjects(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProjectForm) => {
    try {
      const projectData = {
        ...data,
        services: data.services ? data.services.split(',').map(s => s.trim()) : [],
        year: data.year ? Number(data.year) : undefined,
        slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      };

      let result;
      if (editingProject) {
        result = await db.updateProject(editingProject.id, projectData);
      } else {
        result = await db.createProject(projectData);
      }

      if (result.error) {
        throw result.error;
      }

      toast.success(editingProject ? 'Project updated!' : 'Project created!');
      fetchProjects();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await db.deleteProject(id);
      
      if (error) {
        throw error;
      }

      toast.success('Project deleted');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('An error occurred');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setValue('title', project.title);
    setValue('slug', project.slug);
    setValue('description', project.description);
    setValue('featured_image', project.featured_image || '');
    setValue('location', project.location || '');
    setValue('year', project.year);
    setValue('area', project.area || '');
    setValue('services', project.services?.join(', ') || '');
    setValue('featured', project.featured);
    setValue('published', project.published);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProject(null);
    reset();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold font-montserrat mb-2">Projects</h1>
          <p className="text-muted-foreground font-inter">
            Manage your architectural projects
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingProject(null); reset(); }}>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-montserrat">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...register('title', { required: 'Title is required' })}
                  placeholder="Project title"
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
                  placeholder="project-slug (auto-generated if empty)"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  {...register('description', { required: 'Description is required' })}
                  placeholder="Project description"
                  rows={4}
                />
                {errors.description && (
                  <p className="text-destructive text-sm mt-1">{errors.description.message}</p>
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
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    {...register('location')}
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    {...register('year')}
                    placeholder="2024"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  {...register('area')}
                  placeholder="2,500 sq ft"
                />
              </div>

              <div>
                <Label htmlFor="services">Services (comma-separated)</Label>
                <Input
                  id="services"
                  {...register('services')}
                  placeholder="Residential Design, Interior Design"
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
                  {editingProject ? 'Update' : 'Create'} Project
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground font-inter">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 backdrop-blur-md bg-card border border-border rounded-2xl">
          <p className="text-muted-foreground font-inter mb-4">No projects yet</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create First Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="backdrop-blur-md bg-card border border-border rounded-2xl overflow-hidden"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {project.featured_image && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={project.featured_image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold font-montserrat flex-1 pr-2">
                    {project.title}
                  </h3>
                  <div className="flex space-x-1">
                    {project.featured && (
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    )}
                    {project.published ? (
                      <Eye className="h-4 w-4 text-green-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground font-inter mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex justify-between items-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(project)}
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
                        <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete "{project.title}". This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(project.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}