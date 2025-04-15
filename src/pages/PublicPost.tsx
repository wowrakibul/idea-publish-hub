
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { usePostStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, ArrowLeft } from 'lucide-react';

export default function PublicPost() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { posts } = usePostStore();
  const [post, setPost] = useState(null);
  
  useEffect(() => {
    if (id) {
      const foundPost = posts.find(p => p.id === id);
      
      // Only set the post if it exists and is published
      if (foundPost && foundPost.isPublished) {
        setPost(foundPost);
      } else {
        // Redirect if post not found or not published
        navigate('/preview');
      }
    }
  }, [id, posts, navigate]);
  
  if (!post) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container py-8 text-center">
          <p>Loading...</p>
        </main>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link 
              to="/preview" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to all ideas
            </Link>
          </div>
          
          <article>
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(post.updatedAt), 'MMMM d, yyyy')}</span>
                </div>
                {post.readTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime} min read</span>
                  </div>
                )}
              </div>
              
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </header>
            
            <div 
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        </div>
      </main>
    </div>
  );
}
