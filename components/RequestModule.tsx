
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MOCK_REQUESTS, 
  MOCK_LOCATIONS, 
  MOCK_ASSETS, 
  MOCK_USERS, 
  MOCK_GROUPS,
  MOCK_WORKFLOWS
} from '../constants';
import { MaintenanceRequest, RequestPriority, RequestStatus } from '../types';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Cpu, 
  User, 
  Clock, 
  MoreVertical, 
  ArrowRightCircle, 
  X,
  AlertTriangle,
  CheckCircle2,
  Workflow,
  Zap
} from 'lucide-react';

const RequestModule: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<MaintenanceRequest[]>(MOCK_REQUESTS);
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [filter, setFilter] = useState<RequestStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  // Form State
  const [form, setForm] = useState({
    title: '',
    description: '',
    locationId: '',
    assetId: '',
    priority: 'MEDIUM' as RequestPriority
  });

  const filteredRequests = requests.filter(r => {
    const matchesFilter = filter === 'ALL' || r.status === filter;
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                          r.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: MaintenanceRequest = {
      id: `req-${Date.now().toString().slice(-4)}`,
      tenantId: 't1',
      title: form.title,
      description: form.description,
      locationId: form.locationId,
      assetId: form.assetId || undefined,
      priority: form.priority,
      status: 'SUBMITTED',
      reportedBy: 'Current User',
      createdAt: new Date().toISOString()
    };
    setRequests([newReq, ...requests]);
    setIsNewRequestModalOpen(false);
    setForm({ title: '', description: '', locationId: '', assetId: '', priority: 'MEDIUM' });
  };

  const getPriorityStyle = (p: RequestPriority) => {
    switch (p) {
      case 'URGENT': return 'bg-red-500 text-white border-red-600 shadow-red-100 animate-pulse';
      case 'HIGH': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'MEDIUM': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getStatusBadge = (s: RequestStatus) => {
    switch (s) {
      case 'SUBMITTED': return <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-xl text-[10px] font-black border border-indigo-100">NEW</span>;
      case 'ASSIGNED': return <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-xl text-[10px] font-black border border-amber-100">QUEUED</span>;
      case 'IN_PROGRESS': return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black border border-emerald-100">ACTIVE</span>;
      default: return <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black border border-slate-200">{s}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
             <MessageSquare className="text-blue-600" /> Help Desk Triage
          </h2>
          <p className="text-slate-500 font-medium">Issue reporting and resolution dispatch for physical infrastructure.</p>
        </div>
        <button 
          onClick={() => setIsNewRequestModalOpen(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center gap-3 active:scale-95"
        >
          <Zap size={18} className="fill-white" />
          Report Failure
        </button>
      </div>

      {/* Triage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-300 transition-all">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Response MTTR</p>
               <h4 className="text-3xl font-black text-slate-900">18m</h4>
            </div>
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
               <Clock size={24} />
            </div>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between group hover:border-red-300 transition-all">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Urgent Pending</p>
               <h4 className="text-3xl font-black text-red-600">{requests.filter(r => r.priority === 'URGENT' && r.status !== 'RESOLVED').length}</h4>
            </div>
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl group-hover:scale-110 transition-transform">
               <AlertTriangle size={24} />
            </div>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-300 transition-all">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">New Tickets</p>
               <h4 className="text-3xl font-black text-indigo-600">{requests.filter(r => r.status === 'SUBMITTED').length}</h4>
            </div>
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
               <Zap size={24} />
            </div>
         </div>
         <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl flex items-center justify-between group">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fixed Today</p>
               <h4 className="text-3xl font-black">12</h4>
            </div>
            <div className="p-4 bg-white/10 text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform">
               <CheckCircle2 size={24} />
            </div>
         </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-12 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all" 
            placeholder="Search tickets by ID or title..." 
          />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 lg:pb-0">
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-100 rounded-2xl px-8 py-4 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Global Status</option>
            <option value="SUBMITTED">Newly Reported</option>
            <option value="ASSIGNED">Queued / Assigned</option>
            <option value="IN_PROGRESS">Active Work</option>
            <option value="RESOLVED">Resolved</option>
          </select>
          <button className="px-6 py-4 border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-600 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Request Feed */}
      <div className="grid grid-cols-1 gap-6">
        {filteredRequests.map(req => {
          const location = MOCK_LOCATIONS.find(l => l.id === req.locationId);
          const asset = MOCK_ASSETS.find(a => a.id === req.assetId);
          
          return (
            <div 
              key={req.id}
              className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all group"
            >
              <div className="p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border flex items-center gap-2 ${getPriorityStyle(req.priority)}`}>
                       {req.priority === 'URGENT' && <Zap size={10} className="fill-white" />}
                       {req.priority}
                    </span>
                    {getStatusBadge(req.status)}
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-auto lg:ml-0"># {req.id}</span>
                  </div>

                  <div>
                     <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{req.title}</h3>
                     <p className="text-slate-500 font-medium mt-2 leading-relaxed max-w-2xl">{req.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-8 pt-4 border-t border-slate-50">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 text-blue-500 rounded-lg">
                           <MapPin size={16} />
                        </div>
                        <div>
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Target Zone</p>
                           <p className="text-xs font-black text-slate-700 uppercase tracking-tight">{location?.name}</p>
                        </div>
                     </div>
                     {asset && (
                        <div className="flex items-center gap-3 border-l border-slate-100 pl-8">
                           <div className="p-2 bg-slate-50 text-indigo-500 rounded-lg">
                              <Cpu size={16} />
                           </div>
                           <div>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Asset ID</p>
                              <p className="text-xs font-black text-slate-700 uppercase tracking-tight">{asset.name}</p>
                           </div>
                        </div>
                     )}
                     <div className="flex items-center gap-3 border-l border-slate-100 pl-8">
                        <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                           <User size={16} />
                        </div>
                        <div>
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Reported By</p>
                           <p className="text-xs font-black text-slate-700 uppercase tracking-tight">{req.reportedBy}</p>
                        </div>
                     </div>
                  </div>
                </div>

                <div className="lg:w-64 space-y-4">
                   {req.workflowInstanceId ? (
                     <button 
                       onClick={() => navigate(`/instance/${req.workflowInstanceId}`)}
                       className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all"
                     >
                       <Workflow size={18} />
                       Active Engine
                       <ArrowRightCircle size={18} />
                     </button>
                   ) : (
                     <button 
                       onClick={() => {
                          const instId = `inst-${Date.now()}`;
                          navigate(`/instance/inst1`); // Demo redirection
                       }}
                       className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
                     >
                       <Zap size={18} fill="white" />
                       Fix Quick
                       <ArrowRightCircle size={18} />
                     </button>
                   )}
                   <button className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] border-2 border-slate-100 rounded-[1.5rem] hover:bg-slate-50 transition-all">
                      Assign Partner
                   </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Request Modal */}
      {isNewRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-12 border-b border-slate-50 flex justify-between items-center">
                 <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Report Infrastructure Issue</h3>
                    <p className="text-slate-500 font-medium">Capture high-fidelity details for technician resolution.</p>
                 </div>
                 <button onClick={() => setIsNewRequestModalOpen(false)} className="p-4 hover:bg-slate-100 rounded-3xl text-slate-400 transition-all"><X size={24} /></button>
              </div>

              <form onSubmit={handleCreateRequest} className="p-12 space-y-8 overflow-y-auto max-h-[70vh]">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Failure Description</label>
                    <input 
                      required 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all" 
                      placeholder="e.g. Roof leak in Server Room A" 
                      value={form.title}
                      onChange={e => setForm({...form, title: e.target.value})}
                    />
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all min-h-[120px]" 
                      placeholder="Provide specific context or error codes..." 
                      value={form.description}
                      onChange={e => setForm({...form, description: e.target.value})}
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Physical Zone</label>
                       <select 
                         required 
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                         value={form.locationId}
                         onChange={e => setForm({...form, locationId: e.target.value})}
                       >
                          <option value="">Select location...</option>
                          {MOCK_LOCATIONS.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                       </select>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Specific Asset</label>
                       <select 
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                         value={form.assetId}
                         onChange={e => setForm({...form, assetId: e.target.value})}
                       >
                          <option value="">N/A (General Zone)</option>
                          {MOCK_ASSETS.filter(a => !form.locationId || a.locationId === form.locationId).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                       </select>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Criticality Level</label>
                    <div className="grid grid-cols-4 gap-4">
                       {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as RequestPriority[]).map(p => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setForm({...form, priority: p})}
                            className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                               form.priority === p 
                               ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200 scale-105' 
                               : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                            }`}
                          >
                             {p}
                          </button>
                       ))}
                    </div>
                 </div>

                 <button type="submit" className="w-full bg-blue-600 text-white py-8 rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all mt-6">
                    Submit Triage Ticket
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default RequestModule;
