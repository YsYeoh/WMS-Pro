
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MOCK_PROJECTS, 
  MOCK_CONTRACTS, 
  MOCK_SOWS, 
  MOCK_VENDORS, 
  MOCK_WORKFLOWS, 
  MOCK_TASKS, 
  MOCK_LOCATIONS, 
  MOCK_ASSETS, 
  MOCK_SERVICES,
  MOCK_CHECKLISTS,
  MOCK_USERS,
  MOCK_GROUPS
} from '../constants';
import { Contract, SOW, ScheduledTask, FrequencyType, RequestPriority } from '../types';
import { 
  FileText, 
  Plus, 
  ChevronRight, 
  Workflow, 
  User, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  X,
  DollarSign,
  MapPin,
  Cpu,
  Target,
  ListTodo,
  Wrench,
  Repeat,
  Info,
  ShieldCheck,
  Zap,
  Users,
  Briefcase,
  Layers,
  ArrowRight
} from 'lucide-react';

const FREQUENCY_OPTIONS: { label: string; value: FrequencyType }[] = [
  { label: 'Annually', value: 'ANNUALLY' },
  { label: 'Half-Yearly', value: 'HALF_YEARLY' },
  { label: 'Quarterly', value: 'QUARTERLY' },
  { label: 'Monthly', value: 'MONTHLY' },
  { label: 'Daily', value: 'DAILY' },
  { label: 'Ad-hoc', value: 'ADHOC' }
];

const ProjectDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = MOCK_PROJECTS.find(p => p.id === id);
  
  const [activeTab, setActiveTab] = useState<'contracts' | 'sows'>('contracts');
  const [expandedSow, setExpandedSow] = useState<string | null>(null);
  
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS.filter(c => c.projectId === id));
  const [sows, setSows] = useState<SOW[]>(MOCK_SOWS.filter(s => contracts.some(c => c.id === s.contractId)));
  const [tasks, setTasks] = useState<ScheduledTask[]>([]); // Using empty for demo fresh scheduling
  
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isSowModalOpen, setIsSowModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedSowForTask, setSelectedSowForTask] = useState<SOW | null>(null);

  // --- CONTRACT FORM ---
  const [contractForm, setContractForm] = useState({
    title: '',
    description: '',
    value: '',
    startDate: project?.startDate || '',
    endDate: project?.endDate || '',
    serviceIds: [] as string[],
    vendorMode: 'OUTSOURCE' as 'IN_HOUSE' | 'OUTSOURCE',
    eligibleVendorIds: [] as string[]
  });

  // --- SOW FORM ---
  const [sowForm, setSowForm] = useState({
    title: '',
    description: '',
    contractId: '',
    serviceId: '',
    workflowId: '',
    locationIds: [] as string[],
    assetIds: [] as string[],
    startDate: '',
    endDate: '',
    allowedFrequencies: [] as FrequencyType[],
    defaultFrequency: 'ADHOC' as FrequencyType,
    estimatedHours: '40'
  });

  // --- TASK SCHEDULER FORM ---
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    checklistId: '',
    priority: 'MEDIUM' as RequestPriority,
    startTime: '',
    endTime: '',
    frequency: 'ADHOC' as FrequencyType,
    assignedToIds: [] as string[],
    locationId: '',
    assetId: '',
    frequencyConfig: {} as any
  });

  const toggleSelection = (list: string[], item: string) => 
    list.includes(item) ? list.filter(i => i !== item) : [...list, item];

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    const newContract: Contract = {
      id: `c-${Date.now()}`,
      projectId: id!,
      title: contractForm.title,
      description: contractForm.description,
      value: Number(contractForm.value),
      status: 'NEGOTIATING',
      startDate: contractForm.startDate,
      endDate: contractForm.endDate,
      serviceIds: contractForm.serviceIds,
      vendorMode: contractForm.vendorMode,
      eligibleVendorIds: contractForm.eligibleVendorIds
    };
    setContracts([...contracts, newContract]);
    setIsContractModalOpen(false);
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
      locationIds: sowForm.locationIds,
      assetIds: sowForm.assetIds,
      serviceId: sowForm.serviceId,
      vendorId: contract?.eligibleVendorIds[0] || 'internal',
      // Fix: cast to FrequencyType[] to resolve string[] mismatch from toggleSelection or inference
      allowedFrequencies: sowForm.allowedFrequencies as FrequencyType[],
      defaultFrequency: sowForm.defaultFrequency
    };
    setSows([...sows, newSow]);
    setIsSowModalOpen(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSowForTask) return;
    const newTask: ScheduledTask = {
      id: `tsk-${Date.now()}`,
      sowId: selectedSowForTask.id,
      ...taskForm,
      status: 'PENDING'
    };
    setTasks([newTask, ...tasks]);
    setIsTaskModalOpen(false);
  };

  if (!project) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-32 animate-in fade-in duration-500">
      {/* Dynamic Header */}
      <div className="bg-white rounded-[3.5rem] border border-slate-200 p-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-50 rounded-full -mr-48 -mt-48 opacity-40 z-0"></div>
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 relative z-10">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-4 flex-wrap">
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{project.name}</h2>
              <span className="px-5 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest border bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm">
                Project Life-Cycle: {project.status}
              </span>
            </div>
            <p className="text-xl text-slate-500 max-w-3xl leading-relaxed font-medium italic opacity-90">"{project.description}"</p>
            <div className="flex flex-wrap gap-3">
               {project.serviceIds.map(sid => {
                 const srv = MOCK_SERVICES.find(s => s.id === sid);
                 return (
                   <span key={sid} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 shadow-sm hover:border-blue-400 transition-colors">
                      <Wrench size={14} className="text-blue-500" /> {srv?.name}
                   </span>
                 );
               })}
            </div>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 min-w-[320px] shadow-2xl shadow-blue-100/50">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
               <DollarSign size={16} className="text-blue-500" /> Capital Allocation
            </p>
            <p className="text-6xl font-black text-slate-900 tracking-tighter">${project.budget.toLocaleString()}</p>
            <div className="mt-8 pt-8 border-t border-slate-50 grid grid-cols-2 gap-6">
               <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Commencement</p>
                  <p className="text-sm font-black text-slate-700">{project.startDate}</p>
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Termination</p>
                  <p className="text-sm font-black text-slate-700">{project.endDate || 'Perpetual'}</p>
               </div>
            </div>
          </div>
        </div>

        <div className="flex bg-slate-100/80 p-2 rounded-[2rem] mt-16 w-fit relative z-10 border border-white">
          <button 
            onClick={() => setActiveTab('contracts')}
            className={`px-12 py-4 text-sm font-black rounded-2xl transition-all uppercase tracking-[0.1em] flex items-center gap-3 ${activeTab === 'contracts' ? 'bg-white shadow-xl shadow-slate-200 text-blue-600 border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Briefcase size={18} /> Commercial Contracts ({contracts.length})
          </button>
          <button 
            onClick={() => setActiveTab('sows')}
            className={`px-12 py-4 text-sm font-black rounded-2xl transition-all uppercase tracking-[0.1em] flex items-center gap-3 ${activeTab === 'sows' ? 'bg-white shadow-xl shadow-slate-200 text-blue-600 border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Layers size={18} /> Execution Scope ({sows.length})
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="space-y-12">
        {activeTab === 'contracts' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {contracts.map(contract => (
              <div key={contract.id} className="bg-white p-12 rounded-[3.5rem] border border-slate-200 hover:border-blue-400 hover:shadow-2xl transition-all flex flex-col shadow-sm group">
                <div className="flex justify-between items-start mb-10">
                  <div className="p-6 bg-blue-50 text-blue-600 rounded-[2rem] group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                    <FileText size={40} />
                  </div>
                  <div className="flex flex-col gap-3 items-end">
                    <span className="px-5 py-2 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                      {contract.status}
                    </span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{contract.vendorMode}</span>
                  </div>
                </div>
                <h4 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase leading-tight">{contract.title}</h4>
                <p className="text-lg text-slate-400 font-medium line-clamp-2 mb-10 italic">"{contract.description}"</p>
                
                <div className="grid grid-cols-2 gap-8 mb-12 pt-8 border-t border-slate-50">
                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-xl text-slate-400 shadow-inner">
                        {contract.vendorMode === 'IN_HOUSE' ? 'IH' : MOCK_VENDORS.find(v => v.id === contract.vendorId)?.name[0]}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Lead Entity</p>
                        <p className="text-sm font-black text-slate-700 uppercase truncate max-w-[150px]">
                          {contract.vendorMode === 'IN_HOUSE' ? 'Organizational Unit' : MOCK_VENDORS.find(v => v.id === contract.vendorId)?.name}
                        </p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <Calendar size={20} className="text-blue-500" />
                      <div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Horizon</p>
                        <p className="text-sm font-black text-slate-700">{contract.startDate} → {contract.endDate}</p>
                      </div>
                   </div>
                </div>

                <div className="mt-auto pt-10 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Aggregate Commercial Value</span>
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">${contract.value.toLocaleString()}</span>
                </div>
              </div>
            ))}
            <button onClick={() => setIsContractModalOpen(true)} className="border-2 border-dashed border-slate-200 rounded-[3.5rem] p-20 flex flex-col items-center justify-center gap-8 text-slate-400 hover:bg-blue-50/50 hover:text-blue-600 hover:border-blue-300 transition-all group">
              <div className="bg-white p-10 rounded-[2.5rem] shadow-xl group-hover:scale-110 transition-transform">
                <Plus size={52} />
              </div>
              <span className="uppercase tracking-[0.4em] text-sm font-black">Formalize New Contract</span>
            </button>
          </div>
        ) : (
          <div className="space-y-10 animate-in slide-in-from-bottom-8">
            {sows.map(sow => {
              const workflow = MOCK_WORKFLOWS.find(w => w.id === sow.workflowDefinitionId);
              const sowTasks = tasks.filter(t => t.sowId === sow.id);
              const isExpanded = expandedSow === sow.id;
              const service = MOCK_SERVICES.find(s => s.id === sow.serviceId);

              return (
                <div key={sow.id} className="bg-white rounded-[4rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all hover:border-blue-200">
                  <div className="flex flex-col lg:flex-row">
                    <div className="p-16 lg:w-2/3 space-y-10">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 flex-wrap">
                          <h4 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-tight">{sow.title}</h4>
                          <div className="px-6 py-2 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                             <Zap size={16} fill="white" />
                             {service?.name || 'Operations'}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {sow.locationIds.map(locId => (
                            <span key={locId} className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-100 flex items-center gap-2">
                              <MapPin size={12} className="text-blue-400" /> {MOCK_LOCATIONS.find(l => l.id === locId)?.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-2xl text-slate-500 leading-relaxed font-medium italic opacity-80 border-l-8 border-slate-100 pl-8">"{sow.description}"</p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 pt-12 border-t border-slate-50">
                        <div className="space-y-2">
                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Calendar size={14} className="text-blue-500" /> Start
                          </p>
                          <p className="text-sm font-black text-slate-800">{sow.startDate}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Calendar size={14} className="text-red-500" /> End
                          </p>
                          <p className="text-sm font-black text-slate-800">{sow.endDate || 'Active'}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Repeat size={14} className="text-blue-500" /> Policy
                          </p>
                          <p className="text-sm font-black text-slate-800 uppercase">{sow.defaultFrequency}</p>
                        </div>
                        <button 
                          onClick={() => setExpandedSow(isExpanded ? null : sow.id)}
                          className="text-[11px] font-black text-blue-600 uppercase tracking-[0.3em] flex items-center gap-2 self-end hover:bg-blue-50 px-8 py-3 rounded-2xl transition-all border border-blue-50 shadow-sm"
                        >
                          {isExpanded ? 'Collapse' : 'Timeline'}
                          <ChevronRight size={18} className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-50/50 p-16 lg:w-1/3 border-t lg:border-t-0 lg:border-l border-slate-100 flex flex-col justify-between space-y-12">
                       <div className="p-10 bg-white rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/50 flex items-center gap-8 group">
                          <div className="p-5 bg-indigo-600 text-white rounded-3xl shadow-xl shadow-indigo-200 group-hover:rotate-12 transition-transform">
                             <Workflow size={40} />
                          </div>
                          <div>
                             <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">State Machine</p>
                             <p className="text-xl font-black text-slate-900 uppercase tracking-tight leading-tight">{workflow?.name}</p>
                          </div>
                       </div>
                       <button 
                         onClick={() => {
                           setSelectedSowForTask(sow);
                           setTaskForm({ ...taskForm, frequency: sow.defaultFrequency });
                           setIsTaskModalOpen(true);
                         }}
                         className="w-full bg-slate-900 text-white py-8 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-5 active:scale-95"
                       >
                         <ListTodo size={24} />
                         Schedule Work
                       </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-16 pb-16 animate-in slide-in-from-top-10 duration-500 bg-slate-50/30">
                      <div className="pt-16 border-t border-slate-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                          {tasks.filter(t => t.sowId === sow.id).map(task => (
                             <div key={task.id} className="p-10 bg-white border-2 border-slate-100 rounded-[3rem] flex flex-col justify-between hover:border-blue-400 hover:shadow-2xl transition-all group">
                                <div className="space-y-6">
                                  <div className="flex justify-between items-start">
                                     <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">{task.priority}</span>
                                     <Clock size={20} className="text-slate-200" />
                                  </div>
                                  <h6 className="font-black text-slate-900 leading-tight uppercase text-xl tracking-tight">{task.title}</h6>
                                  <div className="space-y-3 pt-6 border-t border-slate-50">
                                     <div className="flex items-center gap-3 text-slate-500">
                                        <MapPin size={16} className="text-blue-500" />
                                        <span className="text-xs font-black uppercase">{MOCK_LOCATIONS.find(l => l.id === task.locationId)?.name}</span>
                                     </div>
                                     <div className="flex items-center gap-3 text-slate-400">
                                        <Calendar size={16} />
                                        <span className="text-xs font-bold uppercase tracking-tighter">{task.startTime}</span>
                                     </div>
                                  </div>
                                </div>
                             </div>
                          ))}
                          {tasks.filter(t => t.sowId === sow.id).length === 0 && (
                            <div className="col-span-full py-20 text-center space-y-6 opacity-40">
                               <Layers size={80} className="mx-auto text-slate-200" />
                               <p className="text-sm font-black uppercase tracking-[0.4em]">Queue Empty - Awaiting Planning</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- FORM MODALS --- */}

      {/* 1. CONTRACT MODAL */}
      {isContractModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-5xl rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
              <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <div>
                   <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">New Commercial Engagement</h3>
                   <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Bound to Project: {project.name}</p>
                </div>
                <button onClick={() => setIsContractModalOpen(false)} className="p-5 hover:bg-slate-100 rounded-[2rem] text-slate-400 transition-all"><X size={36} /></button>
              </div>

              <form onSubmit={handleCreateContract} className="p-16 overflow-y-auto space-y-16 custom-scrollbar">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="space-y-10">
                       <h4 className="text-[12px] font-black text-blue-600 uppercase tracking-[0.3em] border-b border-blue-50 pb-3">1. Legal Identity</h4>
                       <div className="space-y-8">
                          <div className="space-y-3">
                             <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Contract Title</label>
                             <input required className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-black text-base uppercase outline-none focus:ring-4 focus:ring-blue-100" placeholder="e.g. Master Mechanical Services" value={contractForm.title} onChange={e => setContractForm({...contractForm, title: e.target.value})} />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Lifecycle Description</label>
                             <textarea required rows={4} className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-bold text-base outline-none focus:ring-4 focus:ring-blue-100 resize-none" placeholder="Primary commercial obligations..." value={contractForm.description} onChange={e => setContractForm({...contractForm, description: e.target.value})} />
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                             <div className="space-y-3">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Effective Start</label>
                                <input required type="date" min={project.startDate} max={project.endDate} className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold text-sm" value={contractForm.startDate} onChange={e => setContractForm({...contractForm, startDate: e.target.value})} />
                             </div>
                             <div className="space-y-3">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Termination</label>
                                <input required type="date" min={contractForm.startDate} max={project.endDate} className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold text-sm" value={contractForm.endDate} onChange={e => setContractForm({...contractForm, endDate: e.target.value})} />
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-10">
                       <h4 className="text-[12px] font-black text-blue-600 uppercase tracking-[0.3em] border-b border-blue-50 pb-3">2. Execution Scope</h4>
                       <div className="space-y-8">
                          <div className="space-y-4">
                             <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Vendor Mode</label>
                             <div className="grid grid-cols-2 gap-6">
                                <button type="button" onClick={() => setContractForm({...contractForm, vendorMode: 'IN_HOUSE'})} className={`py-5 rounded-3xl text-[11px] font-black uppercase tracking-widest border-2 transition-all ${contractForm.vendorMode === 'IN_HOUSE' ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>Internal</button>
                                <button type="button" onClick={() => setContractForm({...contractForm, vendorMode: 'OUTSOURCE'})} className={`py-5 rounded-3xl text-[11px] font-black uppercase tracking-widest border-2 transition-all ${contractForm.vendorMode === 'OUTSOURCE' ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>Vendor</button>
                             </div>
                          </div>
                          <div className="space-y-3">
                             <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Entitlement (Inherited)</label>
                             <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto p-4 bg-slate-50 rounded-3xl border border-slate-100">
                                {project.serviceIds.map(sid => (
                                  <label key={sid} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 cursor-pointer">
                                     <input type="checkbox" checked={contractForm.serviceIds.includes(sid)} onChange={() => setContractForm({...contractForm, serviceIds: toggleSelection(contractForm.serviceIds, sid)})} className="w-5 h-5 rounded text-blue-600" />
                                     <span className="text-sm font-black text-slate-700 uppercase truncate">{MOCK_SERVICES.find(s => s.id === sid)?.name}</span>
                                  </label>
                                ))}
                             </div>
                          </div>
                          <div className="space-y-3">
                             <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Commercial Value ($)</label>
                             <div className="relative">
                               <input required type="number" value={contractForm.value} onChange={e => setContractForm({...contractForm, value: e.target.value})} className="w-full bg-blue-50 border-2 border-blue-100 p-8 rounded-4xl text-4xl font-black tracking-tighter text-blue-700 placeholder:text-blue-200 outline-none" placeholder="0.00" />
                               <DollarSign className="absolute right-8 top-1/2 -translate-y-1/2 text-blue-300" size={40} />
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <button type="submit" className="w-full bg-blue-600 text-white py-10 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-lg shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-6">
                    <ShieldCheck size={32} />
                    Commit Binding Contract
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* 2. SOW MODAL */}
      {isSowModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[95vh]">
            <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                 <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Define Execution Scope</h3>
                 <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2">Statements of Work (SOW)</p>
              </div>
              <button onClick={() => setIsSowModalOpen(false)} className="p-5 hover:bg-slate-100 rounded-[2rem] text-slate-400 transition-all"><X size={36} /></button>
            </div>
            
            <form onSubmit={handleCreateSow} className="p-16 overflow-y-auto space-y-16 custom-scrollbar">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-12">
                     <div className="space-y-8">
                        <div className="space-y-3">
                           <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Scope Name</label>
                           <input required className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-black text-base uppercase outline-none focus:ring-4 focus:ring-blue-100" placeholder="e.g. Electrical Compliance Pack" value={sowForm.title} onChange={e => setSowForm({...sowForm, title: e.target.value})} />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Information & Description</label>
                           <textarea required rows={4} className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-bold text-base outline-none focus:ring-4 focus:ring-blue-100 resize-none" placeholder="Provide detailed operational deliverables..." value={sowForm.description} onChange={e => setSowForm({...sowForm, description: e.target.value})} />
                        </div>
                     </div>

                     <div className="space-y-8">
                        <h4 className="text-[12px] font-black text-blue-600 uppercase tracking-[0.3em] border-b border-blue-50 pb-3">Temporal Bounds</h4>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-3">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Threshold</label>
                              <input required type="date" className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold text-sm" value={sowForm.startDate} onChange={e => setSowForm({...sowForm, startDate: e.target.value})} />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Termination Point</label>
                              <input required type="date" min={sowForm.startDate} className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold text-sm" value={sowForm.endDate} onChange={e => setSowForm({...sowForm, endDate: e.target.value})} />
                           </div>
                        </div>
                        <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-start gap-4">
                           <Info size={24} className="text-blue-500 shrink-0 mt-1" />
                           <p className="text-[11px] text-blue-700 font-bold uppercase leading-relaxed">
                             SOW dates are validated against the Project lifecycle. Ensure the scope falls within commercial boundaries.
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-12">
                     <div className="space-y-8">
                        <h4 className="text-[12px] font-black text-blue-600 uppercase tracking-[0.3em] border-b border-blue-50 pb-3">Service & Policy</h4>
                        <div className="space-y-6">
                           <div className="space-y-3">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Parent Contract</label>
                              <select required className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-black text-sm uppercase appearance-none" value={sowForm.contractId} onChange={e => setSowForm({...sowForm, contractId: e.target.value, serviceId: ''})}>
                                 <option value="">Select Governing Contract...</option>
                                 {contracts.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                              </select>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Nature (Authorized Service)</label>
                              <select required className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-black text-sm uppercase appearance-none" value={sowForm.serviceId} onChange={e => setSowForm({...sowForm, serviceId: e.target.value})}>
                                 <option value="">Choose Component...</option>
                                 {contracts.find(c => c.id === sowForm.contractId)?.serviceIds.map(sid => (
                                   <option key={sid} value={sid}>{MOCK_SERVICES.find(s => s.id === sid)?.name}</option>
                                 ))}
                              </select>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-8">
                        <h4 className="text-[12px] font-black text-blue-600 uppercase tracking-[0.3em] border-b border-blue-50 pb-3">Frequency Governance</h4>
                        <div className="space-y-6">
                           <div>
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-4 block">Allowed Recurrence Patterns</label>
                              <div className="flex flex-wrap gap-2 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                 {FREQUENCY_OPTIONS.map(opt => (
                                   <button type="button" key={opt.value} onClick={() => setSowForm({...sowForm, allowedFrequencies: toggleSelection(sowForm.allowedFrequencies as string[], opt.value) as FrequencyType[]})} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase border-2 transition-all ${sowForm.allowedFrequencies.includes(opt.value) ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}>{opt.label}</button>
                                 ))}
                              </div>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Default Pattern for Auto-WO Generation</label>
                              <select required className="w-full bg-white border-2 border-slate-100 p-6 rounded-3xl font-black text-sm uppercase" value={sowForm.defaultFrequency} onChange={e => setSowForm({...sowForm, defaultFrequency: e.target.value as any})}>
                                 {sowForm.allowedFrequencies.length > 0 ? sowForm.allowedFrequencies.map(f => (
                                    <option key={f} value={f}>{FREQUENCY_OPTIONS.find(o => o.value === f)?.label}</option>
                                 )) : <option value="ADHOC">Ad-hoc (Manual Control)</option>}
                              </select>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="pt-16 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-3">
                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Spatial Allocation (Sites)</label>
                     <div className="grid grid-cols-2 gap-4 max-h-48 overflow-y-auto p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 custom-scrollbar">
                        {project.locationIds.map(locId => (
                          <label key={locId} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 cursor-pointer hover:border-blue-300 transition-all">
                             <input type="checkbox" checked={sowForm.locationIds.includes(locId)} onChange={() => setSowForm({...sowForm, locationIds: toggleSelection(sowForm.locationIds, locId)})} className="w-6 h-6 rounded-lg text-blue-600" />
                             <span className="text-xs font-black text-slate-700 uppercase truncate">{MOCK_LOCATIONS.find(l => l.id === locId)?.name}</span>
                          </label>
                        ))}
                     </div>
                  </div>
                  <div className="flex flex-col justify-end">
                     <button type="submit" className="w-full bg-slate-900 text-white py-10 rounded-[2.5rem] font-black uppercase tracking-[0.4em] shadow-2xl shadow-blue-100 hover:bg-black transition-all flex items-center justify-center gap-6 group">
                        <CheckCircle2 size={32} className="group-hover:scale-110 transition-transform" />
                        Finalize Scope Definition
                     </button>
                  </div>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. TASK SCHEDULER MODAL (PROFESSIONAL) */}
      {isTaskModalOpen && selectedSowForTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[4.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
            <div className="p-16 border-b border-slate-50 flex justify-between items-center bg-blue-600 text-white shrink-0">
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] opacity-80">
                   <Calendar size={20} /> Execution Stream Scheduler
                </div>
                <h3 className="text-5xl font-black uppercase tracking-tight leading-none">Plan Interaction</h3>
                <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Linked SOW: {selectedSowForTask.title}</p>
              </div>
              <button onClick={() => setIsTaskModalOpen(false)} className="p-6 hover:bg-white/10 rounded-[2.5rem] transition-all"><X size={40} /></button>
            </div>

            <form onSubmit={handleCreateTask} className="p-16 overflow-y-auto max-h-[75vh] space-y-12 custom-scrollbar">
               {/* Identity Section */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                     <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Task Protocol Name</label>
                        <input required className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-black text-lg uppercase outline-none focus:ring-4 focus:ring-blue-100" placeholder="e.g. Biannual Chassis Flush" value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Operational Instructions</label>
                        <textarea rows={3} className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-medium text-base outline-none focus:ring-4 focus:ring-blue-100 resize-none" placeholder="Provide context for the execution team..." value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} />
                     </div>
                  </div>
                  <div className="space-y-8">
                     <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Verification SOP (Checklist)</label>
                        <select required className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-black text-sm uppercase appearance-none" value={taskForm.checklistId} onChange={e => setTaskForm({...taskForm, checklistId: e.target.value})}>
                           <option value="">Select SOP Template...</option>
                           {MOCK_CHECKLISTS.map(ck => <option key={ck.id} value={ck.id}>{ck.name}</option>)}
                        </select>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Criticality</label>
                        <div className="grid grid-cols-4 gap-2">
                           {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as RequestPriority[]).map(p => (
                             <button type="button" key={p} onClick={() => setTaskForm({...taskForm, priority: p})} className={`py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all ${taskForm.priority === p ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'}`}>{p}</button>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               {/* Scheduling & Dynamic Frequency */}
               <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-6">
                        <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.3em] border-b border-blue-100 pb-2 flex items-center gap-2">
                           <Clock size={16} /> Temporal Setup
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Arrival Window</label>
                              <input required type="datetime-local" className="w-full bg-white border border-slate-200 p-4 rounded-2xl font-bold text-sm" value={taskForm.startTime} onChange={e => setTaskForm({...taskForm, startTime: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SLA Deadline</label>
                              <input required type="datetime-local" className="w-full bg-white border border-slate-200 p-4 rounded-2xl font-bold text-sm" value={taskForm.endTime} onChange={e => setTaskForm({...taskForm, endTime: e.target.value})} />
                           </div>
                        </div>
                     </div>
                     <div className="space-y-6">
                        <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.3em] border-b border-blue-100 pb-2 flex items-center gap-2">
                           <Repeat size={16} /> Recurrence Policy
                        </h4>
                        <div className="space-y-4">
                           <select required className="w-full bg-white border-2 border-blue-100 p-5 rounded-3xl font-black text-sm uppercase text-blue-600 shadow-lg shadow-blue-100/50" value={taskForm.frequency} onChange={e => setTaskForm({...taskForm, frequency: e.target.value as any, frequencyConfig: {}})}>
                              {selectedSowForTask.allowedFrequencies.map(f => (
                                <option key={f} value={f}>{f} Execution Pattern</option>
                              ))}
                           </select>

                           {/* --- DYNAMIC FREQUENCY CONFIG ITEMS --- */}
                           {taskForm.frequency === 'DAILY' && (
                             <div className="p-6 bg-white rounded-3xl border border-blue-100 animate-in zoom-in-95">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Recur Every (Days)</label>
                                <div className="flex items-center gap-4">
                                   <input type="number" min="1" className="w-20 bg-slate-50 border border-slate-100 p-4 rounded-2xl font-black text-center" defaultValue="1" onChange={e => setTaskForm({...taskForm, frequencyConfig: {...taskForm.frequencyConfig, interval: e.target.value}})} />
                                   <span className="text-xs font-bold text-slate-500 uppercase">Operational Days</span>
                                </div>
                             </div>
                           )}
                           {taskForm.frequency === 'WEEKLY' && (
                             <div className="p-6 bg-white rounded-3xl border border-blue-100 animate-in zoom-in-95">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Execution Days</label>
                                <div className="flex flex-wrap gap-2">
                                   {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                     <button type="button" key={day} onClick={() => {
                                        const current = taskForm.frequencyConfig.days || [];
                                        const next = current.includes(day) ? current.filter((d:any) => d !== day) : [...current, day];
                                        setTaskForm({...taskForm, frequencyConfig: {...taskForm.frequencyConfig, days: next}});
                                     }} className={`w-10 h-10 rounded-xl text-[10px] font-black uppercase transition-all ${taskForm.frequencyConfig.days?.includes(day) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{day[0]}</button>
                                   ))}
                                </div>
                             </div>
                           )}
                           {taskForm.frequency === 'MONTHLY' && (
                             <div className="p-6 bg-white rounded-3xl border border-blue-100 animate-in zoom-in-95">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Day of the Month</label>
                                <input type="number" min="1" max="31" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-black text-base" placeholder="e.g. 15th" onChange={e => setTaskForm({...taskForm, frequencyConfig: {...taskForm.frequencyConfig, dayOfMonth: e.target.value}})} />
                             </div>
                           )}
                           {taskForm.frequency === 'ADHOC' && (
                             <div className="p-6 bg-white rounded-3xl border border-blue-100 animate-in zoom-in-95">
                                <p className="text-[10px] text-blue-700 font-bold uppercase leading-relaxed text-center italic">Ad-hoc tasks trigger a singular Work Order instance without recurrence logic.</p>
                             </div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>

               {/* Resource & Entity Selection */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                  <div className="space-y-8">
                     <h4 className="text-[12px] font-black text-blue-600 uppercase tracking-[0.3em] border-b border-blue-50 pb-3 flex items-center gap-2">
                        <Users size={16} /> Assignee Authority
                     </h4>
                     <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 custom-scrollbar">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Available Groups</label>
                        {MOCK_GROUPS.map(grp => (
                          <label key={grp.id} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 cursor-pointer hover:border-blue-300 transition-all">
                             <input type="checkbox" checked={taskForm.assignedToIds.includes(grp.id)} onChange={() => setTaskForm({...taskForm, assignedToIds: toggleSelection(taskForm.assignedToIds, grp.id)})} className="w-5 h-5 rounded text-blue-600" />
                             <div>
                                <p className="text-xs font-black text-slate-700 uppercase">{grp.name}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Execution Group</p>
                             </div>
                          </label>
                        ))}
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4 mb-2 block">Direct Resourcing</label>
                        {MOCK_USERS.filter(u => u.status === 'ACTIVE').map(u => (
                          <label key={u.id} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 cursor-pointer hover:border-blue-300 transition-all">
                             <input type="checkbox" checked={taskForm.assignedToIds.includes(u.id)} onChange={() => setTaskForm({...taskForm, assignedToIds: toggleSelection(taskForm.assignedToIds, u.id)})} className="w-5 h-5 rounded text-blue-600" />
                             <div>
                                <p className="text-xs font-black text-slate-700 uppercase">{u.name}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{u.email}</p>
                             </div>
                          </label>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-8">
                     <h4 className="text-[12px] font-black text-blue-600 uppercase tracking-[0.3em] border-b border-blue-50 pb-3 flex items-center gap-2">
                        <Target size={16} /> Physical Entitles
                     </h4>
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Zone Deployment</label>
                           <select required className="w-full bg-slate-50 border border-slate-100 p-5 rounded-3xl font-black text-sm uppercase appearance-none" value={taskForm.locationId} onChange={e => setTaskForm({...taskForm, locationId: e.target.value, assetId: ''})}>
                              <option value="">Select Project Entity...</option>
                              {selectedSowForTask.locationIds.map(locId => (
                                 <option key={locId} value={locId}>{MOCK_LOCATIONS.find(l => l.id === locId)?.name}</option>
                              ))}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Specific Asset (Optional)</label>
                           <select className="w-full bg-slate-50 border border-slate-100 p-5 rounded-3xl font-black text-sm uppercase appearance-none" value={taskForm.assetId} onChange={e => setTaskForm({...taskForm, assetId: e.target.value})}>
                              <option value="">Zone-Wide Interaction</option>
                              {selectedSowForTask.assetIds.filter(aid => MOCK_ASSETS.find(a => a.id === aid)?.locationId === taskForm.locationId).map(aid => (
                                 <option key={aid} value={aid}>{MOCK_ASSETS.find(a => a.id === aid)?.name}</option>
                              ))}
                           </select>
                        </div>
                     </div>
                  </div>
               </div>

               <button type="submit" className="w-full bg-blue-600 text-white py-10 rounded-[3rem] font-black uppercase tracking-[0.5em] text-lg shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-6 group transform active:scale-95">
                 <Calendar className="group-hover:rotate-12 transition-transform" size={32} />
                 Authorize Execution Stream
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
