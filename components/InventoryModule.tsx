
import React, { useState } from 'react';
import { MOCK_INVENTORY, MOCK_INVENTORY_REQUESTS, MOCK_INSTANCES } from '../constants';
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
  ShoppingCart
} from 'lucide-react';

const InventoryModule: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [requests, setRequests] = useState<InventoryUsageRequest[]>(MOCK_INVENTORY_REQUESTS);
  const [activeTab, setActiveTab] = useState<'catalog' | 'requests'>('catalog');

  const getStatusBadge = (item: InventoryItem) => {
    if (item.quantity <= 0) return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-200">Out of Stock</span>;
    if (item.quantity <= item.minStockLevel) return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-200">Low Stock</span>;
    return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-200">Optimal</span>;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
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
          <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2">
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
                   <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">
                      <History size={14} /> Usage History
                   </button>
                   <button className="p-2 text-slate-300 hover:text-slate-600"><MoreVertical size={16} /></button>
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
               <h4 className="text-4xl font-black tracking-tighter">$14,240</h4>
            </div>
            <div className="p-6 bg-white/10 rounded-3xl">
               <DollarSign size={40} className="text-blue-400" />
            </div>
         </div>
         <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Low Stock Alerts</p>
               <h4 className="text-4xl font-black tracking-tighter text-amber-600">3</h4>
            </div>
            <div className="p-6 bg-amber-50 rounded-3xl">
               <AlertTriangle size={40} className="text-amber-500" />
            </div>
         </div>
         <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Usage This Month</p>
               <h4 className="text-4xl font-black tracking-tighter text-blue-600">850 Units</h4>
            </div>
            <div className="p-6 bg-blue-50 rounded-3xl">
               <ArrowUpRight size={40} className="text-blue-500" />
            </div>
         </div>
      </div>
    </div>
  );
};

export default InventoryModule;
