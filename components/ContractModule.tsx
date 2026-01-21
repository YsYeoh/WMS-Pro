
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MOCK_CONTRACTS, 
  MOCK_PROJECTS, 
  MOCK_SOWS, 
  MOCK_TASKS, 
  MOCK_VENDORS, 
  MOCK_SERVICES,
  MOCK_CHECKLISTS,
  MOCK_USERS,
  MOCK_GROUPS,
  MOCK_LOCATIONS,
  MOCK_WORKFLOWS,
  MOCK_ASSETS
} from '../constants';
import { Project, Contract, SOW, ScheduledTask, FrequencyType, RequestPriority, Vendor } from '../types';
import { 
  Handshake, 
  Briefcase, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  Cpu, 
  Wrench, 
  ListTodo, 
  X, 
  ShieldCheck, 
  DollarSign,
  Users,
  Repeat,
  Target,
  CheckCircle2,
  ClipboardList,
  Layers,
  Type,
  FileText,
  Workflow,
  Zap,
  Info,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';

const FREQUENCY_OPTIONS: { label: string; value: FrequencyType }[] = [
  { label: 'Ad-hoc (One-time)', value: 'ADHOC' },
  { label: 'Daily Recurrence', value: 'DAILY' },
  { label: 'Weekly Schedule', value: 'WEEKLY' },
  { label: 'Monthly Anchor', value: 'MONTHLY' }
];

const ContractModule: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
  const [sows, setSows] = useState<SOW[]>(MOCK_SOWS);
  const [tasks, setTasks] = useState<ScheduledTask[]>(MOCK_TASKS);
  
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set(['p1']));
  const [expandedContracts, setExpandedContracts] = useState<Set<string>>(new Set());
  const [expandedSows, setExpandedSows] = useState<Set<string>>(new Set());

  // Modal States
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeContract, setActiveContract] = useState<Contract | null>(null);
  const [activeSow, setActiveSow] = useState<SOW | null>(null);
  
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isSowModalOpen, setIsSowModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Forms
  const [contractForm, setContractForm] = useState({
    title: '', description: '', value: '', startDate: '', endDate: '', serviceIds: [] as string[], vendorId: '', sorSetId: ''
  });

  const [sowForm, setSowForm] = useState({
    title: '', description: '', serviceId: '', workflowId: '', locationIds: [] as string[], startDate: '', endDate: '', defaultFrequency: 'ADHOC' as FrequencyType
  });

  const [taskForm, setTaskForm] = useState({
    title: '', description: '', checklistId: '', priority: 'MEDIUM' as RequestPriority, startTime: '', endTime: '', frequency: 'ADHOC' as FrequencyType, assignedToIds: [] as string[], locationId: '', assetId: '', frequencyConfig: {} as any
  });

  const toggle = (id: string, set: Set<string>, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setter(next);
  };

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;
    const newContract: Contract = {
      id: `c-${Date.now()}`,
      projectId: activeProject.id,
      title: contractForm.title,
      description: contractForm.description,
      value: Number(contractForm.value),
      status: 'NEGOTIATING',
      startDate: contractForm.startDate,
      endDate: contractForm.endDate,
      serviceIds: contractForm.serviceIds,
      vendorMode: contractForm.vendorId ? 'OUTSOURCE' : 'IN_HOUSE',
      eligibleVendorIds: contractForm.vendorId ? [contractForm.vendorId] : [],
      vendorId: contractForm.vendorId || undefined,
      sorSetId: contractForm.sorSetId || undefined
    };
    setContracts([newContract, ...contracts]);
    setIsContractModalOpen(false);
  };

  const handleCreateSow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeContract) return;
    const newSow: SOW = {
      id: `sow-${Date.now()}`,
      contractId: activeContract.id,
      title: sowForm.title,
      description: sowForm.description,
      workflowDefinitionId: sowForm.workflowId,
      estimatedHours: 40,
      startDate: sowForm.startDate,
      endDate: sowForm.endDate,
      locationIds: sowForm.locationIds,
      assetIds: [], 
      serviceId: sowForm.serviceId,
      vendorId: activeContract.vendorId || 'internal',
      // Fix: cast hardcoded string array to FrequencyType[] to resolve string[] mismatch
      allowedFrequencies: ['ADHOC', 'DAILY', 'WEEKLY', 'MONTHLY'] as FrequencyType[],
      defaultFrequency: sowForm.defaultFrequency
    };
    setSows([newSow, ...sows]);
    setIsSowModalOpen(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSow) return;
    const newTask: ScheduledTask = {
      id: `tsk-${Date.now()}`,
      sowId: activeSow.id,
      ...taskForm,
      status: 'PENDING'
    };
    setTasks([newTask, ...tasks]);
    setIsTaskModalOpen(false);
  };

  const toggleList = (list: string[], item: string) => 
    list.includes(item) ? list.filter(i => i !== item) : [...list, item];

  const selectedVendor = MOCK_VENDORS.find(v => v.id === contractForm.vendorId);

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-40 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-4">
             <Briefcase className="text-blue-600" size={40} /> Portfolio Hub
          </h2>
          <p className="text-slate-500 font-medium text-lg">Integrated hierarchy from Capital Projects to Field Operations.</p>
        </div>
        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all flex items-center gap-2">
           <Plus size={18} /> New Capital Project
        </button>
      </header>

      {/* PROJECT LEVEL (ROOT) */}
      <div className="space-y-10">
        {projects.map(project => {
          const projectContracts = contracts.filter(c => c.projectId === project.id);
          const isProjectExpanded = expandedProjects.has(project.id);

          return (
            <div key={project.id} className="relative">
              <div className="bg-white rounded-[3.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all">
                <div 
                  onClick={() => toggle(project.id, expandedProjects, setExpandedProjects)}
                  className="p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8 cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-start gap-10">
                    <div className="p-7 bg-blue-600 text-white rounded-[2.5rem] shadow-2xl shadow-blue-100">
                      <Briefcase size={40} />
                    </div>
                    <div>
                       <div className="flex items-center gap-4 mb-3">
                          <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{project.name}</h3>
                          <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">{project.status}</span>
                       </div>
                       <p className="text-slate-400 font-medium text-base italic max-w-xl">"{project.description}"</p>
                       <div className="flex items-center gap-6 mt-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span className="flex items-center gap-2"><MapPin size={16} className="text-blue-500" /> {project.locationIds.length} Site Allotments</span>
                          <span className="flex items-center gap-2"><Calendar size={16} className="text-slate-300" /> {project.startDate} → {project.endDate}</span>
                       </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-12">
                     <div className="text-right">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">CAPITAL ALLOCATION</p>
                        <p className="text-4xl font-black text-slate-900 tracking-tighter">${project.budget.toLocaleString()}</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setActiveProject(project); setIsContractModalOpen(true); }}
                          className="px-8 py-4 bg-white border border-slate-200 text-blue-600 rounded-2xl hover:bg-blue-50 transition-all flex items-center gap-3 text-xs font-black uppercase tracking-widest shadow-sm"
                        >
                          <Handshake size={18} /> Formalize Contract
                        </button>
                        <div className={`p-2 rounded-full transition-transform ${isProjectExpanded ? 'rotate-180 bg-slate-100' : ''}`}>
                          <ChevronDown size={28} className="text-slate-300" />
                        </div>
                     </div>
                  </div>
                </div>

                {/* CONTRACT LEVEL */}
                {isProjectExpanded && (
                  <div className="bg-slate-50/50 p-12 pt-0 animate-in slide-in-from-top-6">
                    <div className="border-t border-slate-200 pt-10 space-y-8">
                       {projectContracts.map(contract => {
                         const contractSows = sows.filter(s => s.contractId === contract.id);
                         const isContractExpanded = expandedContracts.has(contract.id);
                         const vendor = MOCK_VENDORS.find(v => v.id === contract.vendorId);
                         const sorSet = vendor?.sorSets.find(s => s.id === contract.sorSetId);

                         return (
                           <div key={contract.id} className="relative ml-16">
                              <div className="absolute -left-10 top-0 bottom-0 w-1 bg-blue-100 rounded-full"></div>
                              <div className="absolute -left-10 top-12 w-10 h-1 bg-blue-100 rounded-full"></div>

                              <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden transition-all hover:border-blue-300">
                                 <div 
                                   onClick={() => toggle(contract.id, expandedContracts, setExpandedContracts)}
                                   className="p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 cursor-pointer hover:bg-slate-50/80 transition-colors"
                                 >
                                    <div className="flex items-center gap-8">
                                       <div className="p-6 bg-slate-900 text-white rounded-[2rem] shadow-xl">
                                          <ShieldCheck size={32} />
                                       </div>
                                       <div>
                                          <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tight leading-tight">{contract.title}</h4>
                                          <div className="flex flex-wrap items-center gap-5 mt-2">
                                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                               <Users size={14} className="text-slate-300" /> Vendor: {vendor?.name || 'In-House'}
                                             </span>
                                             {sorSet && (
                                               <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 bg-blue-50 px-2 py-1 rounded-lg">
                                                  <FileSpreadsheet size={14} /> Rate Set: {sorSet.name}
                                               </span>
                                             )}
                                             <span className="text-slate-200">|</span>
                                             <span className="text-lg font-black text-blue-600">${contract.value.toLocaleString()}</span>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                       <button 
                                         onClick={(e) => { e.stopPropagation(); setActiveContract(contract); setIsSowModalOpen(true); }}
                                         className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-3 shadow-lg"
                                       >
                                          <Layers size={18} /> Draft Scope (SOW)
                                       </button>
                                       <div className={`p-1.5 rounded-full transition-transform ${isContractExpanded ? 'rotate-180 bg-slate-50' : ''}`}>
                                          <ChevronDown size={20} className="text-slate-300" />
                                       </div>
                                    </div>
                                 </div>

                                 {/* SOW LEVEL */}
                                 {isContractExpanded && (
                                   <div className="bg-slate-50/30 p-10 pt-0 animate-in slide-in-from-top-4">
                                      <div className="space-y-6 border-t border-slate-100 pt-8">
                                         {contractSows.map(sow => {
                                            const sowTasks = tasks.filter(t => t.sowId === sow.id);
                                            const isSowExpanded = expandedSows.has(sow.id);

                                            return (
                                              <div key={sow.id} className="relative ml-16">
                                                 <div className="absolute -left-8 top-0 bottom-0 w-0.5 bg-indigo-100"></div>
                                                 <div className="absolute -left-8 top-10 w-8 h-0.5 bg-indigo-100"></div>

                                                 <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:border-indigo-400 transition-all">
                                                    <div 
                                                      onClick={() => toggle(sow.id, expandedSows, setExpandedSows)}
                                                      className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer hover:bg-slate-50 transition-colors"
                                                    >
                                                       <div className="flex items-center gap-6">
                                                          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                                                             <Wrench size={24} />
                                                          </div>
                                                          <div>
                                                             <h5 className="font-black text-slate-800 uppercase tracking-tight">{sow.title}</h5>
                                                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                                                               <Calendar size={12} className="text-indigo-400" /> {sow.startDate} → {sow.endDate}
                                                             </p>
                                                          </div>
                                                       </div>
                                                       <div className="flex items-center gap-6">
                                                          <button 
                                                            onClick={(e) => { e.stopPropagation(); setActiveSow(sow); setIsTaskModalOpen(true); }}
                                                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2"
                                                          >
                                                             <Zap size={14} /> Plan WO
                                                          </button>
                                                          <div className={`transition-transform ${isSowExpanded ? 'rotate-180' : ''}`}>
                                                             <ChevronDown size={18} className="text-slate-300" />
                                                          </div>
                                                       </div>
                                                    </div>

                                                    {/* TASK LEVEL (WORK ORDERS) */}
                                                    {isSowExpanded && (
                                                      <div className="bg-slate-50/20 p-8 pt-0 animate-in slide-in-from-top-2">
                                                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-t border-slate-50 pt-8">
                                                            {sowTasks.map(task => (
                                                              <div key={task.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-blue-500 hover:shadow-2xl transition-all">
                                                                 <div className="space-y-4">
                                                                    <div className="flex justify-between items-start">
                                                                       <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase border tracking-widest ${
                                                                         task.priority === 'URGENT' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                                                                       }`}>{task.priority}</span>
                                                                       <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{task.status}</div>
                                                                    </div>
                                                                    <h6 className="font-black text-slate-800 uppercase tracking-tight line-clamp-1">{task.title}</h6>
                                                                    <div className="space-y-2 pt-4 border-t border-slate-50">
                                                                       <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                                                                          <MapPin size={14} className="text-blue-500" /> {MOCK_LOCATIONS.find(l => l.id === task.locationId)?.name}
                                                                       </div>
                                                                       <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                                          <Clock size={14} className="text-slate-300" /> {task.startTime || task.scheduledAt}
                                                                       </div>
                                                                    </div>
                                                                 </div>
                                                                 <button onClick={() => navigate('/tasks')} className="mt-6 w-full py-3 bg-slate-50 group-hover:bg-blue-600 group-hover:text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all">
                                                                    Execute
                                                                 </button>
                                                              </div>
                                                            ))}
                                                            {sowTasks.length === 0 && (
                                                              <div className="col-span-full py-10 text-center opacity-30">
                                                                 <Layers size={40} className="mx-auto mb-2 text-slate-300" />
                                                                 <p className="text-[10px] font-black uppercase tracking-widest">Queue Empty</p>
                                                              </div>
                                                            )}
                                                         </div>
                                                      </div>
                                                    )}
                                                 </div>
                                              </div>
                                            );
                                         })}
                                         {contractSows.length === 0 && (
                                            <div className="ml-16 py-12 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-white">
                                               <Layers className="mx-auto text-slate-100 mb-4" size={48} />
                                               <p className="text-sm font-black text-slate-300 uppercase tracking-widest">No Operational Scopes Authorized</p>
                                            </div>
                                         )}
                                      </div>
                                   </div>
                                 )}
                              </div>
                           </div>
                         );
                       })}
                       {projectContracts.length === 0 && (
                          <div className="ml-16 py-12 text-center border-2 border-dashed border-slate-200 rounded-[3rem] bg-white">
                             <Handshake className="mx-auto text-slate-100 mb-4" size={54} />
                             <p className="text-sm font-black text-slate-300 uppercase tracking-widest">No Commercial Engagements Formalized</p>
                          </div>
                       )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* --- MODALS --- */}

      {/* 1. CONTRACT MODAL */}
      {isContractModalOpen && activeProject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-5xl rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-blue-600 text-white">
              <div>
                 <h3 className="text-3xl font-black uppercase tracking-tighter">Formalize Contract</h3>
                 <p className="text-xs font-bold opacity-80 uppercase tracking-widest mt-2">Project: {activeProject.name}</p>
              </div>
              <button onClick={() => setIsContractModalOpen(false)} className="p-5 hover:bg-white/10 rounded-2xl transition-all"><X size={36} /></button>
            </div>
            <form onSubmit={handleCreateContract} className="p-16 overflow-y-auto space-y-12 custom-scrollbar">
               <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-6">
                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Contract Identity</label>
                     <input required className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-black text-base uppercase outline-none focus:ring-4 focus:ring-blue-100" placeholder="e.g. Master Plumbing Service Pack" value={contractForm.title} onChange={e => setContractForm({...contractForm, title: e.target.value})} />
                     <textarea required rows={4} className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-bold text-base outline-none focus:ring-4 focus:ring-blue-100 resize-none" placeholder="Governance and lifecycle terms..." value={contractForm.description} onChange={e => setContractForm({...contractForm, description: e.target.value})} />
                  </div>
                  <div className="space-y-6">
                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Commercial Alignment</label>
                     <div className="relative">
                        <input required type="number" className="w-full bg-blue-50 border-2 border-blue-100 p-8 rounded-4xl text-4xl font-black text-blue-700 outline-none" placeholder="Value ($)" value={contractForm.value} onChange={e => setContractForm({...contractForm, value: e.target.value})} />
                        <DollarSign className="absolute right-8 top-1/2 -translate-y-1/2 text-blue-200" size={40} />
                     </div>
                     <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Assign Vendor</label>
                           <select required className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-black text-sm uppercase" value={contractForm.vendorId} onChange={e => setContractForm({...contractForm, vendorId: e.target.value, sorSetId: ''})}>
                              <option value="">Select Vendor Entity...</option>
                              {MOCK_VENDORS.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                           </select>
                        </div>
                        {selectedVendor && (
                          <div className="space-y-2 animate-in slide-in-from-top-2">
                             <label className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Select Active Rate (SOR) Set</label>
                             <select required className="w-full bg-white border-2 border-blue-100 p-6 rounded-3xl font-black text-sm uppercase text-blue-600 shadow-lg shadow-blue-50" value={contractForm.sorSetId} onChange={e => setContractForm({...contractForm, sorSetId: e.target.value})}>
                                <option value="">Choose SOR Set...</option>
                                {selectedVendor.sorSets.map(set => <option key={set.id} value={set.id}>{set.name} ({set.effectiveDate})</option>)}
                             </select>
                          </div>
                        )}
                     </div>
                  </div>
               </div>
               <button type="submit" className="w-full bg-slate-900 text-white py-10 rounded-[2.5rem] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-black transition-all">Create Binding Contract</button>
            </form>
          </div>
        </div>
      )}

      {/* 2. SOW MODAL */}
      {isSowModalOpen && activeContract && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-4xl rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-slate-900 text-white">
              <div>
                 <h3 className="text-3xl font-black uppercase tracking-tighter">Draft Operational Scope</h3>
                 <p className="text-xs font-bold opacity-80 uppercase tracking-widest mt-2">Contract: {activeContract.title}</p>
              </div>
              <button onClick={() => setIsSowModalOpen(false)} className="p-5 hover:bg-white/10 rounded-2xl transition-all"><X size={36} /></button>
            </div>
            <form onSubmit={handleCreateSow} className="p-16 overflow-y-auto space-y-12 custom-scrollbar">
               <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-6">
                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Scope Identifier</label>
                     <input required className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-black text-lg uppercase outline-none focus:ring-4 focus:ring-blue-100" placeholder="e.g. Biannual HVAC Audit" value={sowForm.title} onChange={e => setSowForm({...sowForm, title: e.target.value})} />
                     <textarea required rows={4} className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-bold text-base outline-none focus:ring-4 focus:ring-blue-100 resize-none" placeholder="Provide detailed deliverables..." value={sowForm.description} onChange={e => setSowForm({...sowForm, description: e.target.value})} />
                  </div>
                  <div className="space-y-6">
                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Execution Policy</label>
                     <select required className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-black text-sm uppercase" value={sowForm.workflowId} onChange={e => setSowForm({...sowForm, workflowId: e.target.value})}>
                        <option value="">Select Engine Workflow...</option>
                        {MOCK_WORKFLOWS.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                     </select>
                     <select required className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-black text-sm uppercase" value={sowForm.serviceId} onChange={e => setSowForm({...sowForm, serviceId: e.target.value})}>
                        <option value="">Authorized Service...</option>
                        {activeContract.serviceIds.map(sid => <option key={sid} value={sid}>{MOCK_SERVICES.find(s => s.id === sid)?.name}</option>)}
                     </select>
                  </div>
               </div>
               <button type="submit" className="w-full bg-blue-600 text-white py-10 rounded-[2.5rem] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-blue-700 transition-all">Authorize Operational Scope</button>
            </form>
          </div>
        </div>
      )}

      {/* 3. TASK MODAL */}
      {isTaskModalOpen && activeSow && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xl animate-in fade-in">
          <div className="bg-white w-full max-w-5xl rounded-[4.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[95vh]">
            <div className="p-16 border-b border-slate-50 flex justify-between items-center bg-indigo-600 text-white">
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-indigo-200">
                   <Calendar size={20} /> Work Order Orchestration
                </div>
                <h3 className="text-5xl font-black uppercase tracking-tighter leading-none">Schedule Task</h3>
                <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Scope Stream: {activeSow.title}</p>
              </div>
              <button onClick={() => setIsTaskModalOpen(false)} className="p-6 hover:bg-white/10 rounded-[2.5rem] transition-all"><X size={44} /></button>
            </div>
            <form onSubmit={handleCreateTask} className="p-16 overflow-y-auto space-y-16 custom-scrollbar bg-white">
               {/* Identity & Basic Setup */}
               <div className="grid grid-cols-2 gap-16">
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Order Name</label>
                        <div className="relative">
                          <input required className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-black text-lg uppercase pl-16 outline-none focus:ring-4 focus:ring-blue-100 transition-all" placeholder="e.g. Core Filter Remediation" value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} />
                          <Type className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Execution Narrative</label>
                        <textarea rows={4} className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-medium text-base outline-none focus:ring-4 focus:ring-blue-100 resize-none shadow-inner" placeholder="Detailed instructions for the field team..." value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} />
                     </div>
                  </div>
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Linked Verification SOP</label>
                        <div className="relative">
                          <select required className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-black text-sm uppercase appearance-none cursor-pointer pl-16" value={taskForm.checklistId} onChange={e => setTaskForm({...taskForm, checklistId: e.target.value})}>
                             <option value="">Select SOP Standard...</option>
                             {MOCK_CHECKLISTS.map(ck => <option key={ck.id} value={ck.id}>{ck.name}</option>)}
                          </select>
                          <ClipboardList className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={24} />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Task Priority</label>
                        <div className="grid grid-cols-4 gap-2">
                           {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as RequestPriority[]).map(p => (
                             <button type="button" key={p} onClick={() => setTaskForm({...taskForm, priority: p})} className={`py-5 rounded-3xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                               taskForm.priority === p 
                                 ? 'bg-slate-900 border-slate-900 text-white shadow-2xl translate-y-[-4px]' 
                                 : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'
                             }`}>{p}</button>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               {/* Scheduling Block */}
               <div className="p-12 bg-slate-50 rounded-[3rem] border border-slate-100 space-y-12">
                  <div className="grid grid-cols-2 gap-16">
                     <div className="space-y-8">
                        <div className="grid grid-cols-2 gap-8">
                           <div className="space-y-4">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Arrival Window</label>
                              <input required type="datetime-local" className="w-full bg-white border border-slate-200 p-5 rounded-2xl font-bold text-sm shadow-sm outline-none focus:ring-4 focus:ring-blue-100 transition-all" value={taskForm.startTime} onChange={e => setTaskForm({...taskForm, startTime: e.target.value})} />
                           </div>
                           <div className="space-y-4">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">SLA Deadline</label>
                              <input required type="datetime-local" className="w-full bg-white border border-slate-200 p-5 rounded-2xl font-bold text-sm shadow-sm outline-none focus:ring-4 focus:ring-blue-100 transition-all" value={taskForm.endTime} onChange={e => setTaskForm({...taskForm, endTime: e.target.value})} />
                           </div>
                        </div>
                     </div>
                     <div className="space-y-8">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block text-center">Frequency setup</label>
                        <select required className="w-full bg-white border-2 border-indigo-200 p-6 rounded-3xl font-black text-sm uppercase text-indigo-600 shadow-xl" value={taskForm.frequency} onChange={e => setTaskForm({...taskForm, frequency: e.target.value as any, frequencyConfig: {}})}>
                           {FREQUENCY_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                        </select>
                        <div className="animate-in slide-in-from-top-4">
                           {taskForm.frequency === 'DAILY' && (
                             <div className="p-6 bg-white rounded-[2rem] border-2 border-indigo-100 text-center space-y-4 shadow-sm">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Repeat Cycle</label>
                                <div className="flex items-center justify-center gap-4">
                                   <input type="number" min="1" className="w-24 bg-slate-50 border-2 border-indigo-100 p-4 rounded-2xl font-black text-3xl text-center text-indigo-600" defaultValue="1" onChange={e => setTaskForm({...taskForm, frequencyConfig: {interval: e.target.value}})} />
                                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Days</span>
                                </div>
                             </div>
                           )}
                           {taskForm.frequency === 'WEEKLY' && (
                             <div className="p-8 bg-white rounded-[2rem] border-2 border-indigo-100 shadow-sm text-center space-y-6">
                                <div className="flex flex-wrap gap-3 justify-center">
                                   {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                     <button type="button" key={day} onClick={() => {
                                        const current = taskForm.frequencyConfig.days || [];
                                        const next = current.includes(day) ? current.filter((d:any) => d !== day) : [...current, day];
                                        setTaskForm({...taskForm, frequencyConfig: {...taskForm.frequencyConfig, days: next}});
                                     }} className={`w-14 h-14 rounded-2xl text-[11px] font-black uppercase transition-all ${
                                        taskForm.frequencyConfig.days?.includes(day) ? 'bg-indigo-600 text-white shadow-xl' : 'bg-slate-50 text-slate-400'
                                     }`}>{day.slice(0,1)}</button>
                                   ))}
                                </div>
                             </div>
                           )}
                           {taskForm.frequency === 'MONTHLY' && (
                             <div className="p-8 bg-white rounded-[2.5rem] border-2 border-indigo-100 shadow-sm text-center">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Anchor Date (1-31)</label>
                                <input type="number" min="1" max="31" className="w-full bg-slate-50 border-2 border-indigo-100 p-6 rounded-3xl font-black text-4xl text-center text-indigo-600 outline-none" placeholder="15" onChange={e => setTaskForm({...taskForm, frequencyConfig: {dayOfMonth: e.target.value}})} />
                             </div>
                           )}
                           {taskForm.frequency === 'ADHOC' && (
                             <div className="p-8 bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-sm text-center space-y-2 opacity-60">
                                <CheckCircle2 className="mx-auto text-emerald-500" size={32} />
                                <h5 className="font-black text-slate-900 uppercase text-sm">Singular Execution</h5>
                                <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase">Generates one manual Work Order instance.</p>
                             </div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>

               {/* Resource & Scope Assignment */}
               <div className="grid grid-cols-2 gap-16">
                  <div className="space-y-8">
                     <h4 className="text-[12px] font-black text-indigo-600 uppercase tracking-[0.4em] border-b-2 border-indigo-50 pb-4 flex items-center gap-3">
                        <Users size={20} /> Selection (Users/Groups)
                     </h4>
                     <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto p-6 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-inner custom-scrollbar">
                        {MOCK_GROUPS.map(grp => (
                           <label key={grp.id} className="flex items-center gap-5 p-5 bg-white rounded-3xl border border-slate-100 cursor-pointer hover:border-indigo-400 hover:shadow-xl transition-all group">
                              <input type="checkbox" checked={taskForm.assignedToIds.includes(grp.id)} onChange={() => setTaskForm({...taskForm, assignedToIds: toggleList(taskForm.assignedToIds, grp.id)})} className="w-7 h-7 rounded-lg text-indigo-600 border-2" />
                              <div>
                                 <p className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-indigo-600">{grp.name}</p>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{grp.memberIds.length} Members</p>
                              </div>
                           </label>
                        ))}
                        {MOCK_USERS.map(u => (
                           <label key={u.id} className="flex items-center gap-5 p-5 bg-white rounded-3xl border border-slate-100 cursor-pointer hover:border-indigo-400 hover:shadow-xl transition-all group">
                              <input type="checkbox" checked={taskForm.assignedToIds.includes(u.id)} onChange={() => setTaskForm({...taskForm, assignedToIds: toggleList(taskForm.assignedToIds, u.id)})} className="w-7 h-7 rounded-lg text-indigo-600 border-2" />
                              <div>
                                 <p className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-indigo-600">{u.name}</p>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{u.email}</p>
                              </div>
                           </label>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-8">
                     <h4 className="text-[12px] font-black text-indigo-600 uppercase tracking-[0.4em] border-b-2 border-indigo-50 pb-4 flex items-center gap-3">
                        <Target size={20} /> Entity Selection (Site scoped)
                     </h4>
                     <div className="space-y-8">
                        <div className="space-y-3">
                           <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Site (Project Entitles)</label>
                           <div className="relative">
                              <select required className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-black text-base uppercase appearance-none cursor-pointer pl-16" value={taskForm.locationId} onChange={e => setTaskForm({...taskForm, locationId: e.target.value, assetId: ''})}>
                                 <option value="">Choose Site Allocation...</option>
                                 {activeSow.locationIds.map(locId => (
                                    <option key={locId} value={locId}>{MOCK_LOCATIONS.find(l => l.id === locId)?.name}</option>
                                 ))}
                              </select>
                              <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-500" size={28} />
                           </div>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Specific Equipment</label>
                           <div className="relative">
                              <select className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-black text-base uppercase appearance-none cursor-pointer pl-16" value={taskForm.assetId} onChange={e => setTaskForm({...taskForm, assetId: e.target.value})}>
                                 <option value="">Zone Coverage (Full)</option>
                                 {MOCK_ASSETS.filter(a => a.locationId === taskForm.locationId).map(a => (
                                    <option key={a.id} value={a.id}>{a.name} ({a.brickClass})</option>
                                 ))}
                              </select>
                              <Cpu className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-500" size={28} />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <button type="submit" className="w-full bg-indigo-600 text-white py-12 rounded-[3rem] font-black uppercase tracking-[0.5em] text-2xl shadow-2xl hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-8 group">
                  <Handshake className="group-hover:rotate-12 transition-transform" size={48} />
                  Authorize Work Order Stream
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractModule;
