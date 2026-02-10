
import React, { useState } from 'react';
import { Post, Community, User } from '../types.ts';
import PostCard from './PostCard.tsx';

interface FeedProps {
  posts: Post[];
  communities: Community[];
  user: User | null;
  // Fix for Error in file components/Feed.tsx on line 28: Expected 1 arguments, but got 2.
  showToast: (m: string, type?: 'info' | 'success' | 'warning') => void;
}

type FeedType = 'For You' | 'Following' | 'Trending' | 'Communities';

const Feed: React.FC<FeedProps> = ({ posts, communities, user, showToast }) => {
  const [activeTab, setActiveTab] = useState<FeedType>('For You');
  const [joinedCommunities, setJoinedCommunities] = useState<Set<string>>(new Set());

  const tabs: FeedType[] = ['For You', 'Following', 'Trending', 'Communities'];

  const handleJoin = (id: string, name: string) => {
    const newJoined = new Set(joinedCommunities);
    if (newJoined.has(id)) {
      newJoined.delete(id);
      showToast(`Left ${name}`);
    } else {
      newJoined.add(id);
      showToast(`Joined ${name}!`, 'success');
    }
    setJoinedCommunities(newJoined);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex border-b border-slate-800 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); showToast(`Switched to ${tab} feed`); }}
            className={`px-6 py-4 text-sm font-bold transition-all whitespace-nowrap relative active:scale-95 ${
              activeTab === tab ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'Communities' && (
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide animate-in slide-in-from-left-4 duration-500">
          {communities.map((comm) => (
            <div key={comm.id} className="flex-shrink-0 w-64 bg-slate-800/50 border border-slate-700 rounded-3xl p-4 hover:border-slate-500 transition-all hover:bg-slate-800/80 group">
              <div className="relative mb-4 overflow-hidden rounded-2xl">
                <img src={comm.image} alt={comm.name} className="h-32 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {comm.isPrivate && (
                  <span className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-lg border border-white/10">
                    <svg className="h-3 w-3 text-slate-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                  </span>
                )}
              </div>
              <h4 className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{comm.name}</h4>
              <p className="text-xs text-slate-400 mb-4 h-8 line-clamp-2">{comm.description}</p>
              <div className="flex items-center justify-between mb-4">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{comm.category}</span>
                 <span className="text-xs text-slate-400 font-bold">{(comm.memberCount / 1000).toFixed(1)}k members</span>
              </div>
              <button 
                onClick={() => handleJoin(comm.id, comm.name)}
                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                  joinedCommunities.has(comm.id)
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/10'
                }`}
              >
                {joinedCommunities.has(comm.id) ? 'Joined' : 'Join Community'}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-6 animate-in fade-in duration-700">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} currentUser={user} showToast={showToast} />
          ))
        ) : (
          <div className="text-center py-20 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
            <p className="text-slate-500 font-medium">No posts found matching your search.</p>
          </div>
        )}
      </div>

      <div className="py-12 flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500/20 border-t-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Loading older posts</p>
      </div>
    </div>
  );
};

export default Feed;
