
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
      <div className="h-24 w-24 bg-slate-800 rounded-full flex items-center justify-center mb-6">
        <svg className="h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold mb-2">{title}</h2>
      <p className="text-slate-400 max-w-md">This feature is currently in development. Nexus is expanding its ecosystem rapidly!</p>
      <button 
        onClick={() => showToast(`Subscribed to ${title} updates!`, 'success')}
        className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold transition-all"
      >
        Notify me when ready
      </button>
    </div>
  );

  return (
    <Router>
      <div className="flex min-h-screen bg-slate-900 text-slate-50 overflow-x-hidden">
        <div className="hidden md:block w-64 lg:w-72 border-r border-slate-800 h-screen sticky top-0 overflow-y-auto z-40">
          <Sidebar user={user} showToast={showToast} />
        </div>

        <main className="flex-1 flex flex-col min-w-0 relative">
          <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 h-16 flex items-center justify-between px-4 md:px-8">
            <div className="flex items-center gap-4">
              <Link to="/" className="md:hidden text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                N
              </Link>
              <h1 className="hidden md:block text-xl font-semibold tracking-tight">Nexus</h1>
            </div>

            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search Nexus..." 
                  className="w-full bg-slate-800 border border-slate-700 rounded-full py-2 px-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCreateModalOpen(true)}
                className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all items-center gap-2 active:scale-95 shadow-lg shadow-blue-500/20"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Post
              </button>
              
              <button 
                onClick={() => { setChatOpen(!isChatOpen); if(!isChatOpen) showToast('Opened Messages'); }}
                className={`p-2 rounded-full transition-colors relative active:scale-90 ${isChatOpen ? 'bg-slate-700 text-blue-400' : 'hover:bg-slate-800'}`}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-blue-500 border-2 border-slate-900"></span>
              </button>

              <button 
                onClick={() => { setNotificationOpen(!isNotificationOpen); if(!isNotificationOpen) showToast('Opened Notifications'); }}
                className={`p-2 rounded-full transition-colors relative active:scale-90 ${isNotificationOpen ? 'bg-slate-700 text-blue-400' : 'hover:bg-slate-800'}`}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-slate-900"></span>
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
            <Routes>
              <Route path="/" element={<Feed posts={filteredPosts} communities={communities} user={user} showToast={showToast} />} />
              <Route path="/communities" element={<PlaceholderPage title="Communities Explore" />} />
              <Route path="/messages" element={<PlaceholderPage title="Messages Center" />} />
              <Route path="/bookmarks" element={<PlaceholderPage title="My Bookmarks" />} />
              <Route path="/profile/:username" element={<Profile user={user} showToast={showToast} />} />
              <Route path="/creator/dashboard" element={<CreatorDashboard user={user} showToast={showToast} />} />
              <Route path="/admin" element={<AdminDashboard showToast={showToast} />} />
              <Route path="/mod" element={<ModeratorDashboard showToast={showToast} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>

        <div className="hidden lg:block w-80 border-l border-slate-800 h-screen sticky top-0 overflow-y-auto p-6 z-40">
          <TrendingSection showToast={showToast} />
        </div>

        {isChatOpen && <ChatWindow onClose={() => setChatOpen(false)} showToast={showToast} />}
        {isCreateModalOpen && <CreatePostModal onClose={() => setCreateModalOpen(false)} onPost={handleCreatePost} user={user!} showToast={showToast} />}
        {isNotificationOpen && <NotificationsPanel onClose={() => setNotificationOpen(false)} showToast={showToast} />}

        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 h-16 flex items-center justify-around z-50">
           <Link to="/" className="p-2 active:scale-90 transition-transform">
             <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
           </Link>
           <button onClick={() => setCreateModalOpen(true)} className="p-2 text-blue-500 active:scale-90 transition-transform">
             <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </button>
           <Link to={`/profile/${user?.username}`} className="p-2 active:scale-90 transition-transform">
             <img src={user?.avatar} alt="Profile" className="h-6 w-6 rounded-full border border-slate-700" />
           </Link>
        </nav>

        <ToastContainer toasts={toasts} />
      </div>
    </Router>
  );
};

// Fix for Error in file App.tsx on line 217: Expected 1 arguments, but got 2.
// Update TrendingSection props type definition to allow 'type' argument.
const TrendingSection: React.FC<{ showToast: (m: string, type?: 'info' | 'success' | 'warning') => void }> = ({ showToast }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
    <section>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Trending Topics</h3>
        <button onClick={() => showToast('Refreshed Trends')} className="text-blue-500 hover:text-blue-400 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>
      <div className="space-y-4">
        {['#GeminiAI', '#Web3Future', '#UIUXDesign', '#NexusLaunch', '#React19'].map((tag) => (
          <div 
            key={tag} 
            className="group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-slate-800 transition-colors"
            onClick={() => showToast(`Searching for ${tag}`)}
          >
            <p className="text-blue-400 font-medium group-hover:underline">{tag}</p>
            <p className="text-xs text-slate-500">1.2k posts today</p>
          </div>
        ))}
      </div>
    </section>
    <section>
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Recommended for You</h3>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between group">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => showToast(`Viewed Expert User ${i}`)}
            >
              <img src={`https://picsum.photos/seed/${i + 10}/50`} className="h-10 w-10 rounded-full group-hover:ring-2 ring-blue-500/20 transition-all" alt="" />
              <div>
                <p className="text-sm font-medium group-hover:text-blue-400 transition-colors">Expert User {i}</p>
                <p className="text-xs text-slate-500">@expert_{i}</p>
              </div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); showToast(`Followed Expert User ${i}`, 'success'); }}
              className="text-xs font-bold text-blue-500 hover:text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full hover:bg-blue-500/10 transition-all active:scale-95"
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default App;
