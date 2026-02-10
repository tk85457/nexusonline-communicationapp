
import React from 'react';
import { Post, Community, User, UserRole } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Rivera',
  username: 'arivera',
  email: 'alex@nexus.com',
  avatar: 'https://picsum.photos/seed/alex/200',
  role: UserRole.CREATOR,
  bio: 'Digital artist & Tech enthusiast. Building the future of social networks. 🚀',
  interests: ['Tech', 'Design', 'AI', 'Gaming'],
  followers: 12400,
  following: 850,
  badges: ['Early Adopter', 'Top Creator']
};

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    authorId: 'u2',
    authorName: 'Sarah Chen',
    authorUsername: 'schen_dev',
    authorAvatar: 'https://picsum.photos/seed/sarah/200',
    content: "Just finished implementing the new Gemini 3.0 API in my project! The reasoning capabilities are insane. Anyone else tried it yet? #AI #DevLife #Gemini",
    type: 'text',
    hashtags: ['AI', 'DevLife', 'Gemini'],
    likes: 452,
    comments: 24,
    reposts: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    authorId: 'u3',
    authorName: 'Creative Hub',
    authorUsername: 'creativehub',
    authorAvatar: 'https://picsum.photos/seed/hub/200',
    content: "Which color palette fits the 'Nexus' vibe better?",
    type: 'poll',
    poll: {
      options: ['Electric Blue & Slate', 'Neon Purple & Black', 'Sunset Orange & Gray'],
      votes: [120, 340, 85]
    },
    hashtags: ['Design', 'UX'],
    likes: 89,
    comments: 56,
    reposts: 5,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'p3',
    authorId: 'u1',
    authorName: 'Alex Rivera',
    authorUsername: 'arivera',
    authorAvatar: 'https://picsum.photos/seed/alex/200',
    content: "Check out this AI-generated concept art for our next VR community space.",
    type: 'image',
    mediaUrls: ['https://picsum.photos/seed/art/800/600'],
    hashtags: ['VR', 'AIArt'],
    likes: 1205,
    comments: 88,
    reposts: 210,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  }
];

export const MOCK_COMMUNITIES: Community[] = [
  {
    id: 'c1',
    name: 'AI Researchers',
    description: 'A space for sharing papers and breakthroughs in Artificial Intelligence.',
    memberCount: 45000,
    category: 'Science',
    image: 'https://picsum.photos/seed/ai/400',
    isPrivate: false
  },
  {
    id: 'c2',
    name: 'Pixel Perfect UI',
    description: 'Showcase your finest UI designs and get constructive feedback.',
    memberCount: 12000,
    category: 'Design',
    image: 'https://picsum.photos/seed/ui/400',
    isPrivate: false
  },
  {
    id: 'c3',
    name: 'Stealth Startup Founders',
    description: 'A private group for founders building the next big thing.',
    memberCount: 200,
    category: 'Business',
    image: 'https://picsum.photos/seed/startup/400',
    isPrivate: true
  }
];
