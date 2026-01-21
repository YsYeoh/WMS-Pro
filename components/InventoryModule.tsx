
import React, { useState } from 'react';
import { MOCK_INVENTORY, MOCK_INVENTORY_REQUESTS, MOCK_INSTANCES, MOCK_ASSETS, MOCK_LOCATIONS } from '../constants';
import { InventoryItem, InventoryUsageRequest } from '../types';
import { 
  Package, 
  Search, 
  Plus, 
  AlertTriangle, 
  DollarSign, 
  History, 
  ArrowUpRight, 
  MoreVertical,
  Layers,
  CheckCircle2,
  Clock,
  Archive,
  ShoppingCart,
  X,
  Edit3,
  Tag,
  Hash,
  Database,
  MapPin,
  Cpu,
  ArrowRight
} from 'lucide-react';

const InventoryModule: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [requests, setRequests] = useState<InventoryUsageRequest[]>(MOCK_INVENTORY_REQUESTS);
  const [activeTab, setActiveTab] = useState<'catalog' | 'requests'>('catalog');
  
  // Create/Edit State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  
  // History State
  const [historyItem, setHistoryItem] = useState<InventoryItem | null>(null);

  const [form, setForm] = useState<Omit<InventoryItem, 'id'>>({
    sku: '',
    name: '',
    category: 'General',
    quantity: 0,
    minStockLevel: 5,
    unitCost: 0,
    unit: 'pcs'
  });

  const getStatusBadge = (item: InventoryItem) => {
    if (item.quantity <= 0) return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-200">Out of Stock</span>;
    if (item.quantity <= item.minStockLevel) return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-200">Low Stock</span>;
    return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-200">Optimal</span>;
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setForm({
      sku: '',
      name: '',
      category: 'General',
      quantity: 0,
      minStockLevel: 5,
      unitCost: 0,
      unit: 'pcs'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setForm({
      sku: item.sku,
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      minStockLevel: item.minStockLevel,
      unitCost: item.unitCost,
      unit: item.unit
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? { ...form, id: editingItem.id } : i));
    } else {
      const newItem: InventoryItem = {
        ...form,
        id: `inv-${Date.now()}`
      };
      setItems([newItem, ...items]);
    }
    setIsModalOpen(false);
  };

  // Helper to get usage history for an item
  const getItemUsageHistory = (itemId: string) => {
    return requests.filter(r => r.itemId === itemId).map(req => {
      const instance = MOCK_INSTANCES.find(inst => inst.id === req.instanceId);
      const asset = MOCK_ASSETS.find(a => a.id === instance?.data.assetId);
      const location = MOCK_LOCATIONS.find(l => l.id === asset?.locationId);
      return { req, instance, asset, location };
    }).sort((a, b) => new Date(b.req.requestedAt).getTime() - new Date(a.req.requestedAt).getTime());
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Material Inventory</h2>
          <p className="text-slate-500 font-medium">Track spare parts, consumables, and material usage across assets.</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
            <Archive size={18} />
            Bulk Import
          </button>
          <button 
            onClick={handleOpenCreate}
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Add New Item
          </button>
        </div>
      </div>

      <div className="flex bg-slate-100/60 p-1.5 rounded-2xl w-fit border border-slate-50">
        <button 
          onClick={() => setActiveTab('catalog')}
          className={`px-10 py-3.5 text-xs font-black rounded-xl transition-all uppercase tracking-widest ${activeTab === 'catalog' ? 'bg-white shadow-xl shadow-slate-200 text-blue-600 border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Layers size={16} className="inline mr-2" />
          Stock Catalog
        </button>
        <button 
          onClick={() => setActiveTab('requests')}
          className={`px-10 py-3.5 text-xs font-black rounded-xl transition-all uppercase tracking-widest ${activeTab === 'requests' ? 'bg-white shadow-xl shadow-slate-200 text-blue-600 border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <ShoppingCart size={16} className="inline mr-2" />
          Usage Requests ({requests.length})
        </button>
      </div>

      {activeTab === 'catalog' ? (
        <div className="space-y-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input className="w-full bg-white border border-slate-200 rounded-2xl p-4 pl-12 text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-blue-100 transition-all" placeholder="Search SKU or Part Name..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-1 transition-all group">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Package size={24} />
                    </div>
                    {getStatusBadge(item)}
                  </div>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight mb-1">{item.name}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{item.sku} • {item.category}</p>
                  
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-slate-400">On Hand</span>
                        <span className="font-black text-slate-900">{item.quantity} {item.unit}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-50">
                        <span className="font-bold text-slate-400">Unit Value</span>
                        <span className="font-black text-slate-900">${item.unitCost}</span>
                     </div>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 px-8 border-t border-slate-100 flex justify-between items-center">
                   <button 
                    onClick={() => setHistoryItem(item)}
                    className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:underline"
                   >
                      <History size={14} /> Usage History
                   </button>
                   <button 
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                   >
                     <Edit3 size={16} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm animate-in slide-in-from-bottom-4 duration-500">
           <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Requested Item</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Linked Instance</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Qty</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map(req => {
                const item = items.find(i => i.id === req.itemId);
                const instance = MOCK_INSTANCES.find(i => i.id === req.instanceId);
                return (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-10 py-6">
                       <div className="flex items-center gap-4">
                          <div className="p-2 bg-slate-100 text-slate-400 rounded-lg">
                             <Package size={16} />
                          </div>
                          <div>
                             <p className="font-black text-slate-900 tracking-tight">{item?.name}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">By {req.requestedBy}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-6">
                       <p className="text-sm font-bold text-slate-600">{instance?.title || 'Standalone Request'}</p>
                       <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Ref: {req.instanceId}</p>
                    </td>
                    <td className="px-10 py-6 text-center font-black text-slate-900">
                       {req.quantity} {item?.unit}
                    </td>
                    <td className="px-10 py-6 text-right">
                       <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                         req.status === 'CONSUMED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                       }`}>
                         {req.status}
                       </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
           </table>
           {requests.length === 0 && (
             <div className="p-20 text-center text-slate-400">
                <Clock size={48} className="mx-auto mb-4 opacity-10" />
                <p className="font-black text-xs uppercase tracking-widest">No active inventory requests recorded.</p>
             </div>
           )}
        </div>
      )}

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-200 flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Portfolio Inventory Value</p>
               <h4 className="text-4xl font-black tracking-tighter">
                ${items.reduce((acc, curr) => acc + (curr.quantity * curr.unitCost), 0).toLocaleString()}
               </h4>
            </div>
            <div className="p-6 bg-white/10 rounded-3xl">
               <DollarSign size={40} className="text-blue-400" />
            </div>
         </div>
         <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Low Stock Alerts</p>
               <h4 className="text-4xl font-black tracking-tighter text-amber-600">
                {items.filter(i => i.quantity <= i.minStockLevel).length}
               </h4>
            </div>
            <div className="p-6 bg-amber-50 rounded-3xl">
               <AlertTriangle size={40} className="text-amber-500" />
            </div>
         </div>
         <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Categories Managed</p>
               <h4 className="text-4xl font-black tracking-tighter text-blue-600">
                {new Set(items.map(i => i.category)).size}
               </h4>
            </div>
            <div className="p-6 bg-blue-50 rounded-3xl">
               <ArrowUpRight size={40} className="text-blue-500" />
            </div>
         </div>
      </div>

      {/* History Modal */}
      {historyItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 h-[700px]">
               <div className="bg-slate-50 p-10 border-r border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xl mb-8 inline-block">
                        <Package size={48} className="text-blue-600" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2 uppercase">{historyItem.name}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">{historyItem.sku}</p>
                    
                    <div className="space-y-6">
                       <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Stock</p>
                          <p className="text-2xl font-black text-slate-900">{historyItem.quantity} {historyItem.unit}</p>
                       </div>
                       <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Category</p>
                          <p className="text-lg font-black text-slate-900 uppercase tracking-tight">{historyItem.category}</p>
                       </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setHistoryItem(null)}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs"
                   >
                     Close Traceability
                   </button>
               </div>

               <div className="md:col-span-2 p-12 overflow-y-auto space-y-10 custom-scrollbar">
                  <div>
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                       <History size={16} className="text-blue-600" /> Consumption Timeline
                    </h4>

                    <div className="space-y-10 relative">
                       <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-slate-100"></div>
                       
                       {getItemUsageHistory(historyItem.id).length > 0 ? (
                         getItemUsageHistory(historyItem.id).map(({ req, instance, asset, location }) => (
                           <div key={req.id} className="relative pl-16">
                              <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center z-10 shadow-sm group-hover:border-blue-500 transition-colors">
                                 <ArrowRight size={20} className="text-slate-300" />
                              </div>
                              <div className="space-y-3">
                                 <div className="flex justify-between items-start">
                                    <div>
                                       <p className="text-sm font-black text-slate-900 tracking-tight">Consumed {req.quantity} {historyItem.unit}</p>
                                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(req.requestedAt).toLocaleDateString()} • {req.requestedBy}</p>
                                    </div>
                                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-lg border border-emerald-100">
                                       {req.status}
                                    </span>
                                 </div>

                                 <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                                    <div className="flex items-center gap-3">
                                       <Database size={14} className="text-blue-500" />
                                       <p className="text-xs font-black text-slate-700 uppercase tracking-tight">{instance?.title || 'Unknown Task'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200/50">
                                       <div className="flex items-center gap-2">
                                          <Cpu size={14} className="text-slate-400" />
                                          <p className="text-[10px] font-bold text-slate-500 uppercase truncate">{asset?.name || 'Site-wide'}</p>
                                       </div>
                                       <div className="flex items-center gap-2">
                                          <MapPin size={14} className="text-slate-400" />
                                          <p className="text-[10px] font-bold text-slate-500 uppercase truncate">{location?.name || 'Portfolio'}</p>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                         ))
                       ) : (
                         <div className="py-20 text-center space-y-4 border-2 border-dashed border-slate-100 rounded-[2rem]">
                            <History size={40} className="mx-auto text-slate-200" />
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No consumption records found for this SKU.</p>
                         </div>
                       )}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                  {editingItem ? 'Refine Stock Item' : 'Provision New Material'}
                </h3>
                <p className="text-slate-500 font-medium">Update the organization's physical asset registry.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-slate-100 rounded-3xl text-slate-400 transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-12 space-y-8 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Part Name</label>
                  <div className="relative">
                    <input 
                      required 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all pl-12" 
                      placeholder="e.g. HEPA Filter" 
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                    />
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unique SKU</label>
                  <div className="relative">
                    <input 
                      required 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all pl-12" 
                      placeholder="HVAC-001" 
                      value={form.sku}
                      onChange={e => setForm({...form, sku: e.target.value})}
                    />
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all pl-12 appearance-none"
                      value={form.category}
                      onChange={e => setForm({...form, category: e.target.value})}
                    >
                      <option>General</option>
                      <option>HVAC</option>
                      <option>Electrical</option>
                      <option>Plumbing</option>
                      <option>IT</option>
                    </select>
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit Type</label>
                  <input 
                    required 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all" 
                    placeholder="pcs, roll, box..." 
                    value={form.unit}
                    onChange={e => setForm({...form, unit: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Qty</label>
                  <input 
                    type="number" 
                    required 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all" 
                    value={form.quantity}
                    onChange={e => setForm({...form, quantity: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit Cost ($)</label>
                  <input 
                    type="number" 
                    required 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all" 
                    value={form.unitCost}
                    onChange={e => setForm({...form, unitCost: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Min. Threshold</label>
                  <input 
                    type="number" 
                    required 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all" 
                    value={form.minStockLevel}
                    onChange={e => setForm({...form, minStockLevel: Number(e.target.value)})}
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-8 rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all mt-6">
                {editingItem ? 'Synchronize Registry' : 'Provision Stock'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryModule;
