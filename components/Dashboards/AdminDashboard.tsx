
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminDashboardProps {
  showToast: (message: string, type?: 'info' | 'success' | 'warning') => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ showToast }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const data = [
    { name: 'Jan', active: 4000 },
    { name: 'Feb', active: 5200 },
    { name: 'Mar', active: 8000 },
    { name: 'Apr', active: 11000 },
    { name: 'May', active: 15400 },
  ];

  const handleUserSearch = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Searching for user: ${searchTerm}`, 'info');
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto animate-in fade-in duration-500">
      {/* Critical Alert Header */}
      <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-[2rem] text-red-400 flex items-start gap-4 shadow-xl shadow-red-950/10">
         <div className="bg-red-500/20 p-2 rounded-xl">
           <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
         </div>
         <div className="flex-1">
           <p className="text-sm font-black uppercase tracking-widest mb-1">Infrastructure Alert</p>
           <p className="text-sm font-medium opacity-90 leading-relaxed">System detected a high traffic surge in 'AI Researchers'. Auto-scaling protocols active across Node Cluster B-12. Latency stable at 45ms.</p>
         </div>
         <button onClick={() => showToast('Alert acknowledged', 'success')} className="px-4 py-2 bg-red-500 text-white text-xs font-black rounded-xl hover:bg-red-400 active:scale-90 transition-all">Resolve</button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter">Command Center</h2>
          <p className="text-slate-500 font-medium">Global platform health and entity management.</p>
        </div>
        <button 
          onClick={() => showToast('Full system health check initialized...', 'info')}
          className="group px-6 py-3 bg-slate-900 hover:bg-slate-800 rounded-2xl border border-slate-800 text-sm font-bold flex items-center gap-3 transition-all active:scale-95 shadow-lg"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          Status: Operational
        </button>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[3rem] h-[450px] shadow-sm flex flex-col">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black tracking-tight">User Acquisition</h3>
              <select className="bg-slate-950 border border-slate-800 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:ring-1 ring-blue-500">
                <option>Monthly View</option>
                <option>Weekly View</option>
              </select>
           </div>
           <div className="flex-1">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#475569" axisLine={false} tickLine={false} fontSize={12} fontWeight="bold" />
                  <YAxis stroke="#475569" axisLine={false} tickLine={false} fontSize={12} fontWeight="bold" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    cursor={{ fill: '#1e293b' }}
                  />
                  <Bar dataKey="active" fill="#2563eb" radius={[12, 12, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[3rem] shadow-sm">
           <h3 className="text-xl font-black tracking-tight mb-8">Event Logs</h3>
           <div className="space-y-5">
              {[
                { time: '1m ago', msg: 'New Creator Verified: @art_king', type: 'user', icon: '👤' },
                { time: '12m ago', msg: 'Moderation: 45 posts flagged by Gemini', type: 'security', icon: '🛡️' },
                { time: '45m ago', msg: 'New Community: "Sustainable Living"', type: 'comm', icon: '🌍' },
                { time: '1h ago', msg: 'System Backup Complete (640GB)', type: 'sys', icon: '💾' },
              ].map((ev, i) => (
                <div 
                  key={i} 
                  className="flex gap-5 p-4 bg-slate-950/30 hover:bg-slate-800 border border-transparent hover:border-slate-700 rounded-[2rem] transition-all cursor-pointer group"
                  onClick={() => showToast(`Opening Log Detail: ${ev.msg}`)}
                >
                   <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                      {ev.icon}
                   </div>
                   <div className="flex-1">
                      <p className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{ev.msg}</p>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{ev.time} • Global Server A</p>
                   </div>
                   <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                     <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                   </div>
                </div>
              ))}
           </div>
           <button onClick={() => showToast('Full audit trail loading...')} className="w-full mt-8 py-4 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-all">View All Activity</button>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-[3rem] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-950/30">
           <div>
             <h3 className="text-xl font-black tracking-tight">Entity Directory</h3>
             <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">45,201 Active Entities</p>
           </div>
           <form onSubmit={handleUserSearch} className="relative w-full md:w-80 group">
             <input 
               type="text" 
               placeholder="Filter by ID, email, or role..." 
               className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3 text-sm font-medium focus:ring-1 ring-blue-500 outline-none"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
             <button type="submit" className="absolute right-4 top-3.5 text-slate-500 group-hover:text-blue-500 transition-colors">
               <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </button>
           </form>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
              <thead className="bg-slate-950 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-800">
                 <tr>
                    <th className="px-10 py-6">Identity</th>
                    <th className="px-10 py-6">Designation</th>
                    <th className="px-10 py-6">State</th>
                    <th className="px-10 py-6">Registered</th>
                    <th className="px-10 py-6 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                 {[
                   { name: 'Sarah Chen', role: 'CREATOR', status: 'Active', date: 'Oct 2024', email: 'sarah@dev.com' },
                   { name: 'John Doe', role: 'USER', status: 'Active', date: 'Nov 2024', email: 'john@user.net' },
                   { name: 'Bad Actor', role: 'USER', status: 'Suspended', date: 'Jan 2025', email: 'mal@ware.io' },
                   { name: 'Admin One', role: 'ADMIN', status: 'Active', date: 'Sep 2023', email: 'hq@nexus.io' },
                 ].map((u, i) => (
                   <tr key={i} className="hover:bg-slate-900/50 transition-colors group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center font-bold text-blue-400">{u.name.charAt(0)}</div>
                          <div>
                            <p className="text-sm font-black text-slate-100">{u.name}</p>
                            <p className="text-xs text-slate-500 font-medium">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="text-[10px] font-black px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300 border border-slate-700 uppercase tracking-widest">{u.role}</span>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-2">
                          <div className={`h-1.5 w-1.5 rounded-full ${u.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                          <span className={`text-sm font-bold ${u.status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>{u.status}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-sm font-medium text-slate-400">{u.date}</td>
                      <td className="px-10 py-6 text-right">
                         <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => showToast(`Editing identity: ${u.name}`)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all">
                               <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button onClick={() => showToast(`Restriction requested for ${u.name}`, 'warning')} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                               <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                            </button>
                         </div>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
        <div className="p-8 bg-slate-950/50 flex justify-center">
           <button onClick={() => showToast('Next identity cluster loading...')} className="text-sm font-black text-blue-500 hover:text-blue-400 flex items-center gap-2 group transition-all">
             View More Entities
             <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
           </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
