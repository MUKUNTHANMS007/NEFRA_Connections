/** Post item from GET /posts/feed */
export interface FeedPost {
  id: string | number;
  content?: string;
  userId?: string | number;
  createdAt?: string;
  authorName?: string;
  [key: string]: unknown;
}
