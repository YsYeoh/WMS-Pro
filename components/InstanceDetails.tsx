
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageSquare, 
  Paperclip, 
  History, 
  CheckCircle2, 
  Clock, 
  User,
  ArrowRightCircle,
  MoreVertical,
  Activity,
  Package,
  Plus,
  X,
  ShoppingCart,
  CheckCircle,
  // Added missing Workflow icon import
  Workflow
} from 'lucide-react';
import { MOCK_INSTANCES, MOCK_WORKFLOWS, MOCK_INVENTORY, MOCK_INVENTORY_REQUESTS } from '../constants';
import { InstanceStatus, InventoryItem, InventoryUsageRequest } from '../types';

const InstanceDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [instance, setInstance] = useState(MOCK_INSTANCES.find(i => i.id === id));
  const workflow = MOCK_WORKFLOWS.find(w => w.id === instance?.workflowId);
  
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [activeRequests, setActiveRequests] = useState<InventoryUsageRequest[]>(
    MOCK_INVENTORY_REQUESTS.filter(r => r.instanceId === id)
  );

  const [selectedItemId, setSelectedItemId] = useState('');
  const [requestQty, setRequestQty] = useState(1);

  if (!instance || !workflow) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-500">
        <Activity size={48} className="mb-4 opacity-20" />
        <h3 className="text-xl font-bold">Instance Not Found</h3>
        <p>The workflow execution record you are looking for does not exist.</p>
        <button onClick={() => navigate('/')} className="mt-6 text-blue-600 font-semibold underline">Back to Dashboard</button>
      </div>
    );
  }

  const currentState = workflow.states.find(s => s.id === instance.currentStateId);
  const availableTransitions = workflow.transitions.filter(t => t.fromStateId === instance.currentStateId);

  const handleRequestInventory = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = MOCK_INVENTORY.find(i => i.id === selectedItemId);
    if (!newItem) return;

    const newReq: InventoryUsageRequest = {
      id: `req-${Date.now()}`,
      instanceId: instance.id,
      itemId: selectedItemId,
      quantity: requestQty,
      requestedBy: 'Current Technician',
      status: 'PENDING',
      requestedAt: new Date().toISOString()
    };

    setActiveRequests([...activeRequests, newReq]);
    setIsInventoryModalOpen(false);
    setSelectedItemId('');
    setRequestQty(1);
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{instance.title}</h2>
              <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                instance.priority === 'HIGH' ? 'bg-red-50 text-red-700 border-red-100 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-100'
              }`}>
                {instance.priority} PRIORITY
              </span>
            </div>
            <p className="text-sm text-slate-500 flex items-center gap-2 font-medium">
              <span className="font-bold text-blue-600 uppercase tracking-wider">{workflow.name}</span>
              <span className="text-slate-200">|</span>
              <span className="font-black text-slate-400"># {instance.id.toUpperCase()}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-white rounded-2xl border border-transparent hover:border-slate-100 transition-all">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Progress Timeline Tracker */}
          <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-2">
              <Activity size={16} className="text-blue-500" />
              Engine Progression
            </h3>
            <div className="flex items-center w-full px-4">
              {workflow.states.map((state, idx) => {
                const isPast = workflow.states.findIndex(s => s.id === instance.currentStateId) > idx;
                const isCurrent = state.id === instance.currentStateId;
                
                return (
                  <React.Fragment key={state.id}>
                    <div className="flex flex-col items-center relative group flex-1">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center z-10 transition-all duration-300 shadow-lg ${
                        isPast ? 'bg-emerald-500 text-white shadow-emerald-100' : 
                        isCurrent ? 'bg-blue-600 text-white ring-8 ring-blue-50 shadow-blue-100 scale-110' : 
                        'bg-slate-50 text-slate-300'
                      }`}>
                        {isPast ? <CheckCircle2 size={24} /> : <span className="font-black">{idx + 1}</span>}
                      </div>
                      <span className={`text-[9px] mt-4 font-black uppercase tracking-widest text-center absolute -bottom-8 whitespace-nowrap transition-colors ${
                        isCurrent ? 'text-blue-600' : isPast ? 'text-emerald-600' : 'text-slate-400'
                      }`}>
                        {state.name}
                      </span>
                    </div>
                    {idx < workflow.states.length - 1 && (
                      <div className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${isPast ? 'bg-emerald-500' : 'bg-slate-100'}`}></div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            <div className="mt-16 pt-10 border-t border-slate-50">
               <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                 <Clock size={14} className="inline mr-2" />
                 Currently dwelling in <span className="text-blue-600 font-black uppercase tracking-tight">{currentState?.name}</span> since {new Date(instance.updatedAt).toLocaleTimeString()}.
               </p>
            </div>
          </section>

          {/* Instance Data & Materials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Operational Context</h3>
                </div>
                <div className="p-8 space-y-6">
                  {Object.entries(instance.data).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{key.replace(/([A-Z])/g, ' $1')}</label>
                      <p className="text-slate-800 font-black text-sm">{value}</p>
                    </div>
                  ))}
                </div>
             </section>

             <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Package size={16} className="text-blue-600" /> Materials & Inventory
                  </h3>
                  <button 
                    onClick={() => setIsInventoryModalOpen(true)}
                    className="p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="p-8 space-y-4">
                  {activeRequests.map(req => {
                    const item = MOCK_INVENTORY.find(i => i.id === req.itemId);
                    return (
                      <div key={req.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <div>
                            <p className="text-xs font-black text-slate-900">{item?.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Qty: {req.quantity} • {req.status}</p>
                         </div>
                         {req.status === 'CONSUMED' && <CheckCircle size={16} className="text-emerald-500" />}
                      </div>
                    );
                  })}
                  {activeRequests.length === 0 && (
                    <div className="py-6 text-center">
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No materials linked yet</p>
                    </div>
                  )}
                </div>
             </section>
          </div>

          {/* Activity/Audit Log */}
          <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <History size={18} className="text-slate-400" />
                Audit Trail
              </h3>
              <button className="text-blue-600 text-xs font-black uppercase tracking-widest hover:underline">Full Lifecycle Log</button>
            </div>
            <div className="p-8 space-y-8">
              {[1, 2].map(i => (
                <div key={i} className="flex gap-6 items-start relative">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-black shadow-inner">
                    <User size={20} />
                  </div>
                  <div className="pt-1">
                    <p className="text-sm text-slate-800 font-medium">
                      <span className="font-black text-slate-900">System Automator</span> moved to 
                      <span className="ml-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-xl font-black text-[10px] uppercase tracking-widest border border-blue-100">{currentState?.name}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">Oct 15, 10:45 AM • Auto-Trigger</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          {/* Current Actions */}
          <section className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-100 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               {/* Added Workflow icon usage with proper import */}
               <Workflow size={120} className="rotate-12" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] mb-4">Pending Task</h3>
              <p className="text-xl font-black mb-10 tracking-tight leading-tight">{currentState?.description}</p>
              
              <div className="space-y-4">
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Transition Paths</label>
                {availableTransitions.map(tr => (
                  <button 
                    key={tr.id}
                    className="w-full flex items-center justify-between p-5 bg-white/10 border border-white/10 rounded-[1.5rem] hover:bg-blue-600 hover:border-blue-400 transition-all group"
                  >
                    <div className="text-left">
                      <p className="font-black text-white text-sm uppercase tracking-wider">{tr.name}</p>
                      <p className="text-[9px] text-slate-400 group-hover:text-blue-100 font-bold">Target: {workflow.states.find(s => s.id === tr.toStateId)?.name}</p>
                    </div>
                    <ArrowRightCircle size={24} className="text-slate-500 group-hover:text-white" />
                  </button>
                ))}
                {availableTransitions.length === 0 && (
                  <div className="p-6 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center gap-3 border border-emerald-500/30">
                    <CheckCircle2 size={24} />
                    <span className="text-sm font-black uppercase tracking-widest">Process Finalized</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Quick Info Sidebar Items */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
            <div>
              <label className="text-[9px] font-black text-slate-400 uppercase block tracking-widest mb-3">Initiated By</label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black">
                   {instance.createdBy[0]}
                </div>
                <span className="text-sm font-black text-slate-800">{instance.createdBy}</span>
              </div>
            </div>
            <div>
              <label className="text-[9px] font-black text-slate-400 uppercase block tracking-widest mb-3">Accountable Entity</label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  <User size={18} className="text-slate-400" />
                </div>
                <span className="text-sm font-black text-slate-800">{instance.assignedTo || 'Unassigned'}</span>
              </div>
            </div>
          </section>

          {/* Communication */}
          <div className="flex gap-4">
            <button className="flex-1 flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-900 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
              <MessageSquare size={18} />
              Comms
            </button>
            <button className="w-16 flex items-center justify-center bg-white border border-slate-200 rounded-[1.5rem] text-slate-400 hover:text-blue-600 transition-all shadow-sm">
              <Paperclip size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Request Modal */}
      {isInventoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-10 pt-10 pb-6 flex justify-between items-center border-b border-slate-50">
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
                <ShoppingCart className="text-blue-600" /> Request Parts
              </h3>
              <button onClick={() => setIsInventoryModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"><X size={28} /></button>
            </div>
            <form onSubmit={handleRequestInventory} className="p-10 space-y-8">
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Stock Item</label>
                 <select 
                   required 
                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-black text-sm outline-none focus:ring-4 focus:ring-blue-100 transition-all" 
                   value={selectedItemId} 
                   onChange={e => setSelectedItemId(e.target.value)}
                 >
                   <option value="">Choose material...</option>
                   {MOCK_INVENTORY.map(i => (
                     <option key={i.id} value={i.id}>{i.name} ({i.quantity} in stock)</option>
                   ))}
                 </select>
               </div>
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Required Units</label>
                 <input 
                   type="number" 
                   min="1" 
                   value={requestQty} 
                   onChange={e => setRequestQty(Number(e.target.value))}
                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-black text-sm outline-none focus:ring-4 focus:ring-blue-100 transition-all" 
                 />
               </div>
               <button type="submit" className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
                 Authorize Requisition
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstanceDetails;
