
import React, { useState, useMemo, useRef } from 'react';
import { MOCK_SERVICES } from '../constants';
import { Service, SubService } from '../types';
import { 
  Plus, 
  ChevronRight, 
  Wrench, 
  LayoutGrid, 
  FileText, 
  X, 
  FolderPlus, 
  Download, 
  UploadCloud, 
  Search,
  Filter,
  MoreVertical,
  Edit3,
  Trash2,
  Settings2,
  Tags,
  Hash,
  Activity,
  Zap,
  ArrowRight
} from 'lucide-react';

const ServicesModule: React.FC = () => {
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [activeServiceId, setActiveServiceId] = useState<string>(services[0]?.id || '');
  const [subSearch, setSubSearch] = useState('');
  const [unitFilter, setUnitFilter] = useState<string>('ALL');

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isSubServiceModalOpen, setIsSubServiceModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const [serviceForm, setServiceForm] = useState({ name: '', description: '' });
  const [subServiceForm, setSubServiceForm] = useState({ name: '', description: '', baseUnit: 'Per Hour' });

  const activeService = useMemo(() => services.find(s => s.id === activeServiceId), [services, activeServiceId]);

  const filteredSubServices = useMemo(() => {
    if (!activeService) return [];
    return activeService.subServices.filter(sub => {
      const matchesSearch = sub.name.toLowerCase().includes(subSearch.toLowerCase()) || 
                           sub.id.toLowerCase().includes(subSearch.toLowerCase());
      const matchesUnit = unitFilter === 'ALL' || sub.baseUnit === unitFilter;
      return matchesSearch && matchesUnit;
    });
  }, [activeService, subSearch, unitFilter]);

  const unitTypes = useMemo(() => {
    if (!activeService) return [];
    return Array.from(new Set(activeService.subServices.map(s => s.baseUnit)));
  }, [activeService]);

  const handleExport = () => {
    const dataStr = JSON.stringify(services, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const fileName = `WMS_Catalog_${new Date().toISOString().split('T')[0]}.json`;
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', fileName);
    link.click();
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    const newSrv: Service = {
      id: `srv-${Date.now()}`,
      name: serviceForm.name,
      description: serviceForm.description,
      subServices: []
    };
    setServices([...services, newSrv]);
    setActiveServiceId(newSrv.id);
    setIsServiceModalOpen(false);
    setServiceForm({ name: '', description: '' });
  };

  const handleCreateSubService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeServiceId) return;
    const newSub: SubService = {
      id: `sub-${Date.now()}`,
      serviceId: activeServiceId,
      name: subServiceForm.name,
      description: subServiceForm.description,
      baseUnit: subServiceForm.baseUnit
    };
    setServices(services.map(s => s.id === activeServiceId ? { ...s, subServices: [...s.subServices, newSub] } : s));
    setIsSubServiceModalOpen(false);
    setSubServiceForm({ name: '', description: '', baseUnit: 'Per Hour' });
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-160px)] flex flex-col space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
             <Wrench className="text-blue-600" /> Service Explorer
          </h2>
          <p className="text-slate-500 font-medium">Platform-wide registry of engineering procedures and work codes.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
             <button onClick={handleExport} className="p-3 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all" title="Export Full Catalog"><Download size={20} /></button>
             <div className="w-px bg-slate-100 mx-1 self-stretch"></div>
             <button onClick={() => setIsImportModalOpen(true)} className="p-3 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all" title="Import via JSON"><UploadCloud size={20} /></button>
          </div>
          <button 
            onClick={() => setIsServiceModalOpen(true)}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all flex items-center gap-2 active:scale-95"
          >
            <FolderPlus size={18} /> Master Category
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-8 min-h-0 overflow-hidden">
        {/* Left Pane: Master Categories */}
        <aside className="w-80 flex flex-col gap-4 shrink-0 overflow-y-auto pr-2 custom-scrollbar">
           <div className="bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Engineering Domains</p>
              {services.map(service => (
                <button 
                  key={service.id}
                  onClick={() => setActiveServiceId(service.id)}
                  className={`w-full text-left p-5 rounded-2xl transition-all flex items-center justify-between group ${
                    activeServiceId === service.id 
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 ring-4 ring-blue-50' 
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className={`text-sm font-black uppercase tracking-tight truncate ${activeServiceId === service.id ? 'text-white' : 'text-slate-900'}`}>{service.name}</p>
                    <p className={`text-[10px] font-bold ${activeServiceId === service.id ? 'text-blue-100' : 'text-slate-400'}`}>
                      {service.subServices.length} Sub-Categories
                    </p>
                  </div>
                  <ChevronRight size={16} className={`shrink-0 transition-transform ${activeServiceId === service.id ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                </button>
              ))}
           </div>

           <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform"><Activity size={80} /></div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-blue-400">System Health</p>
              <h4 className="text-xl font-black mb-4">Registry Synced</h4>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 Global Cloud DB
              </div>
           </div>
        </aside>

        {/* Right Pane: High-Density Sub-Category Explorer */}
        <main className="flex-1 bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-w-0">
           {/* Header Area */}
           <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
              <div className="space-y-1 overflow-hidden">
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter truncate">{activeService?.name}</h3>
                <p className="text-sm font-medium text-slate-500 max-w-xl line-clamp-1 italic">"{activeService?.description}"</p>
              </div>
              <button 
                onClick={() => setIsSubServiceModalOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2 shrink-0 active:scale-95"
              >
                 <Plus size={16} /> Add Procedure Code
              </button>
           </div>

           {/* Toolbar */}
           <div className="p-6 border-b border-slate-50 flex flex-col lg:flex-row gap-4 shrink-0 bg-white">
              <div className="relative flex-1">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                   value={subSearch}
                   onChange={e => setSubSearch(e.target.value)}
                   className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 pl-12 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all" 
                   placeholder={`Search ${activeService?.subServices.length} sub-categories...`} 
                 />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scroll-hide">
                 <button 
                   onClick={() => setUnitFilter('ALL')}
                   className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${unitFilter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                 >
                    All Units
                 </button>
                 {unitTypes.map(unit => (
                    <button 
                      key={unit}
                      onClick={() => setUnitFilter(unit)}
                      className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${unitFilter === unit ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                       {unit}
                    </button>
                 ))}
              </div>
           </div>

           {/* High Density Table */}
           <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
              <table className="w-full text-left border-collapse table-fixed">
                 <thead className="sticky top-0 z-20 bg-white shadow-sm">
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                       <th className="w-16 px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Procedural Item</th>
                       <th className="w-40 px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Unit</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Technical Objective</th>
                       <th className="w-24 px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50 bg-white">
                    {filteredSubServices.map((sub, idx) => (
                      <tr key={sub.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-8 py-5">
                           <span className="text-[10px] font-black text-slate-300">0{idx + 1}</span>
                        </td>
                        <td className="px-8 py-5 overflow-hidden">
                           <p className="text-sm font-black text-slate-900 truncate uppercase tracking-tight">{sub.name}</p>
                           <p className="text-[9px] font-bold text-slate-400 truncate uppercase tracking-widest">{sub.id}</p>
                        </td>
                        <td className="px-8 py-5">
                           <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-sm">
                              {sub.baseUnit}
                           </span>
                        </td>
                        <td className="px-8 py-5 hidden md:table-cell overflow-hidden">
                           <p className="text-[11px] font-medium text-slate-400 italic line-clamp-1">{sub.description}</p>
                        </td>
                        <td className="px-8 py-5 text-right">
                           <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 bg-white border border-slate-100 rounded-lg text-slate-300 hover:text-blue-600 hover:shadow-lg transition-all"><Edit3 size={14} /></button>
                              <button className="p-2 bg-white border border-slate-100 rounded-lg text-slate-300 hover:text-red-500 hover:shadow-lg transition-all"><Trash2 size={14} /></button>
                           </div>
                        </td>
                      </tr>
                    ))}
                    {filteredSubServices.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-32 text-center">
                           <div className="max-w-xs mx-auto space-y-4">
                              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-200 border border-dashed border-slate-200">
                                 <Zap size={32} />
                              </div>
                              <p className="text-sm font-black text-slate-900 uppercase tracking-widest">No Procedures Found</p>
                              <p className="text-[11px] text-slate-400 font-medium">Try refining your search or add a new procedural code to this master category.</p>
                           </div>
                        </td>
                      </tr>
                    )}
                 </tbody>
              </table>
           </div>

           {/* Footer Stats */}
           <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0 px-8">
              <div className="flex gap-6">
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Loaded {filteredSubServices.length} Results</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">100% Schema Valid</span>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <button className="text-[10px] font-black text-slate-400 uppercase hover:text-blue-600 transition-colors">Previous</button>
                 <span className="text-[10px] font-black bg-white px-3 py-1 rounded-lg border border-slate-200 text-slate-900 shadow-sm">1</span>
                 <button className="text-[10px] font-black text-slate-400 uppercase hover:text-blue-600 transition-colors">Next</button>
              </div>
           </div>
        </main>
      </div>

      {/* --- MODALS --- */}

      {/* 1. MASTER SERVICE MODAL */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
             <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-900 text-white shrink-0">
               <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">New Master Category</h3>
                  <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Administrative Domain Setup</p>
               </div>
               <button onClick={() => setIsServiceModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all text-white"><X size={28} /></button>
             </div>
             <form onSubmit={handleCreateService} className="p-10 space-y-6">
                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Entity Display Name</label>
                      <input required value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100" placeholder="e.g. Fire Suppression" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operational Mandate</label>
                      <textarea required value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold h-32 outline-none focus:ring-4 focus:ring-blue-100 resize-none" placeholder="Describe the scope of work..." />
                   </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">Define Domain Entry</button>
             </form>
           </div>
        </div>
      )}

      {/* 2. SUB-SERVICE MODAL */}
      {isSubServiceModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
             <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-blue-600 text-white shrink-0">
               <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Append Procedural Code</h3>
                  <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Target Domain: {activeService?.name}</p>
               </div>
               <button onClick={() => setIsSubServiceModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all text-white"><X size={28} /></button>
             </div>
             <form onSubmit={handleCreateSubService} className="p-10 space-y-6">
                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Item Descriptor</label>
                      <input required value={subServiceForm.name} onChange={e => setSubServiceForm({...subServiceForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100" placeholder="e.g. Backflow preventer seal replacement" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Commercial Base Unit</label>
                         <select value={subServiceForm.baseUnit} onChange={e => setSubServiceForm({...subServiceForm, baseUnit: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none appearance-none">
                            <option>Per Hour</option>
                            <option>Per Unit</option>
                            <option>Fixed Rate</option>
                            <option>Per Sample</option>
                            <option>Per Car</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Code (Auto)</label>
                         <div className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-4 text-sm font-black text-slate-400 select-none">
                            GEN-NEW-XXXX
                         </div>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Technical Objective</label>
                      <textarea required value={subServiceForm.description} onChange={e => setSubServiceForm({...subServiceForm, description: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold h-24 outline-none focus:ring-4 focus:ring-blue-100 resize-none" placeholder="Provide technical context for technicians..." />
                   </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                  <ArrowRight size={20} /> Authorize Code Entry
                </button>
             </form>
           </div>
        </div>
      )}

      {/* 3. IMPORT MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
             <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 shrink-0">
               <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Bulk Intake Engine</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">JSON Schema Compliant Only</p>
               </div>
               <button onClick={() => setIsImportModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400"><X size={28} /></button>
             </div>
             <div className="p-12 text-center space-y-8">
                <div className="border-4 border-dashed border-slate-100 rounded-[2rem] p-12 hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer group">
                   <UploadCloud size={48} className="mx-auto text-slate-200 group-hover:text-blue-600 mb-4 transition-colors" />
                   <p className="text-sm font-black text-slate-900 mb-1 uppercase tracking-tight">Upload Catalog Stream</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Drag & Drop .json files here</p>
                </div>
                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4 text-left">
                   <Settings2 size={24} className="text-amber-500 shrink-0 mt-1" />
                   <p className="text-[10px] text-amber-700 font-bold leading-relaxed uppercase">Important: Importing will overwrite existing codes with matching unique identifiers. Verify data integrity before execution.</p>
                </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ServicesModule;
