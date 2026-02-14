import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import { db } from '../../utils/supabase';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image?: string;
  author: string;
  publish_date: string;
}

export function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;

    db.getBlogPostBySlug(slug)
      .then(({ data }) => {
        if (data) {
          setPost(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading blog post:', err);
        setLoading(false);
      });
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground font-inter">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-muted-foreground font-inter text-lg mb-6">
          Blog post not found
        </p>
        <Button onClick={() => navigate('/blog')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Button
          onClick={() => navigate('/blog')}
          variant="ghost"
          className="group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Button>
      </div>

      {/* Featured Image */}
      {post.featured_image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-[60vh] mb-12"
        >
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </motion.div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold font-montserrat mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="font-inter">{post.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span className="font-inter">
                {format(new Date(post.publish_date), 'MMMM dd, yyyy')}
              </span>
            </div>
            <Button
              onClick={handleShare}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="backdrop-blur-md bg-card border border-border rounded-2xl p-8 md:p-12"
          style={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div className="prose prose-lg max-w-none">
            <div className="text-lg font-inter text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>
        </motion.div>

        {/* Share Again */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground font-inter mb-4">
            Enjoyed this article?
          </p>
          <Button onClick={handleShare} size="lg" className="group">
            Share This Post
            <Share2 className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}