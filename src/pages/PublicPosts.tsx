
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import { usePostStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Tag, ChevronLeft } from 'lucide-react';

export default function PublicPosts() {
  const { posts } = usePostStore();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Filter for only published posts
  const publishedPosts = posts.filter(post => post.isPublished);
  
  // Filter by selected tag if any
  const filteredPosts = selectedTag 
    ? publishedPosts.filter(post => post.tags.includes(selectedTag))
    : publishedPosts;
    
  // Sort with pinned posts on top, then by updated date
  const pinnedPosts = filteredPosts.filter(post => post.pinned);
  const unpinnedPosts = filteredPosts.filter(post => !post.pinned);
  const sortedPosts = [...pinnedPosts, ...unpinnedPosts].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  
  // Get all unique tags from published posts
  const allTags = Array.from(new Set(publishedPosts.flatMap(post => post.tags)))
    .sort((a, b) => a.localeCompare(b));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-center">
            Published Ideas
          </h1>
          
          {allTags.length > 0 && (
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {allTags.map(tag => (
                <Badge 
                  key={tag}
                  variant={selectedTag === tag ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {sortedPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No published ideas yet.</p>
              <Link 
                to="/" 
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                <ChevronLeft className="inline h-4 w-4 mr-1" />
                Back to dashboard
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {sortedPosts.map(post => (
                <Link 
                  key={post.id}
                  to={`/post/${post.id}`}
                  className="block border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {post.pinned && (
                      <div className="rounded-full h-2 w-2 bg-primary" />
                    )}
                    <h2 className="text-2xl font-serif font-semibold">
                      {post.title}
                    </h2>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(post.updatedAt), 'MMM d, yyyy')}</span>
                    </div>
                    {post.readTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime} min read</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 180)}...
                  </p>
                  
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {post.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs font-normal">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
