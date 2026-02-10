
import React, { useState } from 'react';

interface Report {
  id: number;
  type: string;
  user: string;
  content: string;
  severity: 'High' | 'Medium' | 'Low';
}

// Fix for Error in file App.tsx on line 147: Property 'showToast' does not exist on type 'IntrinsicAttributes'.
interface ModeratorDashboardProps {
  showToast: (message: string, type?: 'info' | 'success' | 'warning') => void;
}

const ModeratorDashboard: React.FC<ModeratorDashboardProps> = ({ showToast }) => {
  const [reports, setReports] = useState<Report[]>([
    { id: 1, type: 'Spam', user: 'bot_99', content: 'Buy crypto now! Link below...', severity: 'Medium' },
    { id: 2, type: 'Hate Speech', user: 'hater123', content: 'This is a simulated offensive post that violates our community guidelines regarding respectful discourse.', severity: 'High' },
    { id: 3, type: 'Misinformation', user: 'news_leak', content: 'Secret society controls the weather using giant fans in the Antarctic...', severity: 'Low' },
  ]);

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const handleAction = (action: string) => {
    console.log(`Report ${selectedReport?.id} - Action: ${action}`);
    // In a real app, we would call an API here
    if (selectedReport) {
      setReports(prev => prev.filter(r => r.id !== selectedReport.id));
      showToast(`Report #${selectedReport.id} ${action}ed`, 'success');
    }
    setSelectedReport(null);
  };

  return (
    <div className="space-y-6 relative">
      <div>
        <h2 className="text-3xl font-bold">Moderation Queue</h2>
        <p className="text-slate-400">Review flagged content and maintain community safety.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700 shadow-sm">
            <p className="text-sm text-slate-500 mb-1 font-medium">Queue Size</p>
            <p className="text-2xl font-bold">{reports.length}</p>
         </div>
         <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700 shadow-sm">
            <p className="text-sm text-slate-500 mb-1 font-medium">AI Pre-filtered</p>
            <p className="text-2xl font-bold">1,205</p>
         </div>
         <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700 shadow-sm">
            <p className="text-sm text-slate-500 mb-1 font-medium">Resolved Today</p>
            <p className="text-2xl font-bold">84</p>
         </div>
      </div>

      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
            <p className="text-slate-500">Moderation queue is empty. Great job!</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="bg-slate-800/60 border border-slate-700 p-6 rounded-3xl flex flex-col md:flex-row gap-6 hover:border-slate-600 transition-colors">
               <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${
                      report.severity === 'High' ? 'bg-red-500/20 text-red-500' : 
                      report.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' : 
                      'bg-blue-500/20 text-blue-500'
                    }`}>
                      {report.severity} Priority
                    </span>
                    <span className="text-slate-500 text-xs">Reported for: <span className="text-slate-300 font-bold">{report.type}</span></span>
                  </div>
                  <p className="text-sm text-slate-400 mb-2 font-medium">User: @{report.user}</p>
                  <div className="p-4 bg-slate-900/50 rounded-xl text-slate-300 italic text-sm line-clamp-2">
                    "{report.content}"
                  </div>
               </div>
               <div className="flex flex-row md:flex-col gap-2 justify-center shrink-0 min-w-[140px]">
                  <button 
                    onClick={() => setSelectedReport(report)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors text-white flex items-center justify-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Review
                  </button>
                  <button 
                    onClick={() => { setReports(prev => prev.filter(r => r.id !== report.id)); showToast(`Dismissed report #${report.id}`); }}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-xl text-sm font-bold transition-colors text-slate-200"
                  >
                    Dismiss
                  </button>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedReport(null)}></div>
          <div className="bg-slate-800 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl relative animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="p-6 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Review Content</h3>
                <p className="text-xs text-slate-500">Report ID: #{selectedReport.id} • Reported for {selectedReport.type}</p>
              </div>
              <button onClick={() => setSelectedReport(null)} className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 bg-slate-700 rounded-full flex items-center justify-center text-xl font-bold text-slate-400">
                  {selectedReport.user.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-lg">@{selectedReport.user}</p>
                  <p className="text-sm text-slate-500">User account age: 14 months • 0 previous violations</p>
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 mb-8">
                <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedReport.content}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => handleAction('Approve')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Approve Content
                </button>
                <button 
                  onClick={() => handleAction('Remove')}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/20"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove Content
                </button>
                <button 
                  onClick={() => handleAction('Escalate')}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Escalate Report
                </button>
              </div>
            </div>

            <div className="px-8 py-4 bg-slate-900/30 text-xs text-slate-500 border-t border-slate-700 flex items-center justify-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Actions will be logged and may be subject to audit.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeratorDashboard;
