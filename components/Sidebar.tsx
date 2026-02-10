
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, UserRole } from '../types.ts';

interface SidebarProps {
  user: User | null;
  showToast: (m: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, showToast }) => {
  const location = useLocation();

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

  return (
    <div className="flex flex-col h-full py-8 px-6 bg-slate-900">
      <Link to="/" className="flex items-center gap-4 px-2 mb-12 group">
        <div className="h-12 w-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] transition-all duration-300">
          <span className="text-3xl font-black text-white italic">N</span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent group-hover:to-white transition-all">NEXUS</span>
          <span className="text-[10px] text-blue-500 font-bold uppercase tracking-[0.2em]">Community</span>
        </div>
      </Link>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => showToast(`Navigating to ${item.label}`)}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 active:scale-95 group ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-400 font-bold shadow-sm border border-blue-500/10' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className={`${isActive ? 'text-blue-400 scale-110' : 'text-slate-500 group-hover:text-slate-300'} transition-all duration-300`}>
                {item.icon}
              </div>
              <span className="text-base">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="mt-auto border-t border-slate-800 pt-8">
          <Link 
            to={`/profile/${user.username}`} 
            onClick={() => showToast('Visiting your profile')}
            className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-800 transition-all active:scale-95 border border-transparent hover:border-slate-700"
          >
            <div className="relative">
              <img src={user.avatar} className="h-11 w-11 rounded-2xl object-cover border-2 border-slate-700" alt={user.name} />
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-slate-900 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-500 font-medium truncate">@{user.username}</p>
            </div>
            <button 
              onClick={(e) => { e.preventDefault(); showToast('Account Settings'); }}
              className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </Link>
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
