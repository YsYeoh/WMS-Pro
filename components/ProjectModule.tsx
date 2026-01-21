
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PROJECTS, MOCK_SERVICES, MOCK_LOCATIONS } from '../constants';
import { Project } from '../types';
import { 
  Plus, 
  ChevronRight, 
  MoreVertical, 
  DollarSign, 
  Calendar, 
  Wrench, 
  MapPin, 
  X, 
  UploadCloud,
  Layers,
  FileText
} from 'lucide-react';

const ProjectModule: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Project Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    budget: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    serviceIds: [] as string[],
    locationIds: [] as string[]
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: `p-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      budget: Number(formData.budget),
      startDate: formData.startDate,
      endDate: formData.endDate,
      serviceIds: formData.serviceIds,
      locationIds: formData.locationIds,
      status: 'ACTIVE'
    };

    setProjects([newProject, ...projects]);
    setIsModalOpen(false);
    setFormData({ name: '', description: '', budget: '', startDate: '', endDate: '', serviceIds: [], locationIds: [] });
  };

  const toggleSelection = (list: string[], item: string) => 
    list.includes(item) ? list.filter(i => i !== item) : [...list, item];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Strategic Projects</h2>
          <p className="text-slate-500 font-medium">Orchestrate capital investments and large-scale maintenance cycles.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2 uppercase tracking-widest active:scale-95"
        >
          <Plus size={18} />
          Launch New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map(project => (
          <div 
            key={project.id} 
            className="group bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-slate-200 hover:border-blue-400 transition-all cursor-pointer flex flex-col shadow-sm"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <div className="p-10 flex-1">
              <div className="flex justify-between items-start mb-6">
                <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                  project.status === 'ACTIVE' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                    : 'bg-slate-50 text-slate-600 border-slate-100'
                }`}>
                  {project.status}
                </div>
                <button className="text-slate-300 hover:text-slate-600 p-1 transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
              <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-3 tracking-tighter leading-tight">{project.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-8 font-medium leading-relaxed italic">"{project.description}"</p>
              
              <div className="flex flex-wrap gap-2">
                {project.serviceIds.slice(0, 2).map(sid => (
                  <span key={sid} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-md text-[8px] font-black uppercase text-slate-400">
                    {MOCK_SERVICES.find(s => s.id === sid)?.name}
                  </span>
                ))}
                {project.serviceIds.length > 2 && <span className="text-[8px] font-black text-slate-300">+{project.serviceIds.length - 2} More</span>}
              </div>
            </div>

            <div className="px-10 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-5 text-[9px] font-black uppercase tracking-widest text-slate-500">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-blue-500" />
                  {project.startDate}
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <DollarSign size={14} />
                  {(project.budget / 1000).toFixed(0)}k Allocated
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="px-10 pt-10 pb-6 flex justify-between items-center border-b border-slate-50 shrink-0 bg-slate-50/50">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Provision Project</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Foundation for Commercial Contracts</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all">
                <X size={28} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-10 overflow-y-auto space-y-10 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Name</label>
                      <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Tower B Lifecycle Upgrade" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lifecycle Objectives</label>
                      <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Outline the strategic scope..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Start</label>
                          <input required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project End</label>
                          <input required type="date" min={formData.startDate} value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold" />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Allocate Master Services</label>
                       <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto p-4 bg-slate-50 rounded-2xl border border-slate-100 custom-scrollbar">
                          {MOCK_SERVICES.map(s => (
                            <label key={s.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 cursor-pointer hover:bg-blue-50 transition-colors">
                               <input type="checkbox" checked={formData.serviceIds.includes(s.id)} onChange={() => setFormData({...formData, serviceIds: toggleSelection(formData.serviceIds, s.id)})} className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                               <span className="text-xs font-bold text-slate-700 uppercase truncate">{s.name}</span>
                            </label>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Physical Site Assignment</label>
                       <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto p-4 bg-slate-50 rounded-2xl border border-slate-100 custom-scrollbar">
                          {MOCK_LOCATIONS.filter(l => l.brickClass === 'Building').map(l => (
                            <label key={l.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 cursor-pointer hover:bg-blue-50 transition-colors">
                               <input type="checkbox" checked={formData.locationIds.includes(l.id)} onChange={() => setFormData({...formData, locationIds: toggleSelection(formData.locationIds, l.id)})} className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                               <span className="text-xs font-bold text-slate-700 uppercase truncate">{l.name}</span>
                            </label>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Budget Allocation ($)</label>
                      <input required type="number" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} placeholder="500000" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold" />
                    </div>
                 </div>
              </div>

              <div className="p-8 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-3 text-slate-400 bg-slate-50/50 hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer">
                 <UploadCloud size={32} />
                 <p className="text-[10px] font-black uppercase tracking-widest">Optional Documents (Charter, Scans, Site Maps)</p>
              </div>

              <button 
                type="submit"
                className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-800 transition-all transform active:scale-[0.98]"
              >
                Create Project Entity
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectModule;
