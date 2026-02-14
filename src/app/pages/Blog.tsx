import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { GlassCard } from '../components/GlassCard';
import { motion } from 'motion/react';
import { db } from '../../utils/supabase';
import { format } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image?: string;
  author: string;
  publish_date: string;
  published: boolean;
}

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    db.getBlogPosts()
      .then(({ data }) => {
        if (data) {
          setPosts(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading blog posts:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-7xl font-bold font-montserrat mb-6">
            Our Blog
          </h1>
          <p className="text-xl text-muted-foreground font-inter max-w-2xl mx-auto">
            Insights, trends, and inspiration from the world of architecture and design
          </p>
        </motion.div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-inter">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-inter text-lg">
              No blog posts yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="flex flex-col"
              >
                <GlassCard
                  image={post.featured_image}
                  title={post.title}
                  description={post.excerpt}
                  buttonText="Read More"
                  onButtonClick={() => navigate(`/blog/${post.slug}`)}
                />
                <div className="mt-4 px-2">
                  <p className="text-sm text-muted-foreground font-inter">
                    By {post.author} · {post.publish_date && !isNaN(new Date(post.publish_date).getTime()) ? format(new Date(post.publish_date), 'MMM dd, yyyy') : 'Date TBA'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}