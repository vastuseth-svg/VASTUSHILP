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
import { Plus, Edit, Trash2, Eye, EyeOff, Users } from 'lucide-react';
import { db } from '../../../utils/supabase';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image?: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  order_index: number;
  published: boolean;
}

interface TeamForm {
  name: string;
  position: string;
  bio: string;
  image?: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  order_index?: number;
  published: boolean;
}

export function AdminTeam({ accessToken }: { accessToken: string }) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<TeamForm>({
    defaultValues: {
      name: '',
      position: '',
      bio: '',
      image: '',
      email: '',
      linkedin: '',
      twitter: '',
      order_index: 0,
      published: false
    }
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const { data, error } = await db.getTeam(true);
      if (error) throw error;
      setTeamMembers(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching team:', error);
      toast.error('Failed to load team members');
      setLoading(false);
    }
  };

  const onSubmit = async (data: TeamForm) => {
    try {
      const memberData = {
        ...data,
        order_index: data.order_index ? Number(data.order_index) : 0,
      };

      let result;
      if (editingMember) {
        result = await db.updateTeamMember(editingMember.id, memberData);
      } else {
        result = await db.createTeamMember(memberData);
      }

      if (result.error) {
        throw result.error;
      }

      toast.success(editingMember ? 'Team member updated!' : 'Team member added!');
      fetchTeam();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving team member:', error);
      toast.error('An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await db.deleteTeamMember(id);
      
      if (error) {
        throw error;
      }

      toast.success('Team member deleted');
      fetchTeam();
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('An error occurred');
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setValue('name', member.name);
    setValue('position', member.position);
    setValue('bio', member.bio);
    setValue('image', member.image || '');
    setValue('email', member.email || '');
    setValue('linkedin', member.linkedin || '');
    setValue('twitter', member.twitter || '');
    setValue('order_index', member.order_index);
    setValue('published', member.published);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMember(null);
    reset();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold font-montserrat mb-2">Team</h1>
          <p className="text-muted-foreground font-inter">
            Manage your team members
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingMember(null); reset(); }}>
              <Plus className="mr-2 h-4 w-4" />
              New Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-montserrat">
                {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  {...register('position', { required: 'Position is required' })}
                  placeholder="Lead Architect"
                />
                {errors.position && (
                  <p className="text-destructive text-sm mt-1">{errors.position.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="bio">Bio *</Label>
                <Textarea
                  id="bio"
                  {...register('bio', { required: 'Bio is required' })}
                  placeholder="Brief bio about the team member..."
                  rows={4}
                />
                {errors.bio && (
                  <p className="text-destructive text-sm mt-1">{errors.bio.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  {...register('image')}
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="john@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    {...register('linkedin')}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div>
                  <Label htmlFor="twitter">Twitter/X URL</Label>
                  <Input
                    id="twitter"
                    {...register('twitter')}
                    placeholder="https://twitter.com/..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="order_index">Display Order</Label>
                <Input
                  id="order_index"
                  type="number"
                  {...register('order_index')}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground mt-1">Lower numbers appear first</p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={watch('published')}
                  onCheckedChange={(checked) => setValue('published', checked)}
                />
                <Label htmlFor="published" className="cursor-pointer">Published</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="ghost" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingMember ? 'Update' : 'Add'} Member
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground font-inter">Loading team members...</p>
        </div>
      ) : teamMembers.length === 0 ? (
        <div className="text-center py-20 backdrop-blur-md bg-card border border-border rounded-2xl">
          <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground font-inter mb-4">No team members yet</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add First Team Member
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="backdrop-blur-md bg-card border border-border rounded-2xl overflow-hidden"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {member.image && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 pr-2">
                    <h3 className="text-xl font-bold font-montserrat mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm text-muted-foreground font-inter">
                      {member.position}
                    </p>
                  </div>
                  {member.published ? (
                    <Eye className="h-4 w-4 text-green-500" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                <p className="text-sm text-muted-foreground font-inter mb-4 line-clamp-3">
                  {member.bio}
                </p>

                <div className="flex justify-between items-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(member)}
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
                        <AlertDialogTitle>Delete Team Member?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete "{member.name}". This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(member.id)}>
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