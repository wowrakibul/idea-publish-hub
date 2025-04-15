
import { Post } from '@/types/post';
import { v4 as uuidv4 } from 'uuid';

const now = new Date();
const yesterday = new Date(now);
yesterday.setDate(yesterday.getDate() - 1);
const lastWeek = new Date(now);
lastWeek.setDate(lastWeek.getDate() - 7);

export const samplePosts: Post[] = [
  {
    id: uuidv4(),
    title: 'Getting Started with Rich Text Editing',
    content: `<h1>Getting Started with Rich Text Editing</h1>
    <p>Welcome to your new rich text editor! This platform allows you to create beautiful posts with formatting and organization.</p>
    <h2>Key Features:</h2>
    <ul>
      <li>Text formatting with bold, italic, and more</li>
      <li>Image embedding</li>
      <li>Private by default, with optional publishing</li>
      <li>Tagging system for organization</li>
    </ul>
    <p>Try editing this post to see how it works!</p>`,
    isPublished: true,
    isDraft: false,
    createdAt: yesterday,
    updatedAt: yesterday,
    tags: ['welcome', 'tutorial'],
    excerpt: 'Learn how to use the core features of your new rich text editor platform.',
    readTime: 2,
    pinned: true,
    viewCount: 12
  },
  {
    id: uuidv4(),
    title: 'My First Draft',
    content: `<p>This is a draft post that I'm working on. It's not ready to be published yet.</p>
    <p>When I'm ready, I can publish it with a single click.</p>`,
    isPublished: false,
    isDraft: true,
    createdAt: now,
    updatedAt: now,
    tags: ['draft', 'ideas'],
    readTime: 1
  },
  {
    id: uuidv4(),
    title: 'How to Organize Your Ideas',
    content: `<h1>How to Organize Your Ideas</h1>
    <p>Keeping your ideas organized is essential for productivity and creativity. Here are some tips:</p>
    <h2>1. Use Tags</h2>
    <p>Tags help you categorize and find related ideas quickly.</p>
    <h2>2. Draft First, Polish Later</h2>
    <p>Get your thoughts down quickly as drafts, then come back to refine them.</p>
    <h2>3. Publish Selectively</h2>
    <p>Only publish ideas that you want to share with others. Keep personal notes private.</p>`,
    isPublished: true,
    isDraft: false,
    createdAt: lastWeek,
    updatedAt: yesterday,
    tags: ['organization', 'productivity', 'tips'],
    excerpt: 'Learn how to keep your ideas organized and accessible with these simple techniques.',
    readTime: 4
  }
];
