
import React, { useState, useMemo } from 'react';
import { MOCK_LOCATIONS, MOCK_ASSETS, MOCK_SOWS, MOCK_INVENTORY, MOCK_INVENTORY_REQUESTS, MOCK_INSTANCES } from '../constants';
import { Location, Asset } from '../types';
import { 
  Building, 
  MapPin, 
  Cpu, 
  Clock, 
  History, 
  DollarSign, 
  Plus, 
  ChevronRight,
  TrendingDown,
  Search,
  ChevronDown,
  Warehouse,
  Home,
  Package
} from 'lucide-react';

const AssetModule: React.FC = () => {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const selectedLocation = useMemo(() => 
    MOCK_LOCATIONS.find(l => l.id === selectedLocationId) || null
  , [selectedLocationId]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(expandedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedIds(next);
  };

  const calculateAging = (installDate: string) => {
    const install = new Date(installDate);
    const now = new Date();
    const years = now.getFullYear() - install.getFullYear();
    const months = now.getMonth() - install.getMonth();
    return { years, months: months < 0 ? months + 12 : months };
  };

  const getAssetKPIs = (assetId: string) => {
    const relatedSows = MOCK_SOWS.filter(s => s.assetId === assetId);
    const serviceCost = relatedSows.reduce((sum, s) => sum + (s.actualCost || 0), 0);
    
    // Find inventory consumed for this asset
    const relatedInstances = MOCK_INSTANCES.filter(i => i.data.assetId === assetId);
    const instanceIds = relatedInstances.map(i => i.id);
    const materialRequests = MOCK_INVENTORY_REQUESTS.filter(r => instanceIds.includes(r.instanceId));
    
    const materialCost = materialRequests.reduce((sum, r) => {
      const item = MOCK_INVENTORY.find(i => i.id === r.itemId);
      return sum + (r.quantity * (item?.unitCost || 0));
    }, 0);

    return { totalCost: serviceCost + materialCost, serviceCost, materialCost, incidents: relatedSows.length };
  };

  // Get all descendant IDs for a location recursively
  const getDescendantIds = (locationId: string): string[] => {
    const children = MOCK_LOCATIONS.filter(l => l.parentId === locationId);
    let ids = children.map(c => c.id);
    children.forEach(c => {
      ids = [...ids, ...getDescendantIds(c.id)];
    });
    return ids;
  };

  const assetsAtLocation = useMemo(() => {
    if (!selectedLocationId) return [];
    const descendantIds = [selectedLocationId, ...getDescendantIds(selectedLocationId)];
    return MOCK_ASSETS.filter(a => descendantIds.includes(a.locationId));
  }, [selectedLocationId]);

  const getLocationMaintenanceCost = (locationId: string) => {
    const descendantIds = [locationId, ...getDescendantIds(locationId)];
    const relatedSows = MOCK_SOWS.filter(s => descendantIds.includes(s.locationId));
    return relatedSows.reduce((sum, s) => sum + (s.actualCost || 0), 0);
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'BUILDING': return <Warehouse size={16} />;
      case 'FLOOR': return <LayersIcon size={16} />;
      case 'ROOM': return <Home size={16} />;
      default: return <MapPin size={16} />;
    }
  };

  const LayersIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 17l10 5 10-5M2 12l10 5 10-5M12 2L2 7l10 5 10-5-10-5z" />
    </svg>
  );

  const renderLocationTree = (parentId: string | undefined = undefined, level: number = 0) => {
    const locations = MOCK_LOCATIONS.filter(l => l.parentId === parentId);
    if (locations.length === 0) return null;

    return (
      <div className={`space-y-1 ${level > 0 ? 'ml-4 mt-1 border-l border-slate-100 pl-2' : ''}`}>
        {locations.map(location => {
          const isExpanded = expandedIds.has(location.id);
          const hasChildren = MOCK_LOCATIONS.some(l => l.parentId === location.id);
          const isSelected = selectedLocationId === location.id;

          return (
            <div key={location.id} className="space-y-1">
              <div 
                onClick={() => setSelectedLocationId(location.id)}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all group ${
                  isSelected ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`}>
                    {getLocationIcon(location.type)}
                  </div>
                  <div className="overflow-hidden">
                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>{location.name}</p>
                    {location.type === 'BUILDING' && !isSelected && (
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                        Total Exp: ${getLocationMaintenanceCost(location.id).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                {hasChildren && (
                  <button 
                    onClick={(e) => toggleExpand(location.id, e)}
                    className={`p-1 rounded-md transition-all ${isSelected ? 'hover:bg-white/20' : 'hover:bg-slate-200 text-slate-400'}`}
                  >
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                )}
              </div>
              {isExpanded && renderLocationTree(location.id, level + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  const getBreadcrumbs = () => {
    if (!selectedLocation) return null;
    const crumbs: Location[] = [];
    let current: Location | undefined = selectedLocation;
    while (current) {
      crumbs.unshift(current);
      current = MOCK_LOCATIONS.find(l => l.id === current?.parentId);
    }
    return (
      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-4">
        {crumbs.map((crumb, idx) => (
          <React.Fragment key={crumb.id}>
            <span className={idx === crumbs.length - 1 ? 'text-blue-600' : ''}>{crumb.name}</span>
            {idx < crumbs.length - 1 && <ChevronRight size={10} />}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Physical Assets & Portfolio</h2>
          <p className="text-slate-500 font-medium">Map your geographical locations and critical asset infrastructure.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
            <MapPin size={18} />
            New Location
          </button>
          <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2">
            <Plus size={18} />
            Register Asset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Locations Navigation */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                className="w-full bg-slate-50 border-none rounded-xl p-3 pl-10 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                placeholder="Find location..." 
              />
            </div>
            <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {renderLocationTree()}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-8">
          {selectedLocation ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
                <div className="relative z-10">
                  {getBreadcrumbs()}
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                      {getLocationIcon(selectedLocation.type)}
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{selectedLocation.name}</h3>
                  </div>
                  <p className="text-slate-500 font-medium ml-14">{selectedLocation.address || 'Standard Operational Zone'}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assets in Scope</p>
                      <p className="text-3xl font-black text-slate-900">{assetsAtLocation.length}</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Maint. Investment</p>
                      <p className="text-3xl font-black text-slate-900">${getLocationMaintenanceCost(selectedLocation.id).toLocaleString()}</p>
                    </div>
                    <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Zone Health</p>
                      <p className="text-3xl font-black text-emerald-700">92%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {assetsAtLocation.length > 0 ? (
                  assetsAtLocation.map(asset => {
                    const aging = calculateAging(asset.installationDate);
                    const kpis = getAssetKPIs(asset.id);
                    const lifespanProgress = (aging.years / asset.expectedLifespanYears) * 100;
                    
                    return (
                      <div 
                        key={asset.id} 
                        onClick={() => setSelectedAsset(asset)}
                        className={`bg-white rounded-[2rem] border-2 transition-all cursor-pointer overflow-hidden group ${
                          selectedAsset?.id === asset.id ? 'border-blue-600 ring-8 ring-blue-50/50' : 'border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="p-8">
                          <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl ${
                              asset.status === 'OPERATIONAL' ? 'bg-emerald-50 text-emerald-600' : 
                              asset.status === 'DEGRADED' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                            }`}>
                              <Cpu size={24} />
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${
                              asset.status === 'OPERATIONAL' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                              asset.status === 'DEGRADED' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-red-50 text-red-600 border-red-100'
                            }`}>
                              {asset.status}
                            </span>
                          </div>
                          <h4 className="text-xl font-black text-slate-900 mb-1">{asset.name}</h4>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{asset.category}</p>
                          
                          <div className="space-y-6">
                            <div>
                              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                                <span className="text-slate-400">Aging & Lifespan</span>
                                <span className={lifespanProgress > 75 ? 'text-red-500' : 'text-slate-600'}>
                                  {aging.years}Y {aging.months}M / {asset.expectedLifespanYears}Y
                                </span>
                              </div>
                              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                                 <div 
                                  className={`h-full transition-all duration-500 ${lifespanProgress > 75 ? 'bg-red-500' : lifespanProgress > 50 ? 'bg-amber-500' : 'bg-blue-500'}`}
                                  style={{ width: `${Math.min(lifespanProgress, 100)}%` }}
                                 ></div>
                              </div>
                            </div>

                            <div className="flex justify-between pt-4 border-t border-slate-50">
                               <div>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Lifecycle Cost</p>
                                  <p className="text-lg font-black text-slate-900">${kpis.totalCost.toLocaleString()}</p>
                               </div>
                               <div>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-right">Interventions</p>
                                  <p className="text-lg font-black text-slate-900 text-right">{kpis.incidents}</p>
                               </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="col-span-2 py-20 bg-white border border-dashed border-slate-200 rounded-[2rem] text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No direct assets found in this zone.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center flex flex-col items-center justify-center min-h-[500px]">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl shadow-slate-200 mb-8 animate-bounce">
                 <Building size={48} className="text-slate-200" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase mb-2">Initialize Portfolio Navigator</h3>
              <p className="text-slate-400 text-sm font-bold max-w-sm leading-relaxed">Select a building or asset zone from the registry on the left to inspect detailed maintenance metrics and aging data.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal Overlay for Asset */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
           <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="grid grid-cols-1 md:grid-cols-3 h-[700px]">
                <div className="bg-slate-50 p-10 border-r border-slate-100 flex flex-col justify-between">
                   <div>
                      <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-100 mb-8 inline-block">
                         <Cpu size={48} className="text-blue-600" />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">{selectedAsset.name}</h3>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">{selectedAsset.category} Infrastructure</p>
                      
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                           <History className="text-slate-400" size={20} />
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Maintenance</p>
                              <p className="text-sm font-black text-slate-700">{selectedAsset.lastMaintenanceDate || 'Not Recorded'}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <Clock className="text-slate-400" size={20} />
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Commissioned On</p>
                              <p className="text-sm font-black text-slate-700">{selectedAsset.installationDate}</p>
                           </div>
                        </div>
                      </div>
                   </div>
                   <button 
                    onClick={() => setSelectedAsset(null)}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs"
                   >
                     Close Inspector
                   </button>
                </div>

                <div className="md:col-span-2 p-12 overflow-y-auto space-y-10">
                   <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Historical Resource Consumption</h4>
                      <div className="space-y-4">
                        {/* Service Costs */}
                        {MOCK_SOWS.filter(s => s.assetId === selectedAsset.id).map(sow => (
                          <div key={sow.id} className="p-6 border border-slate-100 rounded-3xl flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-6">
                              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                <DollarSign size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-900">{sow.title}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Labor Service • {sow.startDate}</p>
                              </div>
                            </div>
                            <div className="text-right">
                               <p className="text-lg font-black text-slate-900">${sow.actualCost?.toLocaleString() || '0'}</p>
                               <p className="text-[10px] font-black text-emerald-600 uppercase">Settled</p>
                            </div>
                          </div>
                        ))}

                        {/* Material Costs */}
                        {MOCK_INVENTORY_REQUESTS.filter(r => {
                          const inst = MOCK_INSTANCES.find(i => i.id === r.instanceId);
                          return inst?.data.assetId === selectedAsset.id;
                        }).map(req => {
                          const item = MOCK_INVENTORY.find(i => i.id === req.itemId);
                          return (
                            <div key={req.id} className="p-6 border border-slate-100 rounded-3xl flex items-center justify-between hover:bg-slate-50 transition-colors">
                              <div className="flex items-center gap-6">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                                  <Package size={20} />
                                </div>
                                <div>
                                  <p className="text-sm font-black text-slate-900">{item?.name}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Material • Qty: {req.quantity}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-lg font-black text-slate-900">${(req.quantity * (item?.unitCost || 0)).toLocaleString()}</p>
                                 <p className="text-[10px] font-black text-amber-600 uppercase">Consumed</p>
                              </div>
                            </div>
                          );
                        })}

                        {MOCK_SOWS.filter(s => s.assetId === selectedAsset.id).length === 0 && (
                          <div className="p-10 border border-dashed border-slate-200 rounded-3xl text-center text-slate-400 font-bold uppercase text-[10px]">No historical data available</div>
                        )}
                      </div>
                   </div>

                   <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-100">
                      <div className="absolute top-0 right-0 p-10 opacity-10">
                        <TrendingDown size={120} />
                      </div>
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-blue-100">AI Reliability Forecast</h4>
                      <p className="text-2xl font-black leading-tight mb-8">This unit has reaching {Math.min(calculateAging(selectedAsset.installationDate).years / selectedAsset.expectedLifespanYears * 100, 100).toFixed(0)}% of its expected lifecycle. We recommend budgeting for replacement in the next 18 months.</p>
                      <button className="px-8 py-3 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Draft Replacement Plan</button>
                   </div>
                </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AssetModule;
