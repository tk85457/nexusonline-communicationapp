
import React from 'react';
import { Toast } from '../App.tsx';

interface ToastContainerProps {
  toasts: Toast[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 flex flex-col gap-3 z-[200] pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10 fade-in duration-300 pointer-events-auto border-l-4 ${
            toast.type === 'success' ? 'bg-green-950/80 border-green-500 text-green-200' :
            toast.type === 'warning' ? 'bg-yellow-950/80 border-yellow-500 text-yellow-200' :
            'bg-slate-800/95 border-blue-500 text-white'
          } backdrop-blur-md border border-white/5 ring-1 ring-white/10`}
        >
          {toast.type === 'success' && (
            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {toast.type === 'info' && (
            <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="text-sm font-bold tracking-tight">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
