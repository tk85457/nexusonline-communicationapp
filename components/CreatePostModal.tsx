
import React, { useState, useRef } from 'react';
import { User, Post } from '../types';
import { geminiService } from '../services/gemini';

// Fix for Error in file App.tsx on line 158: Property 'showToast' does not exist on type 'IntrinsicAttributes & CreatePostModalProps'.
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
      if (file.size > 100 * 1024 * 1024) { // 100MB limit for demo
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

    // AI Content Moderation Step
    const moderationResult = await geminiService.moderateContent(content);
    
    if (!moderationResult.safe) {
      setError(`Your post violates community guidelines: ${moderationResult.reason}`);
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
      hashtags: [],
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
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-slate-800 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-lg font-bold">New Post</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="flex gap-4">
            <img src={user.avatar} className="h-12 w-12 rounded-full" alt="" />
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's happening?"
                className="w-full bg-transparent border-none focus:ring-0 text-xl resize-none min-h-[100px] placeholder:text-slate-500"
              />

              {videoPreview && (
                <div className="relative mt-4 rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
                  <video src={videoPreview} className="w-full max-h-64 object-cover" controls />
                  <button 
                    onClick={removeVideo}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 p-1.5 rounded-full text-white transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  {uploadProgress !== null && uploadProgress < 100 && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4">
                      <div className="w-full max-w-xs h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                      <span className="text-white text-xs font-bold">Uploading {uploadProgress}%</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm flex gap-2 items-center">
              <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-4 text-blue-500">
            <button className="hover:bg-blue-500/10 p-2 rounded-full transition-colors" onClick={() => showToast('Image upload coming soon!')}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </button>
            <button 
              onClick={() => videoInputRef.current?.click()}
              className="hover:bg-blue-500/10 p-2 rounded-full transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>
            <input 
              type="file" 
              hidden 
              accept="video/*" 
              ref={videoInputRef} 
              onChange={handleVideoSelect} 
            />
            <button className="hover:bg-blue-500/10 p-2 rounded-full transition-colors" onClick={() => showToast('Polls coming soon!')}><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={(!content.trim() && !videoFile) || isModerating || (uploadProgress !== null && uploadProgress < 100)}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white px-6 py-2 rounded-full font-bold transition-colors flex items-center gap-2"
          >
            {isModerating ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full"></div>
                Checking Safety...
              </>
            ) : (
              'Post'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
