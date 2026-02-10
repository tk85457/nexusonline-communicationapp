
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, UserRole } from '../types.ts';

interface SidebarProps {
  user: User | null;
  showToast: (m: string, type?: 'info' | 'success' | 'warning') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, showToast }) => {
  const location = useLocation();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Communities', path: '/communities', icon: <CommunityIcon /> },
    { label: 'Messages', path: '/messages', icon: <MessageIcon /> },
    { label: 'Bookmarks', path: '/bookmarks', icon: <BookmarkIcon /> },
  ];

  if (user?.role === UserRole.CREATOR) {
    navItems.push({ label: 'Creator Studio', path: '/creator/dashboard', icon: <CreatorIcon /> });
  }

  if (user?.role === UserRole.ADMIN) {
    navItems.push({ label: 'Admin Panel', path: '/admin', icon: <AdminIcon /> });
  }
  
  navItems.push({ label: 'Moderation', path: '/mod', icon: <ModIcon /> });

  const handleAccountAction = (action: string) => {
    showToast(`${action} performed on account`);
    setIsAccountMenuOpen(false);
  };

  return (
    <div className="flex flex-col h-full py-8 px-6 bg-slate-950 border-r border-slate-800/50 shadow-2xl">
      {/* Brand Logo - Matching Screenshot Sketch */}
      <Link to="/" className="flex items-center gap-4 px-2 mb-12 group transition-all duration-500">
        <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(37,99,235,0.6)] group-hover:shadow-[0_0_35px_rgba(37,99,235,0.8)] group-hover:scale-110 transition-all duration-300">
          <span className="text-3xl font-black text-white italic tracking-tighter">N</span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-black tracking-tighter text-white group-hover:tracking-tight transition-all duration-500">NEXUS</span>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-transparent rounded-full opacity-50"></div>
        </div>
      </Link>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => showToast(`Opening ${item.label}...`)}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 active:scale-95 group relative ${
                isActive 
                  ? 'bg-blue-600/15 text-blue-400 font-bold border border-blue-500/20 shadow-[0_10px_30px_-15px_rgba(37,99,235,0.3)]' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100 hover:border-slate-700 border border-transparent'
              }`}
            >
              <div className={`${isActive ? 'text-blue-400 scale-110' : 'text-slate-500 group-hover:text-blue-300'} transition-all duration-300`}>
                {item.icon}
              </div>
              <span className="text-base tracking-tight">{item.label}</span>
              {isActive && (
                <div className="absolute left-0 w-1.5 h-6 bg-blue-500 rounded-r-full shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Area - Matching Screenshot Sketch */}
      {user && (
        <div className="mt-auto pt-6 border-t border-slate-800/50 relative">
          <div className="flex items-center gap-3.5 p-3.5 rounded-3xl hover:bg-slate-900 transition-all group border border-transparent hover:border-slate-800">
            <Link to={`/profile/${user.username}`} className="relative shrink-0 active:scale-90 transition-transform">
              <img src={user.avatar} className="h-11 w-11 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-blue-500/50 transition-all" alt={user.name} />
              <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-green-500 border-2 border-slate-950 rounded-full shadow-lg"></div>
            </Link>
            <Link to={`/profile/${user.username}`} className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-100 truncate group-hover:text-blue-400 transition-colors">{user.name}</p>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.1em] truncate">@{user.username}</p>
            </Link>
            <button 
              onClick={(e) => { e.preventDefault(); setIsAccountMenuOpen(!isAccountMenuOpen); }}
              className={`p-2 transition-all rounded-xl ${isAccountMenuOpen ? 'bg-blue-500/10 text-blue-400' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'}`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h.01M12 12h.01M19 12h.01" />
              </svg>
            </button>
          </div>

          {isAccountMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsAccountMenuOpen(false)}></div>
              <div className="absolute bottom-20 left-0 w-full bg-slate-900 border border-slate-700 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] py-3 z-50 animate-in slide-in-from-bottom-4 duration-300">
                <button onClick={() => handleAccountAction('Profile Settings')} className="w-full text-left px-5 py-3 text-sm font-bold text-slate-300 hover:bg-slate-800 flex items-center gap-3 transition-colors">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Profile Settings
                </button>
                <button onClick={() => handleAccountAction('Privacy Control')} className="w-full text-left px-5 py-3 text-sm font-bold text-slate-300 hover:bg-slate-800 flex items-center gap-3 transition-colors">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Privacy Control
                </button>
                <div className="h-px bg-slate-800 mx-5 my-2"></div>
                <button onClick={() => handleAccountAction('Sign Out')} className="w-full text-left px-5 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-colors">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const HomeIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const CommunityIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const MessageIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>;
const BookmarkIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>;
const CreatorIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const AdminIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const ModIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;

export default Sidebar;
