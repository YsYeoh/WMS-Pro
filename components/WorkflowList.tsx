
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GitBranch, Plus, Search, MoreVertical, Play } from 'lucide-react';
import { useTenant } from '../App';
import { MOCK_WORKFLOWS } from '../constants';

const WorkflowList: React.FC = () => {
  const { activeTenant } = useTenant();
  const navigate = useNavigate();
  const workflows = MOCK_WORKFLOWS.filter(w => w.tenantId === activeTenant.id);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Workflow Templates</h2>
          <p className="text-slate-500">Define processes and lifecycle states for your assets.</p>
        </div>
        <button 
          onClick={() => navigate('/workflows/new')}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md"
        >
          <Plus size={18} />
          Create Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflows.map(wf => (
          <div key={wf.id} className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg">
                  <GitBranch size={20} />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    wf.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {wf.status}
                  </span>
                  <button className="p-1 hover:bg-slate-100 rounded text-slate-400">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors mb-2">{wf.name}</h3>
              <p className="text-slate-500 text-sm line-clamp-2 mb-4">{wf.description}</p>
              
              <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  {wf.states.length} States
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  {wf.transitions.length} Transitions
                </span>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button 
                onClick={() => navigate(`/workflows/${wf.id}`)}
                className="text-sm font-semibold text-slate-600 hover:text-blue-600"
              >
                Edit Config
              </button>
              <button className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all">
                <Play size={14} className="fill-slate-700" />
                Run
              </button>
            </div>
          </div>
        ))}

        <button 
          onClick={() => navigate('/workflows/new')}
          className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-all"
        >
          <div className="bg-slate-50 p-3 rounded-full mb-3 group-hover:bg-blue-100">
            <Plus size={24} />
          </div>
          <span className="font-semibold">New Template</span>
        </button>
      </div>
    </div>
  );
};

export default WorkflowList;
