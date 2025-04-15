
export interface Post {
  id: string;
  title: string;
  content: string;
  isPublished: boolean;
  isDraft: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  excerpt?: string;
  readTime?: number;
  pinned?: boolean;
  viewCount?: number;
}

export interface PostsState {
  posts: Post[];
  selectedPost: Post | null;
  loading: boolean;
  error: string | null;
}
