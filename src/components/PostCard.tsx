
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Eye, EyeOff, Clock, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Post } from '@/types/post';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface PostCardProps {
  post: Post;
  onPublishToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export function PostCard({ post, onPublishToggle, onDelete, onEdit }: PostCardProps) {
  const formattedDate = formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true });

  // Create an excerpt from the HTML content
  const createExcerpt = (htmlContent: string) => {
    // Remove HTML tags
    const plainText = htmlContent.replace(/<[^>]*>/g, '');
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all", 
      post.isDraft && "border-dashed border-muted-foreground/20 bg-muted/50",
      post.pinned && "border-primary/50"
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="font-serif text-xl line-clamp-1">{post.title || "Untitled"}</CardTitle>
          {post.pinned && (
            <div className="rounded-full h-2 w-2 bg-primary mt-2" />
          )}
        </div>
        <CardDescription className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {post.excerpt || createExcerpt(post.content)}
        </p>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 flex flex-wrap justify-between gap-2">
        <div className="flex items-center text-xs text-muted-foreground gap-2">
          <div className="flex items-center gap-1">
            {post.isPublished ? (
              <Eye className="h-3 w-3 text-green-500" />
            ) : (
              <EyeOff className="h-3 w-3" />
            )}
            <span>{post.isPublished ? "Public" : "Private"}</span>
          </div>
          {post.readTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{post.readTime} min read</span>
            </div>
          )}
          {post.isDraft && (
            <Badge variant="outline" className="text-xs font-normal">Draft</Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onPublishToggle(post.id)}
          >
            {post.isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(post.id)}
          >
            Edit
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(post.id)}
          >
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
