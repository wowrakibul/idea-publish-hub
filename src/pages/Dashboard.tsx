
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Search } from 'lucide-react';
import { PostCard } from '@/components/PostCard';
import { usePostStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const { posts, selectPost, publishPost, unpublishPost, deletePost } = usePostStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'updated'>('updated');

  // Get all unique tags from posts
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)))
    .sort((a, b) => a.localeCompare(b));

  // Filter posts based on search, filter, and tag
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = 
      selectedFilter === 'all' ||
      (selectedFilter === 'published' && post.isPublished) ||
      (selectedFilter === 'private' && !post.isPublished) ||
      (selectedFilter === 'draft' && post.isDraft);
    
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesFilter && matchesTag;
  });

  // Sort the filtered posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  // Pinned posts should be at the top regardless of sort order
  const pinnedPosts = sortedPosts.filter(post => post.pinned);
  const unpinnedPosts = sortedPosts.filter(post => !post.pinned);
  const finalSortedPosts = [...pinnedPosts, ...unpinnedPosts];

  // Handle post deletion with confirmation
  const handleDeletePost = (id: string) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      deletePost(id);
      toast.success('Post deleted successfully');
    }
  };

  // Handle publishing/unpublishing
  const handlePublishToggle = (id: string) => {
    const post = posts.find(p => p.id === id);
    if (post?.isPublished) {
      unpublishPost(id);
      toast.success('Post is now private');
    } else {
      publishPost(id);
      toast.success('Post is now public');
    }
  };

  // Handle edit post
  const handleEditPost = (id: string) => {
    selectPost(id);
    navigate('/editor');
  };

  const handleNewPost = () => {
    selectPost(null); // Deselect any current post
    navigate('/editor');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-serif font-bold">Your Ideas</h1>
            <Button onClick={handleNewPost} className="bg-primary hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" /> New Idea
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-8">
            <div className="space-y-6">
              <div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search ideas..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Filter</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant={selectedFilter === 'all' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedFilter('all')}
                  >
                    All
                  </Badge>
                  <Badge 
                    variant={selectedFilter === 'published' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedFilter('published')}
                  >
                    Published
                  </Badge>
                  <Badge 
                    variant={selectedFilter === 'private' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedFilter('private')}
                  >
                    Private
                  </Badge>
                  <Badge 
                    variant={selectedFilter === 'draft' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedFilter('draft')}
                  >
                    Drafts
                  </Badge>
                </div>
              </div>

              {allTags.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Tags</Label>
                  <div className="flex flex-wrap gap-2">
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
                </div>
              )}

              <div>
                <Label className="text-sm font-medium mb-2 block">Sort By</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant={sortOrder === 'updated' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSortOrder('updated')}
                  >
                    Last Updated
                  </Badge>
                  <Badge 
                    variant={sortOrder === 'newest' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSortOrder('newest')}
                  >
                    Newest
                  </Badge>
                  <Badge 
                    variant={sortOrder === 'oldest' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSortOrder('oldest')}
                  >
                    Oldest
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="border rounded-lg p-12 text-center">
                  <h2 className="text-xl font-semibold mb-2">No ideas yet</h2>
                  <p className="text-muted-foreground mb-4">Start creating your ideas and manage them all in one place.</p>
                  <Button onClick={handleNewPost}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create your first idea
                  </Button>
                </div>
              ) : finalSortedPosts.length === 0 ? (
                <div className="border rounded-lg p-8 text-center">
                  <h2 className="text-lg font-medium mb-2">No matching ideas found</h2>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {finalSortedPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onPublishToggle={handlePublishToggle}
                      onDelete={handleDeletePost}
                      onEdit={handleEditPost}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
