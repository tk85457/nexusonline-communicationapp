
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { User } from '../types.ts';
import { MOCK_USER } from '../constants.tsx';

interface ProfileProps {
  user: User | null;
  // Fix for Error in file components/Profile.tsx on line 21: Expected 1 arguments, but got 2.
  showToast: (m: string, type?: 'info' | 'success' | 'warning') => void;
}

const Profile: React.FC<ProfileProps> = ({ user, showToast }) => {
  const { username } = useParams<{ username: string }>();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('Posts');
  
  const profileUser = username === 'arivera' ? MOCK_USER : MOCK_USER; 

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    showToast(isFollowing ? `Unfollowed @${profileUser.username}` : `Followed @${profileUser.username}!`, 'success');
  };

  const handleAction = (action: string) => {
    showToast(`${action} functionality coming soon!`);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="h-48 md:h-64 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl mb-16 relative shadow-2xl group overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
         <div className="absolute -bottom-12 left-8 p-1.5 bg-slate-900 rounded-3xl shadow-2xl">
            <img src={profileUser.avatar} alt={profileUser.name} className="h-32 w-32 md:h-44 md:w-44 rounded-2xl border-4 border-slate-900 object-cover shadow-inner" />
         </div>
         <button 
            onClick={() => handleAction('Edit Header')}
            className="absolute bottom-4 right-4 bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-md px-5 py-2.5 rounded-2xl text-sm font-bold border border-white/10 transition-all active:scale-95 text-white"
          >
           Edit Header
         </button>
      </div>

      <div className="px-8 flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-1">
            <h2 className="text-4xl font-black tracking-tighter">{profileUser.name}</h2>
            <div className="flex gap-2">
              {profileUser.badges.map(badge => (
                <span key={badge} title={badge} className="px-3 py-1 bg-blue-500/15 text-blue-400 text-[10px] font-black rounded-full border border-blue-500/20 uppercase tracking-widest shadow-sm">
                  {badge}
                </span>
              ))}
            </div>
          </div>
          <p className="text-blue-500 font-bold mb-4">@{profileUser.username}</p>
          <p className="text-slate-300 mb-6 max-w-2xl leading-relaxed font-medium text-lg">{profileUser.bio}</p>

          <div className="flex gap-10 mb-8 p-6 bg-slate-800/20 border border-slate-800/50 rounded-3xl w-fit">
            <div className="flex flex-col gap-0.5 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleAction('View Followers')}>
              <span className="font-black text-2xl text-white">{(profileUser.followers + (isFollowing ? 1 : 0)).toLocaleString()}</span>
              <span className="text-slate-500 text-xs font-black uppercase tracking-widest">Followers</span>
            </div>
            <div className="flex flex-col gap-0.5 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleAction('View Following')}>
              <span className="font-black text-2xl text-white">{profileUser.following.toLocaleString()}</span>
              <span className="text-slate-500 text-xs font-black uppercase tracking-widest">Following</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            {profileUser.interests.map(interest => (
              <span 
                key={interest} 
                onClick={() => showToast(`Explore #${interest}`)}
                className="px-5 py-2 bg-slate-800 border border-slate-700 rounded-2xl text-sm font-bold text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-all active:scale-95 shadow-sm"
              >
                # {interest}
              </span>
            ))}
          </div>
        </div>

        <div className="w-full md:w-auto flex gap-4">
          <button 
            onClick={handleFollow}
            className={`flex-1 md:flex-none px-10 py-4 rounded-2xl font-black transition-all shadow-xl active:scale-95 ${
              isFollowing 
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow User'}
          </button>
          <button 
            onClick={() => handleAction('Direct Message')}
            className="p-4 bg-slate-800 border border-slate-700 rounded-2xl hover:bg-slate-700 transition-all active:scale-95 shadow-lg group"
          >
            <svg className="h-7 w-7 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-8 border-t border-slate-800">
        <div className="flex gap-10 px-8 overflow-x-auto scrollbar-hide">
          {['Posts', 'Replies', 'Media', 'Likes'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => { setActiveTab(tab); showToast(`Viewing ${tab}`); }}
              className={`py-6 font-black uppercase text-xs tracking-[0.2em] border-b-4 transition-all active:scale-95 ${
                activeTab === tab ? 'border-blue-500 text-blue-500' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="px-6 py-24 text-center bg-slate-800/10 rounded-[3rem] border-2 border-dashed border-slate-800/50 mx-4 mt-4 animate-in fade-in zoom-in-95 duration-700">
           <div className="h-20 w-20 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-700">
             <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
           </div>
           <p className="text-slate-500 font-black uppercase tracking-widest text-sm">Empty Feed</p>
           <p className="text-slate-600 mt-2">@{profileUser.username} hasn't posted anything in the {activeTab} section yet.</p>
           <button 
             onClick={() => handleAction('Refresh Profile')}
             className="mt-8 text-blue-500 font-bold hover:underline"
           >
             Refresh Profile
           </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
