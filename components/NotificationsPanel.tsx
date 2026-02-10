
import React from 'react';

// Fix for Error in file App.tsx on line 159: Property 'showToast' does not exist on type 'IntrinsicAttributes & NotificationsPanelProps'.
interface NotificationsPanelProps {
  onClose: () => void;
  showToast: (message: string, type?: 'info' | 'success' | 'warning') => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose, showToast }) => {
  const notifications = [
    { id: 1, user: 'Sarah Chen', action: 'liked your post', time: '2m ago', avatar: 'https://picsum.photos/seed/sarah/50' },
    { id: 2, user: 'Dev Guru', action: 'started following you', time: '1h ago', avatar: 'https://picsum.photos/seed/guru/50' },
    { id: 3, user: 'System', action: 'Your post has been boosted!', time: '3h ago', avatar: 'https://picsum.photos/seed/sys/50' },
  ];

  return (
    <div className="fixed top-16 right-4 md:right-8 w-full max-w-sm bg-slate-800 border border-slate-700 shadow-2xl rounded-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-300">
      <div className="p-4 bg-slate-900/50 border-b border-slate-700 flex justify-between items-center">
        <h3 className="font-bold">Notifications</h3>
        <button onClick={() => showToast('All notifications read', 'success')} className="text-xs text-blue-400 font-medium hover:underline">Mark all as read</button>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.map((n) => (
          <div key={n.id} className="p-4 hover:bg-slate-700/50 cursor-pointer transition-colors border-b border-slate-700/50 last:border-0 flex gap-3" onClick={() => showToast(`Opening ${n.action}`)}>
            <img src={n.avatar} className="h-10 w-10 rounded-full" alt="" />
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-bold">{n.user}</span> {n.action}
              </p>
              <p className="text-xs text-slate-500 mt-1">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 text-center border-t border-slate-700">
        <button className="text-sm font-medium text-slate-400 hover:text-slate-200" onClick={() => showToast('Loading all notifications')}>View all activity</button>
      </div>
    </div>
  );
};

export default NotificationsPanel;
