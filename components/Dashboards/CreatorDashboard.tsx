
import React, { useState, useEffect } from 'react';
import { User } from '../../types.ts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { geminiService } from '../../services/gemini.ts';

const data = [
  { name: 'Mon', followers: 10400, views: 2400 },
  { name: 'Tue', followers: 10600, views: 1398 },
  { name: 'Wed', followers: 11200, views: 9800 },
  { name: 'Thu', followers: 11400, views: 3908 },
  { name: 'Fri', followers: 11900, views: 4800 },
  { name: 'Sat', followers: 12200, views: 3800 },
  { name: 'Sun', followers: 12400, views: 4300 },
];

interface CreatorDashboardProps {
  user: User | null;
  showToast: (m: string) => void;
}

const CreatorDashboard: React.FC<CreatorDashboardProps> = ({ user, showToast }) => {
  const [insight, setInsight] = useState<string>('Analyzing your data...');
  const [isInsightLoading, setIsInsightLoading] = useState(false);

  useEffect(() => {
    fetchInsight();
  }, []);

  const fetchInsight = async () => {
    setIsInsightLoading(true);
    setInsight('Gemini is processing your growth patterns...');
    const summary = "Follower count grew from 10.4k to 12.4k this week. Peak views occurred on Wednesday with 9.8k views.";
    const text = await geminiService.explainAnalytics(summary);
    setInsight(text);
    setIsInsightLoading(false);
  };

  const handleAction = (action: string) => {
    showToast(`${action} action triggered!`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter">Creator Studio</h2>
          <p className="text-slate-400 font-medium">Powering your digital empire on Nexus.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleAction('Change Range')}
            className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-2xl text-sm font-bold transition-all active:scale-95 border border-slate-700"
          >
            Last 7 Days
          </button>
          <button 
            onClick={() => handleAction('Export Data')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/20"
          >
            Export Analytics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Followers', value: '12,400', change: '+12.5%', color: 'text-blue-500' },
          { label: 'Total Reach', value: '842k', change: '+4.2%', color: 'text-green-500' },
          { label: 'Engagement Rate', value: '8.4%', change: '-0.8%', color: 'text-yellow-500' },
          { label: 'Monetization', value: '$2,450', change: '+18%', color: 'text-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-800/30 border border-slate-800 p-6 rounded-[2rem] hover:border-slate-700 transition-all cursor-default group">
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2 group-hover:text-slate-400 transition-colors">{stat.label}</p>
            <p className="text-3xl font-black mb-3">{stat.value}</p>
            <p className={`text-xs font-black flex items-center gap-1 ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
              <svg className={`h-3 w-3 ${stat.change.startsWith('+') ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 15l7-7 7 7" /></svg>
              {stat.change} <span className="text-slate-600 font-bold uppercase ml-1">v/s week</span>
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-800/30 border border-slate-800 p-8 rounded-[2.5rem] h-[450px] shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black tracking-tight">Growth Metrics</h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-blue-400 bg-blue-400/10 px-3 py-1.5 rounded-full"><span className="h-2 w-2 rounded-full bg-blue-400"></span> Followers</span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-400/10 px-3 py-1.5 rounded-full"><span className="h-2 w-2 rounded-full bg-green-400"></span> Views</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="5 5" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#475569" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
              <YAxis stroke="#475569" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
              />
              <Line type="monotone" dataKey="followers" stroke="#3b82f6" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, fill: '#0f172a' }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="views" stroke="#10b981" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, fill: '#0f172a' }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gradient-to-br from-indigo-950/40 to-blue-950/40 border border-indigo-500/20 p-8 rounded-[2.5rem] flex flex-col shadow-2xl shadow-blue-500/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-32 w-32 bg-blue-500/10 blur-3xl -mr-16 -mt-16 rounded-full group-hover:bg-blue-500/20 transition-all"></div>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-indigo-500/20 rounded-2xl shadow-lg border border-indigo-500/20">
              <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-black tracking-tight">AI Strategist</h3>
          </div>
          <div className="flex-1 text-slate-300 text-sm leading-relaxed space-y-4 overflow-y-auto max-h-[300px] scrollbar-hide pr-2">
            <p className={`${isInsightLoading ? 'animate-pulse text-indigo-400' : ''}`}>{insight}</p>
          </div>
          <button 
            onClick={() => { handleAction('AI Strategy Generation'); fetchInsight(); }}
            disabled={isInsightLoading}
            className="mt-8 w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.25rem] text-sm font-black transition-all active:scale-95 shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            {isInsightLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full"></div>
            ) : (
              'Generate New Strategy'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
