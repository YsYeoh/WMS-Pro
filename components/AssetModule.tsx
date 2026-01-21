
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  MOCK_LOCATIONS, 
  MOCK_ASSETS, 
  MOCK_SOWS, 
  MOCK_INVENTORY, 
  MOCK_INVENTORY_REQUESTS, 
  MOCK_INSTANCES, 
  MOCK_REQUESTS,
  BRICK_LOCATIONS, 
  BRICK_EQUIPMENT 
} from '../constants';
import { Location, Asset, BrickLocationClass, BrickEquipmentClass, BrickRelationship } from '../types';
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
  Package,
  Download,
  UploadCloud,
  X,
  AlertCircle,
  FileJson,
  Network,
  ArrowRightCircle,
  Tags,
  Zap,
  MessageSquare,
  Workflow,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

const AssetModule: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [locations, setLocations] = useState<Location[]>(MOCK_LOCATIONS);
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['loc-1', 'loc-2']));
  
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isNewAssetModalOpen, setIsNewAssetModalOpen] = useState(false);
  const [isNewLocationModalOpen, setIsNewLocationModalOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Deep Link Handling
  useEffect(() => {
    const assetId = searchParams.get('assetId');
    if (assetId) {
      const asset = assets.find(a => a.id === assetId);
      if (asset) {
        setSelectedAsset(asset);
        setSelectedLocationId(asset.locationId);
      }
    }
  }, [searchParams, assets]);

  // Form states
  const [newAssetForm, setNewAssetForm] = useState({
    name: '',
    brickClass: 'AHU' as BrickEquipmentClass,
    locationId: '',
    lifespan: '15'
  });

  const [newLocationForm, setNewLocationForm] = useState({
    name: '',
    brickClass: 'Room' as BrickLocationClass,
    parentId: ''
  });

  const selectedLocation = useMemo(() => 
    locations.find(l => l.id === selectedLocationId) || null
  , [selectedLocationId, locations]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(expandedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedIds(next);
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const newAsset: Asset = {
      id: `ast-${Date.now()}`,
      name: newAssetForm.name,
      brickClass: newAssetForm.brickClass,
      locationId: newAssetForm.locationId || selectedLocationId || '',
      status: 'OPERATIONAL',
      installationDate: new Date().toISOString().split('T')[0],
      expectedLifespanYears: Number(newAssetForm.lifespan),
      relationships: [],
      category: 'General'
    };
    setAssets([...assets, newAsset]);
    setIsNewAssetModalOpen(false);
  };

  const handleCreateLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const newLoc: Location = {
      id: `loc-${Date.now()}`,
      name: newLocationForm.name,
      brickClass: newLocationForm.brickClass,
      parentId: newLocationForm.parentId || selectedLocationId || undefined
    };
    setLocations([...locations, newLoc]);
    setIsNewLocationModalOpen(false);
  };

  const calculateAging = (installDate: string) => {
    const install = new Date(installDate);
    const now = new Date();
    const years = now.getFullYear() - install.getFullYear();
    const months = now.getMonth() - install.getMonth();
    return { years, months: months < 0 ? months + 12 : months };
  };

  const getAssetKPIs = (assetId: string) => {
    const relatedSows = MOCK_SOWS.filter(s => s.assetIds.includes(assetId));
    const serviceCost = relatedSows.reduce((sum, s) => sum + (s.actualCost || 0), 0);
    const relatedInstances = MOCK_INSTANCES.filter(i => i.data.assetId === assetId);
    const instanceIds = relatedInstances.map(i => i.id);
    const materialRequests = MOCK_INVENTORY_REQUESTS.filter(r => instanceIds.includes(r.instanceId));
    
    const materialCost = materialRequests.reduce((sum, r) => {
      const item = MOCK_INVENTORY.find(i => i.id === r.itemId);
      return sum + (r.quantity * (item?.unitCost || 0));
    }, 0);

    return { totalCost: serviceCost + materialCost, serviceCost, materialCost, incidents: relatedSows.length };
  };

  const getDescendantIds = (locationId: string): string[] => {
    const children = locations.filter(l => l.parentId === locationId);
    let ids = children.map(c => c.id);
    children.forEach(c => {
      ids = [...ids, ...getDescendantIds(c.id)];
    });
    return ids;
  };

  const assetsAtLocation = useMemo(() => {
    if (!selectedLocationId) return [];
    const descendantIds = [selectedLocationId, ...getDescendantIds(selectedLocationId)];
    return assets.filter(a => descendantIds.includes(a.locationId));
  }, [selectedLocationId, locations, assets]);

  const getLocationIcon = (brickClass: BrickLocationClass) => {
    switch (brickClass) {
      case 'Building': return <Warehouse size={16} />;
      case 'Floor': return <LayersIcon size={16} />;
      case 'Room': return <Home size={16} />;
      case 'Zone': case 'HVAC_Zone': return <Zap size={16} />;
      default: return <MapPin size={16} />;
    }
  };

  const LayersIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 17l10 5 10-5M2 12l10 5 10-5M12 2L2 7l10 5 10-5-10-5z" />
    </svg>
  );

  const renderLocationTree = (parentId: string | undefined = undefined, level: number = 0) => {
    const filteredLocations = locations.filter(l => l.parentId === parentId);
    if (filteredLocations.length === 0) return null;

    return (
      <div className={`space-y-1 ${level > 0 ? 'ml-4 mt-1 border-l border-slate-100 pl-2' : ''}`}>
        {filteredLocations.map(location => {
          const isExpanded = expandedIds.has(location.id);
          const hasChildren = locations.some(l => l.parentId === location.id);
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
                    {getLocationIcon(location.brickClass)}
                  </div>
                  <div className="overflow-hidden">
                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>{location.name}</p>
                    <p className={`text-[8px] font-black uppercase tracking-tighter ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                      Brick: {location.brickClass}
                    </p>
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

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
             <Network className="text-blue-600" /> Brick Digital Twin
          </h2>
          <p className="text-slate-500 font-medium">Graph-based ontological mapping of locations and infrastructure.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setIsNewLocationModalOpen(true)}
            className="bg-white border border-slate-200 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <MapPin size={18} />
            Add Spatial Entity
          </button>
          <button 
            onClick={() => setIsNewAssetModalOpen(true)}
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Register Equipment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                className="w-full bg-slate-50 border-none rounded-xl p-3 pl-10 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                placeholder="Traverse graph..." 
              />
            </div>
            <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {renderLocationTree()}
            </div>
          </div>

          <div className="p-6 bg-blue-600 rounded-[2rem] text-white shadow-xl">
             <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-80">Schema Validation</h4>
             <div className="space-y-3">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                   <span className="text-[10px] font-bold">Spatial Hierarchy Consistent</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                   <span className="text-[10px] font-bold">Logical Flow Validated</span>
                </div>
             </div>
          </div>
        </div>

        {/* Workspace */}
        <div className="lg:col-span-3 space-y-8">
          {selectedLocation ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                      {getLocationIcon(selectedLocation.brickClass)}
                    </div>
                    <div>
                       <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{selectedLocation.name}</h3>
                       <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{selectedLocation.brickClass} Entity</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Downstream Room Count</p>
                      <p className="text-3xl font-black text-slate-900">{getDescendantIds(selectedLocation.id).length}</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Primary Assets</p>
                      <p className="text-3xl font-black text-slate-900">{assetsAtLocation.length}</p>
                    </div>
                    <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">SLA Health</p>
                      <p className="text-3xl font-black text-emerald-700">92%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {assetsAtLocation.length > 0 ? (
                  assetsAtLocation.map(asset => (
                    <div 
                      key={asset.id} 
                      onClick={() => {
                        setSelectedAsset(asset);
                        setSearchParams({ assetId: asset.id });
                      }}
                      className={`bg-white rounded-[2.5rem] border-2 transition-all cursor-pointer overflow-hidden group p-8 ${
                        selectedAsset?.id === asset.id ? 'border-blue-600 ring-8 ring-blue-50/50' : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className={`p-4 rounded-2xl ${
                          asset.status === 'OPERATIONAL' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                          <Cpu size={24} />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border bg-slate-50 border-slate-100">
                          Brick: {asset.brickClass}
                        </span>
                      </div>
                      <h4 className="text-xl font-black text-slate-900 mb-1">{asset.name}</h4>
                      
                      <div className="space-y-6 mt-6">
                        {asset.relationships.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {asset.relationships.map((rel, idx) => (
                              <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-[8px] font-black uppercase tracking-widest border border-blue-100 flex items-center gap-1.5">
                                <Network size={10} /> {rel.type} → {locations.find(l => l.id === rel.targetId)?.name || 'Target'}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex justify-between pt-4 border-t border-slate-50">
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Asset Status</p>
                              <p className={`text-xs font-black uppercase ${asset.status === 'OPERATIONAL' ? 'text-emerald-600' : 'text-red-600'}`}>{asset.status}</p>
                           </div>
                           <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">
                              View Inspector <ChevronRight size={14} />
                           </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 py-20 bg-white border border-dashed border-slate-200 rounded-[2rem] text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No primary equipment registered in this spatial entity.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center flex flex-col items-center justify-center min-h-[500px]">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl shadow-slate-200 mb-8">
                 <Network size={48} className="text-slate-200" />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase mb-2 tracking-tight">Twin Navigator</h3>
              <p className="text-slate-400 text-sm font-bold max-w-sm">Select a spatial entity to visualize its relationships or create new Brick Schema definitions.</p>
            </div>
          )}
        </div>
      </div>

      {/* Asset Detail Inspector */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="grid grid-cols-1 md:grid-cols-4 h-[800px]">
                <div className="bg-slate-50 p-10 border-r border-slate-100 flex flex-col justify-between overflow-y-auto">
                   <div>
                      <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xl mb-8 inline-block">
                         <Cpu size={48} className="text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-4 leading-tight">{selectedAsset.name}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">{selectedAsset.brickClass} Class Ontology</p>
                      
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                           <MapPin className="text-slate-400" size={20} />
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zone Anchor</p>
                              <p className="text-sm font-black text-slate-700">{locations.find(l => l.id === selectedAsset.locationId)?.name}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <History className="text-slate-400" size={20} />
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SLA Status</p>
                              <span className={`text-[10px] font-black uppercase ${selectedAsset.status === 'OPERATIONAL' ? 'text-emerald-600' : 'text-red-600'}`}>
                                {selectedAsset.status}
                              </span>
                           </div>
                        </div>
                      </div>
                   </div>
                   <div className="pt-10 border-t border-slate-200/50 mt-10">
                      <button 
                        onClick={() => {
                          setSelectedAsset(null);
                          setSearchParams({});
                        }}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
                      >
                        Exit Twin
                      </button>
                   </div>
                </div>

                <div className="md:col-span-3 p-12 overflow-y-auto space-y-12 custom-scrollbar">
                   {/* Unified Lifecycle History */}
                   <div>
                      <div className="flex items-center justify-between mb-10">
                        <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                           <Clock size={16} className="text-blue-600" /> Lifecycle Activity Stream
                        </h4>
                        <span className="px-4 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           Total Entities: {MOCK_REQUESTS.filter(r => r.assetId === selectedAsset.id).length + MOCK_INSTANCES.filter(i => i.data.assetId === selectedAsset.id).length}
                        </span>
                      </div>

                      <div className="space-y-12 relative">
                         <div className="absolute left-[27px] top-6 bottom-6 w-1 bg-slate-100 rounded-full"></div>
                         
                         {/* Grouping Logic: We show Requests and Instances together in a chronological stream */}
                         {[
                           ...MOCK_REQUESTS.filter(r => r.assetId === selectedAsset.id).map(r => ({ type: 'REQUEST', data: r, date: r.createdAt })),
                           ...MOCK_INSTANCES.filter(i => i.data.assetId === selectedAsset.id).map(i => ({ type: 'SERVICE', data: i, date: i.createdAt }))
                         ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry, idx) => (
                           <div key={idx} className="relative pl-20 group">
                              {/* Timeline Icon */}
                              <div className={`absolute left-0 top-0 w-14 h-14 rounded-2xl flex items-center justify-center z-10 border-4 border-white shadow-xl transition-all group-hover:scale-110 ${
                                entry.type === 'REQUEST' ? 'bg-indigo-600 text-white' : 'bg-blue-600 text-white'
                              }`}>
                                 {entry.type === 'REQUEST' ? <MessageSquare size={24} /> : <Workflow size={24} />}
                              </div>

                              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all">
                                 <div className="flex justify-between items-start mb-6">
                                    <div>
                                       <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border mb-3 inline-block ${
                                          entry.type === 'REQUEST' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-blue-50 border-blue-100 text-blue-700'
                                       }`}>
                                          {entry.type === 'REQUEST' ? 'Triage Request' : 'Operational Service'}
                                       </span>
                                       <h5 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                                          {(entry.data as any).title}
                                       </h5>
                                       <p className="text-xs text-slate-400 font-bold uppercase mt-1">
                                          {new Date(entry.date).toLocaleString()} • {entry.type === 'SERVICE' ? `Engine: ${(entry.data as any).id}` : `Ref: ${(entry.data as any).id}`}
                                       </p>
                                    </div>
                                    <div className="text-right">
                                       <button 
                                          onClick={() => navigate(entry.type === 'SERVICE' ? `/instance/${(entry.data as any).id}` : `/requests`)}
                                          className="p-3 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-2xl transition-all"
                                       >
                                          <ExternalLink size={18} />
                                       </button>
                                    </div>
                                 </div>

                                 {entry.type === 'SERVICE' && (
                                    <div className="pt-6 border-t border-slate-50 space-y-4">
                                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                          <Package size={14} className="text-blue-500" /> Material Consumption
                                       </p>
                                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                          {MOCK_INVENTORY_REQUESTS.filter(ir => ir.instanceId === (entry.data as any).id).map(inv => {
                                             const item = MOCK_INVENTORY.find(i => i.id === inv.itemId);
                                             return (
                                                <div key={inv.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group/inv">
                                                   <div className="flex items-center gap-4">
                                                      <div className="p-2 bg-white rounded-xl shadow-sm"><Package size={16} className="text-slate-400" /></div>
                                                      <div>
                                                         <p className="text-xs font-black text-slate-700">{item?.name}</p>
                                                         <p className="text-[9px] font-bold text-slate-400 uppercase">Qty: {inv.quantity} {item?.unit}</p>
                                                      </div>
                                                   </div>
                                                   <span className="text-[9px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-md">Taken</span>
                                                </div>
                                             );
                                          })}
                                          {MOCK_INVENTORY_REQUESTS.filter(ir => ir.instanceId === (entry.data as any).id).length === 0 && (
                                             <p className="text-[10px] text-slate-300 font-bold italic py-2">No material resources drawn for this event.</p>
                                          )}
                                       </div>
                                    </div>
                                 )}

                                 {entry.type === 'REQUEST' && (
                                    <div className="pt-6 border-t border-slate-50">
                                       <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                                          "{(entry.data as any).description}"
                                       </p>
                                       {(entry.data as any).workflowInstanceId && (
                                          <div className="mt-4 flex items-center gap-3">
                                             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Workflow size={14} /></div>
                                             <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                                                Resolved via Engine #{(entry.data as any).workflowInstanceId}
                                             </p>
                                          </div>
                                       )}
                                    </div>
                                 )}
                              </div>
                           </div>
                         ))}
                         
                         {MOCK_REQUESTS.filter(r => r.assetId === selectedAsset.id).length === 0 && 
                          MOCK_INSTANCES.filter(i => i.data.assetId === selectedAsset.id).length === 0 && (
                            <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem] space-y-4">
                               <History size={48} className="mx-auto text-slate-100" />
                               <p className="text-slate-300 font-black uppercase text-xs tracking-widest">No documented lifecycle events for this entity.</p>
                            </div>
                         )}
                      </div>
                   </div>

                   <div className="p-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 p-8 opacity-10"><TrendingDown size={120} /></div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-80">Health Forecast</p>
                      <h4 className="text-3xl font-black leading-tight mb-8 max-w-lg">Ontological mapping indicates 14% efficiency drop due to recent service volume.</h4>
                      <button className="px-8 py-4 bg-white text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-50 transition-all">Schedule Preventive Audit</button>
                   </div>
                </div>
             </div>
           </div>
        </div>
      )}

      {/* New Asset Modal */}
      {isNewAssetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
               <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase">Register Equipment</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Brick Ontology Compliant</p>
               </div>
               <button onClick={() => setIsNewAssetModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all"><X /></button>
             </div>
             <form onSubmit={handleCreateAsset} className="p-10 space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Display Name</label>
                   <input required value={newAssetForm.name} onChange={e => setNewAssetForm({...newAssetForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold" placeholder="e.g. Roof AHU-01" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Equipment Class</label>
                      <select value={newAssetForm.brickClass} onChange={e => setNewAssetForm({...newAssetForm, brickClass: e.target.value as any})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold">
                         {BRICK_EQUIPMENT.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected Lifespan</label>
                      <input type="number" value={newAssetForm.lifespan} onChange={e => setNewAssetForm({...newAssetForm, lifespan: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold" />
                   </div>
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase tracking-widest shadow-xl">Commit to Digital Twin</button>
             </form>
           </div>
        </div>
      )}

      {/* New Location Modal */}
      {isNewLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
               <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase">New Spatial Entity</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hierarchical Containment</p>
               </div>
               <button onClick={() => setIsNewLocationModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all"><X /></button>
             </div>
             <form onSubmit={handleCreateLocation} className="p-10 space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entity Name</label>
                   <input required value={newLocationForm.name} onChange={e => setNewLocationForm({...newLocationForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold" placeholder="e.g. Boiler Room 4" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Spatial Class</label>
                   <select value={newLocationForm.brickClass} onChange={e => setNewLocationForm({...newLocationForm, brickClass: e.target.value as any})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold">
                      {BRICK_LOCATIONS.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                   </select>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest shadow-xl">Define Spatial Zone</button>
             </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AssetModule;
