
import React, { useState } from 'react';

// Fix for Error in file App.tsx on line 157: Property 'showToast' does not exist on type 'IntrinsicAttributes & ChatWindowProps'.
interface ChatWindowProps {
  onClose: () => void;
  showToast: (message: string, type?: 'info' | 'success' | 'warning') => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose, showToast }) => {
  const [msg, setMsg] = useState('');

  const handleSend = () => {
    if (!msg.trim()) return;
    showToast('Message sent!', 'success');
    setMsg('');
  };

  return (
    <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 w-full max-w-sm h-[500px] bg-slate-800 border border-slate-700 shadow-2xl rounded-2xl flex flex-col z-[60] animate-in slide-in-from-right-4 duration-300">
      <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src="https://picsum.photos/seed/chat/50" className="h-8 w-8 rounded-full" alt="" />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-slate-800 rounded-full"></span>
          </div>
          <div>
            <p className="text-sm font-bold">Sarah Chen</p>
            <p className="text-[10px] text-green-500">Active now</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex justify-start">
          <div className="bg-slate-700 p-3 rounded-2xl rounded-tl-none max-w-[80%]">
            <p className="text-sm">Hey! Did you check the new community guidelines for the AI group?</p>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-blue-600 p-3 rounded-2xl rounded-tr-none max-w-[80%]">
            <p className="text-sm text-white">Not yet, I'll take a look now. Is everything okay?</p>
          </div>
        </div>
        <div className="flex justify-start">
          <div className="bg-slate-700 p-3 rounded-2xl rounded-tl-none max-w-[80%]">
            <p className="text-sm">Yeah, just a few updates on the monetization structure. Looks promising!</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-700">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Type a message..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} className="bg-blue-600 hover:bg-blue-500 p-2 rounded-xl transition-colors">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
