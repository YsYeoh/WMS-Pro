
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Briefcase,
  Users,
  MessageSquare,
  Zap
} from 'lucide-react';
import { useTenant } from '../App';
import { MOCK_INSTANCES, MOCK_REQUESTS } from '../constants';
import { InstanceStatus } from '../types';

const StatCard = ({ icon: Icon, label, value, color, trend, onClick }: { icon: any, label: string, value: string | number, color: string, trend?: string, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm transition-all ${onClick ? 'cursor-pointer hover:shadow-xl hover:border-blue-200' : ''}`}
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10`}>
        <Icon className={color.replace('bg-', 'text-')} size={28} />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-emerald-600 text-xs font-black tracking-widest uppercase">
          <TrendingUp size={14} />
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</h3>
    <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const { activeTenant } = useTenant();
  const navigate = useNavigate();
  
  const tenantInstances = MOCK_INSTANCES.filter(inst => inst.tenantId === activeTenant.id);
  const openRequests = MOCK_REQUESTS.filter(r => r.status !== 'RESOLVED');

  const getStatusIcon = (status: InstanceStatus) => {
    switch (status) {
      case InstanceStatus.COMPLETED: return <CheckCircle2 className="text-emerald-500" size={18} />;
      case InstanceStatus.IN_PROGRESS: return <Clock className="text-amber-500" size={18} />;
      case InstanceStatus.CANCELLED: return <AlertCircle className="text-red-500" size={18} />;
      default: return <Clock className="text-slate-400" size={18} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Platform Command</h2>
          <p className="text-slate-500 font-medium">Real-time orchestration across <span className="text-blue-600 font-bold">{activeTenant.name}</span> infrastructure.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/requests')}
            className="flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-900 px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-lg"
          >
            <Zap size={18} className="text-blue-600" />
            Triage Desk
          </button>
          <button 
            onClick={() => navigate('/workflows/new')}
            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-100"
          >
            <Plus size={18} />
            Architect
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={MessageSquare} label="Open Triage" value={openRequests.length} color="bg-indigo-600" trend="New" onClick={() => navigate('/requests')} />
        <StatCard icon={Briefcase} label="Active Engines" value={tenantInstances.length} color="bg-blue-600" trend="+12%" />
        <StatCard icon={Clock} label="Pending Tasks" value="24" color="bg-amber-500" trend="+3" />
        <StatCard icon={Users} label="Commercial Partners" value="12" color="bg-slate-900" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Instances List */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
             <div>
                <h3 className="font-black text-slate-900 uppercase tracking-tight">Active Engine Instances</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Live Process Execution</p>
             </div>
             <button className="text-blue-600 text-xs font-black uppercase tracking-widest hover:underline">Global Registry</button>
          </div>
          <div className="divide-y divide-slate-50">
            {tenantInstances.map(inst => (
              <div 
                key={inst.id} 
                onClick={() => navigate(`/instance/${inst.id}`)}
                className="group p-8 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0 p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                    {getStatusIcon(inst.status)}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{inst.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-3 font-bold uppercase tracking-widest">
                      <span className="bg-slate-100 px-3 py-1 rounded-lg text-slate-600">
                        {inst.priority} PRIORITY
                      </span>
                      <span>• Created by {inst.createdBy}</span>
                      <span>• {new Date(inst.createdAt).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="hidden sm:block text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Accountable</p>
                    <p className="text-sm font-black text-slate-700">{inst.assignedTo || 'Unassigned'}</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Recent Events */}
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm p-8 flex flex-col">
          <h3 className="font-black text-slate-900 uppercase tracking-tight mb-8">System Audit Feed</h3>
          <div className="space-y-8 flex-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-5">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 text-sm font-black shadow-sm">
                    {String.fromCharCode(64 + i)}
                  </div>
                  {i < 4 && <div className="absolute top-14 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-50"></div>}
                </div>
                <div className="pt-1">
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    <span className="font-black text-slate-900">Commercial Partner Beta</span> moved 
                    <span className="font-black text-blue-600"> Triage #10{i} </span> 
                    to <span className="italic text-slate-500 font-bold">Execution</span>
                  </p>
                  <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest mt-2">{i * 15} mins ago</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all">
            Open Global Audit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
