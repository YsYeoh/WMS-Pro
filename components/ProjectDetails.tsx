
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PROJECTS, MOCK_CONTRACTS, MOCK_SOWS, MOCK_VENDORS, MOCK_WORKFLOWS, MOCK_TASKS, MOCK_LOCATIONS, MOCK_ASSETS, MOCK_SERVICES } from '../constants';
import { Contract, SOW } from '../types';
import { 
  FileText, 
  Plus, 
  ChevronRight, 
  Workflow, 
  User, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  CheckCircle, 
  Circle, 
  AlertCircle, 
  Settings,
  X,
  DollarSign,
  Briefcase,
  ShieldCheck,
  MapPin,
  Cpu,
  Target
} from 'lucide-react';

const ProjectDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'contracts' | 'sows'>('contracts');
  const [expandedSow, setExpandedSow] = useState<string | null>(null);
  
  // Local state for management
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS.filter(c => c.projectId === id));
  const [sows, setSows] = useState<SOW[]>(MOCK_SOWS.filter(s => contracts.some(c => c.id === s.contractId)));
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isSowModalOpen, setIsSowModalOpen] = useState(false);

  const [contractForm, setContractForm] = useState({
    title: '',
    vendorId: '',
    value: '',
    status: 'NEGOTIATING' as const
  });

  const [sowForm, setSowForm] = useState({
    title: '',
    description: '',
    contractId: '',
    locationId: '',
    assetId: '',
    subServiceId: '',
    workflowId: '',
    estimatedHours: '40',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  const project = MOCK_PROJECTS.find(p => p.id === id);

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    const newContract: Contract = {
      id: `c-${Date.now()}`,
      projectId: id!,
      vendorId: contractForm.vendorId,
      title: contractForm.title,
      value: Number(contractForm.value),
      status: contractForm.status as any
    };

    setContracts([...contracts, newContract]);
    setIsContractModalOpen(false);
    setContractForm({ title: '', vendorId: '', value: '', status: 'NEGOTIATING' });
  };

  const handleCreateSow = (e: React.FormEvent) => {
    e.preventDefault();
    const contract = contracts.find(c => c.id === sowForm.contractId);
    const newSow: SOW = {
      id: `sow-${Date.now()}`,
      contractId: sowForm.contractId,
      title: sowForm.title,
      description: sowForm.description,
      workflowDefinitionId: sowForm.workflowId,
      estimatedHours: Number(sowForm.estimatedHours),
      startDate: sowForm.startDate,
      endDate: sowForm.endDate,
      locationId: sowForm.locationId,
      assetId: sowForm.assetId || undefined,
      subServiceId: sowForm.subServiceId,
      vendorId: contract?.vendorId || ''
    };

    setSows([...sows, newSow]);
    setIsSowModalOpen(false);
  };

  if (!project) return (
    <div className="p-20 text-center animate-in fade-in duration-500">
      <AlertCircle size={64} className="mx-auto text-slate-200 mb-6" />
      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Project Record Not Found</h3>
      <p className="text-slate-500 font-medium mb-8">The requested identifier does not match any existing portfolio projects.</p>
      <button 
        onClick={() => navigate('/projects')} 
        className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all"
      >
        Return to Portfolio
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Header Info */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 opacity-50 z-0"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{project.name}</h2>
              <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                project.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-600 border-slate-100'
              }`}>{project.status}</span>
            </div>
            <p className="text-slate-500 max-w-2xl leading-relaxed font-medium text-lg">{project.description}</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 min-w-[240px] shadow-xl shadow-slate-100 flex flex-col justify-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
               <DollarSign size={12} className="text-blue-500" /> Total Project Allocation
            </p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">${project.budget.toLocaleString()}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-100/60 p-1.5 rounded-2xl mt-12 w-fit relative z-10 border border-slate-50">
          <button 
            onClick={() => setActiveTab('contracts')}
            className={`px-10 py-3.5 text-xs font-black rounded-xl transition-all uppercase tracking-widest ${activeTab === 'contracts' ? 'bg-white shadow-xl shadow-slate-200 text-blue-600 border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Signed Contracts ({contracts.length})
          </button>
          <button 
            onClick={() => setActiveTab('sows')}
            className={`px-10 py-3.5 text-xs font-black rounded-xl transition-all uppercase tracking-widest ${activeTab === 'sows' ? 'bg-white shadow-xl shadow-slate-200 text-blue-600 border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Statements of Work ({sows.length})
          </button>
        </div>
      </div>

      {/* Dynamic Content Based on Tab */}
      <div className="space-y-8">
        {activeTab === 'contracts' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {contracts.map(contract => {
              const vendor = MOCK_VENDORS.find(v => v.id === contract.vendorId);
              return (
                <div key={contract.id} className="bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-blue-400 hover:shadow-2xl hover:shadow-slate-200 transition-all flex flex-col shadow-sm group animate-in slide-in-from-bottom-4 duration-300">
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                      <FileText size={28} />
                    </div>
                    <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl tracking-widest uppercase border ${
                      contract.status === 'SIGNED' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-amber-600 bg-amber-50 border-amber-100'
                    }`}>
                      {contract.status}
                    </span>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{contract.title}</h4>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 shadow-inner">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Assigned Partner</p>
                      <p className="text-sm font-black text-slate-600">{vendor?.name || 'Pending Selection'}</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Execution Value</span>
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">${contract.value.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
            <button 
              onClick={() => setIsContractModalOpen(true)}
              className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 flex flex-col items-center justify-center gap-4 text-slate-400 hover:bg-blue-50/50 hover:text-blue-600 hover:border-blue-300 transition-all font-black text-sm group"
            >
              <div className="bg-white p-6 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                <Plus size={32} />
              </div>
              <span className="uppercase tracking-[0.2em] text-xs">Draft New Contract</span>
            </button>
          </div>
        )}

        {activeTab === 'sows' && (
          <div className="space-y-8">
            {sows.map(sow => {
              const workflow = MOCK_WORKFLOWS.find(w => w.id === sow.workflowDefinitionId);
              const sowTasks = MOCK_TASKS.filter(t => t.sowId === sow.id);
              const location = MOCK_LOCATIONS.find(l => l.id === sow.locationId);
              const asset = MOCK_ASSETS.find(a => a.id === sow.assetId);
              const subService = MOCK_SERVICES.flatMap(s => s.subServices).find(ss => ss.id === sow.subServiceId);
              const isExpanded = expandedSow === sow.id;

              return (
                <div key={sow.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all animate-in slide-in-from-bottom-4 duration-300">
                  <div className="flex flex-col lg:flex-row">
                    <div className="p-10 lg:w-2/3">
                      <div className="flex items-center gap-4 mb-6 flex-wrap">
                        <h4 className="text-3xl font-black text-slate-900 tracking-tight">{sow.title}</h4>
                        <div className="px-4 py-1.5 bg-amber-50 text-amber-700 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-amber-100">
                          <Workflow size={14} />
                          Active Engine Instance
                        </div>
                        {subService && (
                          <div className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">
                            {subService.name}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-6 mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="flex items-center gap-3">
                           <MapPin className="text-blue-600" size={20} />
                           <div>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                              <p className="text-xs font-black text-slate-900">{location?.name || 'General'}</p>
                           </div>
                        </div>
                        {asset && (
                           <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
                              <Cpu className="text-blue-600" size={20} />
                              <div>
                                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Primary Asset</p>
                                 <p className="text-xs font-black text-slate-900">{asset.name}</p>
                              </div>
                           </div>
                        )}
                      </div>

                      <p className="text-lg text-slate-500 mb-10 max-w-2xl leading-relaxed font-medium">{sow.description}</p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Calendar size={14} className="text-blue-500" /> Operational Span
                          </p>
                          <p className="text-xs font-black text-slate-800">{sow.startDate} <span className="text-slate-300 mx-1">→</span> {sow.endDate}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Clock size={14} className="text-blue-500" /> Effort Quota
                          </p>
                          <p className="text-xs font-black text-slate-800">{sow.estimatedHours} Labor Hours</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-blue-500" /> Verification
                          </p>
                          <div className="flex items-center gap-3">
                             <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-[50%]"></div>
                             </div>
                             <span className="text-[10px] font-black text-emerald-600">50%</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setExpandedSow(isExpanded ? null : sow.id)}
                          className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 self-end hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all"
                        >
                          {isExpanded ? 'Hide Schedule' : 'View Schedule'}
                          <ChevronRight size={16} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-10 lg:w-1/3 border-t lg:border-t-0 lg:border-l border-slate-100 flex flex-col justify-between">
                      <div>
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Engine Config</h5>
                        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-100 mb-8 flex items-center gap-5">
                          <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-100">
                             <Workflow size={28} />
                          </div>
                          <div>
                            <p className="text-lg font-black text-slate-900 tracking-tight">{workflow?.name}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{workflow?.states.length} Phases</p>
                          </div>
                        </div>
                        {sow.actualCost && (
                          <div className="p-6 bg-slate-900 text-white rounded-3xl mb-8 flex flex-col items-center">
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Settled Cost</p>
                             <p className="text-2xl font-black">${sow.actualCost.toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => navigate('/workflows/' + sow.workflowDefinitionId)}
                        className="w-full py-4 bg-white border border-slate-200 text-slate-800 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-all shadow-xl shadow-slate-100 flex items-center justify-center gap-3"
                      >
                        <Settings size={18} />
                        Engine Rules
                      </button>
                    </div>
                  </div>

                  {/* Tasks Section (Collapsible) */}
                  {isExpanded && (
                    <div className="px-10 pb-10 animate-in slide-in-from-top-4 duration-500">
                      <div className="pt-8 border-t border-slate-100">
                        <div className="flex justify-between items-center mb-8">
                           <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Milestones</h5>
                           <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-100">
                              <Plus size={14} /> Schedule Milestone
                           </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {sowTasks.map(task => (
                            <div key={task.id} className="p-6 bg-white border border-slate-100 rounded-3xl flex flex-col justify-between hover:border-blue-400 hover:shadow-xl hover:shadow-slate-100 transition-all group">
                              <div>
                                <div className="flex justify-between items-start mb-4">
                                   {task.status === 'COMPLETED' ? (
                                     <CheckCircle size={20} className="text-emerald-500" />
                                   ) : (
                                     <Circle size={20} className="text-slate-200 group-hover:text-blue-400 transition-colors" />
                                   )}
                                   <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                                     task.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                                   }`}>
                                     {task.status}
                                   </span>
                                </div>
                                <h6 className="text-sm font-black text-slate-900 mb-2 leading-tight">{task.title}</h6>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                  <Clock size={12} /> {task.scheduledAt}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <button 
              onClick={() => setIsSowModalOpen(true)}
              className="w-full border-2 border-dashed border-slate-200 rounded-[3rem] py-16 flex flex-col items-center justify-center gap-4 text-slate-400 hover:bg-blue-50/50 hover:text-blue-600 hover:border-blue-300 transition-all group"
            >
              <div className="p-8 bg-white rounded-3xl shadow-lg group-hover:scale-110 transition-transform">
                <Plus size={32} />
              </div>
              <span className="font-black text-sm uppercase tracking-[0.2em]">Initialize Statement of Work (SOW)</span>
            </button>
          </div>
        )}
      </div>

      {/* Contract Creation Modal */}
      {isContractModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-10 pt-10 pb-6 flex justify-between items-center border-b border-slate-50">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Draft Contract</h3>
              <button onClick={() => setIsContractModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"><X size={28} /></button>
            </div>
            <form onSubmit={handleCreateContract} className="p-10 space-y-8">
               {/* Simplified Form */}
               <input required placeholder="Contract Title" className="w-full bg-slate-50 border p-4 rounded-2xl font-bold" value={contractForm.title} onChange={e => setContractForm({...contractForm, title: e.target.value})} />
               <select required className="w-full bg-slate-50 border p-4 rounded-2xl font-bold" value={contractForm.vendorId} onChange={e => setContractForm({...contractForm, vendorId: e.target.value})}>
                 <option value="">Select Vendor...</option>
                 {MOCK_VENDORS.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
               </select>
               <input required type="number" placeholder="Budgeted Value" className="w-full bg-slate-50 border p-4 rounded-2xl font-bold" value={contractForm.value} onChange={e => setContractForm({...contractForm, value: e.target.value})} />
               <button type="submit" className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest shadow-xl">Ratify Draft</button>
            </form>
          </div>
        </div>
      )}

      {/* SOW Creation Modal (New) */}
      {isSowModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-10 pt-10 pb-6 flex justify-between items-center border-b border-slate-50">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Define Work Scope (SOW)</h3>
              <button onClick={() => setIsSowModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"><X size={28} /></button>
            </div>
            <form onSubmit={handleCreateSow} className="p-10 space-y-6 overflow-y-auto max-h-[70vh]">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2 col-span-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SOW Identifier</label>
                     <input required className="w-full bg-slate-50 border p-4 rounded-2xl font-bold" placeholder="e.g. Q1 HVAC Filter Change" value={sowForm.title} onChange={e => setSowForm({...sowForm, title: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Parent Contract</label>
                     <select required className="w-full bg-slate-50 border p-4 rounded-2xl font-bold" value={sowForm.contractId} onChange={e => setSowForm({...sowForm, contractId: e.target.value})}>
                        <option value="">Select Contract...</option>
                        {contracts.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nature of Service</label>
                     <select required className="w-full bg-slate-50 border p-4 rounded-2xl font-bold" value={sowForm.subServiceId} onChange={e => setSowForm({...sowForm, subServiceId: e.target.value})}>
                        <option value="">Choose Component...</option>
                        {MOCK_SERVICES.flatMap(s => s.subServices).map(ss => <option key={ss.id} value={ss.id}>{ss.name}</option>)}
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Location</label>
                     <select required className="w-full bg-slate-50 border p-4 rounded-2xl font-bold" value={sowForm.locationId} onChange={e => setSowForm({...sowForm, locationId: e.target.value})}>
                        <option value="">Choose Site...</option>
                        {MOCK_LOCATIONS.map(l => <option key={l.id} value={l.id}>{l.name} ({l.type})</option>)}
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Linked Asset (Optional)</label>
                     <select className="w-full bg-slate-50 border p-4 rounded-2xl font-bold" value={sowForm.assetId} onChange={e => setSowForm({...sowForm, assetId: e.target.value})}>
                        <option value="">General Site Maintenance</option>
                        {MOCK_ASSETS.filter(a => !sowForm.locationId || a.locationId === sowForm.locationId).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                     </select>
                  </div>
                  <div className="space-y-2 col-span-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Process Workflow Template</label>
                     <select required className="w-full bg-slate-50 border p-4 rounded-2xl font-bold" value={sowForm.workflowId} onChange={e => setSowForm({...sowForm, workflowId: e.target.value})}>
                        <option value="">Select Workflow...</option>
                        {MOCK_WORKFLOWS.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                     </select>
                  </div>
               </div>
               <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest shadow-xl mt-4">Establish Scope of Work</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
