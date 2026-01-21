
import React, { useState } from 'react';
import { MOCK_VENDORS, MOCK_SERVICES, MOCK_TEAM_MEMBERS } from '../constants';
import { Vendor, SORSet, ScheduleOfRate, Service, SubService } from '../types';
import { 
  Star, 
  Mail, 
  User, 
  Phone, 
  Calculator, 
  Plus, 
  Users, 
  Building2, 
  Briefcase, 
  Clock, 
  MoreVertical, 
  FileSpreadsheet, 
  TrendingUp, 
  Target,
  ShieldCheck,
  Calendar,
  ChevronRight,
  X,
  CheckCircle2,
  Globe,
  Award,
  Trash2,
  ChevronDown
} from 'lucide-react';

const VendorModule: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [activeTab, setActiveTab] = useState<'vendors' | 'team'>('vendors');
  const [vendorDetailTab, setVendorDetailTab] = useState<'info' | 'sor'>('info');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(vendors[0] || null);

  // New Vendor Modal State
  const [isNewVendorModalOpen, setIsNewVendorModalOpen] = useState(false);
  const [newVendorForm, setNewVendorForm] = useState({
    name: '',
    contactName: '',
    email: '',
    phone: '',
    website: ''
  });

  // SOR Set Management State
  const [selectedSorSetId, setSelectedSorSetId] = useState<string | null>(null);
  const [isNewSorSetModalOpen, setIsNewSorSetModalOpen] = useState(false);
  const [newSorSetForm, setNewSorSetForm] = useState({ name: '', effectiveDate: new Date().toISOString().split('T')[0] });

  // SOR Calculation State
  const [calcServiceId, setCalcServiceId] = useState<string>('');
  const [calcSubServiceId, setCalcSubServiceId] = useState<string>('');
  const [calcUnits, setCalcUnits] = useState<number>(0);

  const activeSorSet = selectedVendor?.sorSets.find(s => s.id === (selectedSorSetId || selectedVendor.sorSets[0]?.id));
  const availableSubServices = MOCK_SERVICES.find(s => s.id === calcServiceId)?.subServices || [];
  const selectedSorItem = activeSorSet?.rates.find(sor => sor.subServiceId === calcSubServiceId);

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    const newVendor: Vendor = {
      id: `v-${Date.now()}`,
      name: newVendorForm.name,
      contactName: newVendorForm.contactName,
      email: newVendorForm.email,
      rating: 0,
      sorSets: []
    };

    const updatedVendors = [newVendor, ...vendors];
    setVendors(updatedVendors);
    setSelectedVendor(newVendor);
    setIsNewVendorModalOpen(false);
    setNewVendorForm({ name: '', contactName: '', email: '', phone: '', website: '' });
  };

  const handleCreateSorSet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendor) return;
    const newSet: SORSet = {
      id: `set-${Date.now()}`,
      name: newSorSetForm.name,
      effectiveDate: newSorSetForm.effectiveDate,
      rates: []
    };
    const updatedVendor = { ...selectedVendor, sorSets: [...selectedVendor.sorSets, newSet] };
    setVendors(vendors.map(v => v.id === selectedVendor.id ? updatedVendor : v));
    setSelectedVendor(updatedVendor);
    setSelectedSorSetId(newSet.id);
    setIsNewSorSetModalOpen(false);
    setNewSorSetForm({ name: '', effectiveDate: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Operational Resources</h2>
          <p className="text-slate-500 font-medium">Manage human capital and commercial partner relationships.</p>
        </div>
        
        <div className="flex bg-slate-100/60 p-1.5 rounded-2xl w-full md:w-auto border border-slate-100">
          <button 
            onClick={() => setActiveTab('vendors')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${activeTab === 'vendors' ? 'bg-white shadow-xl shadow-slate-200 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Building2 size={16} />
            Partner Network
          </button>
          <button 
            onClick={() => setActiveTab('team')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${activeTab === 'team' ? 'bg-white shadow-xl shadow-slate-200 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Users size={16} />
            Internal Capital
          </button>
        </div>
      </div>

      {activeTab === 'vendors' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Vendor List */}
          <div className="lg:col-span-1 space-y-6">
            <button 
              onClick={() => setIsNewVendorModalOpen(true)}
              className="w-full bg-slate-900 text-white p-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform" />
              Register New Partner
            </button>

            <div className="space-y-4">
              <div className="relative mb-6">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input className="w-full bg-white border border-slate-200 rounded-2xl p-4 pl-12 text-sm font-bold shadow-sm focus:ring-4 focus:ring-blue-100 transition-all outline-none" placeholder="Search partners..." />
              </div>
              {vendors.map(vendor => (
                <div 
                  key={vendor.id} 
                  className={`bg-white border-2 rounded-[2rem] p-6 transition-all cursor-pointer group shadow-sm ${
                    selectedVendor?.id === vendor.id ? 'border-blue-600 ring-8 ring-blue-50/50 shadow-blue-100' : 'border-slate-100 hover:border-slate-200'
                  }`}
                  onClick={() => { setSelectedVendor(vendor); setSelectedSorSetId(null); }}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-all ${
                      selectedVendor?.id === vendor.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'
                    }`}>
                      {vendor.name[0]}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h3 className="font-black text-slate-900 tracking-tight truncate">{vendor.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star size={12} fill="currentColor" />
                          <span className="text-[10px] font-black">{vendor.rating || 'New'}</span>
                        </div>
                        <span className="text-slate-300">•</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{vendor.sorSets.length} Rate Sets</span>
                      </div>
                    </div>
                    <ChevronRight size={18} className={`transition-transform ${selectedVendor?.id === vendor.id ? 'text-blue-600 translate-x-1' : 'text-slate-300'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details & SOR Management */}
          <div className="lg:col-span-2 space-y-8">
            {selectedVendor ? (
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px] animate-in slide-in-from-right-8 duration-500">
                <div className="p-10 pb-0 bg-slate-50/50">
                  <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-6">
                       <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100">
                          <ShieldCheck size={40} className="text-blue-600" />
                       </div>
                       <div>
                         <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{selectedVendor.name}</h3>
                         <p className="text-slate-500 font-bold flex items-center gap-2">
                           <Calendar size={14} /> Partner Record Active
                         </p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 transition-all shadow-sm"><Mail /></button>
                       <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 transition-all shadow-sm"><Phone /></button>
                    </div>
                  </div>

                  <div className="flex gap-8 border-b border-slate-100">
                    <button 
                      onClick={() => setVendorDetailTab('info')}
                      className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-4 ${vendorDetailTab === 'info' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}
                    >
                      Summary Info
                    </button>
                    <button 
                      onClick={() => setVendorDetailTab('sor')}
                      className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-4 ${vendorDetailTab === 'sor' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}
                    >
                      Commercial SOR Sets
                    </button>
                  </div>
                </div>

                <div className="p-10 flex-1">
                  {vendorDetailTab === 'info' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                       <div className="space-y-8">
                         <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                               <TrendingUp size={14} className="text-blue-600" /> Commercial Performance
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                               <div>
                                 <p className="text-xs font-bold text-slate-500">Total Awarded</p>
                                 <p className="text-2xl font-black text-slate-900">$0.0k</p>
                               </div>
                               <div>
                                 <p className="text-xs font-bold text-slate-500">Avg Compliance</p>
                                 <p className="text-2xl font-black text-slate-400">-%</p>
                               </div>
                            </div>
                         </div>
                         
                         <div className="p-2">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Accountable Contact</h4>
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">
                                 {selectedVendor.contactName[0]}
                               </div>
                               <div>
                                 <p className="text-sm font-black text-slate-800">{selectedVendor.contactName}</p>
                                 <p className="text-xs font-medium text-slate-400">{selectedVendor.email}</p>
                               </div>
                            </div>
                         </div>
                       </div>

                       <div className="bg-white border-2 border-slate-50 rounded-[2.5rem] p-8 shadow-sm">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Calculator size={16} className="text-blue-600" /> Instant Quote Tool
                          </h4>
                          <div className="space-y-6">
                            <div className="space-y-2">
                               <label className="text-[8px] font-black text-slate-400 uppercase">Select Rate Set</label>
                               <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all" value={selectedSorSetId || ''} onChange={e => setSelectedSorSetId(e.target.value)}>
                                  {selectedVendor.sorSets.map(set => <option key={set.id} value={set.id}>{set.name}</option>)}
                               </select>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[8px] font-black text-slate-400 uppercase">Nature of Work</label>
                               <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all" value={calcServiceId} onChange={e => setCalcServiceId(e.target.value)}>
                                  <option value="">Choose Service...</option>
                                  {MOCK_SERVICES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                               </select>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[8px] font-black text-slate-400 uppercase">Specific Component</label>
                               <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all" value={calcSubServiceId} onChange={e => setCalcSubServiceId(e.target.value)}>
                                  <option value="">Choose Component...</option>
                                  {availableSubServices.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                               </select>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[8px] font-black text-slate-400 uppercase">Operational Volume ({selectedSorItem?.unit || 'Units'})</label>
                               <input type="number" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all" placeholder="0" onChange={e => setCalcUnits(Number(e.target.value))} />
                            </div>

                            {selectedSorItem && (
                              <div className="pt-6 border-t border-slate-100 mt-6 animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex justify-between items-center mb-2">
                                   <span className="text-[10px] font-black text-slate-400">Unit Price</span>
                                   <span className="text-sm font-black text-slate-900">${selectedSorItem.rate}</span>
                                </div>
                                <div className="p-5 bg-blue-600 rounded-2xl shadow-xl shadow-blue-100 flex items-center justify-between text-white">
                                   <span className="text-[10px] font-black uppercase tracking-widest">Est. Cost</span>
                                   <span className="text-2xl font-black">${(selectedSorItem.rate * calcUnits).toLocaleString()}</span>
                                </div>
                              </div>
                            )}
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="space-y-8 animate-in fade-in duration-500">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
                         <div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active SOR Set</h4>
                            <div className="flex items-center gap-4">
                               <select 
                                 className="bg-white border border-slate-200 rounded-xl p-3 text-sm font-black text-blue-600 outline-none focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
                                 value={selectedSorSetId || selectedVendor.sorSets[0]?.id || ''}
                                 onChange={e => setSelectedSorSetId(e.target.value)}
                               >
                                  {selectedVendor.sorSets.map(set => (
                                    <option key={set.id} value={set.id}>{set.name}</option>
                                  ))}
                                  {selectedVendor.sorSets.length === 0 && <option value="">No Sets Found</option>}
                               </select>
                               <button 
                                 onClick={() => setIsNewSorSetModalOpen(true)}
                                 className="flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                               >
                                  <Plus size={14} /> New Set
                               </button>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Effective Horizon</p>
                            <p className="text-sm font-bold text-slate-700">{activeSorSet?.effectiveDate || 'N/A'}</p>
                         </div>
                      </div>
                      
                      {activeSorSet ? (
                        <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden">
                          <table className="w-full border-collapse">
                             <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                   <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Item</th>
                                   <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing Structure</th>
                                   <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Rate</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-100">
                                {activeSorSet.rates.length > 0 ? activeSorSet.rates.map(sor => {
                                   const masterService = MOCK_SERVICES.find(s => s.id === sor.serviceId);
                                   const subService = masterService?.subServices.find(sub => sub.id === sor.subServiceId);
                                   return (
                                      <tr key={sor.id} className="hover:bg-slate-50 transition-colors">
                                         <td className="px-8 py-6">
                                            <p className="text-sm font-black text-slate-900">{subService?.name || 'Unknown Item'}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">{masterService?.name}</p>
                                         </td>
                                         <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-tighter border border-slate-200">
                                               {sor.unit}
                                            </span>
                                         </td>
                                         <td className="px-8 py-6 text-right">
                                            <p className="text-lg font-black text-slate-900">${sor.rate.toLocaleString()}</p>
                                         </td>
                                      </tr>
                                   );
                                }) : (
                                  <tr>
                                    <td colSpan={3} className="px-8 py-20 text-center">
                                      <FileSpreadsheet size={48} className="mx-auto text-slate-100 mb-4" />
                                      <p className="text-sm font-black text-slate-300 uppercase tracking-widest">No Rates Defined for this Set</p>
                                    </td>
                                  </tr>
                                )}
                             </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                           <Plus size={48} className="mx-auto text-slate-100 mb-4" />
                           <p className="text-sm font-black text-slate-300 uppercase tracking-widest">Initialize a Commercial SOR Set to Manage Rates</p>
                        </div>
                      )}

                      <div className="flex items-center gap-4 p-8 bg-slate-50 border border-slate-100 rounded-[2rem]">
                         <FileSpreadsheet className="text-blue-600" size={32} />
                         <div>
                            <p className="text-sm font-black text-slate-900 tracking-tight">Bulk Import / Export Set</p>
                            <p className="text-xs text-slate-500 font-medium">Download or upload SOR data via CSV/Excel for large pricing revisions.</p>
                         </div>
                         <button className="ml-auto px-6 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-sm">Execute Sync</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center flex flex-col items-center justify-center min-h-[600px]">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl shadow-slate-200 mb-8 animate-bounce">
                   <Target size={48} className="text-slate-200" />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase mb-2">Initialize Resource View</h3>
                <p className="text-slate-400 text-sm font-bold max-w-sm leading-relaxed">Select a commercial partner from the left registry to manage their information and governance rates.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm animate-in fade-in duration-500">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Member</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Domain Role</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Organization</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Direct Comms</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Governance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_TEAM_MEMBERS.map(member => (
                <tr key={member.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black shadow-lg">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 tracking-tight">{member.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Status</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">{member.role}</span>
                  </td>
                  <td className="px-10 py-6 text-sm text-slate-500 font-black tracking-tight">{member.department}</td>
                  <td className="px-10 py-6 text-xs text-slate-400 font-bold">{member.email}</td>
                  <td className="px-10 py-6 text-right">
                    <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-300 hover:text-blue-600 hover:shadow-xl transition-all">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="w-full p-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 bg-slate-50 hover:bg-blue-50 transition-all border-t border-slate-100">
            + Provision New Internal Resource
          </button>
        </div>
      )}

      {/* NEW VENDOR MODAL */}
      {isNewVendorModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-4xl rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-slate-900 text-white">
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-blue-400">
                   <Award size={20} /> Commercial Onboarding
                </div>
                <h3 className="text-4xl font-black uppercase tracking-tighter leading-none text-white">Register Partner</h3>
                <p className="text-xs font-bold opacity-60 uppercase tracking-widest mt-2">Provisioning external commercial resource</p>
              </div>
              <button onClick={() => setIsNewVendorModalOpen(false)} className="p-5 hover:bg-white/10 rounded-[2rem] transition-all text-white"><X size={36} /></button>
            </div>

            <form onSubmit={handleCreateVendor} className="p-16 overflow-y-auto space-y-16 custom-scrollbar bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-10">
                   <h4 className="text-[12px] font-black text-blue-600 uppercase tracking-[0.4em] border-b-2 border-blue-50 pb-4 flex items-center gap-3">
                      <Building2 size={20} /> Entity Identity
                   </h4>
                   <div className="space-y-6">
                      <div className="space-y-3">
                         <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Business Name</label>
                         <input required className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-black text-base uppercase outline-none focus:ring-4 focus:ring-blue-100 transition-all" placeholder="e.g. Apex Industrial Solutions" value={newVendorForm.name} onChange={e => setNewVendorForm({...newVendorForm, name: e.target.value})} />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Corporate Website</label>
                         <div className="relative">
                            <input className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-bold text-sm pl-16 outline-none focus:ring-4 focus:ring-blue-100 transition-all" placeholder="www.apex-solutions.com" value={newVendorForm.website} onChange={e => setNewVendorForm({...newVendorForm, website: e.target.value})} />
                            <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
                         </div>
                      </div>
                   </div>
                </div>

                <div className="space-y-10">
                   <h4 className="text-[12px] font-black text-blue-600 uppercase tracking-[0.4em] border-b-2 border-blue-50 pb-4 flex items-center gap-3">
                      <User size={20} /> Primary Contact
                   </h4>
                   <div className="space-y-6">
                      <div className="space-y-3">
                         <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Accountable Officer</label>
                         <input required className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-black text-base uppercase outline-none focus:ring-4 focus:ring-blue-100 transition-all" placeholder="e.g. Jane Sterling" value={newVendorForm.contactName} onChange={e => setNewVendorForm({...newVendorForm, contactName: e.target.value})} />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Communication Endpoint (Email)</label>
                         <div className="relative">
                            <input required type="email" className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-bold text-sm pl-16 outline-none focus:ring-4 focus:ring-blue-100 transition-all" placeholder="jane@apex-solutions.com" value={newVendorForm.email} onChange={e => setNewVendorForm({...newVendorForm, email: e.target.value})} />
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
                         </div>
                      </div>
                      <div className="space-y-3">
                         <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Direct Phone</label>
                         <div className="relative">
                            <input className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-bold text-sm pl-16 outline-none focus:ring-4 focus:ring-blue-100 transition-all" placeholder="+1 (555) 000-0000" value={newVendorForm.phone} onChange={e => setNewVendorForm({...newVendorForm, phone: e.target.value})} />
                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
                         </div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 flex items-start gap-6">
                 <div className="p-4 bg-white rounded-2xl shadow-sm text-blue-600"><ShieldCheck size={32} /></div>
                 <div>
                    <h5 className="font-black text-slate-900 uppercase tracking-tight text-sm">Automated Governance Entry</h5>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-2xl mt-1 uppercase">Upon registration, this entity will be assigned a temporary "NEGOTIATING" status. You must define a Schedule of Rates (SOR) before assigning work orders to this partner.</p>
                 </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-12 rounded-[3rem] font-black uppercase tracking-[0.5em] text-xl shadow-2xl shadow-blue-100 hover:bg-blue-700 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-8 group">
                <CheckCircle2 className="group-hover:rotate-12 transition-transform" size={40} />
                Authorize Partner Entry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NEW SOR SET MODAL */}
      {isNewSorSetModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300">
             <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-blue-600 text-white rounded-t-[2.5rem]">
               <h3 className="text-xl font-black uppercase tracking-tight">Initialize Rate Set</h3>
               <button onClick={() => setIsNewSorSetModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X /></button>
             </div>
             <form onSubmit={handleCreateSorSet} className="p-8 space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rate Set Identifier</label>
                   <input required className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold" placeholder="e.g. FY2025 Standard" value={newSorSetForm.name} onChange={e => setNewSorSetForm({...newSorSetForm, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Effective Date</label>
                   <input type="date" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold" value={newSorSetForm.effectiveDate} onChange={e => setNewSorSetForm({...newSorSetForm, effectiveDate: e.target.value})} />
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Provision Rate Set</button>
             </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default VendorModule;
