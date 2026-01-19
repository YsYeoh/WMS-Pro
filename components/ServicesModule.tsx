
import React, { useState } from 'react';
import { MOCK_SERVICES } from '../constants';
import { Service, SubService } from '../types';
import { Plus, ChevronDown, ChevronRight, Wrench, LayoutGrid, FileText, X, FolderPlus, FilePlus } from 'lucide-react';

const ServicesModule: React.FC = () => {
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set(['srv-1']));
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isSubServiceModalOpen, setIsSubServiceModalOpen] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);

  const [serviceForm, setServiceForm] = useState({ name: '', description: '' });
  const [subServiceForm, setSubServiceForm] = useState({ name: '', description: '', baseUnit: 'Per Hour' });

  const toggleService = (id: string) => {
    const next = new Set(expandedServices);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedServices(next);
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

    setServices(services.map(s => {
      if (s.id === activeServiceId) {
        return { ...s, subServices: [...s.subServices, newSub] };
      }
      return s;
    }));

    setIsSubServiceModalOpen(false);
    setSubServiceForm({ name: '', description: '', baseUnit: 'Per Hour' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Service Catalog</h2>
          <p className="text-slate-500 font-medium">Define hierarchical natures of work for the platform.</p>
        </div>
        <button 
          onClick={() => setIsServiceModalOpen(true)}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2 uppercase tracking-widest"
        >
          <FolderPlus size={18} />
          Define Master Service
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {services.map(service => {
          const isExpanded = expandedServices.has(service.id);
          return (
            <div key={service.id} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div 
                className="p-8 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => toggleService(service.id)}
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <LayoutGrid size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{service.name}</h3>
                    <p className="text-sm text-slate-500 font-medium">{service.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hierarchy</p>
                    <p className="text-sm font-black text-slate-700">{service.subServices.length} Components</p>
                  </div>
                  {isExpanded ? <ChevronDown className="text-slate-400" /> : <ChevronRight className="text-slate-400" />}
                </div>
              </div>

              {isExpanded && (
                <div className="bg-slate-50/50 p-8 pt-0 animate-in slide-in-from-top-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-slate-100 pt-8">
                    {service.subServices.map(sub => (
                      <div key={sub.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-300 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <FileText size={20} />
                          </div>
                          <span className="text-[8px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-lg tracking-widest uppercase">
                            Unit: {sub.baseUnit}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-800 mb-1">{sub.name}</h4>
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{sub.description}</p>
                      </div>
                    ))}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveServiceId(service.id);
                        setIsSubServiceModalOpen(true);
                      }}
                      className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center gap-2 text-slate-400 hover:bg-white hover:border-blue-200 hover:text-blue-500 transition-all group"
                    >
                      <Plus size={20} className="group-hover:scale-125 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Add Sub-Service</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Master Service Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900">New Master Service</h3>
              <button onClick={() => setIsServiceModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><X /></button>
            </div>
            <form onSubmit={handleCreateService} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Name</label>
                <input required value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold" placeholder="e.g. Fire Safety" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                <textarea required value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold h-32" placeholder="Describe the master category..." />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase tracking-widest shadow-xl">Define Master Service</button>
            </form>
          </div>
        </div>
      )}

      {/* Sub Service Modal */}
      {isSubServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900">Define Component</h3>
              <button onClick={() => setIsSubServiceModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><X /></button>
            </div>
            <form onSubmit={handleCreateSubService} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Component Name</label>
                <input required value={subServiceForm.name} onChange={e => setSubServiceForm({...subServiceForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold" placeholder="e.g. Sprinkler Head Test" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Standard Base Unit</label>
                <select value={subServiceForm.baseUnit} onChange={e => setSubServiceForm({...subServiceForm, baseUnit: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold">
                  <option>Per Hour</option>
                  <option>Per Unit</option>
                  <option>Per Visit</option>
                  <option>Per Meter</option>
                  <option>Fixed</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                <textarea required value={subServiceForm.description} onChange={e => setSubServiceForm({...subServiceForm, description: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold h-24" placeholder="Detail the work component..." />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest shadow-xl">Add Component</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesModule;
