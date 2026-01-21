
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
  Fingerprint,
  X,
  UserCircle,
  Activity,
  Check
} from 'lucide-react';

const ALL_PERMISSIONS: { id: Permission; label: string; desc: string }[] = [
  { id: 'workflow.view', label: 'View Workflows', desc: 'Can browse process templates' },
  { id: 'workflow.edit', label: 'Architect Workflows', desc: 'Can design and modify engines' },
  { id: 'workflow.execute', label: 'Trigger Engines', desc: 'Can start new process instances' },
  { id: 'inventory.view', label: 'Monitor Stock', desc: 'View current inventory levels' },
  { id: 'inventory.request', label: 'Requisition Parts', desc: 'Request materials for tasks' },
  { id: 'inventory.admin', label: 'Stock Governance', desc: 'Manage catalog and intake' },
  { id: 'task.view', label: 'Read Task Queue', desc: 'View operational task lists' },
  { id: 'task.execute', label: 'Perform Work', desc: 'Execute and complete assigned tasks' },
  { id: 'asset.view', label: 'Inspect Assets', desc: 'Access digital twin data' },
  { id: 'asset.edit', label: 'Modify Assets', desc: 'Update ontological asset data' },
  { id: 'tenant.admin', label: 'Platform Admin', desc: 'Global settings management' },
  { id: 'rbac.manage', label: 'Security Admin', desc: 'Manage users and permissions' },
  { id: 'request.create', label: 'File Requests', desc: 'Create help desk tickets' },
  { id: 'request.triage', label: 'Triage Manager', desc: 'Approve and dispatch requests' },
];

const RBACModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'groups'>('users');
  const [users, setUsers] = useState<AppUser[]>(MOCK_USERS);
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
  const [groups, setGroups] = useState<UserGroup[]>(MOCK_GROUPS);
  const [search, setSearch] = useState('');

  // Modals
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Forms
  const [userForm, setUserForm] = useState({ name: '', email: '', roleId: roles[0]?.id || '' });
  const [roleForm, setRoleForm] = useState({ name: '', description: '', permissions: [] as Permission[] });
  const [groupForm, setGroupForm] = useState({ name: '', description: '', memberIds: [] as string[] });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: AppUser = {
      id: `u-${Date.now()}`,
      ...userForm,
      status: 'ACTIVE',
      lastLogin: 'Never'
    };
    setUsers([...users, newUser]);
    setIsUserModalOpen(false);
    setUserForm({ name: '', email: '', roleId: roles[0]?.id || '' });
  };

  const handleCreateOrUpdateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRole) {
      setRoles(roles.map(r => r.id === editingRole.id ? { ...editingRole, ...roleForm } : r));
    } else {
      const newRole: Role = {
        id: `role-${Date.now()}`,
        ...roleForm
      };
      setRoles([...roles, newRole]);
    }
    setIsRoleModalOpen(false);
    setEditingRole(null);
    setRoleForm({ name: '', description: '', permissions: [] });
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    const newGroup: UserGroup = {
      id: `grp-${Date.now()}`,
      ...groupForm
    };
    setGroups([...groups, newGroup]);
    setIsGroupModalOpen(false);
    setGroupForm({ name: '', description: '', memberIds: [] });
  };

  const togglePermission = (perm: Permission) => {
    const current = roleForm.permissions;
    const next = current.includes(perm) ? current.filter(p => p !== perm) : [...current, perm];
    setRoleForm({ ...roleForm, permissions: next });
  };

  const toggleMember = (id: string) => {
    const current = groupForm.memberIds;
    const next = current.includes(id) ? current.filter(m => m !== id) : [...current, id];
    setGroupForm({ ...groupForm, memberIds: next });
  };

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
            <button 
              onClick={() => setIsUserModalOpen(true)}
              className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95"
            >
              <UserPlus size={18} />
              Invite User
            </button>
          )}
          {activeTab === 'roles' && (
            <button 
              onClick={() => { setEditingRole(null); setRoleForm({ name: '', description: '', permissions: [] }); setIsRoleModalOpen(true); }}
              className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95"
            >
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
                          <button 
                            onClick={() => setUsers(users.filter(u => u.id !== user.id))}
                            className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-300 hover:text-red-600 hover:shadow-xl transition-all"
                          >
                            <Trash2 size={18} />
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
                      <button 
                        onClick={() => {
                          setEditingRole(role);
                          setRoleForm({ name: role.name, description: role.description, permissions: role.permissions });
                          setIsRoleModalOpen(true);
                        }}
                        className="p-2 text-slate-300 hover:text-slate-600 transition-all"
                      >
                        <Settings size={20} />
                      </button>
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
                   <button 
                     onClick={() => {
                       setEditingRole(role);
                       setRoleForm({ name: role.name, description: role.description, permissions: role.permissions });
                       setIsRoleModalOpen(true);
                     }}
                     className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline"
                   >
                     Edit Policy
                   </button>
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
                   <button 
                     onClick={() => setGroups(groups.filter(g => g.id !== group.id))}
                     className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-300 hover:text-red-600 transition-all"
                   >
                      <Trash2 size={20} />
                   </button>
                </div>
              </div>
            ))}

            <button 
              onClick={() => setIsGroupModalOpen(true)}
              className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-4 text-slate-400 hover:bg-blue-50/50 hover:text-blue-600 hover:border-blue-300 transition-all font-black text-sm group min-h-[300px]"
            >
              <div className="bg-white p-6 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                <Plus size={32} />
              </div>
              <span className="uppercase tracking-[0.2em] text-xs">Assemble New Group</span>
            </button>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}

      {/* 1. USER MODAL */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-900 text-white">
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tighter">Invite Associate</h3>
                <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Access provisioning engine</p>
              </div>
              <button onClick={() => setIsUserModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all text-white"><X size={28} /></button>
            </div>
            <form onSubmit={handleCreateUser} className="p-10 space-y-6">
              <div className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Identity</label>
                   <input required value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100" placeholder="e.g. Robert Smith" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Communication Endpoint (Email)</label>
                   <input required type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100" placeholder="robert@organization.com" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Governance Role</label>
                   <select value={userForm.roleId} onChange={e => setUserForm({...userForm, roleId: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 appearance-none">
                      {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                   </select>
                 </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                <Check size={20} /> Authorize Invitation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. ROLE MODAL (POLICY ARCHITECT) */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-blue-600 text-white">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] opacity-80">
                   <Key size={16} /> Security Architect
                </div>
                <h3 className="text-4xl font-black uppercase tracking-tighter">{editingRole ? 'Refine Policy' : 'Provision Role'}</h3>
              </div>
              <button onClick={() => setIsRoleModalOpen(false)} className="p-5 hover:bg-white/10 rounded-[2rem] transition-all text-white"><X size={36} /></button>
            </div>
            <form onSubmit={handleCreateOrUpdateRole} className="p-16 overflow-y-auto custom-scrollbar bg-white flex-1 space-y-12">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="space-y-3">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Role Identifier</label>
                       <input required value={roleForm.name} onChange={e => setRoleForm({...roleForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 font-black text-lg uppercase outline-none focus:ring-4 focus:ring-blue-100" placeholder="e.g. Regional Auditor" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Functional Narrative</label>
                       <textarea rows={4} value={roleForm.description} onChange={e => setRoleForm({...roleForm, description: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 font-bold text-sm outline-none focus:ring-4 focus:ring-blue-100 resize-none" placeholder="Describe the commercial and operational mandate..." />
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 flex flex-col justify-center items-center text-center space-y-6">
                     <ShieldAlert size={64} className="text-blue-200" />
                     <div>
                        <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm">Policy Imprint</h4>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed mt-2 uppercase">Changes to this role will affect <span className="text-blue-600 font-black">{users.filter(u => u.roleId === editingRole?.id).length} active associates</span> immediately upon synchronization.</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-8">
                  <h4 className="text-[12px] font-black text-blue-600 uppercase tracking-[0.4em] border-b-2 border-blue-50 pb-4">Entitlement Matrix</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {ALL_PERMISSIONS.map(perm => {
                       const isSelected = roleForm.permissions.includes(perm.id);
                       return (
                         <div 
                           key={perm.id}
                           onClick={() => togglePermission(perm.id)}
                           className={`p-5 rounded-3xl border-2 transition-all cursor-pointer group flex items-start gap-4 ${
                             isSelected ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-100' : 'bg-white border-slate-100 hover:border-blue-300'
                           }`}
                         >
                            <div className={`mt-1 p-1 rounded-full border-2 transition-colors ${isSelected ? 'border-white bg-white text-blue-600' : 'border-slate-200 bg-slate-50 text-slate-200'}`}>
                               <Check size={12} strokeWidth={4} />
                            </div>
                            <div>
                               <p className={`text-xs font-black uppercase tracking-tight ${isSelected ? 'text-white' : 'text-slate-900 group-hover:text-blue-600'}`}>{perm.label}</p>
                               <p className={`text-[10px] font-medium leading-tight mt-1 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>{perm.desc}</p>
                            </div>
                         </div>
                       );
                     })}
                  </div>
               </div>

               <button type="submit" className="w-full bg-blue-600 text-white py-10 rounded-[3rem] font-black uppercase tracking-[0.4em] text-lg shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
                  Synchronize Access Policy
               </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. GROUP MODAL */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-indigo-600 text-white">
              <div className="space-y-2">
                <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">Assemble Operational Unit</h3>
                <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-2">Team aggregation engine</p>
              </div>
              <button onClick={() => setIsGroupModalOpen(false)} className="p-5 hover:bg-white/10 rounded-[2rem] transition-all text-white"><X size={36} /></button>
            </div>
            <form onSubmit={handleCreateGroup} className="p-16 overflow-y-auto custom-scrollbar bg-white flex-1 space-y-12">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="space-y-3">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Group Descriptor</label>
                       <input required value={groupForm.name} onChange={e => setGroupForm({...groupForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 font-black text-lg uppercase outline-none focus:ring-4 focus:ring-indigo-100" placeholder="e.g. Site Response Team B" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Strategic Mission</label>
                       <textarea rows={4} value={groupForm.description} onChange={e => setGroupForm({...groupForm, description: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-100 resize-none" placeholder="Provide operational context for this team cluster..." />
                    </div>
                  </div>

                  <div className="space-y-6">
                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Enlist Associates ({groupForm.memberIds.length})</label>
                     <div className="bg-slate-50 p-6 rounded-[3rem] border border-slate-100 max-h-64 overflow-y-auto custom-scrollbar space-y-3">
                        {users.map(user => {
                          const isSelected = groupForm.memberIds.includes(user.id);
                          return (
                            <div 
                              key={user.id}
                              onClick={() => toggleMember(user.id)}
                              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                                isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-50 hover:border-indigo-100'
                              }`}
                            >
                               <div className="flex items-center gap-4">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] ${isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    {user.name[0]}
                                  </div>
                                  <span className="text-xs font-black uppercase truncate max-w-[150px]">{user.name}</span>
                               </div>
                               {isSelected && <Check size={16} strokeWidth={4} />}
                            </div>
                          );
                        })}
                     </div>
                  </div>
               </div>

               <button type="submit" className="w-full bg-indigo-600 text-white py-10 rounded-[3rem] font-black uppercase tracking-[0.4em] text-lg shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-5">
                  <Fingerprint size={28} /> Deploy Operational Unit
               </button>
            </form>
          </div>
        </div>
      )}

      {/* Activity Summary / Health Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
         <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl flex items-center justify-between group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
               <ShieldAlert size={120} />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Policy Enforcement</p>
               <h4 className="text-4xl font-black tracking-tighter">Hardened</h4>
            </div>
         </div>
         <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm flex items-center justify-between group">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Unusual Logins (24h)</p>
               <h4 className="text-4xl font-black tracking-tighter text-emerald-600">Zero</h4>
            </div>
            <div className="p-6 bg-emerald-50 rounded-3xl group-hover:scale-110 transition-transform">
               <Activity size={40} className="text-emerald-500" />
            </div>
         </div>
         <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm flex items-center justify-between group">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Direct Provisioning</p>
               <h4 className="text-4xl font-black tracking-tighter text-blue-600">Active</h4>
            </div>
            <div className="p-6 bg-blue-50 rounded-3xl group-hover:scale-110 transition-transform text-blue-500">
               <UserCircle size={40} />
            </div>
         </div>
      </div>
    </div>
  );
};

export default RBACModule;
