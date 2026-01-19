
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MOCK_TASKS, 
  MOCK_SOWS, 
  MOCK_LOCATIONS, 
  MOCK_ASSETS, 
  MOCK_WORKFLOWS,
  MOCK_INSTANCES
} from '../constants';
import { ScheduledTask } from '../types';
import { 
  CalendarCheck, 
  Search, 
  Filter, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Play, 
  ChevronRight, 
  MapPin, 
  Cpu, 
  RefreshCw,
  LayoutGrid,
  ListTodo
} from 'lucide-react';

const TaskModule: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE'>('ALL');
  const [recurrenceFilter, setRecurrenceFilter] = useState<string>('ALL');

  const filteredTasks = useMemo(() => {
    return MOCK_TASKS.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filter === 'ALL' || task.status === filter;
      const matchesRecurrence = recurrenceFilter === 'ALL' || task.recurrence === recurrenceFilter;
      return matchesSearch && matchesStatus && matchesRecurrence;
    });
  }, [search, filter, recurrenceFilter]);

  const handleExecuteTask = (task: ScheduledTask) => {
    if (task.workflowInstanceId) {
      navigate(`/instance/${task.workflowInstanceId}`);
    } else {
      // In a real app, we would create the instance here
      // For mock, we'll just alert and maybe redirect to the first instance as demo
      const sow = MOCK_SOWS.find(s => s.id === task.sowId);
      const workflow = MOCK_WORKFLOWS.find(w => w.id === sow?.workflowDefinitionId);
      
      console.log(`Starting new workflow instance for task ${task.id} using workflow ${workflow?.name}`);
      // Simulate creation
      navigate(`/instance/inst1`);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'IN_PROGRESS': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'OVERDUE': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 size={16} />;
      case 'IN_PROGRESS': return <RefreshCw size={16} className="animate-spin-slow" />;
      case 'OVERDUE': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
             <CalendarCheck className="text-blue-600" /> Task Execution Engine
          </h2>
          <p className="text-slate-500 font-medium">Orchestrate PMs, inspections, and ad-hoc maintenance workflows.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
            <ListTodo size={18} />
            Quick Ad-hoc Task
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 pl-12 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all" 
            placeholder="Filter tasks by name or ID..." 
          />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 lg:pb-0">
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-100 rounded-xl px-6 py-3 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="OVERDUE">Overdue</option>
          </select>
          <select 
            value={recurrenceFilter}
            onChange={e => setRecurrenceFilter(e.target.value)}
            className="bg-slate-50 border border-slate-100 rounded-xl px-6 py-3 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Frequencies</option>
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="QUARTERLY">Quarterly</option>
            <option value="ANNUALLY">Annually</option>
            <option value="ADHOC">Ad-hoc</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => {
            const sow = MOCK_SOWS.find(s => s.id === task.sowId);
            const location = MOCK_LOCATIONS.find(l => l.id === sow?.locationId);
            const asset = MOCK_ASSETS.find(a => a.id === sow?.assetId);
            
            return (
              <div 
                key={task.id}
                className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group"
              >
                <div className="p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border flex items-center gap-2 ${getStatusStyle(task.status)}`}>
                        {getStatusIcon(task.status)}
                        {task.status.replace('_', ' ')}
                      </span>
                      {task.recurrence && task.recurrence !== 'ADHOC' && (
                        <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                           <RefreshCw size={12} /> {task.recurrence}
                        </span>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{task.title}</h3>
                      <p className="text-sm font-medium text-slate-400 mt-1">Ref: {task.id.toUpperCase()} • Part of SOW: {sow?.title}</p>
                    </div>

                    <div className="flex flex-wrap gap-6 pt-2">
                       <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-blue-500" />
                          <span className="text-xs font-black text-slate-600 uppercase tracking-tight">{location?.name || 'Site-wide'}</span>
                       </div>
                       {asset && (
                         <div className="flex items-center gap-2">
                            <Cpu size={16} className="text-blue-500" />
                            <span className="text-xs font-black text-slate-600 uppercase tracking-tight">{asset.name}</span>
                         </div>
                       )}
                       <div className="flex items-center gap-2">
                          <Clock size={16} className="text-slate-400" />
                          <span className="text-xs font-bold text-slate-500">Scheduled: {task.scheduledAt}</span>
                       </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 lg:border-l border-slate-100 lg:pl-10">
                    <div className="hidden sm:block text-right min-w-[120px]">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned To</p>
                      <p className="text-sm font-black text-slate-700">{task.assignedTo}</p>
                    </div>
                    
                    <button 
                      onClick={() => handleExecuteTask(task)}
                      className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 ${
                        task.status === 'COMPLETED' 
                          ? 'bg-emerald-600 text-white shadow-emerald-100 hover:bg-emerald-700' 
                          : 'bg-blue-600 text-white shadow-blue-100 hover:bg-blue-700'
                      }`}
                    >
                      {task.status === 'COMPLETED' ? (
                        <>View Report <ChevronRight size={18} /></>
                      ) : (
                        <>Execute Engine <Play size={18} fill="white" /></>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl shadow-slate-100 mx-auto mb-6">
              <LayoutGrid size={40} className="text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase">No Tasks Matched</h3>
            <p className="text-slate-400 font-medium max-w-sm mx-auto mt-2">Try adjusting your filters or search query to find specific operational tasks.</p>
          </div>
        )}
      </div>

      {/* Compliance Stats (Quick View) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">PM Compliance</p>
           <div className="flex items-end gap-3">
              <h4 className="text-4xl font-black tracking-tighter">94%</h4>
              <span className="text-emerald-400 text-xs font-bold mb-1">+2% vs LW</span>
           </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">MTTR (Repair Time)</p>
           <h4 className="text-4xl font-black tracking-tighter text-slate-900">4.2h</h4>
        </div>
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ready to Start</p>
           <h4 className="text-4xl font-black tracking-tighter text-blue-600">
             {MOCK_TASKS.filter(t => t.status === 'PENDING').length}
           </h4>
        </div>
        <div className="bg-red-600 rounded-[2rem] p-8 text-white shadow-xl shadow-red-100">
           <p className="text-[10px] font-black text-red-100 uppercase tracking-widest mb-2">Overdue Alerts</p>
           <h4 className="text-4xl font-black tracking-tighter">
             {MOCK_TASKS.filter(t => t.status === 'OVERDUE').length}
           </h4>
        </div>
      </div>
    </div>
  );
};

export default TaskModule;
