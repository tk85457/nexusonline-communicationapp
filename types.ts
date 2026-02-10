
export enum UserRole {
  USER = 'USER',
  CREATOR = 'CREATOR',
  MODERATOR = 'MODERATOR',
  COMMUNITY_MANAGER = 'COMMUNITY_MANAGER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: UserRole;
  bio?: string;
  interests: string[];
  followers: number;
  following: number;
  badges: string[];
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'poll';
  mediaUrls?: string[];
  hashtags: string[];
  likes: number;
  comments: number;
  reposts: number;
  createdAt: string;
  communityId?: string;
  poll?: {
    options: string[];
    votes: number[];
  };
}

export interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  category: string;
  image: string;
  isPrivate: boolean;
}

export interface AppState {
  currentUser: User | null;
  posts: Post[];
  communities: Community[];
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system';
  fromUser?: {
    name: string;
    avatar: string;
  };
  message: string;
  timestamp: string;
  read: boolean;
}
