
import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  Palette, 
  ShieldCheck, 
  Bell, 
  Link2, 
  Globe, 
  Lock, 
  Save, 
  CheckCircle2, 
  Mail, 
  Smartphone, 
  Zap, 
  Layers,
  ChevronRight,
  Database,
  Eye,
  Cloud,
  // Fix: Added missing icons Clock and AlertCircle
  Clock,
  AlertCircle
} from 'lucide-react';
import { useTenant } from '../App';

type SettingSection = 'organization' | 'branding' | 'governance' | 'notifications' | 'integrations' | 'security';

const SettingsModule: React.FC = () => {
  const { activeTenant } = useTenant();
  const [activeSection, setActiveSection] = useState<SettingSection>('organization');
  const [saveLoading, setSaveLoading] = useState(false);

  const NavButton = ({ id, icon: Icon, label }: { id: SettingSection, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveSection(id)}
      className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all font-black text-xs uppercase tracking-widest ${
        activeSection === id 
          ? 'bg-slate-900 text-white shadow-2xl shadow-slate-200' 
          : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      <Icon size={20} className={activeSection === id ? 'text-blue-400' : 'text-slate-400'} />
      {label}
      <ChevronRight size={16} className={`ml-auto transition-opacity ${activeSection === id ? 'opacity-100' : 'opacity-0'}`} />
    </button>
  );

  const handleSave = () => {
    setSaveLoading(true);
    setTimeout(() => setSaveLoading(false), 800);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
             <Settings className="text-blue-600" /> Platform Architecture
          </h2>
          <p className="text-slate-500 font-medium">Global configuration for <span className="text-blue-600 font-bold">{activeTenant.name}</span> ecosystem.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-3 active:scale-95"
        >
          {saveLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save size={18} />}
          Synchronize Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <div className="bg-white p-3 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-1">
             <NavButton id="organization" icon={Building2} label="Organization" />
             <NavButton id="branding" icon={Palette} label="Branding & UI" />
             <NavButton id="governance" icon={ShieldCheck} label="Governance" />
             <NavButton id="notifications" icon={Bell} label="Notifications" />
             <NavButton id="integrations" icon={Link2} label="Integrations" />
             <NavButton id="security" icon={Lock} label="Compliance" />
          </div>

          <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform">
                <Cloud size={80} />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-indigo-200">Active Tenant ID</p>
             <p className="text-sm font-black tracking-wider mb-6">{activeTenant.id.toUpperCase()}-PLATFORM-V3</p>
             <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Documentation</button>
          </div>
        </div>

        {/* Configuration Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm min-h-[600px] overflow-hidden flex flex-col">
             
             {/* ORGANIZATION SECTION */}
             {activeSection === 'organization' && (
               <div className="p-12 space-y-12 animate-in slide-in-from-right-4">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Core Identity</h3>
                    <p className="text-slate-400 font-medium">Define the primary operational parameters for your tenant instance.</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Entity Display Name</label>
                       <div className="relative">
                          <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold pl-12 outline-none focus:ring-4 focus:ring-blue-100" defaultValue={activeTenant.name} />
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       </div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Region</label>
                       <div className="relative">
                          <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold pl-12 outline-none focus:ring-4 focus:ring-blue-100 appearance-none">
                             <option>North America (East)</option>
                             <option>European Union (Dublin)</option>
                             <option>Asia Pacific (Singapore)</option>
                          </select>
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       </div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reporting Currency</label>
                       <div className="relative">
                          <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold pl-12 outline-none focus:ring-4 focus:ring-blue-100 appearance-none">
                             <option>USD ($) - United States Dollar</option>
                             <option>EUR (€) - Euro</option>
                             <option>GBP (£) - British Pound</option>
                          </select>
                          <Database className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       </div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Threshold Label</label>
                       <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100" defaultValue="Critical Infrastructure" />
                    </div>
                 </div>

                 <div className="pt-10 border-t border-slate-50">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-4 block">Organization Logo</label>
                    <div className="flex items-center gap-8">
                       <img src={activeTenant.logo} className="w-24 h-24 rounded-3xl bg-slate-100 p-2 shadow-xl border border-slate-100" alt="Logo Preview" />
                       <div className="space-y-3">
                          <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Update Graphic</button>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">PNG, SVG or WEBP (Max 2MB)</p>
                       </div>
                    </div>
                 </div>
               </div>
             )}

             {/* BRANDING SECTION */}
             {activeSection === 'branding' && (
               <div className="p-12 space-y-12 animate-in slide-in-from-right-4">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Interface Customization</h3>
                    <p className="text-slate-400 font-medium">Tailor the platform aesthetics to align with your corporate guidelines.</p>
                 </div>

                 <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
                    <div className="flex justify-between items-center mb-8">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Theme Preview</h4>
                       <div className="flex gap-2">
                          <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                          <div className="w-4 h-4 rounded-full bg-slate-900"></div>
                          <div className="w-4 h-4 rounded-full bg-indigo-500"></div>
                       </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                          <div className="w-full h-3 bg-slate-100 rounded mb-3"></div>
                          <div className="w-2/3 h-2 bg-slate-50 rounded"></div>
                       </div>
                       <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-200">
                          <div className="w-full h-3 bg-blue-600 rounded mb-3 shadow-md shadow-blue-100"></div>
                          <div className="w-1/2 h-2 bg-blue-50 rounded"></div>
                       </div>
                       <div className="bg-slate-900 p-6 rounded-2xl shadow-sm">
                          <div className="w-full h-3 bg-white/20 rounded mb-3"></div>
                          <div className="w-3/4 h-2 bg-white/10 rounded"></div>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Accent Primary Color</label>
                       <input type="color" className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl p-2 cursor-pointer" defaultValue="#2563eb" />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Interface Mode</label>
                       <div className="grid grid-cols-2 gap-4">
                          <button className="flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-blue-600 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest">
                            <Eye size={16} /> Standard
                          </button>
                          <button className="flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            Compact
                          </button>
                       </div>
                    </div>
                 </div>
               </div>
             )}

             {/* GOVERNANCE SECTION */}
             {activeSection === 'governance' && (
               <div className="p-12 space-y-12 animate-in slide-in-from-right-4">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Global Governance Policies</h3>
                    <p className="text-slate-400 font-medium">Establish constraints that govern all platform orchestration engines.</p>
                 </div>

                 <div className="space-y-6">
                    <div className="p-8 bg-white border-2 border-slate-100 rounded-[2rem] flex items-center justify-between group hover:border-blue-200 transition-all">
                       <div className="flex items-center gap-6">
                          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                             <ShieldCheck size={28} />
                          </div>
                          <div>
                             <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Remark Enforcement</h4>
                             <p className="text-xs text-slate-400 font-medium">Require reasons for all manual status overrides.</p>
                          </div>
                       </div>
                       <input type="checkbox" className="w-12 h-6 bg-slate-200 rounded-full appearance-none checked:bg-blue-600 relative transition-colors cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 checked:before:translate-x-6 before:transition-transform" defaultChecked />
                    </div>

                    <div className="p-8 bg-white border-2 border-slate-100 rounded-[2rem] flex items-center justify-between group hover:border-blue-200 transition-all">
                       <div className="flex items-center gap-6">
                          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
                             <Clock size={28} />
                          </div>
                          <div>
                             <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">SLA Safety Buffers</h4>
                             <p className="text-xs text-slate-400 font-medium">Auto-append 10% safety margin to all generated task deadlines.</p>
                          </div>
                       </div>
                       <input type="checkbox" className="w-12 h-6 bg-slate-200 rounded-full appearance-none checked:bg-blue-600 relative transition-colors cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 checked:before:translate-x-6 before:transition-transform" />
                    </div>

                    <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white flex items-center justify-between shadow-2xl">
                        <div className="flex items-center gap-6">
                           <div className="p-4 bg-white/10 text-white rounded-2xl">
                              <Zap size={28} />
                           </div>
                           <div>
                              <h4 className="text-sm font-black uppercase tracking-widest">Auto-Archive Engines</h4>
                              <p className="text-xs text-slate-400 font-medium italic">Complete processes older than 90 days are archived.</p>
                           </div>
                        </div>
                        <span className="text-[10px] font-black bg-white/10 px-4 py-1 rounded-full uppercase tracking-widest">Active</span>
                    </div>
                 </div>
               </div>
             )}

             {/* NOTIFICATIONS SECTION */}
             {activeSection === 'notifications' && (
               <div className="p-12 space-y-12 animate-in slide-in-from-right-4">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Communication Preferences</h3>
                    <p className="text-slate-400 font-medium">Control the volume and delivery channels for platform events.</p>
                 </div>

                 <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex flex-col items-center text-center space-y-4">
                          <Mail className="text-blue-600" />
                          <p className="text-[10px] font-black uppercase tracking-widest">Email Alerts</p>
                          <span className="text-[9px] px-3 py-1 bg-emerald-50 text-emerald-600 font-black rounded-lg uppercase">System Default</span>
                       </div>
                       <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex flex-col items-center text-center space-y-4">
                          <Smartphone className="text-slate-400" />
                          <p className="text-[10px] font-black uppercase tracking-widest">Push Notifications</p>
                          <button className="text-[9px] px-3 py-1 bg-white border border-slate-200 text-slate-500 font-black rounded-lg uppercase">Enable</button>
                       </div>
                       <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex flex-col items-center text-center space-y-4">
                          <Smartphone className="text-slate-400" />
                          <p className="text-[10px] font-black uppercase tracking-widest">SMS Gateway</p>
                          <button className="text-[9px] px-3 py-1 bg-white border border-slate-200 text-slate-500 font-black rounded-lg uppercase">Link Provider</button>
                       </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden">
                       <table className="w-full text-left border-collapse">
                          <thead className="bg-slate-50/50 border-b border-slate-50">
                             <tr>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">Event Trigger</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase text-center">Owner</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase text-center">Vendor</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase text-center">Admin</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                             {['New Triage Ticket', 'SLA Overdue', 'Inventory Depleted', 'Task Finalized'].map(event => (
                               <tr key={event} className="hover:bg-slate-50/50">
                                  <td className="px-8 py-5 text-sm font-bold text-slate-700">{event}</td>
                                  <td className="px-8 py-5 text-center"><input type="checkbox" className="w-4 h-4 rounded border-slate-300" defaultChecked /></td>
                                  <td className="px-8 py-5 text-center"><input type="checkbox" className="w-4 h-4 rounded border-slate-300" defaultChecked /></td>
                                  <td className="px-8 py-5 text-center"><input type="checkbox" className="w-4 h-4 rounded border-slate-300" /></td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
               </div>
             )}

             {/* INTEGRATIONS SECTION */}
             {activeSection === 'integrations' && (
                <div className="p-12 space-y-12 animate-in slide-in-from-right-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">External Connections</h3>
                    <p className="text-slate-400 font-medium">Bridge your workflow engine with external data silos and automation tools.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="p-8 border-2 border-slate-100 rounded-[2rem] space-y-6 group hover:border-blue-300 transition-all bg-slate-50/50">
                        <div className="flex justify-between items-start">
                           <div className="p-4 bg-white rounded-2xl shadow-sm"><Layers size={24} className="text-blue-600" /></div>
                           <span className="px-3 py-1 bg-white text-slate-400 border border-slate-200 rounded-lg text-[9px] font-black uppercase">Not Linked</span>
                        </div>
                        <div>
                           <h4 className="font-black text-slate-900 uppercase tracking-tight">ERP Integration</h4>
                           <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">Synchronize purchase orders and vendor invoicing with SAP or Oracle.</p>
                        </div>
                        <button className="w-full py-4 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-all group-hover:border-blue-600">Configure Webhook</button>
                     </div>

                     <div className="p-8 border-2 border-slate-100 rounded-[2rem] space-y-6 group hover:border-emerald-300 transition-all bg-emerald-50/20">
                        <div className="flex justify-between items-start">
                           <div className="p-4 bg-white rounded-2xl shadow-sm"><Zap size={24} className="text-emerald-600" /></div>
                           <span className="px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[9px] font-black uppercase">Active</span>
                        </div>
                        <div>
                           <h4 className="font-black text-slate-900 uppercase tracking-tight">IoT Sensor Grid</h4>
                           <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">Auto-trigger triage tickets based on telemetry hardware failures.</p>
                        </div>
                        <button className="w-full py-4 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-emerald-600 group-hover:text-white transition-all group-hover:border-emerald-600">Manage API Keys</button>
                     </div>
                  </div>

                  <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Request Custom Connector</p>
                  </div>
                </div>
             )}

             {/* SECURITY SECTION */}
             {activeSection === 'security' && (
                <div className="p-12 space-y-12 animate-in slide-in-from-right-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Privacy & Compliance</h3>
                    <p className="text-slate-400 font-medium">Maintain rigorous security standards and data sovereignty.</p>
                  </div>

                  <div className="space-y-6">
                     <div className="p-8 bg-white border-2 border-slate-100 rounded-[2rem] flex items-center justify-between">
                        <div>
                           <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Two-Factor Authentication</h4>
                           <p className="text-xs text-slate-400 font-medium">Enforce 2FA for all administrative and manager-level accounts.</p>
                        </div>
                        <input type="checkbox" className="w-12 h-6 bg-slate-200 rounded-full appearance-none checked:bg-blue-600 relative transition-colors cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 checked:before:translate-x-6 before:transition-transform" defaultChecked />
                     </div>

                     <div className="p-8 bg-white border-2 border-slate-100 rounded-[2rem] flex items-center justify-between">
                        <div>
                           <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Session Governance</h4>
                           <p className="text-xs text-slate-400 font-medium">Force logout after 4 hours of inactivity.</p>
                        </div>
                        <input type="checkbox" className="w-12 h-6 bg-slate-200 rounded-full appearance-none checked:bg-blue-600 relative transition-colors cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 checked:before:translate-x-6 before:transition-transform" defaultChecked />
                     </div>

                     <div className="p-10 bg-red-50 border border-red-100 rounded-[2.5rem]">
                        <h4 className="text-xs font-black text-red-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                           <AlertCircle size={16} /> Danger Zone
                        </h4>
                        <p className="text-sm text-red-700 font-medium mb-6">Purging tenant data is irreversible. All workflows, assets, and audit logs will be permanently deleted from our cold storage.</p>
                        <button className="px-8 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-100">Initiate Full Purge</button>
                     </div>
                  </div>
                </div>
             )}

             <div className="mt-auto bg-slate-50 border-t border-slate-100 p-8 px-12 flex justify-between items-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Build Version: 2.4.0-Stable</p>
                <div className="flex gap-6">
                   <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors underline">Legal Terms</button>
                   <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors underline">Privacy Policy</button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModule;
