
import React, { useState } from 'react';
import { MOCK_ROLES, MOCK_USERS, MOCK_GROUPS } from '../constants';
import { Role, AppUser, UserGroup, Permission } from '../types';
import { 
  ShieldCheck, 
  Users, 
  UserPlus, 
  Lock, 
  Key, 
  Search, 
  MoreVertical, 
  CheckCircle2, 
  XCircle,
  Mail,
  Clock,
  ChevronRight,
  ShieldAlert,
  Settings,
  Plus,
  Trash2,
  Filter,
  // Added missing Fingerprint icon
  Fingerprint
} from 'lucide-react';

const RBACModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'groups'>('users');
  const [users, setUsers] = useState<AppUser[]>(MOCK_USERS);
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
  const [groups, setGroups] = useState<UserGroup[]>(MOCK_GROUPS);

  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
             <ShieldCheck className="text-blue-600" /> Identity & Access Hub
          </h2>
          <p className="text-slate-500 font-medium">Manage permissions, user directory, and organizational hierarchies.</p>
        </div>
        <div className="flex gap-3">
          {activeTab === 'users' && (
            <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2">
              <UserPlus size={18} />
              Invite User
            </button>
          )}
          {activeTab === 'roles' && (
            <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2">
              <Plus size={18} />
              Create Custom Role
            </button>
          )}
        </div>
      </div>

      {/* Segmented Control */}
      <div className="flex bg-slate-100/60 p-1.5 rounded-[1.5rem] w-fit border border-slate-50 shadow-inner">
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-10 py-3.5 text-xs font-black rounded-xl transition-all uppercase tracking-widest flex items-center gap-2 ${activeTab === 'users' ? 'bg-white shadow-xl shadow-slate-200 text-blue-600 border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Users size={16} />
          Users Directory
        </button>
        <button 
          onClick={() => setActiveTab('roles')}
          className={`px-10 py-3.5 text-xs font-black rounded-xl transition-all uppercase tracking-widest flex items-center gap-2 ${activeTab === 'roles' ? 'bg-white shadow-xl shadow-slate-200 text-blue-600 border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Lock size={16} />
          Permission Roles
        </button>
        <button 
          onClick={() => setActiveTab('groups')}
          className={`px-10 py-3.5 text-xs font-black rounded-xl transition-all uppercase tracking-widest flex items-center gap-2 ${activeTab === 'groups' ? 'bg-white shadow-xl shadow-slate-200 text-blue-600 border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Fingerprint size={16} />
          User Groups
        </button>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {activeTab === 'users' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 pl-12 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all" 
                  placeholder="Search by name, email, or department..." 
                />
              </div>
              <button className="px-6 py-3 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 transition-all">
                <Filter size={20} />
              </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Role</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Groups</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map(user => {
                    const role = roles.find(r => r.id === user.roleId);
                    const group = groups.find(g => g.id === user.groupId);
                    return (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-black text-white flex items-center justify-center font-black shadow-lg">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-black text-slate-900 tracking-tight">{user.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <Mail size={12} /> {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">
                            {role?.name}
                          </span>
                        </td>
                        <td className="px-10 py-6">
                          {group ? (
                             <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                               {group.name}
                             </span>
                          ) : (
                             <span className="text-[10px] text-slate-300 font-bold uppercase italic">No Group</span>
                          )}
                        </td>
                        <td className="px-10 py-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {user.status === 'ACTIVE' ? (
                              <CheckCircle2 size={16} className="text-emerald-500" />
                            ) : (
                              <XCircle size={16} className="text-red-400" />
                            )}
                            <span className={`text-[10px] font-black uppercase tracking-widest ${user.status === 'ACTIVE' ? 'text-emerald-600' : 'text-red-400'}`}>
                              {user.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-300 hover:text-blue-600 hover:shadow-xl transition-all">
                            <MoreVertical size={20} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
            {roles.map(role => (
              <div key={role.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-400 transition-all flex flex-col group">
                <div className="p-10 flex-1">
                   <div className="flex justify-between items-start mb-6">
                      <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                         <Key size={24} />
                      </div>
                      <button className="p-2 text-slate-300 hover:text-slate-600"><Settings size={20} /></button>
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-2">{role.name}</h3>
                   <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">{role.description}</p>
                   
                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                         <ShieldCheck size={14} className="text-emerald-500" /> Authorized Permissions
                      </p>
                      <div className="flex flex-wrap gap-2">
                         {role.permissions.map(perm => (
                           <span key={perm} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black text-slate-600 uppercase tracking-wider">
                             {perm.replace('.', ': ')}
                           </span>
                         ))}
                      </div>
                   </div>
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center px-10">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                     In Use By <span className="text-slate-900 ml-1">{users.filter(u => u.roleId === role.id).length} Users</span>
                   </p>
                   <button className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">Edit Policy</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
            {groups.map(group => (
              <div key={group.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all group p-10">
                <div className="flex justify-between items-start mb-10">
                   <div className="p-5 bg-indigo-50 text-indigo-600 rounded-3xl shadow-xl shadow-indigo-100/30">
                      <Users size={32} />
                   </div>
                   <div className="flex -space-x-3">
                      {group.memberIds.slice(0, 3).map((mid, idx) => (
                        <div key={mid} className="w-10 h-10 rounded-xl border-4 border-white bg-slate-200 flex items-center justify-center font-black text-[10px] shadow-sm overflow-hidden">
                           <img src={`https://picsum.photos/40/40?random=${idx + 10}`} alt="" />
                        </div>
                      ))}
                      {group.memberIds.length > 3 && (
                        <div className="w-10 h-10 rounded-xl border-4 border-white bg-slate-100 flex items-center justify-center font-black text-[10px] shadow-sm text-slate-400">
                           +{group.memberIds.length - 3}
                        </div>
                      )}
                   </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-3">{group.name}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">{group.description}</p>
                
                <div className="pt-8 border-t border-slate-100 flex justify-between items-center">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Size</p>
                      <p className="text-lg font-black text-slate-900">{group.memberIds.length} Members</p>
                   </div>
                   <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-300 hover:text-blue-600 transition-all">
                      <ChevronRight size={20} />
                   </button>
                </div>
              </div>
            ))}

            <button className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-4 text-slate-400 hover:bg-blue-50/50 hover:text-blue-600 hover:border-blue-300 transition-all font-black text-sm group min-h-[300px]">
              <div className="bg-white p-6 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                <Plus size={32} />
              </div>
              <span className="uppercase tracking-[0.2em] text-xs">Assemble New Group</span>
            </button>
          </div>
        )}
      </div>

      {/* Security Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
         <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Policy Enforcement</p>
               <h4 className="text-4xl font-black tracking-tighter">Hardened</h4>
            </div>
            <div className="p-6 bg-white/10 rounded-3xl">
               <ShieldAlert size={40} className="text-blue-400" />
            </div>
         </div>
         <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Unusual Logins (24h)</p>
               <h4 className="text-4xl font-black tracking-tighter text-emerald-600">Zero</h4>
            </div>
            <div className="p-6 bg-emerald-50 rounded-3xl">
               <Clock size={40} className="text-emerald-500" />
            </div>
         </div>
         <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pending Invites</p>
               <h4 className="text-4xl font-black tracking-tighter text-blue-600">3</h4>
            </div>
            <div className="p-6 bg-blue-50 rounded-3xl">
               <Plus size={40} className="text-blue-500" />
            </div>
         </div>
      </div>
    </div>
  );
};

export default RBACModule;
