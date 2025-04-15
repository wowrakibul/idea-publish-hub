
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Post, PostsState } from '@/types/post';
import { v4 as uuidv4 } from 'uuid';
import { samplePosts } from './sampleData';

export const usePostStore = create<PostsState & {
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePost: (id: string, post: Partial<Post>) => void;
  deletePost: (id: string) => void;
  publishPost: (id: string) => void;
  unpublishPost: (id: string) => void;
  selectPost: (id: string | null) => void;
  calculateReadTime: (content: string) => number;
}>()(
  persist(
    (set, get) => ({
      posts: samplePosts,
      selectedPost: null,
      loading: false,
      error: null,

      addPost: (postData) => {
        const now = new Date();
        const readTime = get().calculateReadTime(postData.content);
        const newPost: Post = {
          ...postData,
          id: uuidv4(),
          createdAt: now,
          updatedAt: now,
          readTime,
        };

        set((state) => ({
          posts: [newPost, ...state.posts],
          selectedPost: newPost,
        }));
      },

      updatePost: (id, postData) => {
        set((state) => ({
          posts: state.posts.map((post) => 
            post.id === id 
              ? { 
                  ...post, 
                  ...postData, 
                  updatedAt: new Date(),
                  readTime: postData.content ? get().calculateReadTime(postData.content) : post.readTime,
                } 
              : post
          ),
          selectedPost: state.selectedPost?.id === id 
            ? { ...state.selectedPost, ...postData, updatedAt: new Date() } 
            : state.selectedPost,
        }));
      },

      deletePost: (id) => {
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== id),
          selectedPost: state.selectedPost?.id === id ? null : state.selectedPost,
        }));
      },

      publishPost: (id) => {
        set((state) => ({
          posts: state.posts.map((post) => 
            post.id === id ? { ...post, isPublished: true, isDraft: false, updatedAt: new Date() } : post
          ),
        }));
      },

      unpublishPost: (id) => {
        set((state) => ({
          posts: state.posts.map((post) => 
            post.id === id ? { ...post, isPublished: false, updatedAt: new Date() } : post
          ),
        }));
      },

      selectPost: (id) => {
        if (id === null) {
          set({ selectedPost: null });
          return;
        }
        const post = get().posts.find((p) => p.id === id) || null;
        set({ selectedPost: post });
      },

      calculateReadTime: (content) => {
        const wordsPerMinute = 200;
        const wordCount = content.trim().split(/\s+/).length;
        const readTime = Math.ceil(wordCount / wordsPerMinute);
        return readTime || 1; // Minimum 1 minute read time
      },
    }),
    {
      name: 'idea-hub-storage',
    }
  )
);
