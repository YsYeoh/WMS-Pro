
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PROJECTS } from '../constants';
import { Project } from '../types';
import { Briefcase, Calendar, ChevronRight, MoreVertical, Plus, TrendingUp, X, DollarSign, Type, AlignLeft } from 'lucide-react';

const ProjectModule: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Project Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    budget: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: `p-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      budget: Number(formData.budget),
      startDate: formData.startDate,
      status: 'ACTIVE'
    };

    setProjects([newProject, ...projects]);
    setIsModalOpen(false);
    setFormData({ name: '', description: '', budget: '', startDate: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Project Portfolio</h2>
          <p className="text-slate-500 font-medium">Orchestrate large-scale operations across multiple assets.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 hover:-translate-y-0.5 transition-all flex items-center gap-2 uppercase tracking-widest"
        >
          <Plus size={18} />
          Create Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map(project => (
          <div 
            key={project.id} 
            className="group bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-slate-200 hover:border-blue-400 transition-all cursor-pointer flex flex-col"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <div className="p-8 flex-1">
              <div className="flex justify-between items-start mb-6">
                <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                  project.status === 'ACTIVE' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                    : 'bg-slate-50 text-slate-600 border-slate-100'
                }`}>
                  {project.status}
                </div>
                <button className="text-slate-300 hover:text-slate-600 p-1">
                  <MoreVertical size={18} />
                </button>
              </div>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-3 leading-tight">{project.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-8 leading-relaxed font-medium">{project.description}</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Execution Progress</span>
                  <span className="text-blue-600">45%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 w-[45%] rounded-full shadow-sm shadow-blue-200"></div>
                </div>
              </div>
            </div>

            <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-slate-400" />
                  {project.startDate}
                </div>
                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  <DollarSign size={14} />
                  {(project.budget / 1000).toFixed(0)}k Budget
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}

        <button 
          onClick={() => setIsModalOpen(true)}
          className="border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center text-slate-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/50 transition-all group"
        >
          <div className="bg-white p-5 rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
            <Plus size={32} />
          </div>
          <span className="font-black text-sm uppercase tracking-widest">New Project Template</span>
        </button>
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl shadow-slate-900/20 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 pt-8 pb-4 flex justify-between items-center border-b border-slate-50">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Initialize Project</h3>
                <p className="text-sm text-slate-500 font-medium">Set core parameters for the new asset lifecycle.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Name</label>
                <div className="relative">
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Skyline Plaza Maintenance"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-100 outline-none transition-all pl-12"
                  />
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lifecycle Description</label>
                <div className="relative">
                  <textarea 
                    required
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Objectives and scope of this project..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-100 outline-none transition-all pl-12 resize-none"
                  />
                  <AlignLeft className="absolute left-4 top-4 text-slate-400" size={18} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Allocated Budget</label>
                  <div className="relative">
                    <input 
                      required
                      type="number" 
                      value={formData.budget}
                      onChange={e => setFormData({...formData, budget: e.target.value})}
                      placeholder="50000"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-100 outline-none transition-all pl-12"
                    />
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kickoff Date</label>
                  <div className="relative">
                    <input 
                      required
                      type="date" 
                      value={formData.startDate}
                      onChange={e => setFormData({...formData, startDate: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-100 outline-none transition-all pl-12"
                    />
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all mt-4"
              >
                Establish Portfolio Project
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectModule;
