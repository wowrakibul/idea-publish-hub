
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePostStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TagInput } from '@/components/TagInput';
import { RichTextEditor } from '@/components/RichTextEditor';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Save, Eye, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function Editor() {
  const navigate = useNavigate();
  const { addPost, updatePost, selectedPost, publishPost } = usePostStore();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDraft, setIsDraft] = useState(true);

  // Initialize the form with the selected post data if available
  useEffect(() => {
    if (selectedPost) {
      setTitle(selectedPost.title);
      setContent(selectedPost.content);
      setTags(selectedPost.tags);
      setIsDraft(selectedPost.isDraft);
      setIsEditing(true);
    } else {
      // Clear the form for a new post
      setTitle('');
      setContent('');
      setTags([]);
      setIsDraft(true);
      setIsEditing(false);
    }
  }, [selectedPost]);

  // Auto-save every 10 seconds when there are changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if ((title || content) && isDraft) {
        handleSave(true);
      }
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [title, content, tags, isDraft]);

  const handleSave = (isAutoSave = false) => {
    if (!title && !content) return;
    
    if (isEditing && selectedPost) {
      updatePost(selectedPost.id, {
        title,
        content,
        tags,
        isDraft
      });
      if (!isAutoSave) toast.success('Post updated successfully');
    } else {
      addPost({
        title: title || 'Untitled',
        content,
        tags,
        isPublished: false,
        isDraft,
        excerpt: content.substring(0, 150).replace(/<[^>]*>/g, '')
      });
      if (!isAutoSave) toast.success('Post created successfully');
      if (!isAutoSave) navigate('/');
    }
  };

  const handlePublish = () => {
    if (!title && !content) {
      toast.error('Please add some content before publishing');
      return;
    }
    
    if (isEditing && selectedPost) {
      updatePost(selectedPost.id, {
        title,
        content,
        tags,
        isDraft: false
      });
      publishPost(selectedPost.id);
      toast.success('Post published successfully');
    } else {
      const newPost = {
        title: title || 'Untitled',
        content,
        tags,
        isPublished: true,
        isDraft: false,
        excerpt: content.substring(0, 150).replace(/<[^>]*>/g, '')
      };
      addPost(newPost);
      toast.success('Post published successfully');
    }
    navigate('/');
  };

  const handlePreview = () => {
    // Implement preview functionality
    // This could navigate to a preview route or open a modal
    toast.info('Preview feature coming soon');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-8">
        <div className="mb-4 flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-3xl font-serif font-bold">
            {isEditing ? 'Edit Idea' : 'New Idea'}
          </h1>
        </div>
        
        <div className="grid gap-6">
          <div>
            <Input
              type="text"
              placeholder="Title"
              className="text-2xl font-serif font-bold border-none pl-0 text-foreground focus-visible:ring-0 h-auto"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">Tags</label>
            <TagInput 
              tags={tags} 
              onTagsChange={setTags} 
              placeholder="Add topics, categories..."
            />
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">Content</label>
            <RichTextEditor 
              value={content} 
              onChange={setContent} 
              placeholder="Start writing your idea here..."
              autofocus={!isEditing}
            />
          </div>
          
          <div className="flex flex-wrap gap-3 justify-end mt-4">
            <div className="flex items-center mr-auto">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="draft-toggle" 
                  checked={isDraft}
                  onCheckedChange={(checked) => setIsDraft(checked === true)}
                />
                <Label htmlFor="draft-toggle" className="text-sm">Save as draft</Label>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handlePreview}
            >
              <Eye className="mr-2 h-4 w-4" /> Preview
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={() => handleSave()}
            >
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
            
            <Button 
              onClick={handlePublish}
            >
              Publish
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
