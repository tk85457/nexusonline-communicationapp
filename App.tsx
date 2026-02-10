
import React, { useState, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { User, Post, Community } from './types.ts';
import { MOCK_USER, MOCK_POSTS, MOCK_COMMUNITIES } from './constants.tsx';
import Sidebar from './components/Sidebar.tsx';
import Feed from './components/Feed.tsx';
import Profile from './components/Profile.tsx';
import CreatePostModal from './components/CreatePostModal.tsx';
import CreatorDashboard from './components/Dashboards/CreatorDashboard.tsx';
import AdminDashboard from './components/Dashboards/AdminDashboard.tsx';
import ModeratorDashboard from './components/Dashboards/ModeratorDashboard.tsx';
import NotificationsPanel from './components/NotificationsPanel.tsx';
import ChatWindow from './components/ChatWindow.tsx';
import ToastContainer from './components/ToastContainer.tsx';

export interface Toast {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning';
}

const App: React.FC = () => {
  const [user] = useState<User | null>(MOCK_USER);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [communities] = useState<Community[]>(MOCK_COMMUNITIES);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleCreatePost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
    setCreateModalOpen(false);
    showToast('Post published successfully!', 'success');
  };

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    return posts.filter(post => 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorUsername.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [posts, searchQuery]);

  const PlaceholderPage = ({ title }: { title: string }) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="h-24 w-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(59,130,246,0.1)] border border-slate-700">
        <svg className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <h2 className="text-3xl font-black tracking-tight mb-2">{title}</h2>
      <p className="text-slate-400 max-w-md font-medium">This module is part of the next Nexus rollout. Stay tuned for a world-class experience!</p>
      <button 
        onClick={() => showToast(`Subscribed to ${title} updates!`, 'success')}
        className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-3xl font-black transition-all active:scale-95 shadow-xl shadow-blue-500/20"
      >
        Notify Me
      </button>
    </div>
  );

  return (
    <Router>
      <div className="flex min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden selection:bg-blue-500/30">
        {/* Sidebar - Desktop Only */}
        <div className="hidden md:block w-72 lg:w-80 h-screen sticky top-0 z-40">
          <Sidebar user={user} showToast={showToast} />
        </div>

        {/* Main Feed Content Area */}
        <main className="flex-1 flex flex-col min-w-0 relative bg-[#0a0f1e]">
          <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-2xl border-b border-slate-800/50 h-20 flex items-center justify-between px-6 md:px-10">
            <div className="flex items-center gap-6">
              <Link to="/" className="md:hidden flex items-center gap-2 group">
                <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                  <span className="text-xl font-black text-white italic">N</span>
                </div>
              </Link>
              <h1 className="text-2xl font-black tracking-tighter hidden md:block group cursor-pointer" onClick={() => showToast('Nexus Home')}>
                NEXUS<span className="text-blue-500 animate-pulse">.</span>
              </h1>
            </div>

            {/* Global Search Bar */}
            <div className="flex-1 max-w-xl mx-6 hidden sm:block">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Search creators, topics, or communities..." 
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 px-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm font-medium placeholder:text-slate-600 shadow-inner"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg className="absolute left-4 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-4 top-3.5 text-slate-600 hover:text-slate-300">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="flex items-center gap-5">
              <button 
                onClick={() => setCreateModalOpen(true)}
                className="hidden lg:flex bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-2xl text-sm font-black transition-all items-center gap-2 active:scale-95 shadow-xl shadow-blue-600/20 group"
              >
                <svg className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Create
              </button>
              
              <div className="flex items-center bg-slate-900 border border-slate-800 p-1.5 rounded-2xl shadow-sm gap-1">
                <button 
                  onClick={() => { setChatOpen(!isChatOpen); setNotificationOpen(false); if(!isChatOpen) showToast('Messages Loaded', 'success'); }}
                  className={`p-2.5 rounded-xl transition-all relative active:scale-90 ${isChatOpen ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  {!isChatOpen && <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-blue-500 border-2 border-slate-900"></span>}
                </button>

                <button 
                  onClick={() => { setNotificationOpen(!isNotificationOpen); setChatOpen(false); if(!isNotificationOpen) showToast('Notifications Updated'); }}
                  className={`p-2.5 rounded-xl transition-all relative active:scale-90 ${isNotificationOpen ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {!isNotificationOpen && <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-slate-900"></span>}
                </button>
              </div>
            </div>
          </header>

          {/* Main Route Content */}
          <div className="flex-1 overflow-y-auto px-4 md:px-10 py-8 lg:px-16">
            <Routes>
              <Route path="/" element={<Feed posts={filteredPosts} communities={communities} user={user} showToast={showToast} />} />
              <Route path="/communities" element={<PlaceholderPage title="Community Hub" />} />
              <Route path="/messages" element={<PlaceholderPage title="Nexus Messages" />} />
              <Route path="/bookmarks" element={<PlaceholderPage title="Saved Collection" />} />
              <Route path="/profile/:username" element={<Profile user={user} showToast={showToast} />} />
              <Route path="/creator/dashboard" element={<CreatorDashboard user={user} showToast={showToast} />} />
              <Route path="/admin" element={<AdminDashboard showToast={showToast} />} />
              <Route path="/mod" element={<ModeratorDashboard showToast={showToast} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>

        {/* Right Trending Panel - Desktop Only */}
        <div className="hidden xl:block w-96 h-screen sticky top-0 overflow-y-auto p-10 bg-slate-950/50 border-l border-slate-800/50">
          <TrendingSection showToast={showToast} />
        </div>

        {/* Floating Modals & Panels */}
        {isChatOpen && <ChatWindow onClose={() => setChatOpen(false)} showToast={showToast} />}
        {isCreateModalOpen && <CreatePostModal onClose={() => setCreateModalOpen(false)} onPost={handleCreatePost} user={user!} showToast={showToast} />}
        {isNotificationOpen && <NotificationsPanel onClose={() => setNotificationOpen(false)} showToast={showToast} />}

        {/* Mobile Navbar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/50 h-20 flex items-center justify-around z-50 px-6">
           <Link to="/" onClick={() => showToast('Home')} className={`p-3 rounded-2xl transition-all active:scale-75 ${filteredPosts ? 'text-blue-500 bg-blue-500/10' : 'text-slate-500'}`}>
             <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
           </Link>
           <button onClick={() => setCreateModalOpen(true)} className="p-4 bg-blue-600 rounded-3xl text-white shadow-lg shadow-blue-500/30 active:scale-90 transition-all -mt-8 border-4 border-slate-950">
             <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
           </button>
           <Link to={`/profile/${user?.username}`} onClick={() => showToast('My Profile')} className="p-1 active:scale-75 transition-all">
             <img src={user?.avatar} alt="Profile" className="h-9 w-9 rounded-2xl border-2 border-slate-800 shadow-sm" />
           </Link>
        </nav>

        {/* Global Toast Notifications */}
        <ToastContainer toasts={toasts} />
      </div>
    </Router>
  );
};

const TrendingSection: React.FC<{ showToast: (m: string, type?: 'info' | 'success' | 'warning') => void }> = ({ showToast }) => (
  <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
    <section>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Trending Pulse</h3>
        <button onClick={() => showToast('Trends Refreshed', 'success')} className="text-blue-500 hover:text-blue-400 transition-all p-2 rounded-xl hover:bg-blue-500/10 active:rotate-180 duration-500">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>
      <div className="space-y-5">
        {['#GeminiAI', '#Web3Future', '#UIUXDesign', '#NexusLaunch', '#React19'].map((tag) => (
          <div 
            key={tag} 
            className="group cursor-pointer p-4 -mx-4 rounded-[2rem] hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all duration-300"
            onClick={() => showToast(`Pulse: ${tag}`)}
          >
            <p className="text-blue-400 font-black group-hover:underline text-lg">{tag}</p>
            <p className="text-xs text-slate-500 font-bold mt-1">24.5k interactions today</p>
          </div>
        ))}
      </div>
    </section>
    
    <section>
      <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Top Minds</h3>
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between group">
            <div 
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => showToast(`Visiting Expert ${i}`)}
            >
              <img src={`https://picsum.photos/seed/${i + 20}/50`} className="h-12 w-12 rounded-2xl group-hover:ring-4 ring-blue-500/20 transition-all shadow-lg" alt="" />
              <div>
                <p className="text-sm font-black text-slate-100 group-hover:text-blue-400 transition-colors">Visionary {i}</p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">@vision_{i}</p>
              </div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); showToast(`Subscribed to Visionary ${i}`, 'success'); }}
              className="px-5 py-2 bg-slate-900 hover:bg-blue-600 text-slate-400 hover:text-white text-xs font-black border border-slate-800 hover:border-blue-500 rounded-2xl transition-all active:scale-95 shadow-lg"
            >
              Connect
            </button>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default App;
