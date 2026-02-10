
import React, { useState } from 'react';
import { Post, User } from '../types.ts';

interface PostCardProps {
  post: Post;
  currentUser: User | null;
  showToast: (m: string, type?: 'info' | 'success' | 'warning') => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser, showToast }) => {
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [repostCount, setRepostCount] = useState(post.reposts);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
    if(!liked) showToast(`Liked ${post.authorName}'s post`, 'success');
  };

  const toggleRepost = () => {
    setReposted(!reposted);
    setRepostCount(prev => reposted ? prev - 1 : prev + 1);
    showToast(reposted ? 'Removed repost' : 'Reposted successfully!', 'success');
  };

  const handleShare = async () => {
    const postUrl = `https://nexus.platform/post/${post.id}`;
    try {
      await navigator.clipboard.writeText(postUrl);
      showToast('Link copied to clipboard!', 'success');
    } catch (err) {
      showToast('Failed to copy link', 'warning');
    }
  };

  const handleAction = (action: string) => {
    showToast(`${action} functionality coming soon!`);
    setIsMenuOpen(false);
  };

  return (
    <article className="bg-slate-800/30 border border-slate-800 rounded-3xl p-5 md:p-7 hover:border-slate-700 transition-all duration-500 group relative overflow-hidden">
      <div className="flex gap-5">
        <div className="flex-shrink-0 cursor-pointer" onClick={() => handleAction('Visit Profile')}>
          <img src={post.authorAvatar} alt={post.authorName} className="h-14 w-14 rounded-2xl border-2 border-slate-700 group-hover:border-blue-500/30 transition-all shadow-sm" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-slate-100 hover:text-blue-400 cursor-pointer transition-colors" onClick={() => handleAction('Visit Profile')}>{post.authorName}</h4>
              <span className="text-sm text-slate-500 truncate">@{post.authorUsername}</span>
              <span className="text-slate-700">•</span>
              <span className="text-xs text-slate-500 font-medium">2h</span>
            </div>
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-xl transition-all ${isMenuOpen ? 'bg-slate-700 text-blue-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700'}`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>

              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button onClick={() => handleAction('Report Post')} className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      Report Content
                    </button>
                    <button onClick={() => handleAction('Mute User')} className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-3">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                      Mute @{post.authorUsername}
                    </button>
                    <button onClick={() => handleAction('Embed Post')} className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-3">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                      Embed Post
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <p className="text-[15px] text-slate-300 leading-relaxed mb-5 whitespace-pre-wrap font-medium">{post.content}</p>

          {/* Video Rendering */}
          {post.type === 'video' && post.mediaUrls && post.mediaUrls.length > 0 && (
            <div className="mb-5 rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl ring-1 ring-white/5">
              <video 
                src={post.mediaUrls[0]} 
                className="w-full max-h-[500px] object-contain" 
                controls 
                preload="metadata"
              />
            </div>
          )}

          {/* Image Media Rendering */}
          {post.type === 'image' && post.mediaUrls && post.mediaUrls.length > 0 && (
            <div className="mb-5 rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl group/media cursor-zoom-in" onClick={() => handleAction('Expand Media')}>
              <img src={post.mediaUrls[0]} alt="Post media" className="w-full object-cover max-h-[500px] transition-transform duration-700 group-hover/media:scale-[1.02]" />
            </div>
          )}

          {/* Poll Rendering */}
          {post.type === 'poll' && post.poll && (
            <div className="space-y-3 mb-5 bg-slate-900/50 p-5 rounded-2xl border border-slate-800 shadow-inner">
              {post.poll.options.map((option, idx) => {
                const totalVotes = post.poll!.votes.reduce((a, b) => a + b, 0);
                const percentage = Math.round((post.poll!.votes[idx] / totalVotes) * 100);
                return (
                  <div key={idx} className="relative cursor-pointer group/poll active:scale-[0.99] transition-transform" onClick={() => showToast(`Voted for ${option}`, 'success')}>
                    <div className="h-12 border border-slate-700 rounded-xl flex items-center px-4 z-10 relative overflow-hidden transition-all group-hover/poll:border-blue-500/50">
                      <div className="absolute inset-0 bg-blue-500/10 transition-all duration-700 ease-out" style={{ width: `${percentage}%` }}></div>
                      <span className="flex-1 text-sm font-bold z-10 text-slate-200">{option}</span>
                      <span className="text-xs font-black text-blue-400 z-10 opacity-0 group-hover/poll:opacity-100 transition-opacity">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
              <div className="flex justify-between items-center px-1">
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{post.poll.votes.reduce((a, b) => a + b, 0)} total votes</p>
                 <p className="text-xs text-slate-500 font-medium italic">23 hours remaining</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between text-slate-500 pt-2 border-t border-slate-800/50">
            <button 
              onClick={toggleLike} 
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-300 active:scale-90 ${liked ? 'text-pink-500 bg-pink-500/5' : 'hover:text-pink-500 hover:bg-pink-500/5'}`}
            >
              <div className="relative">
                <svg className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {liked && <span className="absolute inset-0 animate-ping h-5 w-5 rounded-full bg-pink-500/30"></span>}
              </div>
              <span className="text-sm font-bold">{likesCount.toLocaleString()}</span>
            </button>

            <button 
              onClick={() => handleAction('Comment')}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-300 hover:text-blue-400 hover:bg-blue-400/5 active:scale-90"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm font-bold">{post.comments}</span>
            </button>

            <button 
              onClick={toggleRepost}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-300 active:scale-90 ${reposted ? 'text-green-500 bg-green-500/5' : 'hover:text-green-500 hover:bg-green-500/5'}`}
            >
              <svg className={`h-5 w-5 ${reposted ? 'scale-110' : ''} transition-transform`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm font-bold">{repostCount}</span>
            </button>

            <button 
              onClick={handleShare}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-300 hover:text-indigo-400 hover:bg-indigo-400/5 active:scale-90"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6a3 3 0 100-2.684m0 2.684l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
