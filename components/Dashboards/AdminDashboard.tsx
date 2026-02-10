
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Fix for Error in file App.tsx on line 146: Property 'showToast' does not exist on type 'IntrinsicAttributes'.
interface AdminDashboardProps {
  showToast: (message: string, type?: 'info' | 'success' | 'warning') => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ showToast }) => {
  const data = [
    { name: 'Jan', active: 4000 },
    { name: 'Feb', active: 5200 },
    { name: 'Mar', active: 8000 },
    { name: 'Apr', active: 11000 },
    { name: 'May', active: 15400 },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-500 flex gap-3 mb-4">
         <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
         <p className="text-sm font-bold">Admin Alert: High traffic spike detected in "AI Researchers" community. Auto-scaling nodes activated.</p>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">System Overview</h2>
        <div className="px-4 py-2 bg-slate-800 rounded-xl border border-slate-700 text-sm font-medium" onClick={() => showToast('Systems verified', 'success')}>Status: <span className="text-green-500">All Systems Operational</span></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-3xl h-[400px]">
           <h3 className="text-lg font-bold mb-6">User Growth (MAU)</h3>
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Bar dataKey="active" fill="#3b82f6" radius={[6, 6, 0, 0]} />
             </BarChart>
           </ResponsiveContainer>
        </div>

        <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-3xl">
           <h3 className="text-lg font-bold mb-6">Recent Platform Events</h3>
           <div className="space-y-4">
              {[
                { time: '1m ago', msg: 'New Creator Verified: @art_king', type: 'user' },
                { time: '12m ago', msg: 'Moderation: 45 posts flagged by AI filter', type: 'security' },
                { time: '45m ago', msg: 'New Community Created: "Sustainable Living"', type: 'comm' },
                { time: '1h ago', msg: 'Database backup successfully completed', type: 'sys' },
              ].map((ev, i) => (
                <div key={i} className="flex gap-4 p-3 hover:bg-slate-700/30 rounded-xl transition-colors" onClick={() => showToast(`Event: ${ev.msg}`)}>
                   <div className="h-2 w-2 mt-2 rounded-full bg-blue-500"></div>
                   <div>
                      <p className="text-sm font-medium">{ev.msg}</p>
                      <p className="text-xs text-slate-500">{ev.time}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="bg-slate-800/40 border border-slate-700 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
           <h3 className="font-bold">User Management</h3>
           <input type="text" placeholder="Search user ID or email..." className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs w-64" />
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead className="bg-slate-900/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                 <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                 {[
                   { name: 'Sarah Chen', role: 'CREATOR', status: 'Active', date: 'Oct 2024' },
                   { name: 'John Doe', role: 'USER', status: 'Active', date: 'Nov 2024' },
                   { name: 'Bad Actor', role: 'USER', status: 'Suspended', date: 'Jan 2025' },
                   { name: 'Admin One', role: 'ADMIN', status: 'Active', date: 'Sep 2023' },
                 ].map((u, i) => (
                   <tr key={i} className="hover:bg-slate-700/20">
                      <td className="px-6 py-4 text-sm font-medium">{u.name}</td>
                      <td className="px-6 py-4"><span className="text-xs px-2 py-1 bg-slate-700 rounded-md">{u.role}</span></td>
                      <td className="px-6 py-4 text-sm">
                        <span className={u.status === 'Active' ? 'text-green-500' : 'text-red-500'}>{u.status}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{u.date}</td>
                      <td className="px-6 py-4">
                         <button onClick={() => showToast(`Editing ${u.name}`)} className="text-blue-500 hover:text-blue-400 text-sm font-bold">Edit</button>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
