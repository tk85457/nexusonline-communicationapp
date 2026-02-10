
import React, { useState, useRef } from 'react';
import { User, Post } from '../types.ts';
import { geminiService } from '../services/gemini.ts';

interface CreatePostModalProps {
  onClose: () => void;
  onPost: (post: Post) => void;
  user: User;
  showToast: (message: string, type?: 'info' | 'success' | 'warning') => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onPost, user, showToast }) => {
  const [content, setContent] = useState('');
  const [isModerating, setIsModerating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) { 
        setError("Video size exceeds 100MB limit.");
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setError(null);
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setUploadProgress(null);
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!content.trim() && !videoFile) return;
    if (uploadProgress !== null && uploadProgress < 100) return;

    setIsModerating(true);
    setError(null);

    // AI-Powered Content Moderation
    showToast('AI is checking your content for safety...', 'info');
    const moderationResult = await geminiService.moderateContent(content);
    
    if (!moderationResult.safe) {
      setError(`Blocked by AI: ${moderationResult.reason}`);
      showToast('Post flagged by safety filters', 'warning');
      setIsModerating(false);
      return;
    }

    const newPost: Post = {
      id: Math.random().toString(36).substr(2, 9),
      authorId: user.id,
      authorName: user.name,
      authorUsername: user.username,
      authorAvatar: user.avatar,
      content,
      type: videoFile ? 'video' : 'text',
      mediaUrls: videoPreview ? [videoPreview] : [],
      hashtags: content.match(/#\w+/g) || [],
      likes: 0,
      comments: 0,
      reposts: 0,
      createdAt: new Date().toISOString()
    };

    onPost(newPost);
    setIsModerating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-slate-800 border border-slate-700 w-full max-w-xl rounded-[2.5rem] shadow-2xl relative animate-in fade-in zoom-in duration-300 overflow-hidden">
        <div className="p-6 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-500/10 rounded-xl">
               <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
               </svg>
             </div>
             <h2 className="text-xl font-black tracking-tight">Compose Nexus</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[70vh]">
          <div className="flex gap-5">
            <img src={user.avatar} className="h-14 w-14 rounded-2xl border-2 border-slate-700 shadow-lg" alt="" />
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share something meaningful..."
                className="w-full bg-transparent border-none focus:ring-0 text-xl resize-none min-h-[120px] placeholder:text-slate-600 font-medium leading-relaxed"
                autoFocus
              />

              {videoPreview && (
                <div className="relative mt-6 rounded-[2rem] overflow-hidden bg-slate-900 border border-slate-700 shadow-2xl group/preview">
                  <video src={videoPreview} className="w-full max-h-72 object-contain" controls />
                  <button 
                    onClick={removeVideo}
                    className="absolute top-4 right-4 bg-black/60 backdrop-blur-md hover:bg-black/80 p-2 rounded-2xl text-white transition-all active:scale-90 border border-white/10"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  {uploadProgress !== null && uploadProgress < 100 && (
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center p-8">
                      <div className="w-full max-w-xs h-3 bg-slate-800 rounded-full overflow-hidden mb-4 shadow-inner">
                        <div className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                      <span className="text-white text-sm font-black uppercase tracking-widest">Optimizing Media {uploadProgress}%</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-8 p-5 bg-red-500/10 border border-red-500/30 rounded-3xl text-red-400 text-sm flex gap-4 items-start animate-in slide-in-from-top-4 duration-300">
              <svg className="h-6 w-6 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="space-y-1">
                <p className="font-black uppercase tracking-wider text-xs">AI Safety Alert</p>
                <p className="font-medium opacity-90">{error}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-700 bg-slate-900/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => showToast('Image picker enabled', 'info')}
              className="p-3 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-2xl transition-all active:scale-90"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </button>
            <button 
              onClick={() => videoInputRef.current?.click()}
              className="p-3 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-2xl transition-all active:scale-90"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>
            <input 
              type="file" 
              hidden 
              accept="video/*" 
              ref={videoInputRef} 
              onChange={handleVideoSelect} 
            />
            <button 
              onClick={() => showToast('AI Assistant suggested: #nexus #future', 'success')}
              className="p-3 text-slate-400 hover:text-purple-400 hover:bg-purple-400/10 rounded-2xl transition-all active:scale-90"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={(!content.trim() && !videoFile) || isModerating || (uploadProgress !== null && uploadProgress < 100)}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white px-10 py-3.5 rounded-[1.25rem] font-black transition-all active:scale-95 flex items-center gap-3 shadow-xl shadow-blue-500/20"
          >
            {isModerating ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full"></div>
                AI Check...
              </>
            ) : (
              'Publish Post'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
